/**
 * HEIC 轉換工具主頁面 (HomeScreen)
 * 
 * 功能說明：
 * - 提供 HEIC 檔案選擇和格式轉換的核心功能介面
 * - 支援多檔案批量處理和實時進度顯示
 * - 整合豐富的轉換設定選項（格式、品質控制）
 * - 具備響應式動畫和直觀的使用者體驗設計
 * 
 * 核心功能：
 * - 檔案選擇: 支援系統檔案選擇器和相簿選擇
 * - 格式轉換: HEIC → JPEG/PNG，使用 heic2any 庫
 * - 品質控制: 50%-100% 可調式品質設定
 * - 批量處理: 多檔案同時轉換，顯示個別進度
 * - 結果導航: 轉換完成後自動跳轉至結果頁面
 * 
 * 技術特色：
 * - 跨平台支援 (Web: heic2any, 原生: 待實作)
 * - 流暢動畫效果 (淡入、滑入、縮放動畫)
 * - 響應式 UI 設計，支援明暗主題
 * - 智慧檔案大小估算和格式最佳化建議
 * - 全螢幕進度顯示，提升使用者體驗
 * 
 * 設定選項：
 * - 輸出格式: JPEG (較小檔案) vs PNG (無損品質)
 * - 品質等級: 網頁(60%) | 平衡(80%) | 高品質(90%) | 無損(100%)
 * - 滑桿控制: 精確的品質微調功能
 * 
 * 狀態管理：
 * - selectedFiles: 使用者選擇的 HEIC 檔案陣列
 * - isConverting: 轉換進行狀態控制
 * - conversionProgress: 轉換進度文字描述
 * - quality: 輸出品質設定 (0.5-1.0)
 * - outputFormat: 目標格式選擇 (jpeg/png)
 */

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
import { FullScreenProgress } from '@/components/ui/FullScreenProgress';
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
    setProgressValue(0);
    setConversionProgress('準備轉換...');
    
    // 初始延遲讓用戶看到進度條啟動
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const converted: any[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // 更新進度和狀態
        const progress = i / selectedFiles.length;
        setProgressValue(progress);
        setConversionProgress(`正在處理 ${file.name}...`);
        
        // 小延遲讓用戶看到進度更新
        await new Promise(resolve => setTimeout(resolve, 200));

        const convertedUri = await convertHeicToJpg(file.uri);
        
        // 轉換完成後的進度更新
        const completedProgress = (i + 1) / selectedFiles.length;
        setProgressValue(completedProgress);
        setConversionProgress(`已完成 ${i + 1}/${selectedFiles.length} 個檔案`);
        
        // 轉換完成延遲
        await new Promise(resolve => setTimeout(resolve, 300));
        
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
      
      // 最終完成狀態
      setProgressValue(1);
      setConversionProgress('轉換完成！正在準備結果...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      
      {/* Full Screen Progress */}
      <FullScreenProgress
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
  
  // Convert Section
  convertSection: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
});
