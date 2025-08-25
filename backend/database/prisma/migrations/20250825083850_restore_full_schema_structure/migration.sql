-- CreateTable
CREATE TABLE "experiment_run" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "filtering_parameters" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONFIGURING',
    "candidate_count" INTEGER,
    "positive_label_count" INTEGER,
    "negative_label_count" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "candidate_stats" TEXT
);

-- CreateTable
CREATE TABLE "anomaly_event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" TEXT NOT NULL,
    "meter_id" TEXT NOT NULL,
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
    CONSTRAINT "anomaly_event_experiment_run_id_fkey" FOREIGN KEY ("experiment_run_id") REFERENCES "experiment_run" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "anomaly_label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "event_label_link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" TEXT NOT NULL,
    "label_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_label_link_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "anomaly_event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_label_link_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "anomaly_label" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trained_models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scenario_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "experiment_run_id" TEXT NOT NULL,
    "model_config" TEXT NOT NULL,
    "data_source_config" TEXT NOT NULL,
    "model_path" TEXT,
    "training_metrics" TEXT,
    "job_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    CONSTRAINT "trained_models_experiment_run_id_fkey" FOREIGN KEY ("experiment_run_id") REFERENCES "experiment_run" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evaluation_runs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scenario_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trained_model_id" TEXT NOT NULL,
    "test_set_source" TEXT NOT NULL,
    "evaluation_metrics" TEXT,
    "job_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    CONSTRAINT "evaluation_runs_trained_model_id_fkey" FOREIGN KEY ("trained_model_id") REFERENCES "trained_models" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "model_predictions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evaluation_run_id" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "prediction_score" REAL NOT NULL,
    "ground_truth" INTEGER,
    CONSTRAINT "model_predictions_evaluation_run_id_fkey" FOREIGN KEY ("evaluation_run_id") REFERENCES "evaluation_runs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ammeter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "electric_meter_number" TEXT NOT NULL,
    "electric_meter_name" TEXT NOT NULL,
    "device_number" TEXT NOT NULL,
    "factory" TEXT,
    "device" TEXT,
    "voltage" REAL,
    "currents" REAL,
    "power" REAL,
    "battery" REAL,
    "switch_state" INTEGER,
    "network_state" INTEGER,
    "last_updated" DATETIME,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "ammeter_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "device_number" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "factory" TEXT,
    "device" TEXT,
    "voltage" REAL,
    "currents" REAL,
    "power" REAL,
    "battery" REAL,
    "switch_state" INTEGER,
    "network_state" INTEGER,
    "last_updated" DATETIME,
    "request_data" TEXT,
    "response_data" TEXT,
    "status_code" INTEGER,
    "success" BOOLEAN NOT NULL,
    "error_message" TEXT,
    "response_time" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT,
    "created_at" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "anomaly_event_event_id_key" ON "anomaly_event"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "anomaly_label_name_key" ON "anomaly_label"("name");

-- CreateIndex
CREATE UNIQUE INDEX "event_label_link_event_id_label_id_key" ON "event_label_link"("event_id", "label_id");

-- CreateIndex
CREATE UNIQUE INDEX "ammeter_device_number_key" ON "ammeter"("device_number");
