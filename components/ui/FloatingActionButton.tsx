import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NewColors, Shadows } from '@/constants/NewColors';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  text?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export function FloatingActionButton({
  onPress,
  icon = '➕',
  text,
  style,
  disabled = false,
}: FloatingActionButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isDark = useThemeColor({}, 'background') === '#151718';
  const colors = isDark ? NewColors.dark : NewColors.light;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const buttonStyles = [
    styles.fab,
    disabled && styles.disabled,
    style,
  ];

  return (
    <Animated.View
      style={[
        buttonStyles,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <LinearGradient
          colors={colors.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ThemedText style={[styles.icon, { color: colors.textInverse }]}>
            {icon}
          </ThemedText>
          {text && (
            <ThemedText style={[styles.text, { color: colors.textInverse }]}>
              {text}
            </ThemedText>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 28,
    ...Shadows.lg,
  },
  touchable: {
    borderRadius: 28,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 56,
    minHeight: 56,
  },
  icon: {
    fontSize: 20,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});