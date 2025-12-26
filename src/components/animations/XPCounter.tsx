/**
 * XPCounter - Animated XP display with counting animation
 * Shows XP increasing with satisfying number roll effect
 */

import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface XPCounterProps {
  value: number;
  previousValue?: number;
  duration?: number;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
  onCountComplete?: () => void;
}

const SIZES = {
  small: {fontSize: 14, iconSize: 16},
  medium: {fontSize: 20, iconSize: 24},
  large: {fontSize: 32, iconSize: 36},
};

export const XPCounter: React.FC<XPCounterProps> = ({
  value,
  previousValue = 0,
  duration = 1500,
  showIcon = true,
  showLabel = false,
  size = 'medium',
  color,
  style,
  onCountComplete,
}) => {
  const theme = useTheme();
  const xpColor = color || theme.colors.secondary;
  const [displayValue, setDisplayValue] = useState(previousValue);
  const animatedValue = useRef(new Animated.Value(previousValue)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const {fontSize, iconSize} = SIZES[size];

  useEffect(() => {
    // Animate the number counting
    animatedValue.setValue(previousValue);

    const listener = animatedValue.addListener(({value: val}) => {
      setDisplayValue(Math.floor(val));
    });

    // Scale pulse when counting
    const countAnimation = Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false, // Can't use native driver for value interpolation
    });

    const pulseAnimation = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]);

    Animated.parallel([countAnimation, pulseAnimation]).start(() => {
      onCountComplete?.();
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, previousValue, duration, animatedValue, scaleAnim, onCountComplete]);

  return (
    <Animated.View
      style={[styles.container, {transform: [{scale: scaleAnim}]}, style]}>
      {showIcon && (
        <Icon
          name="star-four-points"
          size={iconSize}
          color={xpColor}
          style={styles.icon}
        />
      )}
      <Text style={[styles.value, {fontSize, color: xpColor}]}>
        {displayValue.toLocaleString()}
      </Text>
      {showLabel && (
        <Text style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
          XP
        </Text>
      )}
    </Animated.View>
  );
};

/**
 * XPGain - Animated XP gain indicator that floats up
 */
interface XPGainProps {
  amount: number;
  onComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const XPGain: React.FC<XPGainProps> = ({amount, onComplete, style}) => {
  const theme = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Pop in
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
      // Float up and fade out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete?.();
    });
  }, [translateY, opacity, scale, onComplete]);

  return (
    <Animated.View
      style={[
        styles.xpGainContainer,
        {
          transform: [{translateY}, {scale}],
          opacity,
        },
        style,
      ]}>
      <Icon name="star-four-points" size={20} color={theme.colors.secondary} />
      <Text style={[styles.xpGainText, {color: theme.colors.secondary}]}>
        +{amount}
      </Text>
    </Animated.View>
  );
};

/**
 * LevelUpBadge - Animated level up indicator
 */
interface LevelUpBadgeProps {
  level: number;
  levelName: string;
  onComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const LevelUpBadge: React.FC<LevelUpBadgeProps> = ({
  level,
  levelName,
  onComplete,
  style,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Pop in with rotation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Glow pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        {iterations: 3},
      ),
    ]).start(() => {
      onComplete?.();
    });
  }, [scaleAnim, rotateAnim, glowAnim, onComplete]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        styles.levelUpContainer,
        {
          transform: [{scale: scaleAnim}, {rotate: rotation}],
          backgroundColor: theme.colors.primary,
        },
        style,
      ]}>
      <Icon name="arrow-up-bold-circle" size={32} color="#FFD700" />
      <Text style={styles.levelUpTitle}>LEVEL UP!</Text>
      <Text style={styles.levelNumber}>{level}</Text>
      <Text style={styles.levelName}>{levelName}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  value: {
    fontWeight: 'bold',
  },
  label: {
    marginLeft: 4,
    fontSize: 12,
  },
  xpGainContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  xpGainText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  levelUpContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  levelUpTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    letterSpacing: 2,
  },
  levelNumber: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  levelName: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
  },
});

export default XPCounter;
