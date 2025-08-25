#!/usr/bin/env python3
"""
Create sample experiment runs for testing Case Study v2 API.

This script creates sample ExperimentRun records to ensure the API endpoints work properly.
"""

import sqlite3
import json
import uuid
from datetime import datetime, timezone

# Database path
DB_PATH = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'

def generate_cuid():
    """Generate a simple CUID-like ID"""
    import random
    import string
    timestamp = hex(int(datetime.now().timestamp() * 1000))[2:]
    random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"c{timestamp}{random_part}"

def create_sample_experiment_runs():
    """Create sample experiment runs for testing"""

    # Sample data
    sample_runs = [
        {
            'id': 'fb6000a2-4bef-48e9-8c49-fdb54726a368',  # Keep the existing one
            'name': 'Baseline Anomaly Detection - Building A',
            'description': 'Baseline experiment for anomaly detection in Building A offices',
            'filtering_parameters': json.dumps({
                'buildings': ['Building-A'],
                'floors': ['2F', '3F'],
                'occupantTypes': ['OFFICE_WORKER'],
                'zScoreThreshold': 3.0,
                'spikeThreshold': 500,
                'minEventDuration': 60,
                'weekendPatternEnabled': True,
                'holidayPatternEnabled': True
            }),
            'status': 'COMPLETED',
            'candidate_count': 156,
            'positive_label_count': 45,
            'negative_label_count': 111
        },
        {
            'id': generate_cuid(),
            'name': 'Student Dormitory Analysis - Building B',
            'description': 'PU learning experiment for student dormitory patterns',
            'filtering_parameters': json.dumps({
                'buildings': ['Building-B'],
                'floors': ['1F', '2F', '3F'],
                'occupantTypes': ['STUDENT'],
                'zScoreThreshold': 2.5,
                'spikeThreshold': 300,
                'minEventDuration': 90,
                'weekendPatternEnabled': False,
                'holidayPatternEnabled': True
            }),
            'status': 'LABELING',
            'candidate_count': 234,
            'positive_label_count': 67,
            'negative_label_count': 89
        },
        {
            'id': generate_cuid(),
            'name': 'Multi-Building Comparison Study',
            'description': 'Cross-building comparison of energy consumption patterns',
            'filtering_parameters': json.dumps({
                'buildings': ['Building-A', 'Building-B'],
                'floors': ['1F', '2F', '3F', '5F'],
                'occupantTypes': ['OFFICE_WORKER', 'STUDENT'],
                'zScoreThreshold': 3.5,
                'spikeThreshold': 400,
                'minEventDuration': 120,
                'weekendPatternEnabled': True,
                'holidayPatternEnabled': False
            }),
            'status': 'CONFIGURING',
            'candidate_count': None,
            'positive_label_count': None,
            'negative_label_count': None
        }
    ]

    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get current timestamp in ISO format
    now_iso = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

    for run_data in sample_runs:
        try:
            # Check if record already exists
            cursor.execute('SELECT id FROM experiment_run WHERE id = ?', (run_data['id'],))
            if cursor.fetchone():
                print(f"Experiment run {run_data['id']} already exists, updating...")
                cursor.execute('''
                    UPDATE experiment_run SET
                        name = ?, description = ?, filtering_parameters = ?,
                        status = ?, candidate_count = ?, positive_label_count = ?,
                        negative_label_count = ?, updated_at = ?
                    WHERE id = ?
                ''', (
                    run_data['name'],
                    run_data['description'],
                    run_data['filtering_parameters'],
                    run_data['status'],
                    run_data['candidate_count'],
                    run_data['positive_label_count'],
                    run_data['negative_label_count'],
                    now_iso,
                    run_data['id']
                ))
            else:
                print(f"Creating new experiment run: {run_data['name']}")
                cursor.execute('''
                    INSERT INTO experiment_run (
                        id, name, description, filtering_parameters, status,
                        candidate_count, positive_label_count, negative_label_count,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    run_data['id'],
                    run_data['name'],
                    run_data['description'],
                    run_data['filtering_parameters'],
                    run_data['status'],
                    run_data['candidate_count'],
                    run_data['positive_label_count'],
                    run_data['negative_label_count'],
                    now_iso,
                    now_iso
                ))

        except Exception as e:
            print(f"Error creating experiment run {run_data['name']}: {e}")
            continue

    conn.commit()
    conn.close()

    print(f"\nCreated/updated {len(sample_runs)} experiment runs")
    print("You can now test the API endpoints:")
    print("- GET /api/v2/experiment-runs")
    print("- GET /api/v2/experiment-runs/{run_id}")

if __name__ == "__main__":
    create_sample_experiment_runs()
