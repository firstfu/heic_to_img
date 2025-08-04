/**
 * 卡片容器元件 (Card)
 * 
 * 功能說明：
 * - 提供多種視覺風格的內容容器元件
 * - 支援可點擊和靜態兩種使用模式
 * - 整合完整的主題系統和陰影效果
 * - 具備彈性配置的內距和圓角設計
 * 
 * 卡片變體：
 * - default: 標準卡片，淺色背景加細邊框
 * - elevated: 浮起卡片，增強陰影效果
 * - outlined: 強調邊框，使用主題色邊框
 * - glass: 玻璃效果，半透明背景
 * - gradient: 漸層背景，動態色彩過渡
 * 
 * 內距選項：
 * - none: 無內距，適用於自定義佈局
 * - small: 小內距 (Spacing.sm)
 * - medium: 中等內距 (Spacing.lg，預設)
 * - large: 大內距 (Spacing.xl)
 * 
 * 互動功能：
 * - 可點擊: 提供 onPress 時自動轉為 TouchableOpacity
 * - 觸碰回饋: activeOpacity 0.95 提供輕微視覺回饋
 * - 禁用狀態: 視覺禁用效果和互動阻斷
 * - 無障礙支援: 適當的觸碰區域和狀態提示
 * 
 * 視覺特色：
 * - 圓角設計: 統一使用 BorderRadius.lg
 * - 陰影層次: 不同變體使用不同等級陰影
 * - 漸層效果: gradient 變體使用動態主題漸層
 * - 邊框細節: 多種邊框樣式和顏色選擇
 * 
 * 主題整合：
 * - 自動適應明暗主題色彩
 * - 使用 NewColors 設計系統
 * - 響應式背景和邊框顏色
 * - 一致的視覺風格和間距
 * 
 * 玻璃效果 (Glass)：
 * - 半透明背景營造現代感
 * - 微妙邊框增強視覺層次
 * - 適用於重疊內容和浮動元素
 * - 配合毛玻璃效果陰影
 * 
 * 漸層效果 (Gradient)：
 * - LinearGradient 提供動態背景
 * - 明暗主題不同的漸層方向
 * - 自動處理內距和邊框半徑
 * - 適用於重要內容突出顯示
 * 
 * Props 說明：
 * - children: 卡片內容 (必填)
 * - style: 自定義樣式覆蓋
 * - padding: 內距大小選項
 * - variant: 卡片視覺風格變體
 * - onPress: 點擊事件處理函數
 * - disabled: 是否禁用互動功能
 * 
 * 使用場景：
 * - 內容分組和區塊劃分
 * - 互動卡片和選項列表
 * - 資訊展示和數據面板
 * - 設定項目和功能入口
 * - 表單區塊和輸入分組
 */

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