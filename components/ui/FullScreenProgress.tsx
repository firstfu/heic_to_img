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
