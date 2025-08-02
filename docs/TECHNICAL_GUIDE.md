# HEIC 轉換工具 - 技術指南

## 專案概述

這是一個基於 React Native + Expo 開發的 HEIC 圖片轉換應用程式，支援 Web、iOS 和 Android 平台。

## 技術棧

- **前端框架**: React Native 0.79.5 + React 19.0.0
- **開發平台**: Expo SDK ~53.0.20
- **程式語言**: TypeScript
- **路由系統**: Expo Router
- **轉換引擎**: heic2any (Web平台)
- **檔案處理**: expo-document-picker, expo-file-system

## 專案結構

```
heic_to_img/
├── app/                          # 應用程式頁面
│   ├── (tabs)/                   # 標籤導航群組
│   │   ├── _layout.tsx          # 標籤佈局
│   │   └── index.tsx            # 主轉換頁面
│   ├── _layout.tsx              # 根佈局
│   └── +not-found.tsx           # 404 頁面
├── components/                   # 可重用元件
│   ├── ui/                      # UI 元件
│   └── *.tsx                    # 主題元件
├── constants/                    # 全域常數
├── hooks/                       # 自定義 hooks
├── assets/                      # 靜態資源
├── docs/                        # 文件目錄
│   ├── PRD.md                   # 產品需求文件
│   └── TECHNICAL_GUIDE.md       # 技術指南
└── package.json                 # 專案配置
```

## 安裝與設定

### 環境要求
- Node.js 18.0+
- npm 或 yarn
- Expo CLI

### 安裝步驟

1. **複製專案**
```bash
git clone <repository-url>
cd heic_to_img
```

2. **安裝依賴**
```bash
npm install
```

3. **啟動開發伺服器**
```bash
# Web 版本
npx expo start --web

# iOS 模擬器
npx expo start --ios

# Android 模擬器
npx expo start --android
```

## 核心功能實作

### 1. 檔案選擇功能

使用 `expo-document-picker` 實作多檔案選擇：

```typescript
const handleSelectFiles = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['image/heic', 'image/heif', 'image/*'],
    multiple: true,
    copyToCacheDirectory: true,
  });
  
  if (!result.canceled && result.assets) {
    const heicFiles = result.assets.filter(file => 
      file.name.toLowerCase().endsWith('.heic') || 
      file.name.toLowerCase().endsWith('.heif')
    );
    setSelectedFiles(heicFiles);
  }
};
```

### 2. HEIC 轉換引擎

Web 平台使用 `heic2any` 進行轉換：

```typescript
const convertHeicToJpg = async (fileUri: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    const heic2any = (await import('heic2any')).default;
    
    const response = await fetch(fileUri);
    const heicBlob = await response.blob();
    
    const convertedBlob = await heic2any({
      blob: heicBlob,
      toType: `image/${outputFormat}`,
      quality: quality,
    });

    const convertedFile = convertedBlob as Blob;
    return URL.createObjectURL(convertedFile);
  }
};
```

### 3. 批量處理

支援多檔案同時轉換：

```typescript
const handleConvert = async () => {
  setIsConverting(true);
  const converted: any[] = [];

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    setConversionProgress(`轉換中... ${i + 1}/${selectedFiles.length}`);
    
    const convertedUri = await convertHeicToJpg(file.uri);
    if (convertedUri) {
      converted.push({
        name: file.name.replace(/\.(heic|heif)$/i, `.${extension}`),
        originalName: file.name,
        uri: convertedUri,
        quality: quality,
        format: outputFormat,
      });
    }
  }
  
  setConvertedFiles(converted);
  setIsConverting(false);
};
```

### 4. 品質控制

提供多種品質選項：

```typescript
const [quality, setQuality] = useState<number>(0.9);
const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');

// UI 中的品質選擇按鈕
{[0.6, 0.8, 0.9, 1.0].map((q) => (
  <TouchableOpacity
    key={q}
    style={[
      styles.qualityButton,
      quality === q && { backgroundColor: primaryColor }
    ]}
    onPress={() => setQuality(q)}
  >
    <Text>{Math.round(q * 100)}%</Text>
  </TouchableOpacity>
))}
```

## 平台特定實作

### Web 平台
- 使用 `heic2any` 套件進行轉換
- 支援檔案下載功能
- 完整功能支援

### iOS/Android 平台
- 目前返回原始檔案 URI
- 未來需要整合原生轉換模組
- 檔案通過系統分享功能處理

## 效能優化

### 記憶體管理
- 轉換完成後自動清理 blob URLs
- 限制同時處理的檔案數量
- 適當的垃圾回收

### 用戶體驗
- 即時進度顯示
- 非阻塞式 UI 更新
- 完整的錯誤處理

## 部署指南

### Web 部署
```bash
# 建置 Web 版本
npx expo export --platform web

# 部署到靜態託管服務
# 輸出目錄: dist/
```

### 原生應用建置
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

## 開發工具

### 程式碼品質
```bash
# ESLint 檢查
npm run lint

# TypeScript 檢查
npx tsc --noEmit
```

### 除錯
- 使用 Expo DevTools
- React Native Debugger
- 瀏覽器開發者工具 (Web)

## 已知限制

1. **原生平台**: iOS/Android 目前僅支援檔案選擇，轉換功能需要原生模組
2. **檔案大小**: 大檔案可能影響效能
3. **瀏覽器相容性**: 依賴現代瀏覽器 API

## 未來改進方向

1. **原生轉換**: 整合 iOS/Android 原生 HEIC 轉換模組
2. **效能優化**: Web Workers 支援
3. **功能擴展**: 支援更多圖片格式
4. **UI 改進**: 拖拽介面、預覽功能

## 故障排除

### 常見問題

**Q: Web 版本轉換失敗？**
A: 檢查瀏覽器是否支援 HEIC 格式和 Web APIs

**Q: 檔案選擇沒有反應？**
A: 確認設備權限設定，重新啟動應用程式

**Q: 轉換後檔案無法下載？**
A: 檢查瀏覽器下載設定和權限

### 日誌除錯
在開發模式下，所有轉換過程都會輸出到控制台，便於除錯。

## 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 發起 Pull Request

## 授權
本專案採用 MIT 授權條款。