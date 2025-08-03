import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ProgressBar } from './ProgressBar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Typography, BorderRadius, Spacing } from '@/constants/NewColors';

const { width, height } = Dimensions.get('window');

interface LoadingOverlayProps {
  visible: boolean;
  progress?: number;
  title?: string;
  subtitle?: string;
}

export function LoadingOverlay({
  visible,
  progress = 0,
  title = '處理中...',
  subtitle,
}: LoadingOverlayProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: fadeAnim,
          },
        ]}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <ThemedText style={styles.icon}>⏳</ThemedText>
            </View>
            
            <ThemedText style={[styles.title, { color: colors.textPrimary }]}>
              {title}
            </ThemedText>
            
            {subtitle && (
              <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </ThemedText>
            )}
            
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={progress}
                height={6}
                showGradient={false}
              />
              <ThemedText style={[styles.progressText, { color: colors.textTertiary }]}>
                {Math.round(progress * 100)}%
              </ThemedText>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    margin: Spacing.xl,
    minWidth: 280,
    maxWidth: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    ...Typography.h5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  progressContainer: {
    width: '100%',
  },
  progressText: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});