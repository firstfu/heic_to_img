/**
 * 主題化檢視容器元件 (ThemedView)
 * 
 * 功能說明：
 * - 提供自動適應明暗主題的 View 容器元件
 * - 整合應用程式的主題系統，確保視覺一致性
 * - 支援自定義明暗模式顏色覆蓋選項
 * - 作為應用程式中所有檢視容器的基礎元件
 * 
 * 特色功能：
 * - 自動主題偵測: 使用 useThemeColor hook 自動適應系統主題
 * - 彈性配置: 支援自定義明色和暗色背景顏色
 * - 完全相容: 繼承所有原生 View 元件的屬性和方法
 * - 樣式合併: 智慧合併主題背景色與自定義樣式
 * 
 * 使用場景：
 * - 頁面主容器和內容區塊
 * - 卡片和面板的背景容器
 * - 需要響應主題變化的任何檢視元素
 * - 替代原生 View 以獲得主題支援
 * 
 * 技術實作：
 * - 利用 useThemeColor hook 獲取主題顏色
 * - 透過 ViewProps 擴展確保類型安全
 * - 使用 spread operator 保持 API 完整性
 * - 樣式陣列合併確保自定義樣式優先權
 * 
 * Props 說明：
 * - lightColor: 明亮主題下的背景顏色覆蓋
 * - darkColor: 暗色主題下的背景顏色覆蓋
 * - 繼承所有 React Native View 的標準屬性
 */

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
