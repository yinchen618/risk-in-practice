-- DropIndex (guarded)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'trained_model_experimentRunId_key'
  ) THEN
    EXECUTE 'DROP INDEX "trained_model_experimentRunId_key"';
  END IF;
END $$;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "experiment_run" ADD COLUMN IF NOT EXISTS "candidateStats" JSONB;

CREATE TABLE IF NOT EXISTS "model_prediction" (
    "id" TEXT NOT NULL,
    "trainedModelId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "predictionScore" DOUBLE PRECISION NOT NULL,
    "groundTruth" INTEGER,

    CONSTRAINT "model_prediction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey (guarded)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'model_prediction_trainedModelId_fkey'
  ) THEN
    ALTER TABLE "model_prediction" ADD CONSTRAINT "model_prediction_trainedModelId_fkey" FOREIGN KEY ("trainedModelId") REFERENCES "trained_model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

