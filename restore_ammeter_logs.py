import psycopg2
import os
import sys
import string
import tempfile
import itertools
import argparse
import re
import datetime

# --- Configuration ---
DATABASE_URL = "postgresql://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa"
FILE_PREFIX = "db_backup_chunk_"
FILE_SUFFIXES = [f"{c1}{c2}" for c1 in ['a'] for c2 in string.ascii_lowercase[:19]]
BATCH_SIZE = 1000
TABLE_NAME = "ammeter_log"
COLUMNS = [
    "id", "deviceNumber", "action", "factory", "device", "voltage", "currents",
    "power", "battery", "switchState", "networkState", "lastUpdated",
    "requestData", "responseData", "statusCode", "success", "errorMessage",
    "responseTime", "ipAddress", "userAgent", "userId", "organizationId", "createdAt"
]

def process_value(value):
    r"""Handle special values like \N for NULL."""
    return None if value == '\\N' else value
def restore_data(dry_run=False, skip=0):
    """Connects to the database and restores ammeter_log data from chunk files.

    Behaviour:
    - Uses BATCH_SIZE for executemany inserts (commits each batch).
    - Uses COPY when input file contains a COPY section.
    - ON CONFLICT (id) DO NOTHING to skip existing rows.
    - Writes progress lines to restore_progress.log after each successful batch/COPY.
    - On KeyboardInterrupt, attempts to flush remaining batch and commit.
    """
    conn = None
    cur = None
    total_inserted_count = 0
    files_processed = 0
    total_lines_read = 0
    total_records_batched = 0
    records_batch = []
    bad_log = None
    progress_log = None

    try:
        print("--- SCRIPT START ---")
        print(f"Connecting to the database...{' (DRY-RUN)' if dry_run else ''}")
        if not dry_run:
            conn = psycopg2.connect(DATABASE_URL)
            cur = conn.cursor()
            print("Database connection successful.")
        else:
            print("DRY-RUN: no database connection made.")

        placeholders = ", ".join(["%s"] * len(COLUMNS))
        quoted_columns = ', '.join([f'"{col}"' for col in COLUMNS])
        insert_sql = f"INSERT INTO public.{TABLE_NAME} ({quoted_columns}) VALUES ({placeholders}) ON CONFLICT (id) DO NOTHING"
        print("Prepared SQL statement.")

        # helper to count data rows in a file
        def _count_records_in_file(path):
            if not os.path.exists(path):
                return 0
            cnt = 0
            try:
                with open(path, 'r', encoding='utf-8') as fh:
                    first = fh.readline()
                    if not first:
                        return 0
                    # COPY-format file: count non-empty, non-COPY, non-\. lines
                    if first.startswith('COPY'):
                        for l in fh:
                            if l.startswith('\\.') or l.startswith('COPY'):
                                continue
                            if l.strip() == '':
                                continue
                            cnt += 1
                    else:
                        # include first line
                        if first.strip() != '' and not first.startswith('COPY') and not first.startswith('\\.'):
                            cnt += 1
                        for l in fh:
                            if l.strip() == '':
                                continue
                            if l.startswith('COPY') or l.startswith('\\.'):
                                continue
                            cnt += 1
            except Exception:
                return 0
            return cnt

        # open or create logs; determine resume point from restore_progress.log
        try:
            bad_log = open('bad_lines.log', 'a', encoding='utf-8')
        except Exception:
            bad_log = None

        resume_start_index = 0
        progress_log_path = 'restore_progress.log'
        skip_records_in_first_file = 0
        # If there's an existing progress log, inspect its last non-empty line to find last processed file
        if os.path.exists(progress_log_path):
            try:
                with open(progress_log_path, 'r', encoding='utf-8') as rlf:
                    for line in reversed(rlf.read().splitlines()):
                        line = line.strip()
                        if not line:
                            continue
                        # try to parse total count first: 'total <number>'
                        tmatch = re.search(r'total\s+(\d+)', line)
                        if tmatch:
                            try:
                                total_done = int(tmatch.group(1))
                            except Exception:
                                total_done = 0

                            # (uses outer _count_records_in_file)

                            remaining = total_done
                            cumulative = 0
                            found = False
                            for idx, s in enumerate(FILE_SUFFIXES):
                                p = f"{FILE_PREFIX}{s}"
                                c = _count_records_in_file(p)
                                if remaining >= c:
                                    remaining -= c
                                    cumulative += c
                                    continue
                                else:
                                    # resume inside this file (or at its start if remaining==0)
                                    resume_start_index = idx
                                    skip_records_in_first_file = remaining
                                    found = True
                                    break
                            if not found:
                                # total_done covered all known files
                                resume_start_index = len(FILE_SUFFIXES)
                                skip_records_in_first_file = 0
                            # reflect previously-done count in totals so progress messages include them
                            try:
                                total_inserted_count = int(total_done)
                                total_records_batched = int(total_done)
                                # write initial progress line reflecting previously-processed total
                                try:
                                    write_progress(progress_log, f"RESUME from progress_log: total {total_inserted_count}")
                                except Exception:
                                    pass
                            except Exception:
                                pass
                            break

                        # fallback: look for a file name like db_backup_chunk_xx
                        m = re.search(r'(db_backup_chunk_[^:,\s]+)', line)
                        if m:
                            last_file = m.group(1)
                            # map file name to suffix and find index
                            for idx, s in enumerate(FILE_SUFFIXES):
                                if f"{FILE_PREFIX}{s}" == last_file:
                                    resume_start_index = idx + 1
                                    break
                        break
            except Exception:
                resume_start_index = 0

        try:
            progress_log = open(progress_log_path, 'a', encoding='utf-8')
        except Exception:
            progress_log = None

        # If user passed an explicit skip, override resume logic and compute
        # which file and how many records to skip inside that file based on skip count.
        if skip and skip > 0:
            remaining = int(skip)
            resume_start_index = 0
            skip_records_in_first_file = 0
            for idx, s in enumerate(FILE_SUFFIXES):
                p = f"{FILE_PREFIX}{s}"
                c = _count_records_in_file(p)
                if remaining >= c:
                    remaining -= c
                    continue
                else:
                    resume_start_index = idx
                    skip_records_in_first_file = remaining
                    break
            else:
                resume_start_index = len(FILE_SUFFIXES)
                skip_records_in_first_file = 0
            # account skipped records into totals so progress/logs reflect work already done
            try:
                total_inserted_count = int(skip)
                total_records_batched = int(skip)
            except Exception:
                pass
            msg = f"SKIP {skip} records: resuming at {FILE_PREFIX}{FILE_SUFFIXES[resume_start_index] if resume_start_index < len(FILE_SUFFIXES) else 'NONE'} (index {resume_start_index}), skip_in_file={skip_records_in_first_file}"
            print(msg)
            try:
                write_progress(progress_log, msg + f", total {total_inserted_count}")
            except Exception:
                pass

        def _now_ts():
            # use Asia/UTC+8 ISO format with offset
            try:
                tz = datetime.timezone(datetime.timedelta(hours=8))
                return datetime.datetime.now(tz).replace(microsecond=0).isoformat()
            except Exception:
                # fallback to UTC Z if anything goes wrong
                return datetime.datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'

        def write_progress(plog, message):
            if not plog:
                return
            try:
                # ensure single line without embedded newlines
                line = message.rstrip('\n')
                plog.write(f"{_now_ts()} {line}\n")
                plog.flush()
            except Exception:
                pass

        if resume_start_index and resume_start_index < len(FILE_SUFFIXES):
            print(f"Resuming from {FILE_PREFIX}{FILE_SUFFIXES[resume_start_index]} (index {resume_start_index}) based on {progress_log_path} last entry")
        elif resume_start_index >= len(FILE_SUFFIXES):
            print(f"Progress log indicates all known files processed (start index {resume_start_index}). No files to process.")

        try:
            for suffix in FILE_SUFFIXES[resume_start_index:]:
                file_path = f"{FILE_PREFIX}{suffix}"
                if not os.path.exists(file_path):
                    continue

                files_processed += 1
                print(f"\nProcessing file: {file_path}...")
                with open(file_path, 'r', encoding='utf-8') as f:
                    first_line = f.readline()
                    if not first_line:
                        continue
                    total_lines_read += 1
                    # if this is the first file we resume into and we need to skip some records,
                    # handle skipping of data rows (not header COPY lines)
                    need_to_skip = 0
                    if files_processed == 0 and skip_records_in_first_file:
                        need_to_skip = skip_records_in_first_file
                        if need_to_skip:
                            print(f"Skipping first {need_to_skip} already-processed records in {file_path}")
                    if first_line.startswith('COPY'):
                        # write COPY data to a temp file, then use COPY to load it
                        with tempfile.NamedTemporaryFile(mode='w+', delete=False, encoding='utf-8') as tf:
                            for line in f:
                                total_lines_read += 1
                                if line.startswith('\\.') or line.startswith('COPY'):
                                    continue
                                if line.strip() == '':
                                    continue
                                tf.write(line)
                            temp_name = tf.name

                        try:
                            with open(temp_name, 'r', encoding='utf-8') as dataf:
                                if not dry_run and cur:
                                    copy_sql = f"COPY public.{TABLE_NAME} ({quoted_columns}) FROM STDIN WITH (FORMAT text, DELIMITER E'\\t', NULL '\\\\N')"
                                    try:
                                        cur.copy_expert(copy_sql, dataf)
                                        status = (cur.statusmessage or '')
                                        try:
                                            inserted_count = int(status.split()[-1])
                                        except Exception:
                                            inserted_count = 0
                                        total_inserted_count += inserted_count
                                        total_records_batched += inserted_count
                                        if conn:
                                            conn.commit()
                                        if progress_log:
                                            try:
                                                write_progress(progress_log, f"COPY {file_path}: inserted {inserted_count}, total {total_inserted_count}")
                                            except Exception:
                                                pass
                                        print(f"COPY: inserted {inserted_count} records from {file_path}. Total inserted so far: {total_inserted_count}")
                                    except psycopg2.Error as e:
                                        print(f"\n--- DATABASE ERROR during COPY from {file_path} ---", file=sys.stderr)
                                        print(f"Error details: {e}", file=sys.stderr)
                                        if conn:
                                            conn.rollback()
                                else:
                                    dataf.seek(0)
                                    # count, but apply skip if needed and this is the first resumed file
                                    if need_to_skip:
                                        # consume skip lines
                                        for _ in range(need_to_skip):
                                            try:
                                                next(dataf)
                                            except StopIteration:
                                                break
                                        need_to_skip = 0
                                    count = sum(1 for _ in dataf)
                                    inserted_count = count
                                    total_inserted_count += inserted_count
                                    total_records_batched += inserted_count
                                    print(f"DRY-RUN COPY: would insert {inserted_count} records from {file_path}. Total counted so far: {total_inserted_count}")
                                    try:
                                        write_progress(progress_log, f"COPY {file_path}: inserted {inserted_count}, total {total_inserted_count}")
                                    except Exception:
                                        pass
                        finally:
                            try:
                                os.remove(temp_name)
                            except Exception:
                                pass
                    else:
                        lines_iter = itertools.chain([first_line], f)
                        # if need_to_skip > 0, skip that many valid data lines from lines_iter
                        if need_to_skip:
                            skipped = 0
                            new_iter = []
                            for line in lines_iter:
                                if line.strip() == '' or line.startswith('COPY') or line.startswith('\\.'):
                                    continue
                                skipped += 1
                                if skipped >= need_to_skip:
                                    break
                            # rebuild the iterator starting after consumed header + skipped lines
                            # reopen file and recreate iterator from current position
                            f.seek(0)
                            first_line = f.readline()
                            lines_iter = itertools.chain([first_line], f)
                            # consume skipped lines again
                            consumed = 0
                            for line in lines_iter:
                                if line.strip() == '' or line.startswith('COPY') or line.startswith('\\.'):
                                    continue
                                consumed += 1
                                if consumed >= skip_records_in_first_file:
                                    break

                        for i, line in enumerate(lines_iter, start=1):
                            total_lines_read += 1
                            if line.strip() == '':
                                continue
                            if line.startswith('COPY') or line.startswith('\\.'):
                                continue

                            values = line.strip().split('\t')
                            if len(values) == len(COLUMNS):
                                processed_values = [process_value(v) for v in values]
                                records_batch.append(tuple(processed_values))
                                total_records_batched += 1
                            else:
                                msg = f"Warning: Skipping malformed line #{i} in {file_path}: {len(values)} columns found, expected {len(COLUMNS)}"
                                print(msg)
                                if bad_log:
                                    try:
                                        bad_log.write(f"{file_path}:line#{i}: found {len(values)} cols, expected {len(COLUMNS)}: {line}")
                                    except Exception:
                                        pass
                                continue

                            if len(records_batch) >= BATCH_SIZE:
                                try:
                                    if not dry_run and cur:
                                        cur.executemany(insert_sql, records_batch)
                                        inserted_count = len(records_batch)
                                        total_inserted_count += inserted_count
                                        if conn:
                                            conn.commit()
                                        if progress_log:
                                            try:
                                                    write_progress(progress_log, f"BATCH {file_path}: inserted {inserted_count}, total {total_inserted_count}")
                                            except Exception:
                                                pass
                                        print(f"DB INSERT: {inserted_count} records. Total inserted so far: {total_inserted_count}")
                                    else:
                                        inserted_count = len(records_batch)
                                        total_inserted_count += inserted_count
                                        print(f"DRY-RUN: would insert {inserted_count} records from {file_path}. Total counted so far: {total_inserted_count}")
                                        try:
                                            write_progress(progress_log, f"BATCH {file_path}: inserted {inserted_count}, total {total_inserted_count}")
                                        except Exception:
                                            pass
                                except psycopg2.Error as e:
                                    print(f"\n--- DATABASE ERROR while inserting batch from {file_path} ---", file=sys.stderr)
                                    print(f"Error details: {e}", file=sys.stderr)
                                    if conn:
                                        conn.rollback()
                                records_batch = []
        except KeyboardInterrupt:
            print("\nKeyboardInterrupt received. Flushing remaining batch and exiting gracefully...")
            try:
                if records_batch and not dry_run and cur:
                    cur.executemany(insert_sql, records_batch)
                    inserted_count = len(records_batch)
                    total_inserted_count += inserted_count
                    if conn:
                        conn.commit()
                    if progress_log:
                        try:
                            write_progress(progress_log, f"INTERRUPT FLUSH: inserted {inserted_count}, total {total_inserted_count}")
                        except Exception:
                            pass
                    print(f"DB INSERT (on interrupt): {inserted_count} records. Total inserted so far: {total_inserted_count}")
                elif records_batch and dry_run:
                    inserted_count = len(records_batch)
                    total_inserted_count += inserted_count
                    try:
                        write_progress(progress_log, f"INTERRUPT DRY-RUN FLUSH: inserted {inserted_count}, total {total_inserted_count}")
                    except Exception:
                        pass
                    print(f"DRY-RUN INTERRUPT: would insert {inserted_count} records. Total counted so far: {total_inserted_count}")
            except Exception as e:
                print(f"Error while flushing on interrupt: {e}", file=sys.stderr)
                if conn:
                    conn.rollback()

        # flush any remaining records_batch
        if records_batch:
            try:
                if not dry_run and cur:
                    cur.executemany(insert_sql, records_batch)
                    inserted_count = len(records_batch)
                    total_inserted_count += inserted_count
                    if conn:
                        conn.commit()
                    if progress_log:
                        try:
                                write_progress(progress_log, f"FINAL BATCH: inserted {inserted_count}, total {total_inserted_count}")
                        except Exception:
                            pass
                    print(f"DB INSERT (final batch): {inserted_count} records. Total inserted so far: {total_inserted_count}")
                else:
                    inserted_count = len(records_batch)
                    total_inserted_count += inserted_count
                    print(f"DRY-RUN: would insert (final batch) {inserted_count} records. Total counted so far: {total_inserted_count}")
                    try:
                        write_progress(progress_log, f"FINAL BATCH (dry-run): inserted {inserted_count}, total {total_inserted_count}")
                    except Exception:
                        pass
            except psycopg2.Error as e:
                print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
                print("--- DATABASE ERROR ENCOUNTERED DURING FINAL BATCH --- ", file=sys.stderr)
                print(f"Error details: {e}", file=sys.stderr)
                print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
                if conn:
                    conn.rollback()

        print("\n--- SUMMARY ---")
        print(f"Files processed: {files_processed}")
        print(f"Total lines read: {total_lines_read}")
        print(f"Total records prepared for insertion: {total_records_batched}")
        print(f"Total records successfully inserted in DB: {total_inserted_count}")
        print("-----------------")

        if total_records_batched != total_inserted_count:
            print("\n*** WARNING: Mismatch between prepared records and inserted records! ***", file=sys.stderr)
            print(f"prepared={total_records_batched} vs inserted={total_inserted_count}", file=sys.stderr)

        if not dry_run:
            print("\nCommitting changes to the database...")
            if conn:
                conn.commit()
            print("Data restoration completed successfully!")
        else:
            print("\nDRY-RUN complete. No changes were written to the database.")

    except psycopg2.Error as e:
        print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
        print("--- DATABASE ERROR ENCOUNTERED --- ", file=sys.stderr)
        print(f"Error details: {e}", file=sys.stderr)
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
        if conn:
            conn.rollback()
        print("\nTransaction has been ROLLED BACK. No data was saved.", file=sys.stderr)

    except Exception as e:
        print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
        print("--- AN UNEXPECTED ERROR ENCOUNTERED --- ", file=sys.stderr)
        print(f"Error details: {e}", file=sys.stderr)
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", file=sys.stderr)
        if conn:
            conn.rollback()
        print("\nTransaction has been ROLLED BACK. No data was saved.", file=sys.stderr)

    finally:
        if cur:
            try:
                cur.close()
            except Exception:
                pass
        if conn:
            try:
                conn.close()
            except Exception:
                pass
            print("\nDatabase connection closed.")
        try:
            if bad_log:
                bad_log.close()
        except Exception:
            pass
        try:
            if progress_log:
                progress_log.close()
        except Exception:
            pass
        print("--- SCRIPT END ---")
        if conn:
            # close cursor if it was created
            try:
                if 'cur' in locals() and cur:
                    cur.close()
            except Exception:
                pass
            conn.close()
            print("\nDatabase connection closed.")
        # close bad_lines.log if opened
        try:
            if 'bad_log' in locals() and bad_log:
                bad_log.close()
        except Exception:
            pass
        # close progress log if opened
        try:
            if 'progress_log' in locals() and progress_log:
                progress_log.close()
        except Exception:
            pass
        print("--- SCRIPT END ---")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Restore ammeter_log data (supports dry-run)')
    parser.add_argument('--dry-run', action='store_true', help='Validate files and counts without writing to DB')
    parser.add_argument('--skip', type=int, default=0, help='Skip the first N records across the chunk files')
    args = parser.parse_args()
    restore_data(dry_run=args.dry_run, skip=args.skip)
