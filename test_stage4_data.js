// 測試 Stage4 數據處理邏輯

// 模擬從 API 返回的實驗歷史數據
const mockExperimentHistory = {
    "experiment_run": {
        "id": "88bc7ecc-6655-49bc-9a1e-978a0f0724d8",
        "name": "A201",
        "status": "COMPLETED"
    },
    "trained_models": [
        {
            "id": "139a0f5c-55c3-45da-89d1-2114a00fb1ac",
            "name": "DOMAIN_ADAPTATION_2025-08-27T10-24-39",
            "scenario_type": "DOMAIN_ADAPTATION",
            "status": "COMPLETED",
            "experiment_run_id": "88bc7ecc-6655-49bc-9a1e-978a0f0724d8",
            "created_at": "2025-08-27 18:24:39",
            "completed_at": "2025-08-27 18:24:45"
        },
        {
            "id": "f0496299-f169-4544-84e0-93555c35d4a7",
            "name": "ERM_BASELINE_2025-08-27T10-13-34",
            "scenario_type": "ERM_BASELINE",
            "status": "COMPLETED",
            "experiment_run_id": "88bc7ecc-6655-49bc-9a1e-978a0f0724d8",
            "created_at": "2025-08-27 18:13:34",
            "completed_at": "2025-08-27 18:13:41"
        }
    ],
    "evaluation_runs": [
        {
            "id": "103f8589-4817-467b-a8fb-6a26ac19b094",
            "name": "Eval_DOMAIN_ADAPTATION_2025-08-27T10-38-14",
            "scenario_type": "DOMAIN_ADAPTATION",
            "status": "COMPLETED",
            "trained_model_id": "139a0f5c-55c3-45da-89d1-2114a00fb1ac",
            "test_set_source": "\"{\\\"testDataSource\\\":\\\"training_holdout\\\",\\\"customDataRatio\\\":20,\\\"timeRange\\\":{\\\"startDate\\\":\\\"\\\",\\\"endDate\\\":\\\"\\\"},\\\"targetDataset\\\":{\\\"building\\\":\\\"Building-A\\\",\\\"floor\\\":\\\"2F\\\",\\\"room\\\":\\\"Room-06\\\",\\\"datasetId\\\":\\\"c198eb01ec8drtobk8a5\\\"}}\"",
            "evaluation_metrics": {
                "accuracy": 0.8911,
                "precision": 0.7516,
                "recall": 0.7951,
                "f1_score": 0.817,
                "auc_roc": 0.9407,
                "confusion_matrix": {
                    "tp": 93,
                    "fp": 11,
                    "tn": 181,
                    "fn": 9
                }
            },
            "created_at": "2025-08-27 18:38:14",
            "completed_at": "2025-08-27 18:38:24"
        },
        {
            "id": "d0510b78-0345-40df-ab99-578fc5223191",
            "name": "Eval_GENERALIZATION_CHALLENGE_2025-08-27T10-22-54",
            "scenario_type": "GENERALIZATION_CHALLENGE",
            "status": "COMPLETED",
            "trained_model_id": "f0496299-f169-4544-84e0-93555c35d4a7",
            "test_set_source": "\"{\\\"testDataSource\\\":\\\"training_holdout\\\",\\\"customDataRatio\\\":20,\\\"timeRange\\\":{\\\"startDate\\\":\\\"\\\",\\\"endDate\\\":\\\"\\\"}}\"",
            "evaluation_metrics": {
                "accuracy": 0.8448,
                "precision": 0.898,
                "recall": 0.8004,
                "f1_score": 0.8202,
                "auc_roc": 0.8644,
                "confusion_matrix": {
                    "tp": 118,
                    "fp": 22,
                    "tn": 182,
                    "fn": 6
                }
            },
            "created_at": "2025-08-27 18:22:54",
            "completed_at": "2025-08-27 18:23:04"
        },
        {
            "id": "605b2453-fcaa-4167-bbad-63ddefc4f836",
            "name": "Eval_ERM_BASELINE_2025-08-27T10-17-08",
            "scenario_type": "ERM_BASELINE",
            "status": "COMPLETED",
            "trained_model_id": "f0496299-f169-4544-84e0-93555c35d4a7",
            "test_set_source": "\"{\\\"testDataSource\\\":\\\"training_holdout\\\",\\\"customDataRatio\\\":20,\\\"timeRange\\\":{\\\"startDate\\\":\\\"\\\",\\\"endDate\\\":\\\"\\\"}}\"",
            "evaluation_metrics": {
                "accuracy": 0.8346,
                "precision": 0.808,
                "recall": 0.7811,
                "f1_score": 0.8405,
                "auc_roc": 0.9325,
                "confusion_matrix": {
                    "tp": 119,
                    "fp": 13,
                    "tn": 158,
                    "fn": 8
                }
            },
            "created_at": "2025-08-27 18:17:08",
            "completed_at": "2025-08-27 18:17:17"
        }
    ]
};

// 模擬 Stage4ResultsAnalysis 組件中的數據處理邏輯
function processEvaluationsByScenario(experiments) {
    console.log('Processing experiments:', experiments);
    const scenarioMap = {
        ERM_BASELINE: [],
        GENERALIZATION_CHALLENGE: [],
        DOMAIN_ADAPTATION: [],
    };

    experiments.forEach((experiment, index) => {
        console.log(`Experiment ${index}:`, experiment);
        // Access evaluation_runs from ExperimentHistory structure
        const evaluationRuns = experiment.evaluation_runs;
        console.log(`Evaluation runs in experiment ${index}:`, evaluationRuns);
        
        evaluationRuns?.forEach((evaluation, evalIndex) => {
            console.log(`Evaluation ${evalIndex} in experiment ${index}:`, evaluation);
            console.log(`Scenario type: "${evaluation.scenario_type}"`);
            
            if (evaluation.scenario_type && scenarioMap[evaluation.scenario_type]) {
                console.log(`Adding evaluation to ${evaluation.scenario_type}`);
                scenarioMap[evaluation.scenario_type].push(evaluation);
            } else {
                console.log(`Scenario type "${evaluation.scenario_type}" not found in scenarioMap or is undefined`);
            }
        });
    });

    console.log('Final scenarioMap:', scenarioMap);
    return scenarioMap;
}

// 測試
console.log('=== 測試 Stage4 數據處理 ===');
const experiments = [mockExperimentHistory];
const result = processEvaluationsByScenario(experiments);

console.log('\n=== 結果總結 ===');
console.log(`ERM_BASELINE: ${result.ERM_BASELINE.length} evaluations`);
console.log(`GENERALIZATION_CHALLENGE: ${result.GENERALIZATION_CHALLENGE.length} evaluations`);
console.log(`DOMAIN_ADAPTATION: ${result.DOMAIN_ADAPTATION.length} evaluations`);

// 檢查每個場景的數據
console.log('\n=== 詳細數據 ===');
Object.keys(result).forEach(scenario => {
    console.log(`\n${scenario}:`);
    result[scenario].forEach(eval => {
        console.log(`  - ${eval.name}: accuracy=${eval.evaluation_metrics.accuracy}`);
    });
});
