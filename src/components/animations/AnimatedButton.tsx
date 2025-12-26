/**
 * AnimatedButton - Button with press feedback animation
 * Provides scale and opacity feedback on press
 */

import React, {useRef, useCallback} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  activeOpacity?: number;
  accessibilityLabel?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  style,
  activeScale = 0.96,
  activeOpacity = 0.8,
  accessibilityLabel,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: activeScale,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacityAnim, {
        toValue: activeOpacity,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, activeScale, activeOpacity]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled}}>
      <Animated.View
        style={[
          style,
          {
            transform: [{scale: scaleAnim}],
            opacity: disabled ? 0.5 : opacityAnim,
          },
        ]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedButton;
