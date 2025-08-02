import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();

      return () => rotateAnimation.stop();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim, rotateAnim]);

  if (!visible) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
            backgroundColor: colors.background + 'E6',
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              colors.primary + '20',
              colors.secondary + '10',
              'transparent'
            ]}
            style={styles.backgroundGradient}
          />
          
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.primary + '20',
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <ThemedText style={styles.icon}>🔄</ThemedText>
            </Animated.View>
            
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
                showGradient
              />
              <ThemedText style={[styles.progressText, { color: colors.textTertiary }]}>
                {Math.round(progress * 100)}%
              </ThemedText>
            </View>
          </View>
        </Animated.View>
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
    borderRadius: BorderRadius.xl,
    margin: Spacing.xl,
    minWidth: 280,
    maxWidth: width * 0.8,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  content: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
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