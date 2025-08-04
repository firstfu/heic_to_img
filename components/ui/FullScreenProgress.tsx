/**
 * 全螢幕進度顯示元件 (FullScreenProgress)
 * 
 * 功能說明：
 * - 提供沉浸式全螢幕進度顯示介面
 * - 支援動畫進度更新和視覺回饋
 * - 整合多種進度指示器和狀態顯示
 * - 具備優雅的進入和退出動畫效果
 * 
 * 視覺設計特色：
 * - 漸層背景: 使用主題色創造深邃的視覺層次
 * - 進度環: 圓形進度環顯示百分比進度
 * - 進度條: 水平進度條提供線性進度視覺
 * - 動畫點: 三個動態點增加視覺趣味性
 * - 半透明效果: 多層次透明度營造現代感
 * 
 * 動畫效果：
 * - 淡入淡出: fadeAnim 控制整體透明度變化
 * - 縮放動畫: scaleAnim 提供彈性的進入效果
 * - 進度動畫: progressAnim 平滑更新進度顯示
 * - 插值計算: 動畫值插值確保流暢的視覺過渡
 * 
 * Progress 指示器：
 * - 百分比文字: 大字體顯示當前進度百分比
 * - 進度環框: 雙層圓環設計增強視覺層次
 * - 進度條填充: 動態寬度變化顯示進度
 * - 顏色區分: 不同透明度創造視覺對比
 * 
 * 文字資訊展示：
 * - 主標題: 突出顯示當前操作狀態
 * - 副標題: 詳細說明當前進度或檔案資訊
 * - 響應式文字: 根據主題調整文字顏色
 * - 多語言支援: 完整的繁體中文介面
 * 
 * Modal 整合：
 * - 全螢幕覆蓋: 完全遮蓋背景內容
 * - 透明模式: 允許自定義背景效果
 * - 狀態列控制: 自動調整狀態列樣式
 * - 無動畫模式: 使用自定義動畫替代預設
 * 
 * 動畫參數配置：
 * - 淡入動畫: 300ms 平滑淡入效果
 * - 彈性縮放: Spring 動畫提供自然感
 * - 進度過渡: 300ms 進度值平滑變化
 * - 退出動畫: 200ms 快速淡出效果
 * 
 * 使用場景：
 * - 檔案轉換和處理進度
 * - 資料上傳下載進度
 * - 複雜計算和分析任務
 * - 批量操作進度顯示
 * - 任何需要阻擋使用者操作的長時間任務
 * 
 * Props 說明：
 * - visible: 是否顯示進度畫面 (必填)
 * - progress: 進度值 0-1 (預設 0)
 * - title: 主標題文字 (預設 "正在處理...")
 * - subtitle: 副標題詳細資訊 (可選)
 * 
 * 技術實作亮點：
 * - useRef 管理動畫值避免重複建立
 * - useEffect 監聽 props 變化觸發動畫
 * - Animated.parallel 並行執行多個動畫
 * - interpolate 插值計算提供平滑過渡
 * - Dimensions 獲取螢幕尺寸確保全覆蓋
 */

import { ThemedText } from "@/components/ThemedText";
import { NewColors, Spacing, Typography } from "@/constants/NewColors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, StatusBar, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface FullScreenProgressProps {
  visible: boolean;
  progress?: number;
  title?: string;
  subtitle?: string;
}

export function FullScreenProgress({ visible, progress = 0, title = "正在處理...", subtitle }: FullScreenProgressProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const isDark = useThemeColor({}, "background") === "#151718";
  const colors = isDark ? NewColors.dark : NewColors.light;

  // 動畫進度更新
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* 背景漸層 */}
        <LinearGradient colors={[colors.primary, colors.primaryDark || colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

        {/* 內容區域 */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* 進度環 */}
          <View style={styles.progressRing}>
            <View style={[styles.progressRingInner, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]}>
              <ThemedText style={[styles.progressPercent, { color: colors.textInverse }]}>{Math.round(progress * 100)}%</ThemedText>
            </View>
          </View>

          {/* 標題 */}
          <ThemedText style={[styles.title, { color: colors.textInverse }]}>{title}</ThemedText>

          {/* 副標題 */}
          {subtitle && <ThemedText style={[styles.subtitle, { color: "rgba(255, 255, 255, 0.8)" }]}>{subtitle}</ThemedText>}

          {/* 進度條 */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                      extrapolate: "clamp",
                    }),
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                ]}
              />
            </View>
          </View>

          {/* 動畫點 */}
          <View style={styles.animatedDots}>
            {[0, 1, 2].map(index => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    transform: [
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8],
                    }),
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width,
    height,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    width: "100%",
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  progressRingInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercent: {
    ...Typography.h2,
    fontWeight: "700",
    textAlign: "center",
  },
  title: {
    ...Typography.h4,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.xl,
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  animatedDots: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
