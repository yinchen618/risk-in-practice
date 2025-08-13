-- CreateEnum
CREATE TYPE "ExperimentRunStatus" AS ENUM ('CONFIGURING', 'LABELING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AnomalyEventStatus" AS ENUM ('UNREVIEWED', 'VERIFIED', 'FALSE_POSITIVE');

-- This is a baseline migration that represents the current state of the database
-- No actual changes will be made since the database is already in this state
SELECT 1;
