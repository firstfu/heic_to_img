/**
 * 2025 年設計趨勢色彩系統
 * 基於現代化設計語言，支援明暗主題
 */

export const NewColors = {
  light: {
    // 主色調 - 科技感電光藍系統
    primary: '#007AFF',      // iOS 系統藍
    primaryHover: '#0056CC', // 較深的藍
    primaryLight: '#4DA6FF', // 較亮的藍
    primaryGradient: ['#007AFF', '#00C7FF'], // 電光藍漸層
    primaryGradientLight: ['#B3E5FF', '#E6F7FF'], // 淺色漸變
    
    // 輔助色調 - 科技感強調色
    secondary: '#FF9500',    // iOS 橙色
    secondaryLight: '#FFD580', // 淺橙色
    accent: '#00FF88',       // 螢光綠強調色
    accentLight: '#80FFCC',  // 淺螢光綠
    
    // 科技感特殊色調
    teal: '#5AC8FA',         // iOS 淺藍
    tealLight: '#A6E8FF',    // 極淺藍
    emerald: '#30D158',      // iOS 綠
    emeraldLight: '#88E5A3', // 淺綠
    neon: '#00FF88',         // 螢光綠
    electric: '#00C7FF',     // 電光藍
    metal: '#8E8E93',        // 金屬銀
    
    // 背景層次 - 科技感淺色調
    background: '#F8FAFF',   // 極淺科技藍
    backgroundSubtle: '#F2F6FE', // 淺藍灰
    surface: '#EBF4FF',      // 科技藍調表面
    surfaceElevated: '#E1EFFF', // 提升表面
    surfaceHover: '#D1E4FF', // 懸停表面
    surfaceAccent: '#E6F1FF', // 強調表面
    surfaceGlass: 'rgba(235, 244, 255, 0.6)', // 玻璃擬態
    surfaceGlassBorder: 'rgba(0, 122, 255, 0.15)', // 玻璃邊框
    
    // 文字顏色 - 更好的層次
    textPrimary: '#0F172A',  // Slate-900
    textSecondary: '#374151', // Gray-700 (稍微溫暖一些)
    textTertiary: '#6B7280', // Gray-500
    textQuaternary: '#9CA3AF', // Gray-400 (第四層級)
    textInverse: '#FFFFFF',
    
    // 狀態顏色 - 更鮮明的對比
    success: '#059669',      // Emerald-600
    successBg: '#D1FAE5',    // Emerald-100
    successLight: '#A7F3D0', // Emerald-200
    warning: '#D97706',      // Amber-600
    warningBg: '#FEF3C7',    // Amber-100
    warningLight: '#FDE68A', // Amber-200
    error: '#DC2626',        // Red-600
    errorBg: '#FEE2E2',      // Red-100
    errorLight: '#FCA5A5',   // Red-300
    info: '#2563EB',         // Blue-600
    infoBg: '#DBEAFE',       // Blue-100
    infoLight: '#93C5FD',    // Blue-300
    
    // 邊框與分隔線 - 更細膩的層次
    border: '#E5E7EB',       // Gray-200
    borderSubtle: '#F3F4F6', // Gray-100
    borderFocus: '#4F46E5',  // Indigo-600
    borderAccent: '#C7D2FE', // Indigo-200
    
    // 陰影 - 科技感陰影系統
    shadow: 'rgba(0, 122, 255, 0.08)',
    shadowMedium: 'rgba(0, 122, 255, 0.12)',
    shadowLarge: 'rgba(0, 122, 255, 0.16)',
    shadowColored: 'rgba(0, 122, 255, 0.25)', // 藍色科技陰影
    shadowElevated: 'rgba(0, 122, 255, 0.20)',
    shadowGlow: 'rgba(0, 255, 136, 0.3)', // 螢光綠發光效果
    shadowNeon: 'rgba(0, 199, 255, 0.4)', // 電光藍發光效果
  },
  dark: {
    // 主色調 - 深空科技藍系統
    primary: '#0A84FF',      // iOS 暗色模式系統藍
    primaryHover: '#409CFF', // 較亮的藍
    primaryLight: '#64B5F6', // 明亮藍
    primaryGradient: ['#0A84FF', '#00D4FF'], // 深空電光藍漸層
    primaryGradientLight: ['#4DA6FF', '#80CAFF'], // 明亮漸變
    
    // 輔助色調 - 暗色模式科技感強調
    secondary: '#FF9F0A',    // iOS 暗色橙
    secondaryLight: '#FFB84D', // 明亮橙
    accent: '#32D74B',       // iOS 暗色綠
    accentLight: '#66E85C',  // 明亮綠
    
    // 深空科技感特殊色調
    teal: '#5AC8FA',         // iOS 深藍
    tealLight: '#7AE3FF',    // 明亮藍
    emerald: '#32D74B',      // iOS 深綠
    emeraldLight: '#6EE368', // 明亮綠
    neon: '#32D74B',         // 深空螢光綠
    electric: '#00D4FF',     // 深空電光藍
    metal: '#98989D',        // 深色金屬銀
    
    // 背景層次 - 深空科技調色
    background: '#0A0F1C',   // 深空藍背景
    backgroundSubtle: '#0F1419', // 深藍灰
    surface: '#1A1F2E',      // 深藍表面
    surfaceElevated: '#242B3D', // 提升深藍表面
    surfaceHover: '#2A3241', // 懸停深藍表面
    surfaceAccent: '#1E2738', // 強調深藍表面
    surfaceGlass: 'rgba(26, 31, 46, 0.6)', // 深色玻璃擬態
    surfaceGlassBorder: 'rgba(138, 180, 248, 0.15)', // 深色玻璃邊框
    
    // 文字顏色 - 更好的對比
    textPrimary: '#F8FAFC',  // Slate-50
    textSecondary: '#E2E8F0', // Slate-200
    textTertiary: '#94A3B8', // Slate-400
    textQuaternary: '#64748B', // Slate-500
    textInverse: '#0F172A',  // Slate-900
    
    // 狀態顏色 - 暗主題中更明亮
    success: '#10B981',      // Emerald-500
    successBg: '#064E3B',    // Emerald-900
    successLight: '#A7F3D0', // Emerald-200
    warning: '#F59E0B',      // Amber-500
    warningBg: '#78350F',    // Amber-900
    warningLight: '#FDE68A', // Amber-200
    error: '#EF4444',        // Red-500
    errorBg: '#7F1D1D',      // Red-900
    errorLight: '#FCA5A5',   // Red-300
    info: '#3B82F6',         // Blue-500
    infoBg: '#1E3A8A',       // Blue-900
    infoLight: '#93C5FD',    // Blue-300
    
    // 邊框與分隔線 - 暗主題中的邊框
    border: '#374151',       // Gray-700
    borderSubtle: '#1F2937', // Gray-800
    borderFocus: '#6366F1',  // Indigo-500
    borderAccent: '#6366F1', // Indigo-500
    
    // 陰影 - 深空科技陰影效果
    shadow: 'rgba(10, 132, 255, 0.15)',
    shadowMedium: 'rgba(10, 132, 255, 0.25)',
    shadowLarge: 'rgba(10, 132, 255, 0.35)',
    shadowColored: 'rgba(10, 132, 255, 0.4)', // 深空藍色陰影
    shadowElevated: 'rgba(0, 0, 0, 0.6)',
    shadowGlow: 'rgba(50, 215, 75, 0.5)', // 深空螢光綠發光
    shadowNeon: 'rgba(0, 212, 255, 0.6)', // 深空電光藍發光
  },
};

