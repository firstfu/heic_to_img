# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
這是一個 React Native Expo 應用程式，用於 HEIC 圖片轉換功能。使用 Expo Router 進行檔案路由管理，支援 iOS、Android 和 Web 平台。

## 開發命令
- 啟動開發伺服器: `npx expo start`
- 在 Android 模擬器中啟動: `npx expo start --android`
- 在 iOS 模擬器中啟動: `npx expo start --ios`
- 在網頁中啟動: `npx expo start --web`
- 程式碼檢查: `npm run lint`
- 重置專案為空白模板: `npm run reset-project`
- 安裝 Expo 套件: `npx expo install [package-name]`

## 專案架構
- **app/**: 使用 Expo Router 的檔案路由系統
  - `_layout.tsx`: 應用程式根佈局，包含主題提供者和導航堆疊
  - `(tabs)/`: 標籤導航群組
    - `_layout.tsx`: 標籤佈局配置
    - `index.tsx`: 首頁畫面 - HEIC 轉換主介面
    - `about.tsx`: 關於頁面 - 應用程式資訊
  - `results.tsx`: 轉換結果頁面 - 顯示轉換後的檔案
  - `+not-found.tsx`: 404 頁面
- **components/**: 可重複使用的 React 元件
  - `ui/`: 自定義 UI 元件 (Button, Card, DropZone, CustomHeader, FullScreenProgress 等)
  - `FileSelector.tsx`: 檔案選擇元件，支援多檔案選擇和相簿選擇
- **constants/**: 全域常數配置
  - `Colors.ts`: 舊版顏色主題
  - `NewColors.ts`: 新版設計系統，包含完整的顏色、字型、間距定義
- **hooks/**: 自定義 React hooks
  - `useColorScheme`: 偵測系統主題
  - `useThemeColor`: 根據主題獲取顏色
- **assets/**: 靜態資源 (圖片、字體)

## 核心功能架構
### HEIC 轉換流程
1. 使用 `expo-document-picker` 選擇 HEIC 檔案
2. 在 Web 平台使用 `heic2any` 進行轉換
3. 支援 JPEG/PNG 格式輸出和品質控制 (50-100%)
4. 批量處理多個檔案並顯示進度
5. 轉換完成後導航至結果頁面

### 檔案處理
- Web 平台: 使用 Blob URL 和 download 屬性下載
- 原生平台: 使用 `expo-media-library` 儲存至相簿
- 分享功能: 使用 `expo-sharing` 進行檔案分享

## 開發要點
- 使用 TypeScript 進行開發，啟用嚴格模式
- 支援路徑別名 `@/*` 指向專案根目錄
- 支援明暗主題切換
- 使用 Expo 的新架構 (newArchEnabled: true)
- 配置了觸覺反饋標籤按鈕
- 支援 edge-to-edge 顯示 (Android)
- 使用 EAS 進行建置和更新 (projectId: de8ca525-ad65-420e-858f-b6897bb298f2)

## 技術堆疊
- React Native 0.79.5 + React 19.0.0
- Expo SDK ~53.0.20
- Expo Router 用於導航
- TypeScript 用於型別安全
- ESLint 用於程式碼品質檢查
- heic2any 用於 HEIC 格式轉換 (Web 平台)