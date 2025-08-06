# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
這是一個 React Native Expo 應用程式，專門用於 HEIC 圖片轉換功能。使用 Expo Router 進行檔案路由管理，主要支援 iOS 和 Android 原生平台（Web 平台支援已移除）。

## 開發命令
```bash
# 啟動開發伺服器
npx expo start

# 指定平台啟動
npx expo start --android    # Android 模擬器
npx expo start --ios        # iOS 模擬器

# 程式碼品質檢查
npm run lint

# 其他命令
npm run reset-project       # 重置專案為空白模板
npx expo install [package]  # 安裝 Expo 相容套件
```

## 核心架構

### 專案結構
- **app/**: Expo Router 檔案路由系統
  - `_layout.tsx`: 根佈局，設定主題和導航堆疊
  - `(tabs)/_layout.tsx`: 底部標籤導航設定
  - `(tabs)/index.tsx`: HEIC 轉換主頁面
  - `(tabs)/about.tsx`: 關於頁面
  - `results.tsx`: 轉換結果顯示頁面
  - `+not-found.tsx`: 404 錯誤頁面

- **components/**:
  - `ui/`: UI 元件庫 (Button, Card, DropZone, FullScreenProgress, CustomHeader 等)
  - `FileSelector.tsx`: 多檔案選擇元件，支援檔案系統和相簿選擇

- **services/**: 
  - `ApiService.ts`: 後端 API 整合服務，處理 HEIC 轉換請求

- **constants/**:
  - `ApiConfig.ts`: API 設定和端點定義 (預設: http://192.168.23.105:8000)
  - `NewColors.ts`: 設計系統 - 顏色、字型、間距、陰影定義

- **types/**:
  - `Api.ts`: API 相關的 TypeScript 型別定義

### 關鍵功能流程

#### HEIC 轉換流程
1. 使用 `expo-document-picker` 選擇 HEIC 檔案
2. 透過 `ApiService` 上傳至後端 API 進行轉換
3. 支援格式: JPEG/PNG，品質: 60/80/90/100%
4. 批量處理多檔案，即時顯示轉換進度
5. 轉換成功後自動導航至結果頁面

#### 檔案處理
- **原生平台**: 使用 `expo-media-library` 儲存至相簿
- **檔案分享**: 使用 `expo-sharing` 分享轉換後的檔案
- **檔案選擇**: 支援從檔案系統或相簿選擇多個檔案

### API 整合
應用程式依賴後端 API 服務進行 HEIC 檔案轉換：
- **API 基礎 URL**: 在 `constants/ApiConfig.ts` 中設定
- **主要端點**:
  - `POST /api/v1/convert`: 轉換檔案並返回元資料
  - `POST /api/v1/convert-download`: 轉換並直接下載
  - `POST /api/v1/info`: 獲取 HEIC 檔案資訊
  - `GET /health`: 健康檢查

## 後端 API 專案
- **路徑**: `/Users/firstfu/Desktop/heic_to_img_workbase/heic_to_img_api`
- **技術**: FastAPI + Python 3.11+
- **啟動**: `cd ../heic_to_img_api && uv run start`
- **文檔**: http://localhost:8000/docs

### 後端開發命令
```bash
# 切換到 API 專案
cd ../heic_to_img_api

# 安裝依賴
uv sync

# 啟動開發伺服器
uv run start

# 或使用完整指令
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 技術堆疊
- **React Native**: 0.79.5
- **React**: 19.0.0
- **Expo SDK**: ~53.0.20
- **Expo Router**: ~5.1.4 (檔案路由)
- **TypeScript**: ~5.8.3 (嚴格模式)
- **ESLint**: ^9.25.0

### 關鍵套件
- `expo-document-picker`: 檔案選擇
- `expo-file-system`: 檔案系統操作
- `expo-media-library`: 相簿存取
- `expo-sharing`: 檔案分享
- `expo-image-picker`: 相簿圖片選擇
- `react-native-reanimated`: 動畫支援

## 開發注意事項
- TypeScript 嚴格模式已啟用
- 路徑別名 `@/*` 指向專案根目錄
- 支援明暗主題自動切換
- 使用 Expo 新架構 (newArchEnabled: true)
- EAS 專案 ID: de8ca525-ad65-420e-858f-b6897bb298f2
- 觸覺反饋已配置於標籤切換

## 測試和除錯
```bash
# 執行 linter
npm run lint

# 檢查 TypeScript 型別
npx tsc --noEmit

# 開發時啟用除錯日誌
npx expo start --clear
```

## 常見問題
1. **API 連線失敗**: 檢查 `ApiConfig.ts` 中的 API_BASE_URL 設定
2. **檔案上傳失敗**: 確認後端服務正在運行
3. **相簿權限**: 確保應用程式有相簿存取權限