export const Typography = {
  // 大標題 - 使用更現代的字重
  h1: { 
    fontSize: 42, 
    fontWeight: '800' as const, 
    lineHeight: 48,
    letterSpacing: -0.02,
  },
  h2: { 
    fontSize: 36, 
    fontWeight: '700' as const, 
    lineHeight: 42,
    letterSpacing: -0.01,
  },
  h3: { 
    fontSize: 28, 
    fontWeight: '600' as const, 
    lineHeight: 36,
    letterSpacing: -0.01,
  },
  h4: { 
    fontSize: 24, 
    fontWeight: '600' as const, 
    lineHeight: 32,
  },
  h5: { 
    fontSize: 20, 
    fontWeight: '600' as const, 
    lineHeight: 28,
  },
  
  // 內文
  bodyLarge: { 
    fontSize: 18, 
    fontWeight: '400' as const, 
    lineHeight: 28,
  },
  body: { 
    fontSize: 16, 
    fontWeight: '400' as const, 
    lineHeight: 24,
  },
  bodySmall: { 
    fontSize: 14, 
    fontWeight: '400' as const, 
    lineHeight: 20,
  },
  caption: { 
    fontSize: 12, 
    fontWeight: '400' as const, 
    lineHeight: 16,
  },
  
  // 標籤與按鈕
  labelLarge: { 
    fontSize: 16, 
    fontWeight: '600' as const, 
    lineHeight: 20,
  },
  labelMedium: { 
    fontSize: 14, 
    fontWeight: '500' as const, 
    lineHeight: 18,
  },
  labelSmall: { 
    fontSize: 12, 
    fontWeight: '500' as const, 
    lineHeight: 16,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
    elevation: 8,
  },
  xxl: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 12,
  },
  // 科技感發光陰影
  glow: {
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  // 電光藍發光效果
  neon: {
    shadowColor: '#00C7FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 10,
  },
  // 玻璃擬態陰影
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 5,
  },
  // 內陰影效果
  inset: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 0,
  },
};