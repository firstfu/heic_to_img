import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import Slider from '@react-native-community/slider';
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
  
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const slideAnim = useState(() => new Animated.Value(30))[0];
  const scaleAnim = useState(() => new Animated.Value(0.95))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const getQualityInfo = (quality: number, format: 'jpeg' | 'png') => {
    const avgFileSize = selectedFiles.reduce((acc, file) => acc + (file.size || 5000000), 0) / selectedFiles.length;
    
    let sizeMultiplier;
    if (format === 'png') {
      sizeMultiplier = quality * 1.5; // PNG 通常較大
    } else {
      sizeMultiplier = quality * 0.8; // JPEG 較小
    }
    
    const estimatedSize = avgFileSize * sizeMultiplier;
    const estimatedTime = selectedFiles.length * (format === 'png' ? 3 : 2); // PNG 需要更多時間
    
    return {
      sizePerFile: formatFileSize(estimatedSize),
      totalSize: formatFileSize(estimatedSize * selectedFiles.length),
      estimatedTime: estimatedTime
    };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }}>
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
                <Card
                  style={[
                    styles.formatCard,
                    outputFormat === 'jpeg' && [styles.formatCardActive, { 
                      borderColor: colors.primary,
                      backgroundColor: colors.primarySubtle 
                    }]
                  ]}
                  variant={outputFormat === 'jpeg' ? 'outlined' : 'glass'}
                  onPress={() => setOutputFormat('jpeg')}
                  disabled={isConverting}
                >
                  <ThemedText style={[
                    styles.formatTitle,
                    { color: outputFormat === 'jpeg' ? colors.primary : colors.textPrimary }
                  ]}>
                    JPEG
                  </ThemedText>
                  <ThemedText style={[
                    styles.formatDesc,
                    { color: outputFormat === 'jpeg' ? colors.primary : colors.textSecondary }
                  ]}>
                    較小檔案
                  </ThemedText>
                </Card>
                <Card
                  style={[
                    styles.formatCard,
                    outputFormat === 'png' && [styles.formatCardActive, { 
                      borderColor: colors.primary,
                      backgroundColor: colors.primarySubtle 
                    }]
                  ]}
                  variant={outputFormat === 'png' ? 'outlined' : 'glass'}
                  onPress={() => setOutputFormat('png')}
                  disabled={isConverting}
                >
                  <ThemedText style={[
                    styles.formatTitle,
                    { color: outputFormat === 'png' ? colors.primary : colors.textPrimary }
                  ]}>
                    PNG
                  </ThemedText>
                  <ThemedText style={[
                    styles.formatDesc,
                    { color: outputFormat === 'png' ? colors.primary : colors.textSecondary }
                  ]}>
                    無損品質
                  </ThemedText>
                </Card>
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
                <View style={styles.qualityValueContainer}>
                  <ThemedText style={[styles.qualityValue, { color: colors.primary }]}>
                    {Math.round(quality * 100)}%
                  </ThemedText>
                  <View style={[styles.qualityBadge, { backgroundColor: colors.primarySubtle }]}>
                    <ThemedText style={[styles.qualityBadgeText, { color: colors.primary }]}>
                      {quality <= 0.6 ? '網頁' : quality <= 0.8 ? '平衡' : quality <= 0.9 ? '高品質' : '無損'}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={[styles.qualityDesc, { color: colors.textSecondary }]}>
                  {quality <= 0.6 ? '最小檔案大小' : quality <= 0.8 ? '品質與大小平衡' : quality <= 0.9 ? '高品質輸出' : '無損壓縮'}
                </ThemedText>
              </View>
              
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.qualitySlider}
                  minimumValue={0.5}
                  maximumValue={1.0}
                  step={0.1}
                  value={quality}
                  onValueChange={setQuality}
                  disabled={isConverting}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.surfaceElevated}
                  thumbTintColor={colors.primary}
                />
                <View style={styles.sliderLabels}>
                  <ThemedText style={[styles.sliderLabel, { color: colors.textTertiary }]}>
                    50%
                  </ThemedText>
                  <ThemedText style={[styles.sliderLabel, { color: colors.textTertiary }]}>
                    100%
                  </ThemedText>
                </View>
              </View>

              <View style={styles.qualityButtons}>
                {[
                  { value: 0.6, label: '60%', desc: '網頁', icon: '🌐' },
                  { value: 0.8, label: '80%', desc: '平衡', icon: '⚖️' },
                  { value: 0.9, label: '90%', desc: '高品質', icon: '⭐' },
                  { value: 1.0, label: '100%', desc: '無損', icon: '💎' }
                ].map((item) => (
                  <Card 
                    key={item.value}
                    style={[
                      styles.qualityCard,
                      quality === item.value && [styles.qualityCardActive, { 
                        borderColor: colors.primary,
                        backgroundColor: colors.primarySubtle 
                      }]
                    ]}
                    variant={quality === item.value ? 'outlined' : 'glass'}
                    onPress={() => setQuality(item.value)}
                    disabled={isConverting}
                  >
                    <ThemedText style={styles.qualityCardIcon}>
                      {item.icon}
                    </ThemedText>
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

          {/* Estimation Info */}
          {selectedFiles.length > 0 && (
            <View style={styles.estimationContainer}>
              <Card style={styles.estimationCard} variant="glass">
                <View style={styles.estimationHeader}>
                  <ThemedText style={[styles.estimationTitle, { color: colors.textSecondary }]}>
                    轉換預估
                  </ThemedText>
                  <View style={[styles.estimationIcon, { backgroundColor: colors.infoSubtle }]}>
                    <ThemedText style={[styles.estimationIconText, { color: colors.info }]}>
                      📊
                    </ThemedText>
                  </View>
                </View>
                
                {(() => {
                  const info = getQualityInfo(quality, outputFormat);
                  return (
                    <View style={styles.estimationGrid}>
                      <View style={styles.estimationItem}>
                        <ThemedText style={[styles.estimationLabel, { color: colors.textTertiary }]}>
                          平均檔案大小
                        </ThemedText>
                        <ThemedText style={[styles.estimationValue, { color: colors.textPrimary }]}>
                          {info.sizePerFile}
                        </ThemedText>
                      </View>
                      <View style={styles.estimationItem}>
                        <ThemedText style={[styles.estimationLabel, { color: colors.textTertiary }]}>
                          總計大小
                        </ThemedText>
                        <ThemedText style={[styles.estimationValue, { color: colors.textPrimary }]}>
                          {info.totalSize}
                        </ThemedText>
                      </View>
                      <View style={styles.estimationItem}>
                        <ThemedText style={[styles.estimationLabel, { color: colors.textTertiary }]}>
                          預估時間
                        </ThemedText>
                        <ThemedText style={[styles.estimationValue, { color: colors.textPrimary }]}>
                          ~{info.estimatedTime}秒
                        </ThemedText>
                      </View>
                      <View style={styles.estimationItem}>
                        <ThemedText style={[styles.estimationLabel, { color: colors.textTertiary }]}>
                          檔案數量
                        </ThemedText>
                        <ThemedText style={[styles.estimationValue, { color: colors.primary }]}>
                          {selectedFiles.length} 個
                        </ThemedText>
                      </View>
                    </View>
                  );
                })()}
              </Card>
            </View>
          )}
          </Card>
        </Animated.View>


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
    padding: Spacing.lg,
    ...Shadows.card,
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
    padding: 6,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  formatCard: {
    flex: 1,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  formatCardActive: {
    borderWidth: 2,
    ...Shadows.glow,
  },
  formatTitle: {
    ...Typography.labelLarge,
    fontWeight: '600',
    marginBottom: 2,
  },
  formatDesc: {
    ...Typography.caption,
    fontSize: 11,
    textAlign: 'center',
  },
  qualitySection: {
    marginTop: Spacing.sm,
  },
  qualityDisplay: {
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  qualityValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  qualityValue: {
    ...Typography.h3,
    fontWeight: '700',
    marginRight: Spacing.md,
  },
  qualityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  qualityBadgeText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  qualityDesc: {
    ...Typography.caption,
    fontWeight: '500',
    opacity: 0.8,
  },
  sliderContainer: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
  },
  qualitySlider: {
    height: 40,
    marginVertical: Spacing.sm,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderLabel: {
    ...Typography.caption,
    fontSize: 10,
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  qualityCard: {
    flex: 1,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  qualityCardActive: {
    borderWidth: 2,
    ...Shadows.glow,
  },
  qualityCardIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  qualityCardValue: {
    ...Typography.labelMedium,
    fontWeight: '600',
    marginBottom: 2,
  },
  qualityCardDesc: {
    ...Typography.caption,
    fontSize: 9,
    textAlign: 'center',
  },
  
  // Estimation Section
  estimationContainer: {
    marginTop: Spacing.lg,
  },
  estimationCard: {
    padding: Spacing.md,
  },
  estimationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  estimationTitle: {
    ...Typography.labelLarge,
    fontWeight: '600',
  },
  estimationIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estimationIconText: {
    fontSize: 14,
  },
  estimationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  estimationItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  estimationLabel: {
    ...Typography.caption,
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
  },
  estimationValue: {
    ...Typography.labelMedium,
    fontWeight: '600',
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
