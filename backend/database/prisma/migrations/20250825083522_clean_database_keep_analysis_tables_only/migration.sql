-- CreateTable
CREATE TABLE "analysis_datasets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "building" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "occupant_type" TEXT NOT NULL,
    "meter_id_l1" TEXT NOT NULL,
    "meter_id_l2" TEXT NOT NULL,
    "total_records" INTEGER NOT NULL,
    "positive_labels" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "analysis_ready_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataset_id" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "room" TEXT NOT NULL,
    "raw_wattage_l1" REAL NOT NULL,
    "raw_wattage_l2" REAL NOT NULL,
    "wattage_110v" REAL NOT NULL,
    "wattage_220v" REAL NOT NULL,
    "wattage_total" REAL NOT NULL,
    "is_positive_label" BOOLEAN NOT NULL DEFAULT false,
    "source_anomaly_event_id" TEXT,
    CONSTRAINT "analysis_ready_data_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "analysis_datasets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "analysis_datasets_name_key" ON "analysis_datasets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_ready_data_source_anomaly_event_id_key" ON "analysis_ready_data"("source_anomaly_event_id");
