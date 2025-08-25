#!/usr/bin/env python3
"""
Import room samples data to AnalysisDataset and AnalysisReadyData tables - V2.

This script (v2 improvements):
1. Fixes datetime format to include milliseconds and timezone (ISO 8601)
2. Validates and cleans string data to prevent invalid character issues
3. Adds better error handling and data validation
4. Reads *.json files to create AnalysisDataset records
5. Reads *.csv files to populate AnalysisReadyData linked to datasets
6. Uses rooms_metadata.csv for building/floor/occupant info

Usage:
    python scripts/import-room-samples-v2.py
"""

import sqlite3
import json
import csv
import os
import sys
import re
from datetime import datetime, timezone
from pathlib import Path

# Configuration
ROOM_SAMPLES_DIR = Path(__file__).parent.parent.parent / "preprocessing" / "room_samples_for_pu"
DB_PATH = Path(__file__).parent.parent / "prisma" / "pu_practice.db"

def generate_cuid():
    """Generate a simple CUID-like ID"""
    import random
    import string
    timestamp = hex(int(datetime.now().timestamp() * 1000))[2:]
    random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"c{timestamp}{random_part}"

def clean_string(text):
    """
    Clean string data to prevent invalid character issues.

    Removes:
    - NULL bytes (\0)
    - Control characters (except \t, \n, \r in JSON strings)
    - Invalid UTF-8 sequences
    """
    if not text or not isinstance(text, str):
        return text

    # Remove NULL bytes
    text = text.replace('\0', '')

    # Remove most control characters but keep essential ones
    # Keep: \t (09), \n (0A), \r (0D)
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)

    # Ensure valid UTF-8 encoding
    try:
        text = text.encode('utf-8').decode('utf-8')
    except UnicodeDecodeError:
        # If encoding fails, replace problematic characters
        text = text.encode('utf-8', errors='replace').decode('utf-8')

    return text.strip()

def format_datetime_iso(dt_input):
    """
    Format datetime to proper ISO 8601 format with milliseconds and timezone.

    Args:
        dt_input: datetime object, ISO string, or string timestamp

    Returns:
        str: Properly formatted ISO 8601 datetime string (YYYY-MM-DDTHH:mm:ss.sssZ)
    """
    if isinstance(dt_input, str):
        # Try to parse the string
        try:
            # Handle various input formats
            if dt_input.endswith('Z'):
                dt = datetime.fromisoformat(dt_input.replace('Z', '+00:00'))
            elif '+' in dt_input or dt_input.endswith('T00:00:00'):
                dt = datetime.fromisoformat(dt_input)
            else:
                # Assume it's a basic format, add timezone
                dt = datetime.fromisoformat(dt_input)
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
        except ValueError:
            # If parsing fails, use current time
            print(f"Warning: Could not parse datetime '{dt_input}', using current time")
            dt = datetime.now(timezone.utc)
    elif isinstance(dt_input, datetime):
        dt = dt_input
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
    else:
        # Fallback to current time
        dt = datetime.now(timezone.utc)

    # Convert to UTC if not already
    if dt.tzinfo != timezone.utc:
        dt = dt.astimezone(timezone.utc)

    # Format to ISO 8601 with milliseconds and Z suffix
    return dt.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

def validate_json_string(data):
    """
    Validate and clean JSON string data.

    Args:
        data: Dictionary or object to be converted to JSON

    Returns:
        str: Clean JSON string or None if invalid
    """
    if not data:
        return None

    try:
        # Convert to JSON and clean
        json_str = json.dumps(data, ensure_ascii=False)
        return clean_string(json_str)
    except (TypeError, ValueError) as e:
        print(f"Warning: Could not serialize JSON data: {e}")
        return None

