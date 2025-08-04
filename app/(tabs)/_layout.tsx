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
