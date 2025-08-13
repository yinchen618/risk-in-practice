#!/bin/bash

# 這個腳本會手動修復 Prisma 遷移衝突而不刪除資料

echo "正在修復 Prisma 遷移衝突..."

# 1. 備份當前的 schema
cp prisma/schema.prisma prisma/schema.prisma.backup

# 2. 使用 db pull 來獲取當前資料庫的實際結構
echo "從資料庫拉取實際 schema..."
npx dotenv-cli -e ../../.env -- npx prisma db pull --schema=./prisma/schema.prisma

# 3. 重新生成客戶端
echo "重新生成 Prisma Client..."
npx dotenv-cli -e ../../.env -- npx prisma generate --schema=./prisma/schema.prisma

echo "修復完成！"
echo "資料庫 schema 已同步，且沒有刪除任何資料。"
