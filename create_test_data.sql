-- 創建測試數據用於驗證新的 schema
-- 插入測試 AnalysisDataset
INSERT INTO analysis_datasets (
    id, name, description, building, floor, room, 
    start_date, end_date, occupant_type, meter_id_l1, meter_id_l2, 
    total_records, positive_labels, created_at
) VALUES 
    (
        'test_dataset_001', 
        'Room R041 Analysis Dataset', 
        'Test dataset for office room R041',
        'Building A',
        '4F',
        'R041',
        '2025-08-20 00:00:00',
        '2025-08-21 23:59:59',
        'OFFICE_WORKER',
        'METER_R041_L1',
        'METER_R041_L2',
        2880,
        0,
        '2025-08-26 10:00:00'
    );

-- 插入一些 AnalysisReadyData 測試數據
INSERT INTO analysis_ready_data (
    id, dataset_id, timestamp, room, 
    raw_wattage_l1, raw_wattage_l2, wattage_110v, wattage_220v, wattage_total,
    is_positive_label, source_anomaly_event_id
) VALUES 
    ('data_001', 'test_dataset_001', '2025-08-20 10:00:00', 'R041', 150.5, 120.3, 150.5, 240.6, 391.1, 0, NULL),
    ('data_002', 'test_dataset_001', '2025-08-20 10:01:00', 'R041', 152.1, 121.0, 152.1, 242.0, 394.1, 0, NULL),
    ('data_003', 'test_dataset_001', '2025-08-20 10:02:00', 'R041', 148.9, 119.8, 148.9, 239.6, 388.5, 0, NULL),
    ('data_004', 'test_dataset_001', '2025-08-20 10:03:00', 'R041', 350.5, 280.3, 350.5, 560.6, 911.1, 0, NULL), -- 異常高值
    ('data_005', 'test_dataset_001', '2025-08-20 10:04:00', 'R041', 149.2, 120.1, 149.2, 240.2, 389.4, 0, NULL);

-- 插入測試 ExperimentRun
INSERT INTO experiment_run (
    id, name, description, filtering_parameters, status,
    candidate_count, positive_label_count, negative_label_count,
    created_at, updated_at, candidate_stats
) VALUES 
    (
        'test_experiment_001',
        'Test Experiment Run',
        'Test experiment for validation',
        '{"z_score_threshold": 2.5, "spike_threshold": 50}',
        'LABELING',
        1,
        0,
        0,
        '2025-08-26 10:00:00',
        '2025-08-26 10:00:00',
        '{"total_candidates": 1, "positive_labels": 0, "negative_labels": 0}'
    );

-- 插入測試 AnomalyEvent（使用新的 schema）
INSERT INTO anomaly_event (
    id, event_id, dataset_id, line, event_timestamp, detection_rule,
    score, data_window, status, experiment_run_id, created_at, updated_at
) VALUES 
    (
        'test_event_001',
        'AUTO_test001',
        'test_dataset_001',
        'L1',
        '2025-08-20 10:03:00',
        'Z-score:2.5,Spike:50%,Duration:1min',
        0.8,
        '{"startTime": "2025-08-20 09:58:00", "endTime": "2025-08-20 10:08:00", "centerIndex": 3, "wattageTotal": 911.1, "wattage110v": 350.5, "wattage220v": 560.6}',
        'UNREVIEWED',
        'test_experiment_001',
        '2025-08-26 10:00:00',
        '2025-08-26 10:00:00'
    );
