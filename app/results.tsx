import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Share,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NewColors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/NewColors';

interface ConvertedFile {
  name: string;
  originalName: string;
  uri: string;
  size: number;
  originalSize: number;
  convertedAt: string;
  quality: number;
  format: string;
}

export default function ResultsScreen() {
  const { files } = useLocalSearchParams();
  const router = useRouter();
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  // 解析傳入的檔案資料
  const convertedFiles: ConvertedFile[] = files 
    ? JSON.parse(files as string) 
    : [];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (originalSize: number, newSize: number): string => {
    const ratio = ((originalSize - newSize) / originalSize) * 100;
    return ratio > 0 ? `-${ratio.toFixed(1)}%` : `+${Math.abs(ratio).toFixed(1)}%`;
  };

  const handleShare = async (fileUri: string, fileName: string) => {
    try {
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = fileUri;
        link.download = fileName;
        link.click();
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: fileName.endsWith('.png') ? 'image/png' : 'image/jpeg',
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
        const link = document.createElement('a');
        link.href = fileUri;
        link.download = fileName;
        link.click();
        Alert.alert('成功', '檔案已下載');
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('權限不足', '需要相簿權限才能儲存圖片');
          return;
        }

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('HEIC轉換', asset, false);
        Alert.alert('成功', '圖片已儲存到相簿');
      }
    } catch (error) {
      console.error('儲存失敗:', error);
      Alert.alert('錯誤', '儲存檔案時發生錯誤');
    }
  };

  const handleShareAll = async () => {
    try {
      if (Platform.OS === 'web') {
        // 網頁版本批量下載
        convertedFiles.forEach((file) => {
          const link = document.createElement('a');
          link.href = file.uri;
          link.download = file.name;
          link.click();
        });
      } else {
        // 原生平台批量分享
        const uris = convertedFiles.map(file => file.uri);
        await Share.share({
          message: `已轉換 ${convertedFiles.length} 張圖片`,
          url: uris[0], // iOS 需要單一 URL
        });
      }
    } catch (error) {
      console.error('批量分享失敗:', error);
      Alert.alert('錯誤', '批量分享時發生錯誤');
    }
  };

  const handleSaveAll = async () => {
    try {
      if (Platform.OS === 'web') {
        convertedFiles.forEach((file) => {
          const link = document.createElement('a');
          link.href = file.uri;
          link.download = file.name;
          link.click();
        });
        Alert.alert('成功', '所有檔案已下載');
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('權限不足', '需要相簿權限才能儲存圖片');
          return;
        }

        for (const file of convertedFiles) {
          const asset = await MediaLibrary.createAssetAsync(file.uri);
          await MediaLibrary.createAlbumAsync('HEIC轉換', asset, false);
        }
        Alert.alert('成功', `已儲存 ${convertedFiles.length} 張圖片到相簿`);
      }
    } catch (error) {
      console.error('批量儲存失敗:', error);
      Alert.alert('錯誤', '批量儲存時發生錯誤');
    }
  };

  const totalOriginalSize = convertedFiles.reduce((sum, file) => sum + file.originalSize, 0);
  const totalConvertedSize = convertedFiles.reduce((sum, file) => sum + file.size, 0);
  const totalSavings = totalOriginalSize - totalConvertedSize;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: '轉換結果',
          headerBackTitle: '返回',
          headerStyle: {
            backgroundColor: colors.primary,
          } as any,
          headerTintColor: colors.textInverse,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 簡潔的完成狀態 */}
        <Card style={styles.summaryCard} variant="glass">
          <View style={styles.summaryHeader}>
            <View style={[styles.successIcon, { backgroundColor: colors.emerald }]}>
              <ThemedText style={styles.successIconText}>✓</ThemedText>
            </View>
            <View style={styles.summaryContent}>
              <ThemedText style={[styles.summaryTitle, { color: colors.textPrimary }]}>
                轉換完成
              </ThemedText>
              <ThemedText style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
                成功轉換 {convertedFiles.length} 個檔案
              </ThemedText>
            </View>
          </View>

          {/* 簡化的統計資訊 */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                原始大小
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: colors.textPrimary }]}>
                {formatFileSize(totalOriginalSize)}
              </ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                轉換後大小
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: colors.textPrimary }]}>
                {formatFileSize(totalConvertedSize)}
              </ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                節省空間
              </ThemedText>
              <ThemedText style={[
                styles.statValue, 
                { color: totalSavings > 0 ? colors.emerald : colors.coral }
              ]}>
                {getCompressionRatio(totalOriginalSize, totalConvertedSize)}
              </ThemedText>
            </View>
          </View>

          {/* 批量操作按鈕 */}
          <View style={styles.batchActions}>
            <Button
              title="全部儲存"
              variant="primary"
              size="small"
              icon="💾"
              onPress={handleSaveAll}
              style={styles.batchButton}
            />
            <Button
              title="全部分享"
              variant="outline"
              size="small"
              icon="📤"
              onPress={handleShareAll}
              style={styles.batchButton}
            />
          </View>
        </Card>

        {/* 簡潔的檔案列表 */}
        <View style={styles.filesContainer}>
          {convertedFiles.map((file, index) => (
            <Card key={index} style={styles.fileItem} variant="outlined">
              <View style={styles.fileHeader}>
                <View style={styles.fileInfo}>
                  <ThemedText style={[styles.fileName, { color: colors.textPrimary }]}>
                    {file.name}
                  </ThemedText>
                  <ThemedText style={[styles.fileMeta, { color: colors.textTertiary }]}>
                    {formatFileSize(file.originalSize)} → {formatFileSize(file.size)} 
                    <ThemedText style={{ color: file.originalSize > file.size ? colors.emerald : colors.coral }}>
                      {' '}({getCompressionRatio(file.originalSize, file.size)})
                    </ThemedText>
                  </ThemedText>
                </View>
                <View style={[styles.formatBadge, { backgroundColor: colors.primary }]}>
                  <ThemedText style={[styles.formatText, { color: colors.textInverse }]}>
                    {file.format?.toUpperCase() || 'JPEG'}
                  </ThemedText>
                </View>
              </View>

              {/* 操作按鈕 */}
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
        </View>

        {/* 返回按鈕 */}
        <View style={styles.backSection}>
          <Button
            title="返回首頁"
            variant="outline"
            size="large"
            icon="🏠"
            onPress={() => router.back()}
            fullWidth
          />
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  
  // 統計卡片
  summaryCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  successIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  successIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    ...Typography.h4,
    marginBottom: 2,
  },
  summarySubtitle: {
    ...Typography.body,
  },
  
  // 統計容器
  statsContainer: {
    marginBottom: Spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  statLabel: {
    ...Typography.body,
    fontWeight: '500',
  },
  statValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  
  // 批量操作
  batchActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  batchButton: {
    flex: 1,
    minHeight: 40, // 確保統一高度
  },
  
  // 檔案列表
  filesContainer: {
    marginBottom: Spacing.lg,
  },
  fileItem: {
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  fileInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  fileName: {
    ...Typography.labelLarge,
    marginBottom: 4,
  },
  fileMeta: {
    ...Typography.caption,
    lineHeight: 16,
  },
  formatBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  formatText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  
  // 操作按鈕
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 40, // 確保統一高度
  },
  
  // 返回區域
  backSection: {
    marginTop: Spacing.lg,
  },
});