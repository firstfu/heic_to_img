/**
 * 404 錯誤頁面 (NotFoundScreen)
 * 
 * 功能說明：
 * - 處理應用程式中不存在的路由導航錯誤
 * - 提供友善的錯誤提示和導航返回選項
 * - 作為路由系統的後備頁面，確保應用穩定性
 * - 整合應用主題系統，保持視覺一致性
 * 
 * 使用場景：
 * - 使用者輸入錯誤的 URL 路徑
 * - 深層連結指向不存在的頁面
 * - 路由配置錯誤或檔案遺失
 * - 應用更新後舊路由失效
 * 
 * 設計特色：
 * - 簡潔明瞭的錯誤訊息展示
 * - 一鍵返回首頁的便捷導航
 * - 響應式佈局適配不同螢幕尺寸
 * - 整合 ThemedText 和 ThemedView 主題組件
 * 
 * 技術實作：
 * - Expo Router 的 +not-found 檔案命名約定
 * - Stack.Screen 動態標題設定
 * - Link 組件提供導航功能
 * - StyleSheet 集中管理樣式
 * 
 * 使用者體驗：
 * - 清楚說明當前頁面不存在
 * - 提供直接返回首頁的連結
 * - 保持應用整體視覺風格
 * - 避免應用程式崩潰或白屏
 */

import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
