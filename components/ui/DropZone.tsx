import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  DimensionValue,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Typography, BorderRadius, Spacing } from '@/constants/NewColors';

interface DropZoneProps {
  onFileSelect: () => void;
  isDragActive?: boolean;
  disabled?: boolean;
  height?: DimensionValue;
  children?: React.ReactNode;
}

export function DropZone({
  onFileSelect,
  isDragActive = false,
  disabled = false,
  height = 200,
  children,
}: DropZoneProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  const dropZoneStyles = [
    styles.dropZone,
    {
      backgroundColor: colors.surface,
      borderColor: isDragActive ? colors.primary : colors.border,
      height,
    },
    isDragActive && {
      backgroundColor: colors.primary + '10', // 添加透明度
      borderColor: colors.primary,
      borderWidth: 2,
    },
    isPressed && {
      backgroundColor: colors.surfaceHover,
    },
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={dropZoneStyles}
      onPress={onFileSelect}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      activeOpacity={0.95}
    >
      <View style={styles.content}>
        {children || (
          <>
            <View style={styles.iconContainer}>
              <ThemedText style={[styles.icon, { color: colors.primary }]}>
                📁
              </ThemedText>
            </View>
            <ThemedText style={[styles.title, { color: colors.textPrimary }]}>
              {isDragActive ? '釋放檔案以上傳' : '點擊選擇 HEIC 檔案'}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              或拖拽檔案到此區域
            </ThemedText>
            <ThemedText style={[styles.hint, { color: colors.textTertiary }]}>
              支援 .heic, .heif 格式 • 最大 50MB
            </ThemedText>
          </>
        )}
      </View>
      
      {/* 裝飾性虛線邊框 */}
      <View style={[styles.dashedBorder, { borderColor: colors.border }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dropZone: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...Typography.h5,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  hint: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  dashedBorder: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    pointerEvents: 'none',
  },
  disabled: {
    opacity: 0.5,
  },
});