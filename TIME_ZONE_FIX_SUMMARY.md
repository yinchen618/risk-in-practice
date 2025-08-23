# 時間處理流程修正總結

## 問題描述

之前的前後端時間處理存在時區處理不一致的問題：
- 前端用戶選擇台灣時間（+8），但傳送時沒有明確時區資訊
- 後端假設收到的是台灣時間，再次進行 -8 小時的轉換
- 這可能導致時間偏移問題

## 修正後的流程

### 1. 前端時間處理 (`use-testbed-data.ts`)

```typescript
const getAmmeterHistoryDataWithTime = async (
	building: string,
	electricMeterNumber: string,
	startDate: string,      // "2025-08-23"
	endDate: string,        // "2025-08-23"
	startTime: string,      // "14:00"
	endTime: string,        // "23:59"
): Promise<MeterData> => {
	// 將台灣時間轉換為 ISO 8601 格式，明確指定 +08:00 時區
	const startDateTime = `${startDate}T${startTime}:00+08:00`;  // "2025-08-23T14:00:00+08:00"
	const endDateTime = `${endDate}T${endTime}:00+08:00`;        // "2025-08-23T23:59:00+08:00"
	
	const params = new URLSearchParams({
		electric_meter_number: electricMeterNumber,
		start_datetime: startDateTime,
		end_datetime: endDateTime,
	});
	
	// 使用正確的 API 端點
	const response = await fetch(
		`https://python.yinchen.tw/api/testbed/ammeter-history?${params}`,
		// ...
	);
}
```

### 2. 後端路由層時區轉換 (`routes/testbed.py`)

```python
# 如果有 datetime 參數，需要轉換為日期和時間格式
if start_datetime and end_datetime:
    # 解析帶時區的 datetime
    start_dt = datetime.fromisoformat(start_datetime)  # 2025-08-23T14:00:00+08:00
    end_dt = datetime.fromisoformat(end_datetime)      # 2025-08-23T23:59:00+08:00
    
    # 如果有時區信息，轉換為 UTC
    if start_dt.tzinfo is not None:
        start_dt_utc = start_dt.astimezone(timezone.utc).replace(tzinfo=None)  # 2025-08-23T06:00:00
        end_dt_utc = end_dt.astimezone(timezone.utc).replace(tzinfo=None)      # 2025-08-23T15:59:00
        
        start_date_part = start_dt_utc.strftime('%Y-%m-%d')  # "2025-08-23"
        start_time_part = start_dt_utc.strftime('%H:%M')     # "06:00"
        end_date_part = end_dt_utc.strftime('%Y-%m-%d')      # "2025-08-23"
        end_time_part = end_dt_utc.strftime('%H:%M')         # "15:59"
```

### 3. 後端服務層 (`services/testbed_service.py`)

```python
async def get_ammeter_history_data_by_datetime_range(
    self,
    electric_meter_number: str,
    start_date: str,  # 已經轉換為 UTC 的日期
    end_date: str,    # 已經轉換為 UTC 的日期
    start_time: str,  # 已經轉換為 UTC 的時間
    end_time: str,    # 已經轉換為 UTC 的時間
) -> MeterHistoryData:
    # 組合為 UTC 時間字符串
    start_datetime_utc = f"{start_date}T{start_time}:00"  # "2025-08-23T06:00:00"
    end_datetime_utc = f"{end_date}T{end_time}:00"        # "2025-08-23T15:59:00"
    
    # 直接使用 UTC 時間查詢資料庫
    # 不再進行額外的時區轉換
```

### 4. 前端顯示時間格式化

```typescript
// 在 SimpleTimeChart 組件中
const taiwanTime = new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
}).format(d.timestamp);  // 將 UTC 時間格式化為台灣時間顯示
```

## 時間流向總結

1. **用戶選擇**：台灣時間 `2025-08-23 14:00` ~ `2025-08-23 23:59`
2. **前端發送**：`2025-08-23T14:00:00+08:00` ~ `2025-08-23T23:59:00+08:00`
3. **後端轉換**：`2025-08-23T06:00:00` ~ `2025-08-23T15:59:00` (UTC)
4. **資料庫查詢**：使用 UTC 時間查詢
5. **資料庫返回**：UTC 時間的 timestamp
6. **前端顯示**：使用 `timeZone: "Asia/Taipei"` 格式化為台灣時間顯示

## 關鍵修正點

1. **明確時區資訊**：前端發送時明確指定 `+08:00` 時區
2. **統一轉換邏輯**：在路由層統一處理時區轉換，服務層只處理 UTC 時間
3. **移除重複轉換**：服務層不再進行台灣時間到 UTC 的轉換
4. **正確的 API 端點**：使用 `/ammeter-history` 而非 `/ammeter-history-range`

## 測試方式

1. 在前端選擇台灣時間，例如：`2025-08-23 14:00` ~ `2025-08-23 23:59`
2. 檢查後端日誌，確認時區轉換正確：
   - 應該看到 `start_datetime: 2025-08-23T14:00:00+08:00`
   - 轉換後應該是 `start_date_part: 2025-08-23`, `start_time_part: 06:00`
3. 檢查前端圖表顯示的時間軸是否為台灣時間
4. 檢查 tooltip 顯示的時間是否正確

這樣修正後，時間處理流程應該更加一致和正確。
