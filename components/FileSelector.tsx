import React, { useState } from 'react';
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
import { NewColors, Typography, Spacing, BorderRadius } from '@/constants/NewColors';
import * as DocumentPicker from 'expo-document-picker';

interface FileSelectorProps {
  selectedFiles: any[];
  onFilesSelected: (files: any[]) => void;
  onClearFiles: () => void;
  disabled?: boolean;
}

export function FileSelector({
  selectedFiles,
  onFilesSelected,
  onClearFiles,
  disabled = false,
}: FileSelectorProps) {
  const [isDragActive] = useState(false);
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

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
      <Card
        style={[
          styles.dropZone,
          {
            borderColor: isDragActive ? colors.primary : colors.border,
            backgroundColor: isDragActive ? colors.primary + '10' : colors.surface,
          },
        ]}
        onPress={disabled ? undefined : handleSelectFiles}
        disabled={disabled}
      >
        <View style={styles.dropContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <ThemedText style={styles.dropIcon}>📁</ThemedText>
          </View>
          
          <ThemedText style={[styles.dropTitle, { color: colors.textPrimary }]}>
            {isDragActive ? '釋放檔案以上傳' : '選擇 HEIC 檔案'}
          </ThemedText>
          
          <ThemedText style={[styles.dropSubtitle, { color: colors.textSecondary }]}>
            點擊選擇檔案或拖拽到此區域
          </ThemedText>
          
          <View style={styles.supportedFormats}>
            <StatusBadge
              status="info"
              text="HEIC"
              size="small"
            />
            <StatusBadge
              status="info"
              text="HEIF"
              size="small"
            />
          </View>
          
          <ThemedText style={[styles.hint, { color: colors.textTertiary }]}>
            最大 50MB • 支援批量選擇
          </ThemedText>
        </View>
      </Card>

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
  
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    minHeight: 200,
    justifyContent: 'center',
  },
  dropContent: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  dropIcon: {
    fontSize: 28,
  },
  dropTitle: {
    ...Typography.h5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  dropSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  supportedFormats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  hint: {
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