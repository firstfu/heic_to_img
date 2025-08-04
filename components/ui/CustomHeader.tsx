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