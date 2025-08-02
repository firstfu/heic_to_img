# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
這是一個 React Native Expo 應用程式，用於 HEIC 圖片轉換功能。使用 Expo Router 進行檔案路由管理，支援 iOS、Android 和 Web 平台。

## 開發命令
- 啟動開發伺服器: `npx expo start`
- 在 Android 模擬器中啟動: `expo start --android`
- 在 iOS 模擬器中啟動: `expo start --ios`
- 在網頁中啟動: `expo start --web`
- 程式碼檢查: `npm run lint`
- 重置專案為空白模板: `npm run reset-project`

## 專案架構
- **app/**: 使用 Expo Router 的檔案路由系統
  - `_layout.tsx`: 應用程式根佈局，包含主題提供者和導航堆疊
  - `(tabs)/`: 標籤導航群組
    - `_layout.tsx`: 標籤佈局配置
    - `index.tsx`: 首頁畫面
  - `+not-found.tsx`: 404 頁面
- **components/**: 可重複使用的 React 元件
  - `ui/`: 平台特定的 UI 元件 (IconSymbol, TabBarBackground)
- **constants/**: 全域常數，包含顏色主題配置
- **hooks/**: 自定義 React hooks，包含顏色主題和色彩方案
- **assets/**: 靜態資源 (圖片、字體)

## 開發要點
- 使用 TypeScript 進行開發，啟用嚴格模式
- 支援路徑別名 `@/*` 指向專案根目錄
- 支援明暗主題切換
- 使用 Expo 的新架構 (newArchEnabled: true)
- 配置了觸覺反饋標籤按鈕
- 支援 edge-to-edge 顯示 (Android)

## 技術堆疊
- React Native 0.79.5 + React 19.0.0
- Expo SDK ~53.0.20
- Expo Router 用於導航
- TypeScript 用於型別安全
- ESLint 用於程式碼品質檢查