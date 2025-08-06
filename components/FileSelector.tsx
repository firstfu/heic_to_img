/**
 * 檔案選擇器元件 (FileSelector)
 *
 * 功能說明：
 * - 提供 HEIC 檔案選擇的雙重方式：相簿選擇和檔案系統選擇
 * - 支援多檔案批量選擇和即時預覽功能
 * - 整合權限管理和錯誤處理機制
 * - 具備精美的視覺設計和流暢的互動動畫
 *
 * 選擇方式：
 * - 相簿選擇: 使用 ImagePicker 從系統相簿選擇 HEIC 照片
 * - 檔案選擇: 使用 DocumentPicker 從檔案系統選擇 HEIC/HEIF 檔案
 * - 自動過濾: 確保只能選擇 HEIC/HEIF 格式的圖片檔案
 * - 批量支援: 兩種方式都支援多檔案同時選擇
 *
 * 視覺設計特色：
 * - 漸層卡片: 使用 LinearGradient 創造現代化視覺效果
 * - 自訂圖示: 精心設計的相機和資料夾圖示
 * - 按壓動畫: 縮放動畫提供即時的觸覺回饋
 * - 發光效果: 圖示周圍的發光邊框增強視覺衝擊
 * - 主題適應: 自動適應明暗主題顏色系統
 *
 * 檔案管理功能：
 * - 選擇狀態顯示: StatusBadge 顯示已選檔案數量
 * - 檔案列表預覽: 顯示前 3 個檔案的詳細資訊
 * - 檔案大小格式化: B/KB/MB 自動轉換顯示
 * - 清除功能: 一鍵清除所有已選檔案
 * - 格式驗證: 確保選擇的檔案符合 HEIC/HEIF 格式
 *
 * 權限與錯誤處理：
 * - 相簿權限檢查: 自動請求和驗證相簿存取權限
 * - 格式驗證: 檢查檔案副檔名和 MIME 類型
 * - 友善錯誤提示: 清楚的錯誤訊息和解決建議
 * - 異常捕獲: 完整的 try-catch 錯誤處理機制
 *
 * 動畫與互動：
 * - 按壓縮放動畫: 0.95 倍縮放提供觸覺回饋
 * - 圖示發光效果: opacity 和 shadow 結合的視覺效果
 * - 禁用狀態處理: 轉換進行中的視覺禁用效果
 * - 懸停狀態管理: 支援 Web 平台的懸停效果
 *
 * Props 說明：
 * - selectedFiles: 當前已選擇的檔案陣列
 * - onFilesSelected: 檔案選擇完成的回調函數
 * - onClearFiles: 清除檔案的回調函數
 * - disabled: 是否禁用檔案選擇功能
 * - showPhotoOption: 是否顯示相簿選擇選項
 *
 * 技術實作亮點：
 * - 統一檔案格式: 將不同來源的檔案轉換為統一的資料結構
 * - 效能最佳化: 僅顯示前 3 個檔案避免長列表效能問題
 * - 記憶體管理: 適當的狀態管理避免記憶體洩漏
 * - 跨平台相容: 同時支援原生和 Web 平台的檔案選擇
 */

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HEICPickerModal } from "@/components/ui/HEICPickerModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BorderRadius, NewColors, Shadows, Spacing, Typography } from "@/constants/NewColors";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, Animated, StyleSheet, TouchableOpacity, View } from "react-native";

interface FileSelectorProps {
  selectedFiles: any[];
  onFilesSelected: (files: any[]) => void;
  onClearFiles: () => void;
  disabled?: boolean;
  showPhotoOption?: boolean;
}

