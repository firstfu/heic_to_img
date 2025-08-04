/**
 * 主題化文字元件 (ThemedText)
 * 
 * 功能說明：
 * - 提供自動適應明暗主題的文字顯示元件
 * - 內建多種預設文字樣式類型，確保設計一致性
 * - 支援自定義主題顏色覆蓋和完整樣式自定義
 * - 作為應用程式中所有文字顯示的標準元件
 * 
 * 文字類型：
 * - default: 標準內文字體 (16px, 行高24px)
 * - defaultSemiBold: 加粗內文字體 (16px, 600字重)
 * - title: 大標題字體 (32px, 粗體)
 * - subtitle: 副標題字體 (20px, 粗體)
 * - link: 連結字體 (16px, 藍色, 行高30px)
 * 
 * 特色功能：
 * - 自動主題適應: 根據系統主題自動調整文字顏色
 * - 預設樣式系統: 提供一致的文字層級和視覺效果
 * - 彈性覆蓋: 支援明暗模式顏色自定義
 * - 完全擴展: 繼承所有 React Native Text 屬性
 * 
 * 使用場景：
 * - 標題、副標題和內文顯示
 * - 按鈕文字和標籤文字
 * - 連結文字和互動文字
 * - 任何需要主題適應的文字內容
 * 
 * 技術實作：
 * - 使用 useThemeColor hook 自動獲取主題顏色
 * - 條件式樣式應用確保效能最佳化
 * - 樣式層疊順序: 主題色 → 類型樣式 → 自定義樣式
 * - TypeScript 類型安全和 API 完整性
 * 
 * Props 說明：
 * - type: 預設文字樣式類型
 * - lightColor/darkColor: 主題顏色覆蓋選項
 * - 繼承所有 React Native Text 的標準屬性
 */

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
