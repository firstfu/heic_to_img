/**
 * 2025 年設計趨勢色彩系統
 * 基於現代化設計語言，支援明暗主題
 */

export const NewColors = {
  light: {
    // 主色調 - 採用漸變紫藍色系
    primary: '#6366F1',      // Indigo-500
    primaryHover: '#5B5BD6',
    primaryGradient: ['#8B5CF6', '#6366F1'], // Purple-500 to Indigo-500
    secondary: '#F59E0B',    // Amber-500
    accent: '#EC4899',       // Pink-500
    
    // 背景層次
    background: '#FFFFFF',
    surface: '#F8FAFC',      // Slate-50
    surfaceElevated: '#F1F5F9', // Slate-100
    surfaceHover: '#E2E8F0', // Slate-200
    
    // 文字顏色
    textPrimary: '#0F172A',  // Slate-900
    textSecondary: '#475569', // Slate-600
    textTertiary: '#94A3B8',  // Slate-400
    textInverse: '#FFFFFF',
    
    // 狀態顏色
    success: '#10B981',      // Emerald-500
    successBg: '#D1FAE5',    // Emerald-100
    warning: '#F59E0B',      // Amber-500
    warningBg: '#FEF3C7',    // Amber-100
    error: '#EF4444',        // Red-500
    errorBg: '#FEE2E2',      // Red-100
    info: '#3B82F6',         // Blue-500
    infoBg: '#DBEAFE',       // Blue-100
    
    // 邊框與分隔線
    border: '#E2E8F0',       // Slate-200
    borderSubtle: '#F1F5F9', // Slate-100
    borderFocus: '#6366F1',  // Indigo-500
    
    // 陰影
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowMedium: 'rgba(0, 0, 0, 0.15)',
    shadowLarge: 'rgba(0, 0, 0, 0.2)',
  },
  dark: {
    primary: '#818CF8',      // Indigo-400
    primaryHover: '#A5B4FC',
    primaryGradient: ['#A78BFA', '#818CF8'], // Purple-400 to Indigo-400
    secondary: '#FBBF24',    // Amber-400
    accent: '#F472B6',       // Pink-400
    
    background: '#0F172A',   // Slate-900
    surface: '#1E293B',      // Slate-800
    surfaceElevated: '#334155', // Slate-700
    surfaceHover: '#475569', // Slate-600
    
    textPrimary: '#F8FAFC',  // Slate-50
    textSecondary: '#CBD5E1', // Slate-300
    textTertiary: '#64748B',  // Slate-500
    textInverse: '#0F172A',
    
    success: '#34D399',      // Emerald-400
    successBg: '#064E3B',    // Emerald-900
    warning: '#FBBF24',      // Amber-400
    warningBg: '#78350F',    // Amber-900
    error: '#F87171',        // Red-400
    errorBg: '#7F1D1D',      // Red-900
    info: '#60A5FA',         // Blue-400
    infoBg: '#1E3A8A',       // Blue-900
    
    border: '#334155',       // Slate-700
    borderSubtle: '#1E293B', // Slate-800
    borderFocus: '#818CF8',  // Indigo-400
    
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowMedium: 'rgba(0, 0, 0, 0.4)',
    shadowLarge: 'rgba(0, 0, 0, 0.5)',
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
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
};