import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/NewColors';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface FileSelectorProps {
  selectedFiles: any[];
  onFilesSelected: (files: any[]) => void;
  onClearFiles: () => void;
  disabled?: boolean;
  showPhotoOption?: boolean;
}

export function FileSelector({
  selectedFiles,
  onFilesSelected,
  onClearFiles,
  disabled = false,
  showPhotoOption = false,
}: FileSelectorProps) {
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  const handleSelectFromPhotos = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('權限不足', '需要相簿權限才能選擇照片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        // 將 ImagePicker 的結果轉換為統一格式
        const files = result.assets.map(asset => ({
          name: asset.uri.split('/').pop() || 'image.heic',
          uri: asset.uri,
          size: 0, // ImagePicker 不提供檔案大小
          mimeType: 'image/heic',
        }));

        onFilesSelected(files);
        Alert.alert('成功', `已選擇 ${files.length} 個檔案`);
      }
    } catch (error) {
      console.error('選擇照片時發生錯誤:', error);
      Alert.alert('錯誤', '選擇照片時發生錯誤，請重試');
    }
  };

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/heic', 'image/heif', 'image/*'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const heicFiles = result.assets.filter(file => 
          file.name.toLowerCase().endsWith('.heic') || 
          file.name.toLowerCase().endsWith('.heif') ||
          file.mimeType?.includes('heic') ||
          file.mimeType?.includes('heif')
        );

        if (heicFiles.length === 0) {
          Alert.alert('錯誤', '請選擇 HEIC/HEIF 格式的圖片檔案');
          return;
        }

        onFilesSelected(heicFiles);
        Alert.alert('成功', `已選擇 ${heicFiles.length} 個 HEIC 檔案`);
      }
    } catch (error) {
      console.error('選擇檔案時發生錯誤:', error);
      Alert.alert('錯誤', '選擇檔案時發生錯誤，請重試');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectionOptions}>
        <Card
          style={[
            styles.optionCard,
            { backgroundColor: colors.surface }
          ]}
          onPress={disabled ? undefined : handleSelectFromPhotos}
          disabled={disabled}
        >
          <View style={styles.optionContent}>
            <View style={[styles.optionIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <ThemedText style={styles.optionIcon}>📷</ThemedText>
            </View>
            <ThemedText style={[styles.optionTitle, { color: colors.textPrimary }]}>
              選擇相簿
            </ThemedText>
            <ThemedText style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
              從相簿選擇 HEIC 照片
            </ThemedText>
          </View>
        </Card>
        
        <Card
          style={[
            styles.optionCard,
            { backgroundColor: colors.surface }
          ]}
          onPress={disabled ? undefined : handleSelectFiles}
          disabled={disabled}
        >
          <View style={styles.optionContent}>
            <View style={[styles.optionIconContainer, { backgroundColor: colors.secondary + '15' }]}>
              <ThemedText style={styles.optionIcon}>📁</ThemedText>
            </View>
            <ThemedText style={[styles.optionTitle, { color: colors.textPrimary }]}>
              選擇檔案
            </ThemedText>
            <ThemedText style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
              從檔案系統選擇
            </ThemedText>
          </View>
        </Card>
      </View>

      {selectedFiles.length > 0 && (
        <Card style={styles.selectedFilesCard} variant="elevated">
          <View style={styles.selectedHeader}>
            <StatusBadge
              status="success"
              text={`已選擇 ${selectedFiles.length} 個檔案`}
              icon="✅"
            />
            <Button
              title="清除全部"
              variant="ghost"
              size="small"
              onPress={onClearFiles}
              disabled={disabled}
            />
          </View>
          
          <View style={styles.filesList}>
            {selectedFiles.slice(0, 3).map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  <ThemedText 
                    style={[styles.fileName, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {file.name}
                  </ThemedText>
                  <ThemedText style={[styles.fileSize, { color: colors.textTertiary }]}>
                    {formatFileSize(file.size || 0)}
                  </ThemedText>
                </View>
                <StatusBadge
                  status="info"
                  text="HEIC"
                  size="small"
                />
              </View>
            ))}
            
            {selectedFiles.length > 3 && (
              <ThemedText style={[styles.moreFiles, { color: colors.textSecondary }]}>
                還有 {selectedFiles.length - 3} 個檔案...
              </ThemedText>
            )}
          </View>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  
  selectionOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  
  optionCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  
  optionContent: {
    alignItems: 'center',
  },
  
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  
  optionIcon: {
    fontSize: 24,
  },
  
  optionTitle: {
    ...Typography.labelLarge,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  
  optionSubtitle: {
    ...Typography.caption,
    textAlign: 'center',
  },
  
  selectedFilesCard: {
    marginTop: Spacing.md,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  filesList: {
    gap: Spacing.md,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  fileInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  fileName: {
    ...Typography.labelMedium,
    marginBottom: 2,
  },
  fileSize: {
    ...Typography.caption,
  },
  moreFiles: {
    ...Typography.bodySmall,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
});