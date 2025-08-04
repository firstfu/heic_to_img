/**
 * 通用按鈕元件 (Button)
 * 
 * 功能說明：
 * - 提供多種樣式變體的統一按鈕元件
 * - 支援不同尺寸、狀態和互動效果
 * - 整合載入狀態和圖示顯示功能
 * - 具備完整的主題適應和無障礙支援
 * 
 * 按鈕變體：
 * - primary: 主要按鈕，使用漸層背景和白色文字
 * - secondary: 次要按鈕，使用單色背景
 * - outline: 邊框按鈕，透明背景加彩色邊框
 * - ghost: 幽靈按鈕，淺色背景無邊框
 * 
 * 尺寸選項：
 * - small: 40px 高度，適用於次要操作
 * - medium: 48px 高度，標準按鈕尺寸 (預設)
 * - large: 56px 高度，適用於重要的主要操作
 * 
 * 特殊功能：
 * - 載入狀態: 顯示 ActivityIndicator 取代按鈕內容
 * - 圖示支援: 可在左側或右側顯示圖示或 emoji
 * - 全寬度: 可設定按鈕佔滿容器寬度
 * - 禁用狀態: 視覺禁用效果和互動阻斷
 * 
 * 視覺設計：
 * - 漸層背景: Primary 按鈕使用動態主題漸層
 * - 陰影效果: 不同變體使用不同等級的陰影
 * - 按壓回饋: activeOpacity 提供觸碰視覺回饋
 * - 圓角設計: 根據尺寸調整圓角半徑
 * 
 * 主題整合：
 * - 自動適應明暗主題色彩
 * - 使用 NewColors 設計系統顏色
 * - 響應式文字和背景顏色調整
 * - 一致的視覺風格和間距
 * 
 * 無障礙特色：
 * - 適當的觸碰區域大小 (最小 40px)
 * - 清晰的視覺狀態區分
 * - 載入和禁用狀態的明確提示
 * - 高對比度的文字顏色選擇
 * 
 * Props 說明：
 * - title: 按鈕顯示文字 (必填)
 * - onPress: 點擊事件處理函數
 * - variant: 按鈕樣式變體
 * - size: 按鈕尺寸大小
 * - disabled: 是否禁用按鈕
 * - loading: 是否顯示載入狀態
 * - icon: 圖示內容 (ReactNode 或字串)
 * - iconPosition: 圖示位置 (左側或右側)
 * - fullWidth: 是否佔滿容器寬度
 * - style/textStyle: 自定義樣式覆蓋
 * 
 * 使用場景：
 * - 表單提交和確認操作
 * - 導航和頁面跳轉
 * - 功能觸發和狀態切換
 * - 檔案操作和資料處理
 */

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