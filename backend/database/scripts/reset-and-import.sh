#!/bin/bash
# Full database reset and import script
# Usage: ./scripts/reset-and-import.sh

set -e

echo "🔄 Starting full database reset and import..."

# Change to database directory
cd "$(dirname "$0")/.."

echo "📋 Step 1: Resetting database..."
pnpm db:reset

echo "📊 Step 2: Importing room samples data..."
pnpm db:import

echo "🔍 Step 3: Verifying import..."
echo "Datasets created: $(sqlite3 prisma/pu_practice.db 'SELECT COUNT(*) FROM analysis_datasets;')"
echo "Analysis records: $(sqlite3 prisma/pu_practice.db 'SELECT COUNT(*) FROM analysis_ready_data;')"

echo "✅ Database reset and import completed successfully!"
echo "🎯 You can now run 'pnpm db:studio' to view the data"
