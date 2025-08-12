-- DropIndex
DROP INDEX "trained_model_experimentRunId_key";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "model_prediction" (
    "id" TEXT NOT NULL,
    "trainedModelId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "predictionScore" DOUBLE PRECISION NOT NULL,
    "groundTruth" INTEGER,

    CONSTRAINT "model_prediction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "model_prediction" ADD CONSTRAINT "model_prediction_trainedModelId_fkey" FOREIGN KEY ("trainedModelId") REFERENCES "trained_model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

