import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, BorderRadius, Shadows, Spacing } from '@/constants/NewColors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  onPress?: () => void;
  disabled?: boolean;
}

export function Card({
  children,
  style,
  padding = 'medium',
  variant = 'default',
  onPress,
  disabled = false,
}: CardProps) {
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: Spacing.sm };
      case 'large':
        return { padding: Spacing.xl };
      default:
        return { padding: Spacing.lg };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surfaceElevated,
          ...Shadows.xl,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: colors.primary,
          ...Shadows.md,
        };
      case 'glass':
        return {
          backgroundColor: colors.surfaceGlass,
          borderWidth: 1,
          borderColor: colors.surfaceGlassBorder,
          ...Shadows.glass,
        };
      case 'gradient':
        return {
          backgroundColor: 'transparent',
          ...Shadows.lg,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.surface,
          ...Shadows.lg,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
        };
    }
  };

  const cardStyles = [
    styles.card,
    getPaddingStyles(),
    getVariantStyles(),
    disabled && styles.disabled,
    style,
  ];

  const renderCardContent = () => {
    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={isDark 
            ? [colors.surfaceElevated, colors.surfaceAccent] 
            : [colors.surfaceAccent, colors.surfaceElevated]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientCard,
            getPaddingStyles(),
            disabled && styles.disabled,
          ]}
        >
          {children}
        </LinearGradient>
      );
    }
    return children;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.95}
        style={cardStyles}
      >
        {renderCardContent()}
      </TouchableOpacity>
    );
  }

  if (variant === 'gradient') {
    return (
      <View style={[cardStyles, { padding: 0 }]}>
        {renderCardContent()}
      </View>
    );
  }

  return <View style={cardStyles}>{renderCardContent()}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden', // 確保漸層和內容不會溢出圓角
  },
  gradientCard: {
    borderRadius: BorderRadius.lg,
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});