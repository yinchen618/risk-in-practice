/*
  Warnings:

  - Added the required column `name` to the `anomaly_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trained_models" ADD COLUMN "started_at" DATETIME;
ALTER TABLE "trained_models" ADD COLUMN "training_logs" TEXT;
ALTER TABLE "trained_models" ADD COLUMN "validation_metrics" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_anomaly_event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataset_id" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "event_timestamp" DATETIME NOT NULL,
    "detection_rule" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "data_window" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNREVIEWED',
    "reviewer_id" TEXT,
    "review_timestamp" DATETIME,
    "justification_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "experiment_run_id" TEXT,
    CONSTRAINT "anomaly_event_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "analysis_datasets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "anomaly_event_experiment_run_id_fkey" FOREIGN KEY ("experiment_run_id") REFERENCES "experiment_run" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_anomaly_event" ("created_at", "data_window", "dataset_id", "detection_rule", "event_id", "event_timestamp", "experiment_run_id", "id", "justification_notes", "line", "review_timestamp", "reviewer_id", "score", "status", "updated_at") SELECT "created_at", "data_window", "dataset_id", "detection_rule", "event_id", "event_timestamp", "experiment_run_id", "id", "justification_notes", "line", "review_timestamp", "reviewer_id", "score", "status", "updated_at" FROM "anomaly_event";
DROP TABLE "anomaly_event";
ALTER TABLE "new_anomaly_event" RENAME TO "anomaly_event";
CREATE UNIQUE INDEX "anomaly_event_event_id_key" ON "anomaly_event"("event_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
