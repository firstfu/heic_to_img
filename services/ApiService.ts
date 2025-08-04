/**
 * API 服務層
 * 
 * 提供與後端 API 互動的統一介面
 * 包含檔案上傳、轉換、錯誤處理、重試邏輯等功能
 */

import {
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_CONFIG,
  ERROR_MESSAGES,
  getApiUrl,
  isSupportedFormat,
  isValidFileSize,
} from '@/constants/ApiConfig';

import {
  ConvertFileRequest,
  ConversionResponse,
  ImageInfoResponse,
  ApiErrorResponse,
  HealthCheckResponse,
  RootResponse,
  BatchConvertRequest,
  BatchConvertResponse,
  ConvertedFile,
  ApiRequestOptions,
  isSuccessResponse,
  isErrorResponse,
  OutputFormat,
} from '@/types/Api';

/**
 * API 服務類別
 */
export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private defaultTimeout: number;

  private constructor() {
    this.baseUrl = API_BASE_URL;
    this.defaultTimeout = REQUEST_CONFIG.TIMEOUT;
  }

  /**
   * 取得單例實例
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * 建立 FormData 用於檔案上傳
   */
  private createFormData(request: ConvertFileRequest): FormData {
    const formData = new FormData();
    
    // 處理檔案
    if ('uri' in request.file) {
      // React Native 檔案格式
      formData.append('file', {
        uri: request.file.uri,
        name: request.file.name,
        type: request.file.type || 'image/heic',
      } as any);
    } else {
      // Web File API 格式 (雖然我們已移除 Web 支援，但保留介面相容性)
      formData.append('file', request.file);
    }
    
    // 加入格式和品質參數
    formData.append('format', request.format);
    if (request.quality !== undefined) {
      formData.append('quality', request.quality.toString());
    }
    
    return formData;
  }

  /**
   * 執行 HTTP 請求的通用方法
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;
    
    // 建立 AbortController 用於超時控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      
      if (error.message?.includes('Network request failed')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      
      throw error;
    }
  }

  /**
   * 帶重試邏輯的請求方法
   */
  private async makeRequestWithRetry<T>(
    url: string,
    options: RequestInit & ApiRequestOptions = {}
  ): Promise<T> {
    const { 
      retryAttempts = REQUEST_CONFIG.RETRY_ATTEMPTS, 
      retryDelay = REQUEST_CONFIG.RETRY_DELAY,
      ...requestOptions 
    } = options;

    let lastError: Error;
    
    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        return await this.makeRequest<T>(url, requestOptions);
      } catch (error: any) {
        lastError = error;
        
        // 如果是最後一次嘗試，直接拋出錯誤
        if (attempt === retryAttempts) {
          break;
        }
        
        // 某些錯誤不需要重試 (如 4xx 錯誤)
        if (error.message?.includes('HTTP 4')) {
          break;
        }
        
        // 等待後重試
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
    
    throw lastError!;
  }

  /**
   * 健康檢查
   */
  public async healthCheck(): Promise<HealthCheckResponse> {
    const url = getApiUrl(API_ENDPOINTS.HEALTH);
    return this.makeRequest<HealthCheckResponse>(url);
  }

  /**
   * 取得根路徑資訊
   */
  public async getRoot(): Promise<RootResponse> {
    const url = getApiUrl(API_ENDPOINTS.ROOT);
    return this.makeRequest<RootResponse>(url);
  }

  /**
   * 轉換單一檔案
   */
  public async convertFile(
    request: ConvertFileRequest,
    options: ApiRequestOptions = {}
  ): Promise<ConversionResponse> {
    // 驗證檔案格式
    if (!isSupportedFormat(request.file.name)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    // 建立請求
    const url = getApiUrl(API_ENDPOINTS.CONVERT);
    const formData = this.createFormData(request);
    
    const response = await this.makeRequestWithRetry<ConversionResponse | ApiErrorResponse>(url, {
      method: 'POST',
      body: formData,
      ...options,
    });
    
    if (!isSuccessResponse(response)) {
      throw new Error((response as ApiErrorResponse).message || ERROR_MESSAGES.SERVER_ERROR);
    }
    
    return response;
  }

  /**
   * 轉換檔案並直接下載
   */
  public async convertAndDownload(
    request: ConvertFileRequest,
    options: ApiRequestOptions = {}
  ): Promise<Blob> {
    // 驗證檔案格式
    if (!isSupportedFormat(request.file.name)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    const url = getApiUrl(API_ENDPOINTS.CONVERT_DOWNLOAD);
    const formData = this.createFormData(request);
    
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        ...fetchOptions,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.blob();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      
      if (error.message?.includes('Network request failed')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      
      throw error;
    }
  }

  /**
   * 取得圖片資訊
   */
  public async getImageInfo(
    file: { uri: string; name: string; type: string },
    options: ApiRequestOptions = {}
  ): Promise<ImageInfoResponse> {
    // 驗證檔案格式
    if (!isSupportedFormat(file.name)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    const url = getApiUrl(API_ENDPOINTS.INFO);
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type || 'image/heic',
    } as any);
    
    return this.makeRequestWithRetry<ImageInfoResponse>(url, {
      method: 'POST',
      body: formData,
      ...options,
    });
  }

  /**
   * 批量轉換檔案
   */
  public async batchConvert(
    request: BatchConvertRequest,
    options: ApiRequestOptions = {}
  ): Promise<BatchConvertResponse> {
    const results: (ConversionResponse | ApiErrorResponse)[] = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < request.files.length; i++) {
      const fileRequest = request.files[i];
      
      try {
        // 通知開始轉換這個檔案
        request.onProgress?.(i, 0);
        
        const result = await this.convertFile(fileRequest, {
          ...options,
          onProgress: (progress) => request.onProgress?.(i, progress),
        });
        
        results.push(result);
        successful++;
        
        // 通知檔案轉換完成
        request.onFileComplete?.(i, result);
        
      } catch (error: any) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        };
        
        results.push(errorResponse);
        failed++;
        
        // 通知檔案轉換失敗
        request.onFileComplete?.(i, errorResponse);
      }
    }

    return {
      results,
      successful,
      failed,
      total: request.files.length,
    };
  }

  /**
   * 驗證服務是否可用
   */
  public async isServiceAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// 導出單例實例
export const apiService = ApiService.getInstance();