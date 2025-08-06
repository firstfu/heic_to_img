/**
 * 轉換結果 Context
 * 
 * 用於在應用程式中共享轉換後的檔案數據
 * 避免通過路由參數傳遞大量數據
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConvertedFile {
  name: string;
  originalName: string;
  uri: string;
  size: number;
  originalSize: number;
  convertedAt: string;
  quality: number;
  format: string;
}

interface ConversionContextType {
  convertedFiles: ConvertedFile[];
  setConvertedFiles: (files: ConvertedFile[]) => void;
  clearConvertedFiles: () => void;
}

const ConversionContext = createContext<ConversionContextType | undefined>(undefined);

export function ConversionProvider({ children }: { children: ReactNode }) {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);

  const clearConvertedFiles = () => {
    setConvertedFiles([]);
  };

  return (
    <ConversionContext.Provider 
      value={{ 
        convertedFiles, 
        setConvertedFiles, 
        clearConvertedFiles 
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
}

export function useConversion() {
  const context = useContext(ConversionContext);
  if (context === undefined) {
    throw new Error('useConversion must be used within a ConversionProvider');
  }
  return context;
}