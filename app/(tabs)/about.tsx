import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NewColors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/NewColors';

export default function AboutScreen() {
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={colors.primaryGradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <LinearGradient
                colors={[colors.electric, colors.neon] as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroIcon}
              >
                <ThemedText style={styles.heroIconText}>🔄</ThemedText>
              </LinearGradient>
              <ThemedText style={[styles.heroTitle, { color: colors.textInverse }]}>
                HEIC 轉換工具
              </ThemedText>
              <ThemedText style={[styles.heroSubtitle, { color: colors.textInverse, opacity: 0.9 }]}>
                快速、安全、高品質的圖片格式轉換
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Card style={styles.featureCard} variant="glass">
            <LinearGradient
              colors={[colors.primary, colors.electric] as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureIconContainer}
            >
              <ThemedText style={styles.featureIcon}>🔒</ThemedText>
            </LinearGradient>
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>
              隱私優先
            </ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textTertiary }]}>
              完全離線處理，保護您的隱私
            </ThemedText>
          </Card>
          
          <Card style={styles.featureCard} variant="glass">
            <LinearGradient
              colors={[colors.neon, colors.emerald]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureIconContainer}
            >
              <ThemedText style={styles.featureIcon}>⚡</ThemedText>
            </LinearGradient>
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>
              批量轉換
            </ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textTertiary }]}>
              支援多檔案同時轉換
            </ThemedText>
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
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>
              品質保證
            </ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textTertiary }]}>
              保留原始品質與 EXIF 資料
            </ThemedText>
          </Card>
        </View>

        {/* Instructions */}
        <Card style={styles.instructionsCard} variant="gradient">
          <ThemedText style={[styles.instructionsTitle, { color: colors.textPrimary }]}>
            使用說明
          </ThemedText>
          <View style={styles.instructionsList}>
            {[
              { step: '1', text: '拖拽或點擊選擇 HEIC 檔案' },
              { step: '2', text: '調整轉換品質和格式設定' },
              { step: '3', text: '點擊開始轉換執行處理' },
              { step: '4', text: '下載轉換完成的檔案' },
            ].map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <LinearGradient
                  colors={[colors.primary, colors.electric] as [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.stepNumber}
                >
                  <ThemedText style={[styles.stepNumberText, { color: colors.textInverse }]}>
                    {instruction.step}
                  </ThemedText>
                </LinearGradient>
                <ThemedText style={[styles.instructionText, { color: colors.textTertiary }]}>
                  {instruction.text}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Tech Details */}
        <Card style={styles.techCard} variant="glass">
          <ThemedText style={[styles.techTitle, { color: colors.textPrimary }]}>
            技術說明
          </ThemedText>
          
          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>
              支援的格式
            </ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textTertiary }]}>
              • 輸入格式：HEIC, HEIF{'\n'}
              • 輸出格式：JPEG, PNG
            </ThemedText>
          </View>

          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>
              品質設定
            </ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textTertiary }]}>
              • 60% - 適合網頁使用{'\n'}
              • 80% - 平衡品質與檔案大小{'\n'}
              • 90% - 高品質輸出{'\n'}
              • 100% - 無損品質
            </ThemedText>
          </View>

          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>
              檔案大小限制
            </ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textTertiary }]}>
              最大 50MB，支援批量選擇
            </ThemedText>
          </View>
        </Card>

        {/* Privacy Policy */}
        <Card style={styles.privacyCard} variant="gradient">
          <ThemedText style={[styles.privacyTitle, { color: colors.textPrimary }]}>
            隱私承諾
          </ThemedText>
          <ThemedText style={[styles.privacyText, { color: colors.textTertiary }]}>
            我們重視您的隱私。所有圖片轉換都在您的裝置上進行，不會上傳到任何伺服器。
            您的檔案永遠不會離開您的裝置。
          </ThemedText>
        </Card>

        {/* About Developer */}
        <Card style={styles.aboutCard} variant="glass">
          <ThemedText style={[styles.aboutTitle, { color: colors.textPrimary }]}>
            關於開發者
          </ThemedText>
          <ThemedText style={[styles.aboutText, { color: colors.textTertiary }]}>
            這個應用程式是使用 React Native 和 Expo 開發的開源專案。
            歡迎貢獻程式碼或提出建議！
          </ThemedText>
          {Platform.OS === 'web' && (
            <Button
              title="GitHub"
              icon="🔗"
              variant="outline"
              size="medium"
              onPress={() => handleOpenLink('https://github.com')}
              style={styles.githubButton}
            />
          )}
        </Card>

        {/* Version Info */}
        <View style={styles.versionSection}>
          <ThemedText style={[styles.versionText, { color: colors.textTertiary }]}>
            版本 1.0.0
          </ThemedText>
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
    paddingHorizontal: Spacing.md,
    paddingTop: 0, // 因為沉浸式設計，從頂部開始
    paddingBottom: Spacing.xxl,
  },
  
  // Hero Section
  heroContainer: {
    marginBottom: Spacing.lg,
    marginHorizontal: -Spacing.md,
    overflow: 'hidden',
  },
  heroGradient: {
    paddingTop: Spacing.xxxl + 40, // 為狀態欄留出空間
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    ...Shadows.neon,
  },
  heroContent: {
    alignItems: 'center',
    position: 'relative',
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.glow,
  },
  heroIconText: {
    fontSize: 28,
  },
  heroTitle: {
    ...Typography.h1,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  
  // Features Section
  featuresSection: {
    flexDirection: 'column',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  featureCard: {
    width: '100%',
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.glow,
  },
  featureIcon: {
    fontSize: 22,
  },
  featureTitle: {
    ...Typography.labelLarge,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  featureText: {
    ...Typography.bodySmall,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    ...Shadows.glow,
  },
  stepNumberText: {
    ...Typography.labelSmall,
    fontWeight: '700',
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
  
  // Privacy
  privacyCard: {
    marginBottom: Spacing.lg,
  },
  privacyTitle: {
    ...Typography.h5,
    marginBottom: Spacing.sm,
  },
  privacyText: {
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
    alignSelf: 'flex-start',
  },
  
  // Version
  versionSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  versionText: {
    ...Typography.caption,
  },
});