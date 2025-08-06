/**
 * 應用程式根佈局元件 (Root Layout)
 * 
 * 功能說明：
 * - 作為整個應用程式的最頂層佈局元件
 * - 負責設定全域主題（明暗模式）和字體載入
 * - 配置 Expo Router 的導航堆疊結構
 * - 管理狀態列樣式和顯示設定
 * 
 * 主要特色：
 * - 自動偵測系統主題偏好並套用對應的導航主題
 * - 非同步載入自定義字體 (SpaceMono)
 * - 設定標籤頁導航和404頁面的路由配置
 * - 使用 React Navigation 的主題提供者統一管理顏色
 * 
 * 技術架構：
 * - Expo Router 檔案路由系統
 * - React Navigation 主題整合
 * - 字體非同步載入機制
 * - 響應式主題切換
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ConversionProvider } from "@/contexts/ConversionContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ConversionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ConversionProvider>
    </ThemeProvider>
  );
}
