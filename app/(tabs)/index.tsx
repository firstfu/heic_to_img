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
import { BlurView } from 'expo-blur';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
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

  const handleShare = async (fileUri: string, fileName: string) => {
    try {
      if (Platform.OS === 'web') {
        // 網頁版本使用下載
        const link = document.createElement('a');
        link.href = fileUri;
        link.download = fileName;
        link.click();
      } else {
        // 原生平台使用分享
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png',
            dialogTitle: '分享圖片',
          });
        } else {
          Alert.alert('無法分享', '此設備不支援分享功能');
        }
      }
    } catch (error) {
      console.error('分享失敗:', error);
      Alert.alert('錯誤', '分享檔案時發生錯誤');
    }
  };

  const handleSaveToGallery = async (fileUri: string, fileName: string) => {
    try {
      if (Platform.OS === 'web') {
        // 網頁版本使用下載
        const link = document.createElement('a');
        link.href = fileUri;
        link.download = fileName;
        link.click();
        Alert.alert('成功', '檔案已下載');
      } else {
        // 請求權限
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('權限不足', '需要相簿權限才能儲存圖片');
          return;
        }

        // 儲存到相簿
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('HEIC轉換', asset, false);
        Alert.alert('成功', '圖片已儲存到相簿');
      }
    } catch (error) {
      console.error('儲存失敗:', error);
      Alert.alert('錯誤', '儲存檔案時發生錯誤');
    }
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
    <ThemedView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          isDark ? '#1a1f3a' : '#f8f9ff',
          isDark ? '#0f1219' : '#ffffff',
          isDark ? '#151923' : '#f5f7ff',
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card Container */}
        <View style={styles.mainCard}>
          {Platform.OS === 'ios' && (
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.blurContainer}>
              <View style={[styles.cardContent, { backgroundColor: colors.surface + '95' }]}>
                <FileSelector
                  selectedFiles={selectedFiles}
                  onFilesSelected={handleFilesSelected}
                  onClearFiles={handleClearAll}
                  disabled={isConverting}
                  showPhotoOption={true}
                />
              </View>
            </BlurView>
          )}
          {Platform.OS !== 'ios' && (
            <View style={[styles.cardContent, { backgroundColor: colors.surface + 'F0' }]}>
              <FileSelector
                selectedFiles={selectedFiles}
                onFilesSelected={handleFilesSelected}
                onClearFiles={handleClearAll}
                disabled={isConverting}
                showPhotoOption={true}
              />
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.blurContainer}>
              <View style={[styles.settingsContent, { backgroundColor: colors.surface + '95' }]}>
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
              </View>
            </BlurView>
          ) : (
            <Card style={[styles.settingsCard, { backgroundColor: colors.surface + 'F0' }]}>
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
          )}
        </View>


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
                <View style={styles.actionButtons}>
                  <Button
                    title={Platform.OS === 'web' ? '下載' : '儲存'}
                    variant="primary"
                    size="small"
                    icon="💾"
                    onPress={() => handleSaveToGallery(file.uri, file.name)}
                    style={styles.actionButton}
                  />
                  <Button
                    title="分享"
                    variant="outline"
                    size="small"
                    icon="📤"
                    onPress={() => handleShare(file.uri, file.name)}
                    style={styles.actionButton}
                  />
                </View>
              </Card>
            ))}
          </Card>
        )}


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
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    top: -150,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    bottom: 100,
    left: -50,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
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
  
  // Main Card
  mainCard: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  blurContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  cardContent: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  
  // Settings Section
  settingsContainer: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  settingsContent: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  settingsCard: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
    ...Shadows.md,
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
    marginTop: Spacing.md,
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
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
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
