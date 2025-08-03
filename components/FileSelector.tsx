import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  
  const [photoHover, setPhotoHover] = useState(false);
  const [fileHover, setFileHover] = useState(false);
  const [scaleAnimPhoto] = useState(new Animated.Value(1));
  const [scaleAnimFile] = useState(new Animated.Value(1));

  const animatePress = (scaleAnim: Animated.Value, action: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    action();
  };

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
        <Animated.View style={[styles.optionWrapper, { transform: [{ scale: scaleAnimPhoto }] }]}>
          <TouchableOpacity
            onPress={disabled ? undefined : () => animatePress(scaleAnimPhoto, handleSelectFromPhotos)}
            disabled={disabled}
            activeOpacity={0.9}
            style={[styles.optionCard, disabled && styles.disabled]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.optionGradient}
            >
              <View style={styles.optionContent}>
                <View style={styles.iconWrapper}>
                  <LinearGradient
                    colors={[colors.electric, colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.optionIconContainer}
                  >
                    <View style={styles.cameraIcon}>
                      <View style={[styles.cameraBody, { backgroundColor: colors.textInverse }]} />
                      <View style={[styles.cameraLens, { backgroundColor: 'transparent', borderColor: colors.textInverse }]} />
                      <View style={[styles.cameraFlash, { backgroundColor: colors.textInverse }]} />
                    </View>
                  </LinearGradient>
                  <View style={[styles.iconGlow, { backgroundColor: colors.electric }]} />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={[styles.optionTitle, { color: colors.textPrimary }]}>
                    選擇相簿
                  </ThemedText>
                  <ThemedText style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                    從相簿選擇 HEIC 照片
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.optionWrapper, { transform: [{ scale: scaleAnimFile }] }]}>
          <TouchableOpacity
            onPress={disabled ? undefined : () => animatePress(scaleAnimFile, handleSelectFiles)}
            disabled={disabled}
            activeOpacity={0.9}
            style={[styles.optionCard, disabled && styles.disabled]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.optionGradient}
            >
              <View style={styles.optionContent}>
                <View style={styles.iconWrapper}>
                  <LinearGradient
                    colors={[colors.neon, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.optionIconContainer}
                  >
                    <View style={styles.folderIcon}>
                      <View style={[styles.folderBack, { backgroundColor: colors.textInverse }]} />
                      <View style={[styles.folderFront, { backgroundColor: colors.textInverse }]} />
                      <View style={[styles.folderTab, { backgroundColor: colors.textInverse }]} />
                    </View>
                  </LinearGradient>
                  <View style={[styles.iconGlow, { backgroundColor: colors.neon }]} />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={[styles.optionTitle, { color: colors.textPrimary }]}>
                    選擇檔案
                  </ThemedText>
                  <ThemedText style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                    從檔案系統選擇
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
  
  optionWrapper: {
    flex: 1,
  },
  
  optionCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  
  optionGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  optionContent: {
    alignItems: 'center',
    position: 'relative',
  },
  
  iconWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  
  optionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.neon,
  },
  
  iconGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 36,
    opacity: 0.3,
    ...Shadows.glow,
  },
  
  optionIcon: {
    fontSize: 28,
  },
  
  // Camera Icon Styles
  cameraIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  cameraBody: {
    width: 24,
    height: 18,
    borderRadius: 4,
    position: 'absolute',
  },
  
  cameraLens: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    position: 'absolute',
  },
  
  cameraFlash: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: -4,
    right: 2,
  },
  
  // Folder Icon Styles
  folderIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  folderBack: {
    width: 26,
    height: 20,
    borderRadius: 3,
    position: 'absolute',
    bottom: 4,
  },
  
  folderFront: {
    width: 24,
    height: 18,
    borderRadius: 3,
    position: 'absolute',
    bottom: 2,
    left: 1,
  },
  
  folderTab: {
    width: 10,
    height: 6,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    position: 'absolute',
    top: 2,
    left: 4,
  },
  
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  optionTitle: {
    ...Typography.labelLarge,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontWeight: '700',
  },
  
  optionSubtitle: {
    ...Typography.caption,
    textAlign: 'center',
    opacity: 0.8,
  },
  
  
  disabled: {
    opacity: 0.6,
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