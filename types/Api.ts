/**
 * API 相關型別定義
 * 
 * 定義與後端 API 互動所需的所有資料型別
 * 包含請求、回應、錯誤處理等相關型別
 */

/**
 * 輸出格式型別
 */
export type OutputFormat = 'jpeg' | 'png';

/**
 * 檔案轉換請求參數
 */
export interface ConvertFileRequest {
  file: File | { uri: string; name: string; type: string };
  format: OutputFormat;
  quality?: number;
}

/**
 * 轉換回應介面 (對應後端 ConversionResponse)
 */
export interface ConversionResponse {
  success: boolean;
  message: string;
  filename: string;
  original_size: number;
  converted_size: number;
  data?: string; // Base64 編碼的檔案資料 (當需要時)
  data_url?: string; // 新增 base64 data URL 欄位
}

/**
 * 圖片資訊回應
 */
export interface ImageInfoResponse {
  success: boolean;
  filename: string;
  size: number;
  image_info: {
    width: number;
    height: number;
    format: string;
    mode: string;
    has_transparency: boolean;
    [key: string]: any; // 其他可能的中繼資料
  };
}

/**
 * API 錯誤回應
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  detail?: string;
  status_code?: number;
}

/**
 * 健康檢查回應
 */
export interface HealthCheckResponse {
  status: string;
}

/**
 * 根路徑回應
 */
export interface RootResponse {
  message: string;
  version: string;
}

/**
 * 檔案上傳進度回調
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * API 請求選項
 */
export interface ApiRequestOptions {
  timeout?: number;
  onProgress?: UploadProgressCallback;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * 批量轉換請求
 */
export interface BatchConvertRequest {
  files: ConvertFileRequest[];
  onProgress?: (fileIndex: number, progress: number) => void;
  onFileComplete?: (fileIndex: number, result: ConversionResponse | ApiErrorResponse) => void;
}

/**
 * 批量轉換回應
 */
export interface BatchConvertResponse {
  results: (ConversionResponse | ApiErrorResponse)[];
  successful: number;
  failed: number;
  total: number;
}

/**
 * 轉換後的檔案資訊
 */
export interface ConvertedFile {
  name: string;
  originalName: string;
  uri: string;
  size: number;
  originalSize: number;
  convertedAt: string;
  quality: number;
  format: OutputFormat;
  success: boolean;
  error?: string;
}

/**
 * 網路狀態
 */
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
}

/**
 * API 客戶端配置
 */
export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  maxFileSize: number;
}

/**
 * 型別守衛 - 檢查是否為成功回應
 */
export const isSuccessResponse = (response: any): response is ConversionResponse => {
  return response && response.success === true;
};

/**
 * 型別守衛 - 檢查是否為錯誤回應
 */
export const isErrorResponse = (response: any): response is ApiErrorResponse => {
  return response && response.success === false;
};

/**
 * 型別守衛 - 檢查是否為有效的輸出格式
 */
export const isValidOutputFormat = (format: any): format is OutputFormat => {
  return typeof format === 'string' && ['jpeg', 'png'].includes(format);
};