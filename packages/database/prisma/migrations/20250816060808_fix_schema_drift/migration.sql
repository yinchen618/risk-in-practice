/*
  Warnings:

  - Creating new table structures to match the current schema.
  - Adding required column `evaluation_run_id` to the `model_prediction` table.
  - Note: Any existing data in `trained_model` table may need manual migration.

*/

-- Drop foreign key constraints if they exist
DO $$
BEGIN
    -- Drop model_prediction foreign key
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'model_prediction_trainedModelId_fkey'
    ) THEN
        ALTER TABLE "model_prediction" DROP CONSTRAINT "model_prediction_trainedModelId_fkey";
    END IF;
    
    -- Drop trained_model foreign key if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trained_model') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'trained_model_experimentRunId_fkey'
        ) THEN
            ALTER TABLE "trained_model" DROP CONSTRAINT "trained_model_experimentRunId_fkey";
        END IF;
        
        -- Drop the old table (WARNING: This will lose data)
        DROP TABLE "trained_model";
    END IF;
END $$;

-- Create the new tables
CREATE TABLE IF NOT EXISTS "trained_models" (
    "id" TEXT NOT NULL,
    "job_id" TEXT,
    "experiment_run_id" TEXT,
    "scenario_type" TEXT NOT NULL DEFAULT 'ERM_BASELINE',
    "model_type" TEXT NOT NULL DEFAULT 'default',
    "model_path" TEXT NOT NULL DEFAULT '',
    "data_source_config" JSONB NOT NULL DEFAULT '{}',
    "training_metrics" JSONB,
    "data_split_config" JSONB,
    "model_config" JSONB,
    "status" TEXT,
    "created_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "organization_id" TEXT,

    CONSTRAINT "trained_models_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "evaluation_runs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trained_model_id" TEXT NOT NULL,
    "test_set_source" JSONB NOT NULL,
    "evaluation_metrics" JSONB,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "evaluation_runs_pkey" PRIMARY KEY ("id")
);

-- Add evaluation_run_id column to model_prediction if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'model_prediction' AND column_name = 'evaluation_run_id'
    ) THEN
        ALTER TABLE "model_prediction" ADD COLUMN "evaluation_run_id" TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'evaluation_runs_trained_model_id_fkey'
    ) THEN
        ALTER TABLE "evaluation_runs" ADD CONSTRAINT "evaluation_runs_trained_model_id_fkey" FOREIGN KEY ("trained_model_id") REFERENCES "trained_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'trained_models_experiment_run_id_fkey'
    ) THEN
        ALTER TABLE "trained_models" ADD CONSTRAINT "trained_models_experiment_run_id_fkey" FOREIGN KEY ("experiment_run_id") REFERENCES "experiment_run"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'model_prediction_trainedModelId_fkey'
    ) THEN
        ALTER TABLE "model_prediction" ADD CONSTRAINT "model_prediction_trainedModelId_fkey" FOREIGN KEY ("trainedModelId") REFERENCES "trained_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'model_prediction_evaluation_run_id_fkey'
    ) THEN
        ALTER TABLE "model_prediction" ADD CONSTRAINT "model_prediction_evaluation_run_id_fkey" FOREIGN KEY ("evaluation_run_id") REFERENCES "evaluation_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
