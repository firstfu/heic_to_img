/**
 * 圖示符號元件 (IconSymbol) - iOS 版本
 * 
 * 功能說明：
 * - iOS 平台專用的 SF Symbols 圖示元件
 * - 提供原生 iOS 設計語言支援
 * - 支援完整的 SF Symbols 圖庫和樣式選項
 * - 確保 iOS 平台的最佳視覺體驗
 * 
 * SF Symbols 特色：
 * - 原生 iOS 圖示系統整合
 * - 支援多種權重和樣式
 * - 自動適應系統主題
 * - 高品質向量圖示
 */

import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