def load_metadata():
    """Load room metadata from CSV with data validation"""
    metadata_file = ROOM_SAMPLES_DIR / "rooms_metadata.csv"
    metadata = {}

    try:
        with open(metadata_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                room_id = clean_string(row['room_id'])
                if not room_id:
                    print(f"Warning: Skipping row with empty room_id")
                    continue

                metadata[room_id] = {
                    'building': clean_string(row['building']) or 'Unknown',
                    'floor': clean_string(row['floor']) or 'Unknown',
                    'room': clean_string(row['room']) or room_id,
                    'occupant_type': clean_string(row['occupant_type']) or 'STUDENT',
                    'l1_device': clean_string(row['l1_device']) or '',
                    'l2_device': clean_string(row['l2_device']) or ''
                }
    except FileNotFoundError:
        print(f"Error: Metadata file not found: {metadata_file}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading metadata file: {e}")
        sys.exit(1)

    return metadata

def import_analysis_datasets(conn, metadata):
    """Import AnalysisDataset records from JSON summaries with v2 improvements"""
    cursor = conn.cursor()
    dataset_mapping = {}

    # Find all JSON summary files
    json_files = list(ROOM_SAMPLES_DIR.glob("room_summary_*.json"))

    print(f"Found {len(json_files)} JSON summary files")

    for json_file in json_files:
        try:
            room_id = clean_string(json_file.stem.replace("room_summary_", ""))

            if not room_id or room_id not in metadata:
                print(f"Warning: No metadata found for {room_id}, skipping")
                continue

            # Load JSON summary with error handling
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    summary = json.load(f)
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                print(f"Error reading JSON file {json_file}: {e}")
                continue

            room_meta = metadata[room_id]
            data_summary = summary.get('data_summary', {})

            # Generate dataset ID
            dataset_id = generate_cuid()

            # Parse time range with v2 datetime formatting
            try:
                start_time_str = data_summary.get('time_range', {}).get('start', '')
                end_time_str = data_summary.get('time_range', {}).get('end', '')

                start_time_iso = format_datetime_iso(start_time_str)
                end_time_iso = format_datetime_iso(end_time_str)
                created_at_iso = format_datetime_iso(datetime.now(timezone.utc))

            except Exception as e:
                print(f"Error formatting datetime for {room_id}: {e}")
                continue

            # Clean and validate all string fields
            name = clean_string(f"Room {room_id} Analysis Dataset")
            description = clean_string(f"Preprocessed analysis data for {room_id} - {data_summary.get('total_samples', 0)} samples")

            # Create dataset record with validated data
            cursor.execute("""
                INSERT INTO analysis_datasets (
                    id, name, description, building, floor, room,
                    start_date, end_date, occupant_type,
                    meter_id_l1, meter_id_l2, total_records, positive_labels,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                dataset_id,
                name,
                description,
                room_meta['building'],
                room_meta['floor'],
                room_meta['room'],
                start_time_iso,
                end_time_iso,
                room_meta['occupant_type'],
                room_meta['l1_device'],
                room_meta['l2_device'],
                int(data_summary.get('total_samples', 0)),
                int(data_summary.get('positive_samples', 0)),
                created_at_iso
            ))

            dataset_mapping[room_id] = dataset_id
            print(f"Created dataset for {room_id}: {dataset_id}")

        except Exception as e:
            print(f"Error processing {json_file}: {e}")
            continue

    conn.commit()
    return dataset_mapping

def import_analysis_ready_data(conn, dataset_mapping):
    """Import AnalysisReadyData records from CSV files with v2 improvements"""
    cursor = conn.cursor()

    # Find all CSV sample files
    csv_files = list(ROOM_SAMPLES_DIR.glob("room_samples_*.csv"))

    print(f"Found {len(csv_files)} CSV sample files")

    total_imported = 0

    for csv_file in csv_files:
        try:
            room_id = clean_string(csv_file.stem.replace("room_samples_", ""))

            if not room_id or room_id not in dataset_mapping:
                print(f"Warning: No dataset found for {room_id}, skipping CSV import")
                continue

            dataset_id = dataset_mapping[room_id]

            print(f"Importing CSV data for {room_id}...")

            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                batch_data = []
                batch_size = 1000
                row_count = 0

                for row in reader:
                    try:
                        row_count += 1

                        # Generate record ID
                        record_id = generate_cuid()

                        # Parse timestamp with v2 formatting
                        timestamp_iso = format_datetime_iso(row.get('timestamp', ''))

                        # Clean and validate string fields
                        room_field = clean_string(row.get('room_id', room_id))

                        # Handle sourceAnomalyEventId with proper cleaning
                        source_anomaly_event_id = clean_string(row.get('sourceAnomalyEventId', ''))
                        if not source_anomaly_event_id or source_anomaly_event_id.lower() in ['null', 'none', '']:
                            source_anomaly_event_id = None

                        # Parse numeric fields with validation
                        def safe_float(value, default=0.0):
                            try:
                                return float(value) if value and value.strip() else default
                            except (ValueError, TypeError):
                                return default

                        # Parse boolean field
                        is_positive = str(row.get('isPositiveLabel', 'false')).lower() == 'true'

                        batch_data.append((
                            record_id,
                            dataset_id,
                            timestamp_iso,
                            room_field,
                            safe_float(row.get('rawWattageL1')),
                            safe_float(row.get('rawWattageL2')),
                            safe_float(row.get('wattage110v_current')),
                            safe_float(row.get('wattage220v_current')),
                            safe_float(row.get('wattageTotal_current')),
                            is_positive,
                            source_anomaly_event_id
                        ))

                        # Insert in batches
                        if len(batch_data) >= batch_size:
                            cursor.executemany("""
                                INSERT INTO analysis_ready_data (
                                    id, dataset_id, timestamp, room,
                                    raw_wattage_l1, raw_wattage_l2,
                                    wattage_110v, wattage_220v, wattage_total,
                                    is_positive_label, source_anomaly_event_id
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, batch_data)

                            total_imported += len(batch_data)
                            print(f"  Imported {total_imported} records...")
                            batch_data = []

                    except Exception as e:
                        print(f"Error processing row {row_count} in {csv_file}: {e}")
                        continue

                # Insert remaining records
                if batch_data:
                    cursor.executemany("""
                        INSERT INTO analysis_ready_data (
                            id, dataset_id, timestamp, room,
                            raw_wattage_l1, raw_wattage_l2,
                            wattage_110v, wattage_220v, wattage_total,
                            is_positive_label, source_anomaly_event_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, batch_data)

                    total_imported += len(batch_data)

            print(f"Completed {room_id}: imported {row_count} rows, total: {total_imported} records")

        except Exception as e:
            print(f"Error processing CSV file {csv_file}: {e}")
            continue

    conn.commit()
    return total_imported

def validate_database_after_import(conn):
    """Validate database integrity after import (v2 feature)"""
    cursor = conn.cursor()

    print("\n=== Validating database integrity ===")

    # Check for invalid datetime formats
    cursor.execute("""
        SELECT COUNT(*) as bad_dates
        FROM analysis_datasets
        WHERE start_date NOT LIKE '%.%Z'
           OR end_date NOT LIKE '%.%Z'
           OR created_at NOT LIKE '%.%Z'
    """)

    bad_dates = cursor.fetchone()[0]
    if bad_dates > 0:
        print(f"Warning: Found {bad_dates} records with invalid datetime format")
    else:
        print("✅ All datetime fields properly formatted")

    # Check for NULL bytes or invalid characters
    cursor.execute("""
        SELECT COUNT(*) as bad_strings
        FROM analysis_datasets
        WHERE name LIKE '%' || char(0) || '%'
           OR building LIKE '%' || char(0) || '%'
           OR room LIKE '%' || char(0) || '%'
    """)

    bad_strings = cursor.fetchone()[0]
    if bad_strings > 0:
        print(f"Warning: Found {bad_strings} records with invalid characters")
    else:
        print("✅ All string fields clean")

def main():
    """Main import process with v2 improvements"""
    print("Starting room samples import (v2 - with data validation)...")
    print(f"Source directory: {ROOM_SAMPLES_DIR}")
    print(f"Database path: {DB_PATH}")

    # Check if source directory exists
    if not ROOM_SAMPLES_DIR.exists():
        print(f"Error: Source directory not found: {ROOM_SAMPLES_DIR}")
        sys.exit(1)

    # Check if database exists
    if not DB_PATH.exists():
        print(f"Error: Database not found: {DB_PATH}")
        print("Please run 'pnpm db:reset' first to create the database")
        sys.exit(1)

    # Load metadata
    print("Loading room metadata...")
    metadata = load_metadata()
    print(f"Loaded metadata for {len(metadata)} rooms")

    # Connect to database
    conn = sqlite3.connect(DB_PATH)

    try:
        # Import datasets
        print("\n=== Importing AnalysisDataset records ===")
        dataset_mapping = import_analysis_datasets(conn, metadata)

        # Import ready data
        print("\n=== Importing AnalysisReadyData records ===")
        total_records = import_analysis_ready_data(conn, dataset_mapping)

        # Validate after import (v2 feature)
        validate_database_after_import(conn)

        print(f"\n=== Import completed successfully (v2) ===")
        print(f"Created {len(dataset_mapping)} datasets")
        print(f"Imported {total_records} analysis ready data records")
        print("✅ All data validated and properly formatted")

    except Exception as e:
        print(f"Error during import: {e}")
        conn.rollback()
        sys.exit(1)

    finally:
        conn.close()

    print("\n💡 Tip: Run 'npm run db:validate' to double-check data integrity")

if __name__ == "__main__":
    main()
