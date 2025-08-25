#!/usr/bin/env python3
"""
Import room samples data to AnalysisDataset and AnalysisReadyData tables.

This script:
1. Reads *.json files to create AnalysisDataset records
2. Reads *.csv files to populate AnalysisReadyData linked to datasets
3. Uses rooms_metadata.csv for building/floor/occupant info

Usage:
    python scripts/import-room-samples.py
"""

import sqlite3
import json
import csv
import os
import sys
from datetime import datetime
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

def load_metadata():
    """Load room metadata from CSV"""
    metadata_file = ROOM_SAMPLES_DIR / "rooms_metadata.csv"
    metadata = {}

    with open(metadata_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            metadata[row['room_id']] = {
                'building': row['building'],
                'floor': row['floor'],
                'room': row['room'],
                'occupant_type': row['occupant_type'],
                'l1_device': row['l1_device'],
                'l2_device': row['l2_device']
            }

    return metadata

def import_analysis_datasets(conn, metadata):
    """Import AnalysisDataset records from JSON summaries"""
    cursor = conn.cursor()
    dataset_mapping = {}

    # Find all JSON summary files
    json_files = list(ROOM_SAMPLES_DIR.glob("room_summary_*.json"))

    print(f"Found {len(json_files)} JSON summary files")

    for json_file in json_files:
        room_id = json_file.stem.replace("room_summary_", "")

        if room_id not in metadata:
            print(f"Warning: No metadata found for {room_id}, skipping")
            continue

        # Load JSON summary
        with open(json_file, 'r', encoding='utf-8') as f:
            summary = json.load(f)

        room_meta = metadata[room_id]
        data_summary = summary['data_summary']

        # Generate dataset ID
        dataset_id = generate_cuid()

        # Parse time range
        start_time = datetime.fromisoformat(data_summary['time_range']['start'])
        end_time = datetime.fromisoformat(data_summary['time_range']['end'])

        # Create dataset record
        cursor.execute("""
            INSERT INTO analysis_datasets (
                id, name, description, building, floor, room,
                start_date, end_date, occupant_type,
                meter_id_l1, meter_id_l2, total_records, positive_labels,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            dataset_id,
            f"Room {room_id} Analysis Dataset",
            f"Preprocessed analysis data for {room_id} - {data_summary['total_samples']} samples",
            room_meta['building'],
            room_meta['floor'],
            room_meta['room'],
            start_time.isoformat(),
            end_time.isoformat(),
            room_meta['occupant_type'],
            room_meta['l1_device'],
            room_meta['l2_device'],
            data_summary['total_samples'],
            data_summary['positive_samples'],
            datetime.now().isoformat()
        ))

        dataset_mapping[room_id] = dataset_id
        print(f"Created dataset for {room_id}: {dataset_id}")

    conn.commit()
    return dataset_mapping

def import_analysis_ready_data(conn, dataset_mapping):
    """Import AnalysisReadyData records from CSV files"""
    cursor = conn.cursor()

    # Find all CSV sample files
    csv_files = list(ROOM_SAMPLES_DIR.glob("room_samples_*.csv"))

    print(f"Found {len(csv_files)} CSV sample files")

    total_imported = 0

    for csv_file in csv_files:
        room_id = csv_file.stem.replace("room_samples_", "")

        if room_id not in dataset_mapping:
            print(f"Warning: No dataset found for {room_id}, skipping CSV import")
            continue

        dataset_id = dataset_mapping[room_id]

        print(f"Importing CSV data for {room_id}...")

        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            batch_data = []
            batch_size = 1000

            for row in reader:
                # Generate record ID
                record_id = generate_cuid()

                # Parse timestamp
                timestamp = datetime.fromisoformat(row['timestamp'])

                # Extract core fields (matching schema)
                source_anomaly_event_id = row['sourceAnomalyEventId'].strip() if row['sourceAnomalyEventId'] and row['sourceAnomalyEventId'].strip() else None

                batch_data.append((
                    record_id,
                    dataset_id,
                    timestamp.isoformat(),
                    row['room_id'],
                    float(row['rawWattageL1']) if row['rawWattageL1'] else 0.0,
                    float(row['rawWattageL2']) if row['rawWattageL2'] else 0.0,
                    float(row['wattage110v_current']) if row['wattage110v_current'] else 0.0,
                    float(row['wattage220v_current']) if row['wattage220v_current'] else 0.0,
                    float(row['wattageTotal_current']) if row['wattageTotal_current'] else 0.0,
                    row['isPositiveLabel'].lower() == 'true',
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

        print(f"Completed {room_id}: {total_imported} total records")

    conn.commit()
    return total_imported

def main():
    """Main import process"""
    print("Starting room samples import...")
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

        print(f"\n=== Import completed ===")
        print(f"Created {len(dataset_mapping)} datasets")
        print(f"Imported {total_records} analysis ready data records")

    except Exception as e:
        print(f"Error during import: {e}")
        conn.rollback()
        sys.exit(1)

    finally:
        conn.close()

if __name__ == "__main__":
    main()
