# 資料庫資料插入最佳實踐

## 問題根源

之前遇到的 "Inconsistent column data: Conversion failed: input contains invalid characters" 錯誤是由於以下原因：

1. **日期格式不正確**: DateTime 欄位包含不完整的 ISO 字符串
2. **字符編碼問題**: 資料中包含無效的 UTF-8 字符
3. **NULL 字節**: 資料中意外包含了 NULL 字節 (\0)

## 修復措施

### 1. 日期格式標準化
確保所有 DateTime 欄位使用完整的 ISO 8601 格式：
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

### 2. 字符驗證
在插入資料前，確保所有字符串欄位：
- 使用有效的 UTF-8 編碼
- 不包含 NULL 字節
- 不包含控制字符（\r, \n 在 JSON 字符串欄位中除外）

### 3. 資料驗證腳本
定期執行驗證腳本：
```bash
npm run db:validate
```

## 預防措施

### ExperimentRun 資料插入時的注意事項

1. **JSON 欄位驗證**:
   ```javascript
   // ✅ 正確的做法
   const filteringParams = JSON.stringify(cleanObject);
   
   // ❌ 避免直接插入可能包含無效字符的資料
   const badParams = someUserInput; // 可能包含無效字符
   ```

2. **日期欄位處理**:
   ```javascript
   // ✅ 使用 JavaScript Date 物件
   const now = new Date();
   
   // ✅ 或使用 ISO 字符串
   const isoString = new Date().toISOString();
   ```

3. **字符串清理**:
   ```javascript
   function cleanString(str) {
       if (!str) return str;
       return str
           .replace(/\0/g, '') // 移除 NULL 字節
           .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // 移除控制字符
   }
   ```

### 建議的插入模式

```javascript
async function safeInsertExperimentRun(data) {
    const prisma = new PrismaClient();
    
    try {
        const cleanData = {
            name: cleanString(data.name),
            description: data.description ? cleanString(data.description) : null,
            filteringParameters: data.filteringParameters ? 
                JSON.stringify(data.filteringParameters) : null,
            status: cleanString(data.status) || 'CONFIGURING',
            // 其他欄位...
        };
        
        const result = await prisma.experimentRun.create({
            data: cleanData
        });
        
        return result;
    } catch (error) {
        console.error('插入失敗:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
```

## 定期維護

1. **每次資料匯入後執行驗證**:
   ```bash
   npm run db:import && npm run db:validate
   ```

2. **在 CI/CD 中包含驗證步驟**

3. **定期備份資料庫**

## 故障排除

如果再次遇到類似錯誤：

1. 執行驗證腳本找出問題欄位
2. 使用 SQLite 工具檢查原始資料
3. 針對性修復無效字符
4. 重新生成 Prisma Client
