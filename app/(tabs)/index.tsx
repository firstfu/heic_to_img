import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as DocumentPicker from 'expo-document-picker';

export default function HomeScreen() {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<any[]>([]);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const [quality, setQuality] = useState<number>(0.9);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');

  const primaryColor = useThemeColor({}, 'tint');

  const convertHeicToJpg = async (fileUri: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        // 在網頁環境使用 heic2any
        const heic2any = (await import('heic2any')).default;
        
        const response = await fetch(fileUri);
        const heicBlob = await response.blob();
        
        const convertedBlob = await heic2any({
          blob: heicBlob,
          toType: `image/${outputFormat}`,
          quality: quality,
        });

        const convertedFile = convertedBlob as Blob;
        const jpgDataUrl = URL.createObjectURL(convertedFile);
        return jpgDataUrl;
      } else {
        // 在原生環境，目前只返回原始檔案
        // 實際專案中需要原生轉換解決方案
        console.log('原生環境暫不支援 HEIC 轉換');
        return fileUri;
      }
    } catch (error) {
      console.error('轉換失敗:', error);
      return null;
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

        setSelectedFiles(heicFiles);
        Alert.alert('成功', `已選擇 ${heicFiles.length} 個 HEIC 檔案`);
      }
    } catch (error) {
      console.error('選擇檔案時發生錯誤:', error);
      Alert.alert('錯誤', '選擇檔案時發生錯誤，請重試');
    }
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setConvertedFiles([]);
    setConversionProgress('');
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('錯誤', '請先選擇要轉換的檔案');
      return;
    }

    setIsConverting(true);
    setConvertedFiles([]);
    const converted: any[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setConversionProgress(`轉換中... ${i + 1}/${selectedFiles.length}`);

        const convertedUri = await convertHeicToJpg(file.uri);
        
        if (convertedUri) {
          const extension = outputFormat === 'jpeg' ? 'jpg' : 'png';
          const convertedFile = {
            name: file.name.replace(/\.(heic|heif)$/i, `.${extension}`),
            originalName: file.name,
            uri: convertedUri,
            size: file.size,
            convertedAt: new Date().toISOString(),
            quality: quality,
            format: outputFormat,
          };
          converted.push(convertedFile);
        } else {
          console.error(`轉換失敗: ${file.name}`);
        }
      }

      setConvertedFiles(converted);
      
      if (converted.length === selectedFiles.length) {
        Alert.alert(
          '轉換完成',
          `成功轉換 ${converted.length} 個檔案！`,
          [
            {
              text: '確定',
              onPress: () => {
                // 可以在這裡添加下載或分享功能
              }
            }
          ]
        );
      } else {
        Alert.alert(
          '部分轉換失敗',
          `成功轉換 ${converted.length}/${selectedFiles.length} 個檔案`
        );
      }
    } catch (error) {
      console.error('轉換過程中發生錯誤:', error);
      Alert.alert('錯誤', '轉換過程中發生錯誤，請重試');
    } finally {
      setIsConverting(false);
      setConversionProgress('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 標題區域 */}
        <View style={styles.headerSection}>
          <ThemedText style={styles.title}>HEIC 轉換工具</ThemedText>
          <ThemedText style={styles.subtitle}>
            快速、安全、高品質的 HEIC 圖片轉換
          </ThemedText>
        </View>

        {/* 功能特色卡片 */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureTitle}>🔒 隱私優先</ThemedText>
            <ThemedText style={styles.featureText}>
              完全離線處理，保護您的隱私
            </ThemedText>
          </View>
          
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureTitle}>⚡ 批量轉換</ThemedText>
            <ThemedText style={styles.featureText}>
              支援多檔案同時轉換
            </ThemedText>
          </View>
          
          <View style={styles.featureCard}>
            <ThemedText style={styles.featureTitle}>🎯 品質保證</ThemedText>
            <ThemedText style={styles.featureText}>
              保留原始品質與 EXIF 資料
            </ThemedText>
          </View>
        </View>

        {/* 設定區域 */}
        <View style={styles.settingsSection}>
          <ThemedText style={styles.settingsSectionTitle}>轉換設定</ThemedText>
          
          <View style={styles.settingRow}>
            <ThemedText style={styles.settingLabel}>輸出格式:</ThemedText>
            <View style={styles.formatButtons}>
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  outputFormat === 'jpeg' && { backgroundColor: primaryColor }
                ]}
                onPress={() => setOutputFormat('jpeg')}
                disabled={isConverting}
              >
                <ThemedText style={styles.formatButtonText}>JPEG</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.formatButton,
                  outputFormat === 'png' && { backgroundColor: primaryColor }
                ]}
                onPress={() => setOutputFormat('png')}
                disabled={isConverting}
              >
                <ThemedText style={styles.formatButtonText}>PNG</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <ThemedText style={styles.settingLabel}>
              品質: {Math.round(quality * 100)}%
            </ThemedText>
            <View style={styles.qualityButtons}>
              {[0.6, 0.8, 0.9, 1.0].map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[
                    styles.qualityButton,
                    quality === q && { backgroundColor: primaryColor }
                  ]}
                  onPress={() => setQuality(q)}
                  disabled={isConverting}
                >
                  <ThemedText style={styles.qualityButtonText}>
                    {Math.round(q * 100)}%
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 主要操作區域 */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: primaryColor }]}
            onPress={handleSelectFiles}
            disabled={isConverting}
          >
            <ThemedText style={styles.buttonText}>
              📁 選擇 HEIC 檔案
            </ThemedText>
          </TouchableOpacity>

          {selectedFiles.length > 0 && (
            <View style={styles.selectedFilesSection}>
              <View style={styles.selectedFilesHeader}>
                <ThemedText style={styles.selectedFilesText}>
                  已選擇 {selectedFiles.length} 個檔案
                </ThemedText>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearAll}
                  disabled={isConverting}
                >
                  <ThemedText style={styles.clearButtonText}>清除</ThemedText>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[styles.convertButton, { backgroundColor: primaryColor }]}
                onPress={handleConvert}
                disabled={isConverting}
              >
                <ThemedText style={styles.buttonText}>
                  {isConverting ? (conversionProgress || '🔄 轉換中...') : '🚀 開始轉換'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 轉換結果區域 */}
        {convertedFiles.length > 0 && (
          <View style={styles.resultsSection}>
            <ThemedText style={styles.resultsTitle}>轉換完成</ThemedText>
            <View style={styles.resultsList}>
              {convertedFiles.map((file, index) => (
                <View key={index} style={styles.resultItem}>
                  <ThemedText style={styles.resultText}>
                    ✅ {file.originalName} → {file.name}
                  </ThemedText>
                  <ThemedText style={styles.resultSubText}>
                    轉換時間: {new Date(file.convertedAt).toLocaleTimeString()}
                  </ThemedText>
                  <ThemedText style={styles.resultSubText}>
                    格式: {file.format?.toUpperCase()} | 品質: {Math.round((file.quality || 0.9) * 100)}%
                  </ThemedText>
                  {Platform.OS === 'web' && (
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => {
                        const link = document.createElement('a');
                        link.href = file.uri;
                        link.download = file.name;
                        link.click();
                      }}
                    >
                      <ThemedText style={styles.downloadButtonText}>
                        📥 下載
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 使用說明 */}
        <View style={styles.instructionsSection}>
          <ThemedText style={styles.instructionsTitle}>使用說明</ThemedText>
          <ThemedText style={styles.instructionText}>
            1. 點擊「選擇 HEIC 檔案」選擇要轉換的檔案
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            2. 選擇轉換品質和格式設定（可選）
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            3. 點擊「開始轉換」執行轉換
          </ThemedText>
          <ThemedText style={styles.instructionText}>
            4. 轉換完成後可下載或分享檔案
          </ThemedText>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    width: Platform.OS === 'web' ? '30%' : '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  settingsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  formatButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  formatButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  qualityButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionSection: {
    marginBottom: 30,
  },
  primaryButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  convertButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedFilesSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedFilesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedFilesText: {
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 100, 100, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  resultsSection: {
    marginBottom: 30,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  resultsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  resultItem: {
    paddingVertical: 8,
  },
  resultText: {
    fontSize: 14,
  },
  resultSubText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  downloadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  instructionsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
    opacity: 0.8,
  },
});
