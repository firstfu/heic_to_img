/**
 * 可摺疊內容元件 (Collapsible)
 * 
 * 功能說明：
 * - 提供可展開和摺疊的內容區域容器
 * - 具備動畫箭頭指示器顯示展開狀態
 * - 支援主題化顏色和響應式設計
 * - 適用於FAQ、設定選項、詳細資訊等場景
 * 
 * 互動特色：
 * - 點擊標題區域切換展開/收合狀態
 * - 旋轉箭頭動畫指示當前狀態 (0°→90°)
 * - 平滑的顯示/隱藏內容轉換
 * - 觸碰回饋效果 (activeOpacity: 0.8)
 * 
 * 視覺設計：
 * - SF Symbols 風格箭頭圖示 (chevron.right)
 * - 主題化圖示顏色自動適應明暗模式
 * - 標題使用加粗字體突出重要性
 * - 內容區域自動縮排提升視覺層次
 * 
 * 技術實作：
 * - useState 管理展開/收合狀態
 * - 條件渲染內容區域節省效能
 * - Transform rotate 實現箭頭旋轉動畫
 * - TouchableOpacity 提供觸碰互動體驗
 * 
 * 使用場景：
 * - FAQ 常見問題列表
 * - 設定頁面選項分類
 * - 產品規格詳細資訊
 * - 使用說明步驟展示
 * - 任何需要節省垂直空間的內容
 * 
 * 佈局結構：
 * - 標題區域: 箭頭圖示 + 標題文字
 * - 內容區域: 左側縮排的子元件容器
 * - 整體容器: ThemedView 提供主題背景
 * 
 * Props 說明：
 * - title: 可摺疊區塊的標題文字
 * - children: 摺疊內容區域的子元件
 * - 繼承 PropsWithChildren 確保完整的 React 子元件支援
 */

import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
