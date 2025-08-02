import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Typography, BorderRadius, Spacing } from '@/constants/NewColors';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  text: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  icon?: string;
}

export function StatusBadge({
  status,
  text,
  size = 'medium',
  style,
  icon,
}: StatusBadgeProps) {
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return {
          backgroundColor: colors.successBg,
          textColor: colors.success,
        };
      case 'warning':
        return {
          backgroundColor: colors.warningBg,
          textColor: colors.warning,
        };
      case 'error':
        return {
          backgroundColor: colors.errorBg,
          textColor: colors.error,
        };
      case 'info':
        return {
          backgroundColor: colors.infoBg,
          textColor: colors.info,
        };
      default:
        return {
          backgroundColor: colors.surface,
          textColor: colors.textSecondary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.sm,
          borderRadius: BorderRadius.sm,
        };
      case 'large':
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          borderRadius: BorderRadius.md,
        };
      default:
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          borderRadius: BorderRadius.sm,
        };
    }
  };

  const getTextStyles = () => {
    switch (size) {
      case 'small':
        return Typography.caption;
      case 'large':
        return Typography.bodySmall;
      default:
        return Typography.labelSmall;
    }
  };

  const statusColors = getStatusColors();
  const sizeStyles = getSizeStyles();
  const textStyles = getTextStyles();

  const badgeStyles = [
    styles.badge,
    sizeStyles,
    {
      backgroundColor: statusColors.backgroundColor,
    },
    style,
  ];

  const textColor = {
    color: statusColors.textColor,
  };

  return (
    <View style={badgeStyles}>
      <View style={styles.content}>
        {icon && (
          <ThemedText style={[styles.icon, textColor]}>
            {icon}
          </ThemedText>
        )}
        <ThemedText style={[textStyles, textColor, { fontWeight: '500' }]}>
          {text}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: Spacing.xs,
    fontSize: 12,
  },
});