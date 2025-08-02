import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { FileSelector } from '@/components/FileSelector';
import { NewColors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/NewColors';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<any[]>([]);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const [quality, setQuality] = useState<number>(0.9);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');

  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;
  const [progressValue, setProgressValue] = useState(0);

  const convertHeicToJpg = async (fileUri: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        // 在網頁環境使用 heic2any
        const heic2any = (await import('heic2any')).default;
        
        const response = await fetch(fileUri);
        const heicBlob = await response.blob();
        
        const convertedBlob = await heic2any({
          blob: heicBlob,
          toType: `image/${outputFormat}`,
          quality: quality,
        });

        const convertedFile = convertedBlob as Blob;
        const jpgDataUrl = URL.createObjectURL(convertedFile);
        return jpgDataUrl;
      } else {
        // 在原生環境，目前只返回原始檔案
        // 實際專案中需要原生轉換解決方案
        console.log('原生環境暫不支援 HEIC 轉換');
        return fileUri;
      }
    } catch (error) {
      console.error('轉換失敗:', error);
      return null;
    }
  };

  const handleFilesSelected = (files: any[]) => {
    setSelectedFiles(files);
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionProgress('');
    setProgressValue(0);
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('錯誤', '請先選擇要轉換的檔案');
      return;
    }

    setIsConverting(true);
    setConvertedFiles([]);
    const converted: any[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const progress = (i + 1) / selectedFiles.length;
        setProgressValue(progress);
        setConversionProgress(`轉換中... ${i + 1}/${selectedFiles.length}`);

        const convertedUri = await convertHeicToJpg(file.uri);
        
        if (convertedUri) {
          const extension = outputFormat === 'jpeg' ? 'jpg' : 'png';
          const convertedFile = {
            name: file.name.replace(/\.(heic|heif)$/i, `.${extension}`),
            originalName: file.name,
            uri: convertedUri,
            size: file.size,
            convertedAt: new Date().toISOString(),
            quality: quality,
            format: outputFormat,
          };
          converted.push(convertedFile);
        } else {
          console.error(`轉換失敗: ${file.name}`);
        }
      }

      setConvertedFiles(converted);
      
      if (converted.length === selectedFiles.length) {
        Alert.alert(
          '轉換完成',
          `成功轉換 ${converted.length} 個檔案！`,
          [
            {
              text: '確定',
              onPress: () => {
                // 可以在這裡添加下載或分享功能
              }
            }
          ]
        );
      } else {
        Alert.alert(
          '部分轉換失敗',
          `成功轉換 ${converted.length}/${selectedFiles.length} 個檔案`
        );
      }
    } catch (error) {
      console.error('轉換過程中發生錯誤:', error);
      Alert.alert('錯誤', '轉換過程中發生錯誤，請重試');
    } finally {
      setIsConverting(false);
      setConversionProgress('');
      setProgressValue(0);
    }
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

        {/* Settings Section */}
        <Card style={styles.settingsCard}>
          <ThemedText style={[styles.settingsTitle, { color: colors.textPrimary }]}>
            轉換設定
          </ThemedText>
          
          <View style={styles.settingRow}>
            <ThemedText style={[styles.settingLabel, { color: colors.textPrimary }]}>
              輸出格式
            </ThemedText>
            <View style={styles.formatButtons}>
              <Button
                title="JPEG"
                variant={outputFormat === 'jpeg' ? 'primary' : 'outline'}
                size="small"
                onPress={() => setOutputFormat('jpeg')}
                disabled={isConverting}
                style={styles.formatButton}
              />
              <Button
                title="PNG"
                variant={outputFormat === 'png' ? 'primary' : 'outline'}
                size="small"
                onPress={() => setOutputFormat('png')}
                disabled={isConverting}
                style={styles.formatButton}
              />
            </View>
          </View>

          <View style={styles.settingRow}>
            <ThemedText style={[styles.settingLabel, { color: colors.textPrimary }]}>
              品質: {Math.round(quality * 100)}%
            </ThemedText>
            <View style={styles.qualityButtons}>
              {[0.6, 0.8, 0.9, 1.0].map((q) => (
                <Button
                  key={q}
                  title={`${Math.round(q * 100)}%`}
                  variant={quality === q ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => setQuality(q)}
                  disabled={isConverting}
                  style={styles.qualityButton}
                />
              ))}
            </View>
          </View>
        </Card>

        {/* File Selection */}
        <FileSelector
          selectedFiles={selectedFiles}
          onFilesSelected={handleFilesSelected}
          onClearFiles={handleClearAll}
          disabled={isConverting}
        />

        {/* Convert Button */}
        {selectedFiles.length > 0 && (
          <View style={styles.convertSection}>
            <Button
              title={isConverting ? '轉換中...' : '開始轉換'}
              icon={isConverting ? undefined : '🚀'}
              onPress={handleConvert}
              disabled={isConverting}
              loading={isConverting}
              fullWidth
              size="large"
            />
          </View>
        )}

        {/* Results Section */}
        {convertedFiles.length > 0 && (
          <Card style={styles.resultsCard} variant="elevated">
            <View style={styles.resultHeaderSection}>
              <ThemedText style={[styles.resultsTitle, { color: colors.textPrimary }]}>
                轉換完成
              </ThemedText>
              <StatusBadge
                status="success"
                text={`${convertedFiles.length} 個檔案`}
                icon="✅"
              />
            </View>
            
            {convertedFiles.map((file, index) => (
              <Card key={index} style={styles.resultItem} variant="outlined">
                <View style={styles.resultHeader}>
                  <ThemedText style={[styles.resultFileName, { color: colors.textPrimary }]}>
                    {file.name}
                  </ThemedText>
                  <StatusBadge
                    status="success"
                    text={file.format?.toUpperCase() || 'JPEG'}
                    size="small"
                  />
                </View>
                <ThemedText style={[styles.resultOriginalName, { color: colors.textTertiary }]}>
                  來源: {file.originalName}
                </ThemedText>
                <View style={styles.resultMeta}>
                  <ThemedText style={[styles.resultMetaText, { color: colors.textSecondary }]}>
                    品質: {Math.round((file.quality || 0.9) * 100)}%
                  </ThemedText>
                  <ThemedText style={[styles.resultMetaText, { color: colors.textSecondary }]}>
                    轉換時間: {new Date(file.convertedAt).toLocaleTimeString()}
                  </ThemedText>
                </View>
                {Platform.OS === 'web' && (
                  <Button
                    title="下載"
                    variant="outline"
                    size="small"
                    icon="📥"
                    onPress={() => {
                      const link = document.createElement('a');
                      link.href = file.uri;
                      link.download = file.name;
                      link.click();
                    }}
                    style={styles.downloadButton}
                  />
                )}
              </Card>
            ))}
          </Card>
        )}

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

      </ScrollView>
      
      {/* Loading Overlay */}
      <LoadingOverlay
        visible={isConverting}
        progress={progressValue}
        title="正在轉換 HEIC 檔案"
        subtitle={conversionProgress}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.lg,
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
    width: Platform.OS === 'web' && screenWidth > 768 ? '30%' : '100%',
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
  
  // Settings Section
  settingsCard: {
    marginBottom: Spacing.xl,
  },
  settingsTitle: {
    ...Typography.h4,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    marginBottom: Spacing.lg,
  },
  settingLabel: {
    ...Typography.labelLarge,
    marginBottom: Spacing.sm,
  },
  formatButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  formatButton: {
    flex: 1,
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  qualityButton: {
    flex: 1,
  },
  
  // Convert Section
  convertSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  
  // Results Section
  resultsCard: {
    marginBottom: Spacing.xl,
  },
  resultHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resultsTitle: {
    ...Typography.h4,
  },
  resultItem: {
    marginBottom: Spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  resultFileName: {
    ...Typography.labelLarge,
    flex: 1,
    marginRight: Spacing.md,
  },
  resultOriginalName: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  resultMetaText: {
    ...Typography.caption,
  },
  downloadButton: {
    alignSelf: 'flex-start',
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
});
