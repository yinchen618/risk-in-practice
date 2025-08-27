-- 創建用於演示 training_data_info 功能的測試數據

-- 創建 experiment_runs 表
CREATE TABLE IF NOT EXISTS experiment_runs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    filtering_parameters TEXT,
    positive_label_count INTEGER,
    total_data_pool_size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 創建 analysis_datasets 表
CREATE TABLE IF NOT EXISTS analysis_datasets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dataset_type TEXT NOT NULL,
    file_path TEXT,
    total_samples INTEGER DEFAULT 0,
    positive_labels INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 創建 trained_models 表 (包含新的 training_data_info 字段)
CREATE TABLE IF NOT EXISTS trained_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    scenario_type TEXT NOT NULL,
    status TEXT NOT NULL,
    experiment_run_id TEXT NOT NULL,
    model_config TEXT,
    data_source_config TEXT,
    model_path TEXT,
    training_metrics TEXT,
    training_data_info TEXT,
    job_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (experiment_run_id) REFERENCES experiment_runs(id)
);

-- 創建 evaluation_runs 表
CREATE TABLE IF NOT EXISTS evaluation_runs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    scenario_type TEXT NOT NULL,
    status TEXT NOT NULL,
    trained_model_id TEXT NOT NULL,
    test_set_source TEXT,
    evaluation_metrics TEXT,
    job_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (trained_model_id) REFERENCES trained_models(id)
);

-- 插入測試的實驗運行
INSERT OR REPLACE INTO experiment_runs (id, name, description, status, positive_label_count, total_data_pool_size)
VALUES ('test-exp-001', 'Test Experiment for Training Data Info', 'Demo experiment to show training data information', 'COMPLETED', 150, 5000);

-- 插入測試的分析數據集
INSERT OR REPLACE INTO analysis_datasets (id, name, dataset_type, total_samples, positive_labels)
VALUES 
('dataset-p-001', 'Power Consumption Dataset A', 'ANOMALY_DETECTION', 2500, 75),
('dataset-p-002', 'Power Consumption Dataset B', 'ANOMALY_DETECTION', 1800, 45),
('dataset-u-001', 'Unlabeled Power Data A', 'NORMAL_OPERATION', 3200, 0),
('dataset-u-002', 'Unlabeled Power Data B', 'NORMAL_OPERATION', 2800, 0);

-- 插入測試的訓練模型 (包含 training_data_info)
INSERT OR REPLACE INTO trained_models (
    id, name, scenario_type, status, experiment_run_id,
    model_config, data_source_config, training_data_info,
    model_path, training_metrics, created_at, completed_at
) VALUES (
    'model-001',
    'ERM_BASELINE_2025-08-27T17-30-00',
    'ERM_BASELINE',
    'COMPLETED',
    'test-exp-001',
    '{"classPrior": 0.1, "windowSize": 60, "modelType": "MLP", "hiddenSize": 128, "numLayers": 3, "epochs": 100}',
    '{"trainRatio": 70, "validationRatio": 20, "testRatio": 10, "positiveDataSourceIds": ["dataset-p-001", "dataset-p-002"], "unlabeledDataSourceIds": ["dataset-u-001", "dataset-u-002"]}',
    '{
        "p_data_sources": {
            "dataset_ids": ["dataset-p-001", "dataset-p-002"],
            "dataset_info": {
                "dataset-p-001": {
                    "total_samples": 75,
                    "train_samples": 52,
                    "validation_samples": 15,
                    "test_samples": 8
                },
                "dataset-p-002": {
                    "total_samples": 45,
                    "train_samples": 31,
                    "validation_samples": 9,
                    "test_samples": 5
                }
            },
            "dataset_names": {
                "dataset-p-001": "Power Consumption Dataset A",
                "dataset-p-002": "Power Consumption Dataset B"
            },
            "total_samples": 120,
            "total_train_samples": 83,
            "total_validation_samples": 24,
            "total_test_samples": 13
        },
        "u_data_sources": {
            "dataset_ids": ["dataset-u-001", "dataset-u-002"],
            "dataset_info": {
                "dataset-u-001": {
                    "total_samples": 800,
                    "train_samples": 560,
                    "validation_samples": 160,
                    "test_samples": 80
                },
                "dataset-u-002": {
                    "total_samples": 400,
                    "train_samples": 280,
                    "validation_samples": 80,
                    "test_samples": 40
                }
            },
            "dataset_names": {
                "dataset-u-001": "Unlabeled Power Data A",
                "dataset-u-002": "Unlabeled Power Data B"
            },
            "total_samples": 1200,
            "total_train_samples": 840,
            "total_validation_samples": 240,
            "total_test_samples": 120
        },
        "data_split_ratios": {
            "train_ratio": 0.7,
            "validation_ratio": 0.2,
            "test_ratio": 0.1
        },
        "overlap_removal": false,
        "u_sampling_applied": true
    }',
    '/models/model-001_nnpu.pth',
    '{"final_loss": 0.12, "final_accuracy": 0.87, "best_val_accuracy": 0.85, "training_time_seconds": 240, "total_epochs": 100, "p_samples": 120, "u_samples": 1200, "class_prior": 0.1}',
    '2025-08-27 17:30:00',
    '2025-08-27 17:34:00'
);

-- 插入第二個測試模型（沒有 training_data_info 的對比）
INSERT OR REPLACE INTO trained_models (
    id, name, scenario_type, status, experiment_run_id,
    model_config, data_source_config,
    model_path, training_metrics, created_at, completed_at
) VALUES (
    'model-002',
    'ERM_BASELINE_2025-08-27T16-15-00',
    'ERM_BASELINE',
    'COMPLETED',
    'test-exp-001',
    '{"classPrior": 0.15, "windowSize": 30, "modelType": "MLP", "hiddenSize": 64, "numLayers": 2, "epochs": 80}',
    '{"trainRatio": 60, "validationRatio": 25, "testRatio": 15}',
    '/models/model-002_nnpu.pth',
    '{"final_loss": 0.18, "final_accuracy": 0.82, "best_val_accuracy": 0.80, "training_time_seconds": 180, "total_epochs": 80}',
    '2025-08-27 16:15:00',
    '2025-08-27 16:18:00'
);

-- 插入測試的評估運行
INSERT OR REPLACE INTO evaluation_runs (
    id, name, scenario_type, status, trained_model_id,
    test_set_source, evaluation_metrics, created_at, completed_at
) VALUES (
    'eval-001',
    'Eval_ERM_BASELINE_2025-08-27T17-35-00',
    'ERM_BASELINE',
    'COMPLETED',
    'model-001',
    '{"dataset_ids": ["dataset-p-001"], "samples_count": 100}',
    '{"precision": 0.85, "recall": 0.78, "f1_score": 0.81, "accuracy": 0.87, "auc_roc": 0.89, "confusion_matrix": [[85, 8], [7, 40]]}',
    '2025-08-27 17:35:00',
    '2025-08-27 17:37:00'
);
