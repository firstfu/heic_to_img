/**
 * 應用資訊頁面 (AboutScreen)
 *
 * 功能說明：
 * - 展示應用程式的詳細資訊和功能介紹
 * - 提供完整的使用說明和技術規格
 * - 包含開發者資訊和版本詳情
 *
 * 頁面結構：
 * - 功能特色展示: 批量轉換、品質保證
 * - 使用說明指南: 四步驟操作流程
 * - 技術規格詳情: 支援格式、品質設定、檔案限制
 * - 開發者介紹: 開源專案資訊和 GitHub 連結
 *
 * 設計特色：
 * - 現代化卡片佈局，增強視覺層次
 * - 漸層背景圖示，提升美觀度
 * - 響應式主題支援 (明暗模式)
 * - 分步驟指南，清晰易懂
 * - 互動式按鈕和連結整合
 *
 * 技術實作：
 * - LinearGradient 漸層效果
 * - 動態主題色彩系統
 * - 外部連結處理 (Linking API)
 * - 跨平台條件渲染
 * - 模組化卡片組件架構
 *
 * 內容亮點：
 * - 技術透明: 詳細說明支援格式和品質選項
 * - 開源友善: 鼓勵社群參與和貢獻
 * - 版本資訊: 清楚標示當前版本號
 */

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/ui/Card";
import { NewColors, Shadows, Spacing, Typography } from "@/constants/NewColors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";

export default function AboutScreen() {
  const isDark = useThemeColor({}, "background") === "#151718";
  const colors = isDark ? NewColors.dark : NewColors.light;

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "應用資訊",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.textInverse,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Card style={styles.featureCard} variant="glass">
            <LinearGradient colors={[colors.neon, colors.emerald]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>⚡</ThemedText>
            </LinearGradient>
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>批量轉換</ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textTertiary }]}>支援多檔案同時轉換</ThemedText>
          </Card>

          <Card style={styles.featureCard} variant="glass">
            <LinearGradient
              colors={[colors.electric, colors.primary] as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureIconContainer}
            >
              <ThemedText style={styles.featureIcon}>🎯</ThemedText>
            </LinearGradient>
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>品質保證</ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textTertiary }]}>保留原始品質與 EXIF 資料</ThemedText>
          </Card>
        </View>

        {/* Instructions */}
        <Card style={styles.instructionsCard} variant="gradient">
          <ThemedText style={[styles.instructionsTitle, { color: colors.textPrimary }]}>使用說明</ThemedText>
          <View style={styles.instructionsList}>
            {[
              { step: "1", text: "點擊選擇圖片檔案" },
              { step: "2", text: "調整轉換品質和格式設定" },
              { step: "3", text: "點擊開始轉換執行處理" },
              { step: "4", text: "下載轉換完成的檔案" },
            ].map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <LinearGradient colors={[colors.primary, colors.electric] as [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.stepNumber}>
                  <ThemedText style={[styles.stepNumberText, { color: colors.textInverse }]}>{instruction.step}</ThemedText>
                </LinearGradient>
                <ThemedText style={[styles.instructionText, { color: colors.textTertiary }]}>{instruction.text}</ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Tech Details */}
        <Card style={styles.techCard} variant="glass">
          <ThemedText style={[styles.techTitle, { color: colors.textPrimary }]}>技術說明</ThemedText>

          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>支援的格式</ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textTertiary }]}>• 輸入格式：HEIC{"\n"}• 輸出格式：JPEG, PNG</ThemedText>
          </View>

          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>品質設定</ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textTertiary }]}>
              • 60% - 適合網頁使用{"\n"}• 80% - 平衡品質與檔案大小{"\n"}• 90% - 高品質輸出{"\n"}• 100% - 無損品質
            </ThemedText>
          </View>

          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>檔案大小限制</ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textTertiary }]}>最大 50MB，支援批量選擇</ThemedText>
          </View>
        </Card>


        {/* Version Info */}
        <View style={styles.versionSection}>
          <ThemedText style={[styles.versionText, { color: colors.textTertiary }]}>版本 1.0.0</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  // Features Section
  featuresSection: {
    flexDirection: "column",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  featureCard: {
    width: "100%",
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    ...Shadows.glow,
  },
  featureIcon: {
    fontSize: 22,
  },
  featureTitle: {
    ...Typography.labelLarge,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  featureText: {
    ...Typography.bodySmall,
    textAlign: "center",
    lineHeight: 19,
    opacity: 0.8,
  },

  // Instructions Section
  instructionsCard: {
    marginBottom: Spacing.lg,
  },
  instructionsTitle: {
    ...Typography.h5,
    marginBottom: Spacing.md,
  },
  instructionsList: {
    gap: Spacing.sm,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
    ...Shadows.glow,
  },
  stepNumberText: {
    ...Typography.labelSmall,
    fontWeight: "700",
  },
  instructionText: {
    ...Typography.bodySmall,
    flex: 1,
    lineHeight: 20,
  },

  // Tech Details
  techCard: {
    marginBottom: Spacing.lg,
  },
  techTitle: {
    ...Typography.h5,
    marginBottom: Spacing.md,
  },
  techSection: {
    marginBottom: Spacing.md,
  },
  techSubtitle: {
    ...Typography.labelMedium,
    marginBottom: Spacing.xs,
  },
  techText: {
    ...Typography.bodySmall,
    lineHeight: 20,
  },


  // About
  aboutCard: {
    marginBottom: Spacing.lg,
  },
  aboutTitle: {
    ...Typography.h5,
    marginBottom: Spacing.sm,
  },
  aboutText: {
    ...Typography.bodySmall,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  githubButton: {
    alignSelf: "flex-start",
  },

  // Version
  versionSection: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  versionText: {
    ...Typography.caption,
  },
});
