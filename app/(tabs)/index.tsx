import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { FileSelector } from '@/components/FileSelector';
import { NewColors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/NewColors';


export default function HomeScreen() {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const [quality, setQuality] = useState<number>(0.9);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');

  const router = useRouter();
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
    setConversionProgress('');
    setProgressValue(0);
  };


  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('錯誤', '請先選擇要轉換的檔案');
      return;
    }

    setIsConverting(true);
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
          // 計算轉換後的檔案大小（模擬）
          const estimatedNewSize = file.size * (outputFormat === 'png' ? quality * 1.5 : quality * 0.8);
          const convertedFile = {
            name: file.name.replace(/\.(heic|heif)$/i, `.${extension}`),
            originalName: file.name,
            uri: convertedUri,
            size: Math.round(estimatedNewSize),
            originalSize: file.size,
            convertedAt: new Date().toISOString(),
            quality: quality,
            format: outputFormat,
          };
          converted.push(convertedFile);
        } else {
          console.error(`轉換失敗: ${file.name}`);
        }
      }
      
      if (converted.length > 0) {
        // 轉換完成後跳轉到結果頁面
        router.push({
          pathname: '/results',
          params: {
            files: JSON.stringify(converted)
          }
        });
      } else {
        Alert.alert('轉換失敗', '沒有檔案成功轉換，請重試');
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
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <CustomHeader 
              title="HEIC 轉換工具"
              subtitle="將 HEIC 格式轉換為 JPEG 或 PNG"
            />
          ),
          headerStyle: {
            backgroundColor: colors.primary,
            height: 120, // 增加導航欄高度以容納標題和副標題
          } as any,
          headerTintColor: colors.textInverse,
          headerShadowVisible: false,
          headerTransparent: false,
          headerTitleAlign: 'center',
        }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* File Selection */}
        <View style={[styles.mainCard, { backgroundColor: 'transparent' }]}>
          <FileSelector
            selectedFiles={selectedFiles}
            onFilesSelected={handleFilesSelected}
            onClearFiles={handleClearAll}
            disabled={isConverting}
            showPhotoOption={true}
          />
        </View>

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
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <ThemedText style={[styles.settingLabel, { color: colors.textPrimary }]}>
                輸出格式
              </ThemedText>
              <View style={[styles.settingIndicator, { backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.formatButtonsContainer}>
              <View style={[styles.formatButtons, { backgroundColor: colors.surfaceGlass, borderWidth: 1, borderColor: colors.surfaceGlassBorder }]}>
                <Card
                  style={StyleSheet.flatten([
                    styles.formatCard,
                    { backgroundColor: outputFormat === 'jpeg' ? colors.primary : colors.surface },
                    outputFormat === 'jpeg' && styles.formatCardActive,
                    outputFormat === 'jpeg' && { 
                      borderColor: colors.primary,
                      backgroundColor: colors.primary 
                    }
                  ])}
                  variant="glass"
                  onPress={() => setOutputFormat('jpeg')}
                  disabled={isConverting}
                >
                  <ThemedText style={[
                    styles.formatTitle,
                    { color: outputFormat === 'jpeg' ? colors.textInverse : colors.textPrimary }
                  ]}>
                    JPEG
                  </ThemedText>
                  <ThemedText style={[
                    styles.formatDesc,
                    { color: outputFormat === 'jpeg' ? colors.textInverse : colors.textSecondary }
                  ]}>
                    較小檔案
                  </ThemedText>
                </Card>
                <Card
                  style={StyleSheet.flatten([
                    styles.formatCard,
                    { backgroundColor: outputFormat === 'png' ? colors.primary : colors.surface },
                    outputFormat === 'png' && styles.formatCardActive,
                    outputFormat === 'png' && { 
                      borderColor: colors.primary,
                      backgroundColor: colors.primary 
                    }
                  ])}
                  variant="glass"
                  onPress={() => setOutputFormat('png')}
                  disabled={isConverting}
                >
                  <ThemedText style={[
                    styles.formatTitle,
                    { color: outputFormat === 'png' ? colors.textInverse : colors.textPrimary }
                  ]}>
                    PNG
                  </ThemedText>
                  <ThemedText style={[
                    styles.formatDesc,
                    { color: outputFormat === 'png' ? colors.textInverse : colors.textSecondary }
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
                  <View style={[styles.qualityBadge, { backgroundColor: colors.primary }]}>
                    <ThemedText style={[styles.qualityBadgeText, { color: colors.textInverse }]}>
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
                    style={StyleSheet.flatten([
                      styles.qualityCard,
                      { backgroundColor: quality === item.value ? colors.primary : colors.surface },
                      quality === item.value && styles.qualityCardActive,
                      quality === item.value && { 
                        borderColor: colors.primary,
                        backgroundColor: colors.primary 
                      }
                    ])}
                    variant="glass"
                    onPress={() => setQuality(item.value)}
                    disabled={isConverting}
                  >
                    <ThemedText style={styles.qualityCardIcon}>
                      {item.icon}
                    </ThemedText>
                    <ThemedText style={[
                      styles.qualityCardValue, 
                      { color: quality === item.value ? colors.textInverse : colors.textPrimary }
                    ]}>
                      {item.label}
                    </ThemedText>
                    <ThemedText style={[
                      styles.qualityCardDesc, 
                      { color: quality === item.value ? colors.textInverse : colors.textSecondary }
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
                  <View style={[styles.estimationIcon, { backgroundColor: colors.primary }]}>
                    <ThemedText style={[styles.estimationIconText, { color: colors.textInverse }]}>
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
        <View style={styles.convertSection}>
          <Button
            title={isConverting ? '轉換中...' : selectedFiles.length === 0 ? '選擇檔案後開始轉換' : '開始轉換'}
            icon={isConverting ? undefined : selectedFiles.length === 0 ? '📁' : '🚀'}
            onPress={handleConvert}
            disabled={isConverting || selectedFiles.length === 0}
            loading={isConverting}
            fullWidth
            size="large"
          />
        </View>



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
    paddingTop: Spacing.lg, // 調整為正常間距
    paddingBottom: Spacing.xl,
  },
  
  
  // Main Card
  mainCard: {
    marginBottom: Spacing.lg,
  },
  
  // Settings Section
  settingsCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    ...Shadows.lg,
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
    ...Shadows.glass,
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
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
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
    gap: Spacing.sm,
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
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
});
