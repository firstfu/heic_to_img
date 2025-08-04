import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Typography, BorderRadius, Shadows } from '@/constants/NewColors';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode | string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 40, // 固定高度確保一致性
          paddingHorizontal: 16,
          borderRadius: BorderRadius.sm,
        };
      case 'large':
        return {
          height: 56, // 固定高度確保一致性
          paddingHorizontal: 32,
          borderRadius: BorderRadius.lg,
        };
      default:
        return {
          height: 48, // 固定高度確保一致性
          paddingHorizontal: 24,
          borderRadius: BorderRadius.md,
        };
    }
  };

  const getTextStyles = () => {
    switch (size) {
      case 'small':
        return Typography.labelSmall;
      case 'large':
        return Typography.labelLarge;
      default:
        return Typography.labelMedium;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderWidth: 0,
          ...Shadows.md,
        };
      case 'outline':
        return {
          backgroundColor: isDark ? colors.surfaceGlass : 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1.5,
          borderColor: colors.primary,
          ...Shadows.sm,
        };
      case 'ghost':
        return {
          backgroundColor: isDark ? colors.surfaceElevated : colors.surfaceAccent,
          borderWidth: 0,
          ...Shadows.sm,
        };
      default:
        return {
          backgroundColor: 'transparent', // 將使用漸層
          borderWidth: 0,
          ...Shadows.lg,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return colors.textInverse;
    }
  };

  const buttonStyles = [
    styles.button,
    getSizeStyles(),
    getVariantStyles(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    getTextStyles(),
    { color: getTextColor() },
    disabled && styles.disabledText,
    textStyle,
  ];


  const renderButtonContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverse}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              {typeof icon === 'string' ? (
                <ThemedText style={textStyles}>{icon}</ThemedText>
              ) : (
                icon
              )}
            </View>
          )}
          <ThemedText style={textStyles}>{title}</ThemedText>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>
              {typeof icon === 'string' ? (
                <ThemedText style={textStyles}>{icon}</ThemedText>
              ) : (
                icon
              )}
            </View>
          )}
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[buttonStyles, { backgroundColor: 'transparent' }]}
      >
        <LinearGradient
          colors={colors.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientButton,
            getSizeStyles(),
            disabled && styles.disabled,
          ]}
        >
          {renderButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={buttonStyles}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // 確保漸層不會溢出
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});