import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { NewColors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/NewColors';


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
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <ThemedText style={[styles.title, { color: colors.textInverse }]}>
                  HEIC 轉換工具
                </ThemedText>
                <View style={[styles.titleAccent, { backgroundColor: colors.neon }]} />
              </View>
              <ThemedText style={[styles.subtitle, { color: colors.textInverse, opacity: 0.9 }]}>
                將 HEIC 格式轉換為 JPEG 或 PNG
              </ThemedText>
              <View style={styles.headerDecorations}>
                <View style={[styles.decoration, { backgroundColor: colors.electric }]} />
                <View style={[styles.decoration, { backgroundColor: colors.neon }]} />
                <View style={[styles.decoration, { backgroundColor: colors.electric }]} />
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* File Selection */}
        <Card style={styles.mainCard} variant="glass">
          <FileSelector
            selectedFiles={selectedFiles}
            onFilesSelected={handleFilesSelected}
            onClearFiles={handleClearAll}
            disabled={isConverting}
            showPhotoOption={true}
          />
        </Card>

        {/* Settings Section */}
        <Card style={styles.settingsCard} variant="gradient">
          <View style={styles.settingsHeader}>
            <ThemedText style={[styles.settingsTitle, { color: colors.textPrimary }]}>
              轉換設定
            </ThemedText>
            <LinearGradient
              colors={[colors.electric, colors.neon]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.settingsIcon}
            >
              <ThemedText style={styles.settingsIconText}>⚙️</ThemedText>
            </LinearGradient>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <ThemedText style={[styles.settingLabel, { color: colors.textPrimary }]}>
                輸出格式
              </ThemedText>
              <View style={[styles.settingIndicator, { backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.formatButtonsContainer}>
              <View style={[styles.formatButtons, { backgroundColor: isDark ? colors.surfaceElevated : colors.surfaceAccent }]}>
                <Button
                  title="JPEG"
                  variant={outputFormat === 'jpeg' ? 'primary' : 'ghost'}
                  size="small"
                  onPress={() => setOutputFormat('jpeg')}
                  disabled={isConverting}
                  style={styles.formatButton}
                />
                <Button
                  title="PNG"
                  variant={outputFormat === 'png' ? 'primary' : 'ghost'}
                  size="small"
                  onPress={() => setOutputFormat('png')}
                  disabled={isConverting}
                  style={styles.formatButton}
                />
              </View>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <ThemedText style={[styles.settingLabel, { color: colors.textPrimary }]}>
                品質設定
              </ThemedText>
              <View style={[styles.settingIndicator, { backgroundColor: colors.neon }]} />
            </View>
            <View style={styles.qualitySection}>
              <View style={styles.qualityDisplay}>
                <ThemedText style={[styles.qualityValue, { color: colors.primary }]}>
                  {Math.round(quality * 100)}%
                </ThemedText>
                <ThemedText style={[styles.qualityDesc, { color: colors.textSecondary }]}>
                  {quality <= 0.6 ? '網頁最佳化' : quality <= 0.8 ? '平衡品質' : quality <= 0.9 ? '高品質' : '無損品質'}
                </ThemedText>
              </View>
              <View style={styles.qualityButtons}>
                {[
                  { value: 0.6, label: '60%', desc: '網頁' },
                  { value: 0.8, label: '80%', desc: '平衡' },
                  { value: 0.9, label: '90%', desc: '高品質' },
                  { value: 1.0, label: '100%', desc: '無損' }
                ].map((item) => (
                  <Card 
                    key={item.value}
                    style={[
                      styles.qualityCard,
                      quality === item.value && [styles.qualityCardActive, { borderColor: colors.primary }]
                    ]}
                    variant={quality === item.value ? 'outlined' : 'glass'}
                    onPress={() => setQuality(item.value)}
                    disabled={isConverting}
                  >
                    <ThemedText style={[
                      styles.qualityCardValue, 
                      { color: quality === item.value ? colors.primary : colors.textPrimary }
                    ]}>
                      {item.label}
                    </ThemedText>
                    <ThemedText style={[
                      styles.qualityCardDesc, 
                      { color: quality === item.value ? colors.primary : colors.textSecondary }
                    ]}>
                      {item.desc}
                    </ThemedText>
                  </Card>
                ))}
              </View>
            </View>
          </View>
        </Card>


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
          <Card style={styles.resultsCard} variant="glass">
            <View style={styles.resultHeaderSection}>
              <View style={styles.resultHeaderContent}>
                <LinearGradient
                  colors={[colors.emerald, colors.neon]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.successIcon}
                >
                  <ThemedText style={styles.successIconText}>✅</ThemedText>
                </LinearGradient>
                <ThemedText style={[styles.resultsTitle, { color: colors.textPrimary }]}>
                  轉換完成
                </ThemedText>
              </View>
              <StatusBadge
                status="success"
                text={`${convertedFiles.length} 個檔案`}
                icon="🎉"
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
  },
  scrollContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 0, // 因為沉浸式設計，從頂部開始
    paddingBottom: Spacing.xl,
  },
  
  // Header Section
  headerContainer: {
    marginBottom: Spacing.lg,
    marginHorizontal: -Spacing.lg,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: Spacing.xxxl + 40, // 為狀態欄留出空間
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.neon,
  },
  headerContent: {
    alignItems: 'center',
    position: 'relative',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleAccent: {
    width: 60,
    height: 3,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
    ...Shadows.glow,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  headerDecorations: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  decoration: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    opacity: 0.8,
  },
  
  // Main Card
  mainCard: {
    marginBottom: Spacing.lg,
  },
  
  // Settings Section
  settingsCard: {
    marginBottom: Spacing.lg,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  settingsTitle: {
    ...Typography.h4,
    flex: 1,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
  settingsIconText: {
    fontSize: 16,
  },
  settingRow: {
    marginBottom: Spacing.xl,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  settingLabel: {
    ...Typography.labelLarge,
    marginRight: Spacing.sm,
  },
  settingIndicator: {
    width: 4,
    height: 16,
    borderRadius: BorderRadius.sm,
    ...Shadows.glow,
  },
  formatButtonsContainer: {
    marginTop: Spacing.sm,
  },
  formatButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: 4,
    borderRadius: BorderRadius.lg,
  },
  formatButton: {
    flex: 1,
  },
  qualitySection: {
    marginTop: Spacing.sm,
  },
  qualityDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  qualityValue: {
    ...Typography.h3,
    fontWeight: '700',
  },
  qualityDesc: {
    ...Typography.caption,
    fontWeight: '500',
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  qualityCard: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  qualityCardActive: {
    borderWidth: 2,
    ...Shadows.glow,
  },
  qualityCardValue: {
    ...Typography.labelMedium,
    fontWeight: '600',
    marginBottom: 2,
  },
  qualityCardDesc: {
    ...Typography.caption,
    fontSize: 10,
    textAlign: 'center',
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
  resultHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.glow,
  },
  successIconText: {
    fontSize: 18,
  },
  resultsTitle: {
    ...Typography.h4,
    flex: 1,
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
});
