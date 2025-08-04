/**
 * 外部連結元件 (ExternalLink)
 * 
 * 功能說明：
 * - 提供跨平台的外部網址連結開啟功能
 * - 在原生平台使用應用內瀏覽器開啟連結
 * - 在 Web 平台使用新標籤頁開啟外部連結
 * - 確保良好的使用者體驗和導航流程
 * 
 * 平台適配：
 * - Web 平台: 使用 target="_blank" 在新標籤頁開啟
 * - 原生平台 (iOS/Android): 使用 expo-web-browser 應用內瀏覽器
 * - 自動偵測平台並選擇最適合的開啟方式
 * - 阻止原生平台的預設瀏覽器跳轉行為
 * 
 * 技術特色：
 * - 事件攔截: preventDefault() 控制原生平台行為
 * - 非同步處理: async/await 確保瀏覽器正確開啟
 * - 類型安全: TypeScript 嚴格型別檢查
 * - API 相容: 完全繼承 Expo Router Link 元件功能
 * 
 * 使用場景：
 * - 開啟外部網站連結
 * - 社群媒體和第三方平台連結
 * - 技術文件和參考資料連結
 * - 任何需要離開應用程式的外部資源
 * 
 * 使用者體驗：
 * - 原生平台: 保持在應用內，使用內建瀏覽器
 * - Web 平台: 新標籤頁開啟，不影響當前頁面
 * - 無縫體驗: 使用者無需手動選擇開啟方式
 * - 一致性: 所有外部連結使用相同的開啟邏輯
 * 
 * Props 說明：
 * - href: 外部連結網址 (必須是字串格式的 Href)
 * - 繼承 Expo Router Link 的所有其他屬性
 * - 移除原始 href 屬性以確保型別正確性
 * 
 * 實作細節：
 * - 使用 Omit 移除原始 href 型別並重新定義
 * - Platform.OS 檢測確保跨平台相容性
 * - expo-web-browser 提供原生應用內瀏覽體驗
 */

import { Href, Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async event => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
