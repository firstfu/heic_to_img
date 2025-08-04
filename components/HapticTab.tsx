/**
 * 觸覺反饋標籤按鈕元件 (HapticTab)
 * 
 * 功能說明：
 * - 為底部標籤導航按鈕添加觸覺反饋功能
 * - 在 iOS 平台上提供輕微的震動回饋體驗
 * - 增強使用者互動體驗和操作確認感
 * - 保持與 React Navigation 標籤按鈕的完全相容性
 * 
 * 觸覺反饋特色：
 * - iOS 專用: 僅在 iOS 平台上啟用觸覺反饋
 * - 輕量震動: 使用 Light Impact 級別提供柔和回饋
 * - 按壓觸發: 在 onPressIn 事件時觸發觸覺效果
 * - 非阻斷式: 不影響原有的按鈕功能和事件處理
 * 
 * 技術實作：
 * - PlatformPressable: React Navigation 跨平台可按壓元件
 * - Expo Haptics: 原生觸覺反饋 API 整合
 * - 環境變數檢測: process.env.EXPO_OS 確保平台相容性
 * - 事件鏈傳遞: 保持原始 onPressIn 事件處理器
 * 
 * 使用場景：
 * - 底部標籤導航按鈕 (主要用途)
 * - 需要觸覺確認的重要按鈕
 * - 增強使用者體驗的互動元素
 * - iOS 原生應用感觸覺一致性
 * 
 * 體驗優勢：
 * - 即時回饋: 按壓瞬間提供觸覺確認
 * - 操作確認: 協助使用者確認按鈕已被觸發
 * - 無障礙改善: 為視覺障礙使用者提供額外的感覺回饋
 * - 品牌一致性: 符合 iOS 設計規範和使用者期待
 * 
 * Props 說明：
 * - 完全繼承 BottomTabBarButtonProps 所有屬性
 * - 自動處理 onPressIn 事件並添加觸覺反饋
 * - 保持所有原始按鈕功能和樣式配置
 */

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
