/*
  Warnings:

  - You are about to drop the `evaluation_runs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `model_prediction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trained_models` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "evaluation_runs" DROP CONSTRAINT "evaluation_runs_trained_model_id_fkey";

-- DropForeignKey
ALTER TABLE "model_prediction" DROP CONSTRAINT "model_prediction_evaluation_run_id_fkey";

-- DropForeignKey
ALTER TABLE "model_prediction" DROP CONSTRAINT "model_prediction_trainedModelId_fkey";

-- DropForeignKey
ALTER TABLE "trained_models" DROP CONSTRAINT "trained_models_experiment_run_id_fkey";

-- DropTable
DROP TABLE "evaluation_runs";

-- DropTable
DROP TABLE "model_prediction";

-- DropTable
DROP TABLE "trained_models";