export function FileSelector({ selectedFiles, onFilesSelected, onClearFiles, disabled = false }: FileSelectorProps) {
  const isDark = useThemeColor({}, "background") === "#151718";
  const colors = isDark ? NewColors.dark : NewColors.light;

  const [scaleAnimPhoto] = useState(new Animated.Value(1));
  const [scaleAnimFile] = useState(new Animated.Value(1));
  const [showHEICModal, setShowHEICModal] = useState(false);

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
      // 請求相簿權限
      console.log("🔒 請求相簿權限...");
      const { status: imagePickerStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();

      console.log("📋 權限狀態:", { imagePickerStatus, mediaLibraryStatus });

      if (imagePickerStatus !== "granted" || mediaLibraryStatus !== "granted") {
        console.log("❌ 權限被拒絕");
        Alert.alert("權限不足", "需要相簿權限才能選擇照片");
        return;
      }

      // 直接顯示 HEIC 選擇界面，讓 Modal 自己載入
      console.log("📋 顯示 HEIC 選擇界面");
      setShowHEICModal(true);
    } catch (error) {
      console.error("❌ 選擇照片時發生錯誤:", error);
      Alert.alert("錯誤", `選擇照片時發生錯誤: ${(error as Error).message || "未知錯誤"}`);
    }
  };

  const handleHEICSelectionComplete = (selectedFiles: any[]) => {
    onFilesSelected(selectedFiles);
    Alert.alert("成功", `已選擇 ${selectedFiles.length} 個 HEIC 檔案`);
    setShowHEICModal(false);
  };

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/heic", "image/heif"],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const heicFiles = result.assets.filter(
          file => file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif") || file.mimeType?.includes("heic") || file.mimeType?.includes("heif")
        );

        if (heicFiles.length === 0) {
          Alert.alert("錯誤", "請選擇 HEIC/HEIF 格式的圖片檔案");
          return;
        }

        onFilesSelected(heicFiles);
        Alert.alert("成功", `已選擇 ${heicFiles.length} 個 HEIC 檔案`);
      }
    } catch (error) {
      console.error("選擇檔案時發生錯誤:", error);
      Alert.alert("錯誤", "選擇檔案時發生錯誤，請重試");
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
            <LinearGradient colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.optionGradient}>
              <View style={styles.optionContent}>
                <View style={styles.iconWrapper}>
                  <LinearGradient colors={[colors.electric, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.optionIconContainer}>
                    <View style={styles.cameraIcon}>
                      <View style={[styles.cameraBody, { backgroundColor: colors.textInverse }]} />
                      <View style={[styles.cameraLens, { backgroundColor: "transparent", borderColor: colors.textInverse }]} />
                      <View style={[styles.cameraFlash, { backgroundColor: colors.textInverse }]} />
                    </View>
                  </LinearGradient>
                  <View style={[styles.iconGlow, { backgroundColor: colors.electric }]} />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={[styles.optionTitle, { color: colors.textPrimary }]}>選擇相簿</ThemedText>
                  <ThemedText style={[styles.optionSubtitle, { color: colors.textSecondary }]}>從相簿選擇 HEIC 照片</ThemedText>
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
            <LinearGradient colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.optionGradient}>
              <View style={styles.optionContent}>
                <View style={styles.iconWrapper}>
                  <LinearGradient colors={[colors.neon, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.optionIconContainer}>
                    <View style={styles.folderIcon}>
                      <View style={[styles.folderBack, { backgroundColor: colors.textInverse }]} />
                      <View style={[styles.folderFront, { backgroundColor: colors.textInverse }]} />
                      <View style={[styles.folderTab, { backgroundColor: colors.textInverse }]} />
                    </View>
                  </LinearGradient>
                  <View style={[styles.iconGlow, { backgroundColor: colors.neon }]} />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={[styles.optionTitle, { color: colors.textPrimary }]}>選擇檔案</ThemedText>
                  <ThemedText style={[styles.optionSubtitle, { color: colors.textSecondary }]}>從檔案系統選擇</ThemedText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {selectedFiles.length > 0 && (
        <Card style={styles.selectedFilesCard} variant="elevated">
          <View style={styles.selectedHeader}>
            <StatusBadge status="success" text={`已選擇 ${selectedFiles.length} 個檔案`} icon="✅" />
            <Button title="清除全部" variant="ghost" size="small" onPress={onClearFiles} disabled={disabled} />
          </View>

          <View style={styles.filesList}>
            {selectedFiles.slice(0, 3).map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  <ThemedText style={[styles.fileName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {file.name}
                  </ThemedText>
                  <ThemedText style={[styles.fileSize, { color: colors.textTertiary }]}>{formatFileSize(file.size || 0)}</ThemedText>
                </View>
                <StatusBadge status="info" text="HEIC" size="small" />
              </View>
            ))}

            {selectedFiles.length > 3 && <ThemedText style={[styles.moreFiles, { color: colors.textSecondary }]}>還有 {selectedFiles.length - 3} 個檔案...</ThemedText>}
          </View>
        </Card>
      )}

      <HEICPickerModal visible={showHEICModal} onClose={() => setShowHEICModal(false)} onSelectionComplete={handleHEICSelectionComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },

  selectionOptions: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  optionWrapper: {
    flex: 1,
  },

  optionCard: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    ...Shadows.lg,
  },

  optionGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  optionContent: {
    alignItems: "center",
    position: "relative",
  },

  iconWrapper: {
    position: "relative",
    marginBottom: Spacing.md,
  },

  optionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.neon,
  },

  iconGlow: {
    position: "absolute",
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
    justifyContent: "center",
    alignItems: "center",
  },

  cameraBody: {
    width: 24,
    height: 18,
    borderRadius: 4,
    position: "absolute",
  },

  cameraLens: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    position: "absolute",
  },

  cameraFlash: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: "absolute",
    top: -4,
    right: 2,
  },

  // Folder Icon Styles
  folderIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  folderBack: {
    width: 26,
    height: 20,
    borderRadius: 3,
    position: "absolute",
    bottom: 4,
  },

  folderFront: {
    width: 24,
    height: 18,
    borderRadius: 3,
    position: "absolute",
    bottom: 2,
    left: 1,
  },

  folderTab: {
    width: 10,
    height: 6,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    position: "absolute",
    top: 2,
    left: 4,
  },

  textContainer: {
    alignItems: "center",
    marginBottom: Spacing.sm,
  },

  optionTitle: {
    ...Typography.labelLarge,
    textAlign: "center",
    marginBottom: Spacing.xs,
    fontWeight: "700",
  },

  optionSubtitle: {
    ...Typography.caption,
    textAlign: "center",
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.6,
  },

  selectedFilesCard: {
    marginTop: Spacing.md,
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  filesList: {
    gap: Spacing.md,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(99, 102, 241, 0.05)",
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
    textAlign: "center",
    fontStyle: "italic",
    marginTop: Spacing.sm,
  },
});
