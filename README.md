# HEIC 轉換工具 🖼️

一個專業級的 HEIC/HEIF 圖片轉換應用程式，支援批量處理、品質控制，完全離線運作保護您的隱私。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20iOS%20%7C%20Android-lightgrey.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020.svg)

## ✨ 特色功能

### 🔒 隱私優先
- **完全離線處理** - 檔案不會上傳到任何伺服器
- **本地轉換** - 所有處理都在您的裝置上完成
- **無資料收集** - 不記錄或分析您的圖片

### ⚡ 高效批量處理
- **多檔案選擇** - 一次選擇多個 HEIC 檔案
- **批量轉換** - 同時處理所有選中的檔案
- **進度顯示** - 即時顯示轉換進度

### 🎯 專業品質控制
- **多格式輸出** - 支援 JPEG 和 PNG 格式
- **品質調整** - 60%、80%、90%、100% 品質選項
- **EXIF 保留** - 保持原始圖片的拍攝資訊

### 🌐 跨平台支援
- **Web 瀏覽器** - 在任何現代瀏覽器中使用
- **iOS 應用** - 原生 iOS 體驗
- **Android 應用** - 原生 Android 體驗

## 🚀 快速開始

### 環境要求
- Node.js 18.0+
- npm 或 yarn
- Expo CLI

### 安裝步驟

1. **複製專案**
```bash
git clone https://github.com/yourname/heic_to_img.git
cd heic_to_img
```

2. **安裝依賴**
```bash
npm install
```

3. **啟動開發伺服器**
```bash
# Web 版本（推薦）
npx expo start --web

# iOS 模擬器
npx expo start --ios

# Android 模擬器
npx expo start --android
```

4. **開始使用**
- 在瀏覽器中打開應用程式
- 點擊「選擇 HEIC 檔案」
- 調整品質和格式設定
- 點擊「開始轉換」
- 下載轉換完成的檔案

## 🛠️ 使用說明

### 基本操作流程

1. **選擇設定**
   - 選擇輸出格式（JPEG 或 PNG）
   - 調整品質設定（60% - 100%）

2. **選擇檔案**
   - 點擊「選擇 HEIC 檔案」按鈕
   - 從檔案瀏覽器中選擇一個或多個 HEIC/HEIF 檔案

3. **開始轉換**
   - 點擊「開始轉換」按鈕
   - 等待轉換完成（會顯示進度）

4. **下載結果**
   - 轉換完成後，點擊「下載」按鈕
   - 檔案會自動下載到您的裝置

### 高級功能

- **批量處理**: 可同時選擇最多 50 個檔案
- **品質優化**: 根據用途選擇合適的品質設定
- **格式選擇**: JPEG 適合照片，PNG 適合需要透明背景的圖片

## 📋 系統需求

### Web 瀏覽器
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### 行動裝置
- iOS 13.0+
- Android 8.0+ (API level 26)

## 🔧 技術架構

### 核心技術
- **React Native** - 跨平台應用框架
- **Expo** - 開發和部署平台
- **TypeScript** - 型別安全的 JavaScript
- **heic2any** - HEIC 轉換引擎

### 主要套件
- `expo-document-picker` - 檔案選擇功能
- `expo-file-system` - 檔案系統操作
- `heic2any` - HEIC 到 JPEG/PNG 轉換

詳細技術資訊請參考 [技術指南](docs/TECHNICAL_GUIDE.md)

## 📚 文件

- [產品需求文件 (PRD)](docs/PRD.md) - 完整的產品規劃和需求
- [技術指南](docs/TECHNICAL_GUIDE.md) - 開發和部署指南
- [CLAUDE.md](CLAUDE.md) - 專案配置和指令

## 🤝 貢獻

歡迎貢獻代碼！請閱讀我們的貢獻指南：

1. Fork 本專案
2. 創建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打開一個 Pull Request

## 🐛 問題回報

如果您發現錯誤或有功能建議，請在 [Issues](https://github.com/yourname/heic_to_img/issues) 頁面提交。

## 📝 變更日誌

### v1.0.0 (2025-01-02)
- ✨ 初始版本發佈
- 🔒 完全離線 HEIC 轉換功能
- ⚡ 批量處理支援
- 🎯 品質控制選項
- 🌐 跨平台支援

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 🙋‍♂️ 支援

如果您覺得這個專案有幫助，請給我們一個 ⭐️！

---

**Made with ❤️ by [Your Team Name]**
