/**
 * HEIC 相簿選擇器模態窗元件
 * 
 * 功能說明：
 * - 專門用於選擇 HEIC 格式的圖片
 * - 提供網格式的預覽界面
 * - 支援多選功能和選擇狀態管理
 * - 具備搜尋和過濾功能
 * - 整合完整的錯誤處理和載入狀態
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Typography, Spacing, BorderRadius } from '@/constants/NewColors';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_SIZE = (screenWidth - Spacing.xl * 2 - Spacing.md * 2) / 3;

interface HEICAsset {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
}

interface HEICPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectionComplete: (selectedFiles: any[]) => void;
  initialAssets?: HEICAsset[];
}

export function HEICPickerModal({
  visible,
  onClose,
  onSelectionComplete,
  initialAssets = [],
}: HEICPickerModalProps) {
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;
  
  const [heicAssets, setHeicAssets] = useState<HEICAsset[]>(initialAssets);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // 載入 HEIC 資產
  useEffect(() => {
    if (!visible) return;

    const loadHEICAssets = async () => {
      setIsLoading(true);
      setHeicAssets([]); // 清空舊資料
      
      try {
        console.log('📱 開始載入 HEIC 資產...');
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('權限不足', '需要相簿權限才能載入圖片');
          onClose();
          return;
        }

        // 快速載入策略
        const heicList: HEICAsset[] = [];
        const processedIds = new Set<string>();
        let after: string | undefined = undefined;
        let totalBatches = 0;
        const maxBatches = 10; // 最多載入 10 批
        
        while (totalBatches < maxBatches) {
          const assets = await MediaLibrary.getAssetsAsync({
            mediaType: ['photo'],
            first: 200, // 每批載入 200 張
            after: after,
            sortBy: [MediaLibrary.SortBy.creationTime],
          });

          console.log(`📊 第 ${totalBatches + 1} 批: 載入 ${assets.assets.length} 張照片`);

          if (assets.assets.length === 0) {
            break;
          }

          // 快速過濾 HEIC
          for (const asset of assets.assets) {
            const filename = asset.filename || asset.uri.split('/').pop() || '';
            
            if ((filename.toLowerCase().includes('.heic') || filename.toLowerCase().includes('.heif')) 
                && !processedIds.has(asset.id)) {
              processedIds.add(asset.id);
              heicList.push({
                id: asset.id,
                uri: asset.uri,
                filename: filename,
                width: asset.width,
                height: asset.height,
              });
              console.log('🎯 找到 HEIC:', filename);
            }
          }

          // 如果已經找到足夠多的 HEIC 圖片，先顯示
          if (heicList.length >= 20 && totalBatches === 0) {
            console.log('📋 先顯示前 20 張 HEIC');
            setHeicAssets([...heicList]);
            setIsLoading(false);
          }

          if (assets.hasNextPage && assets.endCursor) {
            after = assets.endCursor;
            totalBatches++;
          } else {
            break;
          }
        }

        console.log(`✅ 載入完成，總共找到 ${heicList.length} 個 HEIC 圖片`);
        setHeicAssets(heicList);
      } catch (error) {
        console.error('Failed to load HEIC assets:', error);
        Alert.alert('錯誤', '載入 HEIC 圖片時發生錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    loadHEICAssets();
  }, [visible, onClose]);

  const toggleAssetSelection = (assetId: string) => {
    const newSelection = new Set(selectedAssets);
    if (newSelection.has(assetId)) {
      newSelection.delete(assetId);
    } else {
      newSelection.add(assetId);
    }
    setSelectedAssets(newSelection);
  };

  const handleConfirmSelection = () => {
    const selectedFiles = heicAssets
      .filter(asset => selectedAssets.has(asset.id))
      .map(asset => ({
        name: asset.filename,
        uri: asset.uri,
        size: 0,
        mimeType: 'image/heic',
      }));

    if (selectedFiles.length === 0) {
      Alert.alert('提示', '請至少選擇一張 HEIC 圖片');
      return;
    }

    onSelectionComplete(selectedFiles);
    setSelectedAssets(new Set());
    onClose();
  };

  const handleCancel = () => {
    setSelectedAssets(new Set());
    onClose();
  };

  const renderAssetItem = (asset: HEICAsset) => {
    const isSelected = selectedAssets.has(asset.id);
    
    return (
      <TouchableOpacity
        key={asset.id}
        style={[styles.assetItem, { backgroundColor: colors.surface }]}
        onPress={() => toggleAssetSelection(asset.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: asset.uri }}
          style={styles.assetImage}
          contentFit="cover"
        />
        
        {isSelected && (
          <View style={[styles.selectedOverlay, { backgroundColor: 'rgba(99, 102, 241, 0.7)' }]}>
            <View style={[styles.selectionBadge, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.selectionText}>✓</ThemedText>
            </View>
          </View>
        )}
        
        <View style={[styles.assetInfo, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <ThemedText style={styles.assetName} numberOfLines={1}>
            {asset.filename}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* 標題欄 */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <ThemedText style={[styles.title, { color: colors.textPrimary }]}>
            選擇 HEIC 圖片
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            {selectedAssets.size > 0 && `已選擇 ${selectedAssets.size} 張`}
          </ThemedText>
        </View>

        {/* 內容區域 */}
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
                正在載入 HEIC 圖片...
              </ThemedText>
            </View>
          ) : heicAssets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                沒有找到 HEIC 格式的圖片
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                請確認您的相簿中有 HEIC 格式的照片
              </ThemedText>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.assetsGrid}
              showsVerticalScrollIndicator={false}
            >
              {heicAssets.map(renderAssetItem)}
            </ScrollView>
          )}
        </View>

        {/* 底部操作欄 */}
        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <Button
            title="取消"
            variant="ghost"
            onPress={handleCancel}
            style={styles.footerButton}
          />
          <Button
            title={`確認選擇 (${selectedAssets.size})`}
            variant="primary"
            onPress={handleConfirmSelection}
            disabled={selectedAssets.size === 0}
            style={styles.footerButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  title: {
    ...Typography.h5,
    marginBottom: Spacing.xs,
  },
  
  subtitle: {
    ...Typography.body,
  },
  
  content: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  
  loadingText: {
    ...Typography.body,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  
  emptyText: {
    ...Typography.bodyLarge,
    textAlign: 'center',
  },
  
  emptySubtext: {
    ...Typography.body,
    textAlign: 'center',
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  assetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  
  assetItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  
  assetImage: {
    width: '100%',
    height: '100%',
  },
  
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  assetInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xs,
  },
  
  assetName: {
    ...Typography.caption,
    color: 'white',
  },
  
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  footerButton: {
    flex: 1,
  },
});