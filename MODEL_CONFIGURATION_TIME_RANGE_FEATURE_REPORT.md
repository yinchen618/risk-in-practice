# Model Configuration Time Range & Building Selection Feature Report

## 功能概述

在 Model Configuration Panel 中新增了時間範圍和樓層選擇功能，類似於 TimeRangeFilter 組件的功能。使用者可以選擇使用當初標註的區間，或自訂時間範圍和樓層選擇。

## 主要功能

### 1. Radio 按鈕選擇模式
- **使用原始標註區間** (推薦)：自動讀取當初在 Stage 1 進行資料探索時設定的時間範圍和樓層選擇
- **自訂區間**：允許使用者手動設定不同的時間範圍和樓層選擇

### 2. 原始標註區間自動載入
- 當選擇實驗 run 時，系統會自動從 `experiment_run.filteringParameters` 載入原始設定
- 包含：
  - 時間範圍 (start_date, end_date, start_time, end_time)
  - 樓層選擇 (selected_floors_by_building)
- 在原始模式下顯示唯讀的原始設定資訊

### 3. 自訂時間範圍和樓層選擇
- 類似於 TimeRangeFilter 的完整功能
- 包含三欄式佈局：
  - **左欄**：日期時間選擇器
  - **中欄**：Building A 樓層選擇
  - **右欄**：Building B 樓層選擇
- 支援按建築分組的樓層選擇
- 提供資料統計計算功能

### 4. 訓練資料統計
- 在自訂模式下可以點擊 "Calculate Data Count" 查看所選範圍的資料統計
- 顯示記錄數、設備數、平均值等資訊

## 實作詳情

### 新增的 Props
在 `ModelConfigurationPanel` 中新增了以下 props：

```typescript
// Time Range & Floor Selection (New)
timeRangeMode?: TimeRangeMode;
timeRange?: TimeRangeParams;
floor?: FloorParams;
originalTimeRange?: TimeRangeParams; // 來自當初標註的區間
originalFloor?: FloorParams; // 來自當初標註的樓層
selectedRunId?: string; // 用於獲取原始標註範圍
onTimeRangeModeChange?: (mode: TimeRangeMode) => void;
onTimeRangeChange?: (key: keyof TimeRangeParams, value: any) => void;
onFloorChange?: (key: keyof FloorParams, value: string[]) => void;
```

### 新增的類型定義
```typescript
type TimeRangeMode = "original" | "custom";

interface TimeRangeParams {
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
}

interface FloorParams {
    selectedBuildings: string[];
    selectedFloors: string[];
    selectedFloorsByBuilding?: Record<string, string[]>;
}
```

### Stage3ModelTraining 的修改
- 新增了時間範圍和樓層選擇的狀態管理
- 實作了從實驗 run 載入原始標註設定的邏輯
- 提供了切換模式時的資料同步機制

## 主要修改的檔案

1. **ModelConfigurationPanel.tsx**
   - 新增 Radio 按鈕選擇模式
   - 整合 TimeRangeFilter 類似的時間範圍和樓層選擇功能
   - 新增資料統計計算功能

2. **Stage3ModelTraining.tsx**
   - 新增時間範圍和樓層選擇的狀態管理
   - 實作原始標註資料的載入邏輯
   - 更新 ModelConfigurationPanel 的使用方式

## 使用方式

1. 進入 Stage 3 Model Training
2. 在 Model Configuration 面板中：
   - 預設選擇「使用原始標註區間」，會自動載入 Stage 1 的設定
   - 可以切換到「自訂區間」進行個別調整
   - 在自訂模式下可以選擇不同的時間範圍和樓層
   - 可以點擊計算按鈕查看所選範圍的資料統計

## 向後相容性

- 現有的 Prediction Settings 和 Model Parameters 功能保持不變
- 新功能為可選的 props，不會影響現有的使用方式
- 當未提供新 props 時，組件會正常工作，只是不顯示時間範圍和樓層選擇功能

## 測試建議

1. 測試原始模式下的資料載入
2. 測試自訂模式下的時間範圍和樓層選擇
3. 測試模式切換的資料同步
4. 測試資料統計計算功能
5. 測試向後相容性（在其他地方使用 ModelConfigurationPanel）

## 技術特點

- 重用了 TimeRangeFilter 的設計模式和組件結構
- 保持了原有組件的簡潔性，新功能為可選擴展
- 使用 TypeScript 確保類型安全
- 遵循現有的程式碼風格和架構模式
- 支援響應式設計，在不同螢幕尺寸下正常顯示
