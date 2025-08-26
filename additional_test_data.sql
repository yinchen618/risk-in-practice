-- 創建更多測試數據來演示 Stage 1 候選生成
-- 插入第二個測試數據集
INSERT INTO analysis_datasets (
    id, name, description, building, floor, room, 
    start_date, end_date, occupant_type, meter_id_l1, meter_id_l2, 
    total_records, positive_labels, created_at
) VALUES 
    (
        'test_dataset_002', 
        'Room R042 Analysis Dataset', 
        'Test dataset for student room R042',
        'Building B',
        '4F',
        'R042',
        '2025-08-21 00:00:00',
        '2025-08-21 23:59:59',
        'STUDENT',
        'METER_R042_L1',
        'METER_R042_L2',
        1440,
        0,
        '2025-08-26 10:00:00'
    );

-- 插入第二個數據集的一些測試數據
INSERT INTO analysis_ready_data (
    id, dataset_id, timestamp, room, 
    raw_wattage_l1, raw_wattage_l2, wattage_110v, wattage_220v, wattage_total,
    is_positive_label, source_anomaly_event_id
) VALUES 
    ('data_006', 'test_dataset_002', '2025-08-21 14:00:00', 'R042', 80.5, 60.3, 80.5, 120.6, 201.1, 0, NULL),
    ('data_007', 'test_dataset_002', '2025-08-21 14:01:00', 'R042', 82.1, 61.0, 82.1, 122.0, 204.1, 0, NULL),
    ('data_008', 'test_dataset_002', '2025-08-21 14:02:00', 'R042', 450.9, 380.8, 450.9, 760.6, 1211.5, 0, NULL), -- 另一個異常高值
    ('data_009', 'test_dataset_002', '2025-08-21 14:03:00', 'R042', 79.2, 60.1, 79.2, 120.2, 199.4, 0, NULL),
    ('data_010', 'test_dataset_002', '2025-08-21 14:04:00', 'R042', 81.5, 62.3, 81.5, 124.6, 206.1, 0, NULL);
