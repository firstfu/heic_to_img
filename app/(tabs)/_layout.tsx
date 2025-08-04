/**
 * 標籤導航佈局元件 (Tab Layout)
 * 
 * 功能說明：
 * - 負責配置應用程式的底部標籤欄導航結構
 * - 管理兩個主要標籤頁：轉換工具和應用資訊
 * - 整合觸覺反饋和視覺主題系統
 * - 動態調整狀態列樣式以配合主題切換
 * 
 * 導航結構：
 * - index (轉換工具): HEIC 檔案轉換的主要功能頁面
 * - about (應用資訊): 顯示應用程式相關資訊和設定
 * 
 * 設計特色：
 * - 響應式主題色彩系統 (明暗模式支援)
 * - SF Symbols 圖示整合 (iOS 風格)
 * - 觸覺反饋標籤按鈕體驗
 * - 自定義標籤欄背景效果
 * - 跨平台狀態列樣式管理
 * 
 * 技術實作：
 * - Expo Router Tabs 導航系統
 * - 動態主題色彩配置
 * - Platform-specific 狀態列控制
 * - 自定義標籤欄組件整合
 */

import { Tabs } from "expo-router";
import React from "react";
import { Platform, StatusBar } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { NewColors } from "@/constants/NewColors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? NewColors.dark : NewColors.light;

  // 設置狀態欄樣式
  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    }
  }, [isDark]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true, // 啟用導航欄
        headerShadowVisible: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.borderSubtle,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "轉換工具",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="photo.on.rectangle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "應用資訊",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
