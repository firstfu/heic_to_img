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

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Typography, Spacing } from '@/constants/NewColors';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

const { width: screenWidth } = Dimensions.get('window');
const GAP_SIZE = 2; // 圖片間隔 2px
const PADDING = 4; // 左右邊距 4px
const ITEM_SIZE = (screenWidth - PADDING * 2 - GAP_SIZE * 2) / 3;

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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);

  // 初始載入 HEIC 資產
  useEffect(() => {
    if (!visible) {
      // 重置狀態
      setHeicAssets([]);
      setSelectedAssets(new Set());
      setEndCursor(undefined);
      setHasMore(true);
      return;
    }

    const loadInitialAssets = async () => {
      setIsLoading(true);
      setHeicAssets([]);
      
      try {
        console.log('📱 開始載入 HEIC 資產...');
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('權限不足', '需要相簿權限才能載入圖片');
          onClose();
          return;
        }

        // 初始載入 - 只載入前 3 批
        const heicList: HEICAsset[] = [];
        const processedIds = new Set<string>();
        let after: string | undefined = undefined;
        let totalBatches = 0;
        const initialBatches = 3; // 初始載入 3 批
        
        while (totalBatches < initialBatches) {
          const assets = await MediaLibrary.getAssetsAsync({
            mediaType: ['photo'],
            first: 200, // 每批載入 200 張
            after: after,
            sortBy: [MediaLibrary.SortBy.creationTime],
          });

          console.log(`📊 初始第 ${totalBatches + 1} 批: 載入 ${assets.assets.length} 張照片`);

          if (assets.assets.length === 0) {
            setHasMore(false);
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
            }
          }

          if (assets.hasNextPage && assets.endCursor) {
            after = assets.endCursor;
            totalBatches++;
          } else {
            setHasMore(false);
            break;
          }
        }

        console.log(`✅ 初始載入完成，找到 ${heicList.length} 個 HEIC 圖片`);
        setHeicAssets(heicList);
        setEndCursor(after);
      } catch (error) {
        console.error('Failed to load HEIC assets:', error);
        Alert.alert('錯誤', '載入 HEIC 圖片時發生錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialAssets();
  }, [visible, onClose]);

  // 載入更多 HEIC 資產
  const loadMoreAssets = useCallback(async () => {
    if (isLoadingMore || !hasMore || !endCursor) return;

    setIsLoadingMore(true);
    
    try {
      console.log('📋 載入更多 HEIC 圖片...');
      
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: ['photo'],
        first: 200,
        after: endCursor,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      console.log(`📊 載入更多: ${assets.assets.length} 張照片`);

      if (assets.assets.length === 0) {
        setHasMore(false);
        return;
      }

      const newHeicAssets: HEICAsset[] = [];
      const existingIds = new Set(heicAssets.map(a => a.id));

      // 過濾出新的 HEIC 圖片
      for (const asset of assets.assets) {
        const filename = asset.filename || asset.uri.split('/').pop() || '';
        
        if ((filename.toLowerCase().includes('.heic') || filename.toLowerCase().includes('.heif')) 
            && !existingIds.has(asset.id)) {
          newHeicAssets.push({
            id: asset.id,
            uri: asset.uri,
            filename: filename,
            width: asset.width,
            height: asset.height,
          });
        }
      }

      if (newHeicAssets.length > 0) {
        console.log(`🎯 找到 ${newHeicAssets.length} 個新的 HEIC 圖片`);
        setHeicAssets(prev => [...prev, ...newHeicAssets]);
      }

      if (assets.hasNextPage && assets.endCursor) {
        setEndCursor(assets.endCursor);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more assets:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, endCursor, heicAssets]);

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
          <View style={styles.headerContent}>
            <View style={[styles.headerIcon, { backgroundColor: colors.primary + '20' }]}>
              <ThemedText style={[styles.headerIconText, { color: colors.primary }]}>📸</ThemedText>
            </View>
            <View style={styles.headerTextContainer}>
              <ThemedText style={[styles.title, { color: colors.textPrimary }]}>
                選擇 HEIC 圖片
              </ThemedText>
              {selectedAssets.size > 0 && (
                <View style={[styles.selectionBadgeContainer, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.selectionBadgeText}>
                    {selectedAssets.size}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
          {selectedAssets.size > 0 && (
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              已選擇 {selectedAssets.size} 張圖片
            </ThemedText>
          )}
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
            <FlatList
              data={heicAssets}
              renderItem={({ item }) => renderAssetItem(item)}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreAssets}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => (
                isLoadingMore ? (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <ThemedText style={[styles.loadingMoreText, { color: colors.textSecondary }]}>
                      正在載入更多 HEIC 圖片...
                    </ThemedText>
                  </View>
                ) : !hasMore && heicAssets.length > 0 ? (
                  <View style={styles.endContainer}>
                    <ThemedText style={[styles.endText, { color: colors.textTertiary }]}>
                      已載入所有 HEIC 圖片
                    </ThemedText>
                  </View>
                ) : null
              )}
            />
          )}
        </View>

        {/* 底部操作欄 */}
        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.cancelButtonText, { color: colors.primary }]}>
              取消
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.confirmButton,
              { backgroundColor: selectedAssets.size === 0 ? colors.textTertiary : colors.primary },
            ]}
            onPress={handleConfirmSelection}
            disabled={selectedAssets.size === 0}
            activeOpacity={0.8}
          >
            <View style={styles.confirmButtonContent}>
              <ThemedText style={[styles.confirmButtonText, { color: colors.background }]}>
                確認選擇
              </ThemedText>
              {selectedAssets.size > 0 && (
                <View style={[styles.confirmBadge, { backgroundColor: colors.background + '30' }]}>
                  <ThemedText style={[styles.confirmBadgeText, { color: colors.background }]}>
                    {selectedAssets.size}
                  </ThemedText>
                </View>
              )}
            </View>
          </TouchableOpacity>
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
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  
  headerIconText: {
    fontSize: 24,
  },
  
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  title: {
    ...Typography.h5,
    fontWeight: '700',
  },
  
  selectionBadgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  selectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  subtitle: {
    ...Typography.body,
    marginLeft: 48 + Spacing.md,
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
    padding: PADDING,
    gap: GAP_SIZE,
  },
  
  assetItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 0,
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
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  
  confirmBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  confirmBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
    gap: GAP_SIZE,
  },
  
  flatListContent: {
    paddingBottom: Spacing.lg,
    paddingTop: PADDING,
  },
  
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  
  loadingMoreText: {
    ...Typography.body,
  },
  
  endContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  
  endText: {
    ...Typography.body,
    fontStyle: 'italic',
  },
});