/**
 * 標籤欄背景元件 (TabBarBackground) - Web/Android 版本
 * 
 * 功能說明：
 * - Web 和 Android 平台的標籤欄背景處理
 * - 提供不透明標籤欄的基礎實作
 * - 處理底部標籤欄溢出計算
 * - 確保跨平台一致性
 * 
 * 平台差異：
 * - Web/Android: 標籤欄通常為不透明設計
 * - 溢出值固定為 0，無需額外處理
 * - 簡化的背景處理邏輯
 */

// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

export function useBottomTabOverflow() {
  return 0;
}
