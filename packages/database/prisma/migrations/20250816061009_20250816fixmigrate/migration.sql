/*
  Warnings:

  - Made the column `evaluation_run_id` on table `model_prediction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "model_prediction" ALTER COLUMN "evaluation_run_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "trained_models" ALTER COLUMN "scenario_type" DROP DEFAULT,
ALTER COLUMN "model_type" DROP DEFAULT,
ALTER COLUMN "model_path" DROP DEFAULT,
ALTER COLUMN "data_source_config" DROP DEFAULT;
