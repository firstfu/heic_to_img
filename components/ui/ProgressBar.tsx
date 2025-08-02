import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors } from '@/constants/NewColors';

interface ProgressBarProps {
  progress: number; // 0-1
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
  showGradient?: boolean;
}

export function ProgressBar({
  progress,
  height = 8,
  style,
  animated = true,
  showGradient = true,
}: ProgressBarProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      animatedProgress.setValue(progress);
    }
  }, [progress, animated, animatedProgress]);

  const progressBarStyles = [
    styles.container,
    {
      height,
      backgroundColor: colors.surface,
      borderRadius: height / 2,
    },
    style,
  ];

  const progressFillStyles = [
    styles.fill,
    {
      borderRadius: height / 2,
    },
  ];

  return (
    <View style={progressBarStyles}>
      <Animated.View
        style={[
          progressFillStyles,
          {
            width: animatedProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {showGradient ? (
          <LinearGradient
            colors={colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: height / 2 }]}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.primary,
                borderRadius: height / 2,
              },
            ]}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});