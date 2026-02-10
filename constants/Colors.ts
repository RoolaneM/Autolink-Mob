export const Colors = {
  primary: '#FF6B35', // Laranja vibrante
  primaryDark: '#E55A2B',
  primaryLight: '#FF8A5C',
  
  secondary: '#2C3E50', // Azul escuro
  secondaryLight: '#34495E',
  
  background: '#F8F9FA',
  surface: '#FFFFFF',
  
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#95A5A6',
  
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  
  border: '#E0E0E0',
  divider: '#ECEFF1',
  
  favorite: '#E74C3C',
  
  // Gradients
  gradientPrimary: ['#FF6B35', '#FF8A5C'],
  gradientDark: ['#2C3E50', '#34495E'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};