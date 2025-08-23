-- CreateTable
CREATE TABLE IF NOT EXISTS "trained_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scenario_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "experiment_run_id" TEXT NOT NULL,
    "model_config" JSONB NOT NULL,
    "data_source_config" JSONB NOT NULL,
    "model_path" TEXT,
    "training_metrics" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "trained_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "evaluation_runs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scenario_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trained_model_id" TEXT NOT NULL,
    "test_set_source" JSONB NOT NULL,
    "evaluation_metrics" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "evaluation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "model_predictions" (
    "id" TEXT NOT NULL,
    "evaluation_run_id" TEXT NOT NULL,
    "anomaly_event_id" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "predictionScore" DOUBLE PRECISION NOT NULL,
    "groundTruth" INTEGER,

    CONSTRAINT "model_predictions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey (只添加還沒有的外鍵)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trained_models_experiment_run_id_fkey') THEN
        ALTER TABLE "trained_models" ADD CONSTRAINT "trained_models_experiment_run_id_fkey" FOREIGN KEY ("experiment_run_id") REFERENCES "experiment_run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'evaluation_runs_trained_model_id_fkey') THEN
        ALTER TABLE "evaluation_runs" ADD CONSTRAINT "evaluation_runs_trained_model_id_fkey" FOREIGN KEY ("trained_model_id") REFERENCES "trained_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'model_predictions_evaluation_run_id_fkey') THEN
        ALTER TABLE "model_predictions" ADD CONSTRAINT "model_predictions_evaluation_run_id_fkey" FOREIGN KEY ("evaluation_run_id") REFERENCES "evaluation_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
