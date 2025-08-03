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
        headerShown: false, // 隱藏標準導航欄以實現沉浸式設計
        headerShadowVisible: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: isDark ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderTopWidth: 1,
            borderTopColor: colors.borderSubtle,
          },
          default: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.borderSubtle,
          },
        }),
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
          title: "關於",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
