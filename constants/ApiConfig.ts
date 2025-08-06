/**
 * API 配置檔案
 *
 * 定義後端 API 的基礎 URL、端點路徑和相關配置
 * 支援開發和生產環境的不同設定
 */

// 預設 API 基礎 URL (可透過環境變數覆寫)
const DEFAULT_API_BASE_URL = "http://192.168.23.105:8000";

// 從環境變數讀取 API URL，若無則使用預設值
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

/**
 * API 端點定義
 */
export const API_ENDPOINTS = {
  // 轉換相關端點
  CONVERT: "/api/v1/convert",
  CONVERT_DOWNLOAD: "/api/v1/convert-download",
  INFO: "/api/v1/info",

  // 健康檢查
  HEALTH: "/health",
  ROOT: "/",
} as const;

/**
 * 請求配置
 */
export const REQUEST_CONFIG = {
  // 請求超時時間 (毫秒)
  TIMEOUT: 30000, // 30 秒

  // 檔案上傳最大大小 (位元組)
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB

  // 重試配置
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 秒

  // 支援的檔案格式
  SUPPORTED_FORMATS: ["heic", "heif"],

  // 輸出格式選項
  OUTPUT_FORMATS: {
    JPEG: "jpeg",
    PNG: "png",
  } as const,

  // 品質範圍
  QUALITY_RANGE: {
    MIN: 50,
    MAX: 100,
    DEFAULT: 85,
  } as const,
} as const;

/**
 * 錯誤訊息定義
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "網路連接失敗，請檢查網路狀態",
  TIMEOUT_ERROR: "請求超時，請重試",
  FILE_TOO_LARGE: `檔案大小超過限制 (${REQUEST_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`,
  INVALID_FORMAT: "不支援的檔案格式",
  SERVER_ERROR: "伺服器錯誤，請稍後重試",
  UNKNOWN_ERROR: "發生未知錯誤",
} as const;

/**
 * 取得完整的 API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * 檢查檔案格式是否支援
 */
export const isSupportedFormat = (filename: string): boolean => {
  const extension = filename.toLowerCase().split(".").pop();
  return REQUEST_CONFIG.SUPPORTED_FORMATS.includes(extension as any);
};

/**
 * 檢查檔案大小是否符合限制
 */
export const isValidFileSize = (size: number): boolean => {
  return size <= REQUEST_CONFIG.MAX_FILE_SIZE;
};
