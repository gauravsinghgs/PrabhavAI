/**
 * LoadingSpinner - Animated loading indicator
 * Smooth rotation animation for loading states
 */

import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import {useTheme} from 'react-native-paper';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const SIZES = {
  small: 24,
  medium: 40,
  large: 60,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  style,
}) => {
  const theme = useTheme();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinnerColor = color || theme.colors.primary;
  const spinnerSize = SIZES[size];

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            borderColor: spinnerColor,
            borderTopColor: 'transparent',
            transform: [{rotate: spin}],
          },
        ]}
      />
    </View>
  );
};

/**
 * PulsingDot - Animated pulsing dot for subtle loading indicators
 */
interface PulsingDotProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const PulsingDot: React.FC<PulsingDotProps> = ({
  size = 12,
  color,
  style,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const dotColor = color || theme.colors.primary;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dotColor,
          transform: [{scale: scaleAnim}],
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

/**
 * DotsLoader - Three bouncing dots loader
 */
interface DotsLoaderProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({
  size = 10,
  color,
  style,
}) => {
  const theme = useTheme();
  const dotColor = color || theme.colors.primary;

  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createBounce = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -size,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600 - delay),
        ]),
      );
    };

    const anim1 = createBounce(dot1Anim, 0);
    const anim2 = createBounce(dot2Anim, 150);
    const anim3 = createBounce(dot3Anim, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1Anim, dot2Anim, dot3Anim, size]);

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: dotColor,
    marginHorizontal: size / 3,
  };

  return (
    <View style={[styles.dotsContainer, style]}>
      <Animated.View
        style={[dotStyle, {transform: [{translateY: dot1Anim}]}]}
      />
      <Animated.View
        style={[dotStyle, {transform: [{translateY: dot2Anim}]}]}
      />
      <Animated.View
        style={[dotStyle, {transform: [{translateY: dot3Anim}]}]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderWidth: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingSpinner;
