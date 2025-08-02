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
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[
              colors.primary + '20',
              colors.secondary + '10',
              'transparent'
            ]}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <ThemedText style={styles.heroIconText}>🔄</ThemedText>
            </View>
            <ThemedText style={[styles.heroTitle, { color: colors.textPrimary }]}>
              HEIC 轉換工具
            </ThemedText>
            <ThemedText style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              快速、安全、高品質的圖片格式轉換
            </ThemedText>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Card style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>🔒</ThemedText>
            </View>
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>
              隱私優先
            </ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textSecondary }]}>
              完全離線處理，保護您的隱私
            </ThemedText>
          </Card>
          
          <Card style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>⚡</ThemedText>
            </View>
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>
              批量轉換
            </ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textSecondary }]}>
              支援多檔案同時轉換
            </ThemedText>
          </Card>
          
          <Card style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>🎯</ThemedText>
            </View>
            <ThemedText style={[styles.featureTitle, { color: colors.textPrimary }]}>
              品質保證
            </ThemedText>
            <ThemedText style={[styles.featureText, { color: colors.textSecondary }]}>
              保留原始品質與 EXIF 資料
            </ThemedText>
          </Card>
        </View>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
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
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <ThemedText style={[styles.stepNumberText, { color: colors.textInverse }]}>
                    {instruction.step}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.instructionText, { color: colors.textSecondary }]}>
                  {instruction.text}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Tech Details */}
        <Card style={styles.techCard}>
          <ThemedText style={[styles.techTitle, { color: colors.textPrimary }]}>
            技術說明
          </ThemedText>
          
          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>
              支援的格式
            </ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textSecondary }]}>
              • 輸入格式：HEIC, HEIF{'\n'}
              • 輸出格式：JPEG, PNG
            </ThemedText>
          </View>

          <View style={styles.techSection}>
            <ThemedText style={[styles.techSubtitle, { color: colors.textPrimary }]}>
              品質設定
            </ThemedText>
            <ThemedText style={[styles.techText, { color: colors.textSecondary }]}>
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
            <ThemedText style={[styles.techText, { color: colors.textSecondary }]}>
              最大 50MB，支援批量選擇
            </ThemedText>
          </View>
        </Card>

        {/* Privacy Policy */}
        <Card style={styles.privacyCard}>
          <ThemedText style={[styles.privacyTitle, { color: colors.textPrimary }]}>
            隱私承諾
          </ThemedText>
          <ThemedText style={[styles.privacyText, { color: colors.textSecondary }]}>
            我們重視您的隱私。所有圖片轉換都在您的裝置上進行，不會上傳到任何伺服器。
            您的檔案永遠不會離開您的裝置。
          </ThemedText>
        </Card>

        {/* About Developer */}
        <Card style={styles.aboutCard}>
          <ThemedText style={[styles.aboutTitle, { color: colors.textPrimary }]}>
            關於開發者
          </ThemedText>
          <ThemedText style={[styles.aboutText, { color: colors.textSecondary }]}>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  
  // Hero Section
  heroSection: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    marginBottom: Spacing.xl,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: -100,
    right: -100,
    height: 300,
    borderRadius: BorderRadius.xl,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  heroIconText: {
    fontSize: 36,
  },
  heroTitle: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 28,
  },
  
  // Features Section
  featuresSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  featureCard: {
    width: Platform.OS === 'web' ? '30%' : '100%',
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    ...Typography.h5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  featureText: {
    ...Typography.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Instructions Section
  instructionsCard: {
    marginBottom: Spacing.xl,
  },
  instructionsTitle: {
    ...Typography.h4,
    marginBottom: Spacing.lg,
  },
  instructionsList: {
    gap: Spacing.md,
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
    marginRight: Spacing.md,
  },
  stepNumberText: {
    ...Typography.labelSmall,
    fontWeight: '700',
  },
  instructionText: {
    ...Typography.body,
    flex: 1,
    lineHeight: 24,
  },
  
  // Tech Details
  techCard: {
    marginBottom: Spacing.xl,
  },
  techTitle: {
    ...Typography.h4,
    marginBottom: Spacing.lg,
  },
  techSection: {
    marginBottom: Spacing.lg,
  },
  techSubtitle: {
    ...Typography.labelLarge,
    marginBottom: Spacing.sm,
  },
  techText: {
    ...Typography.body,
    lineHeight: 24,
  },
  
  // Privacy
  privacyCard: {
    marginBottom: Spacing.xl,
  },
  privacyTitle: {
    ...Typography.h4,
    marginBottom: Spacing.md,
  },
  privacyText: {
    ...Typography.body,
    lineHeight: 24,
  },
  
  // About
  aboutCard: {
    marginBottom: Spacing.xl,
  },
  aboutTitle: {
    ...Typography.h4,
    marginBottom: Spacing.md,
  },
  aboutText: {
    ...Typography.body,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  githubButton: {
    alignSelf: 'flex-start',
  },
  
  // Version
  versionSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  versionText: {
    ...Typography.caption,
  },
});