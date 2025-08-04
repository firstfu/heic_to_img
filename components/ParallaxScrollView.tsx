/**
 * 視差滾動檢視元件 (ParallaxScrollView)
 * 
 * 功能說明：
 * - 提供具有視差滾動效果的頁面容器元件
 * - 實現頭部圖像隨滾動位置產生動態變化效果
 * - 整合主題系統和底部標籤欄溢出處理
 * - 創造沉浸式和互動式的滾動體驗
 * 
 * 視差效果：
 * - 頭部圖像垂直位移: 向上滾動時圖像向上移動，向下滾動時圖像向下移動
 * - 縮放效果: 向上滾動時圖像正常，向下拉伸時圖像放大 (最大2倍)
 * - 滾動範圍: -250px 到 +250px 的滾動偏移量插值計算
 * - 流暫動畫: 使用 React Native Reanimated 確保 60fps 流暢體驗
 * 
 * 技術特色：
 * - Reanimated 動畫引擎: 原生效能的平滑動畫體驗
 * - 插值計算: translateY 和 scale 變換的數學插值
 * - 滾動偵測: useScrollViewOffset hook 實時追蹤滾動位置
 * - 主題適應: 頭部背景色自動適應明暗主題
 * - 底部溢出: 整合標籤欄高度避免內容被遮蔽
 * 
 * 使用場景：
 * - 產品展示頁面和詳情頁面
 * - 個人資料和關於頁面
 * - 圖片畫廊和媒體展示
 * - 需要吸引使用者注意的重要內容頁面
 * 
 * 動畫參數：
 * - HEADER_HEIGHT: 250px 頭部高度
 * - translateY 插值: [-125, 0, 187.5] (向上/靜止/向下)
 * - scale 插值: [2, 1, 1] (放大/正常/正常)
 * - scrollEventThrottle: 16ms 滾動事件節流
 * 
 * Props 說明：
 * - headerImage: 頭部背景圖像 ReactElement
 * - headerBackgroundColor: 明暗主題背景色配置
 * - children: 滾動內容區域的子元件
 */

import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
