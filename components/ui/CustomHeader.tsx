/**
 * 自定義標題元件 (CustomHeader)
 * 
 * 功能說明：
 * - 為導航欄提供標題和副標題的組合顯示
 * - 支援主題化文字顏色和響應式設計
 * - 適用於需要雙行標題資訊的頁面
 * - 整合應用程式的設計系統和文字規範
 * 
 * 視覺特色：
 * - 主標題使用較大字體突出重點
 * - 副標題使用較小字體提供補充資訊
 * - 自動適應明暗主題的文字顏色
 * - 副標題具備透明度效果增加層次感
 * 
 * 使用場景：
 * - 導航欄標題區域
 * - 頁面頂部標題展示
 * - 需要說明文字的標題組合
 * 
 * Props 說明：
 * - title: 主標題文字 (必填)
 * - subtitle: 副標題文字 (可選)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { NewColors, Typography, Spacing } from '@/constants/NewColors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
}

export function CustomHeader({ title, subtitle }: CustomHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? NewColors.dark : NewColors.light;

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.title, { color: colors.textInverse }]}>
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText style={[styles.subtitle, { color: colors.textInverse, opacity: 0.9 }]}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0, // 移除額外的頂部內邊距
    minHeight: 60, // 確保最小高度以容納內容
  },
  title: {
    ...Typography.h6,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 18, // 明確設定字體大小
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});