/**
 * SuccessCheckmark - Animated success indicator
 * Circle draws then checkmark appears with satisfying animation
 */

import React, {useRef, useEffect, useCallback} from 'react';
import {Animated, StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SuccessCheckmarkProps {
  size?: number;
  color?: string;
  message?: string;
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  size = 80,
  color,
  message,
  autoPlay = true,
  onAnimationComplete,
  style,
}) => {
  const theme = useTheme();
  const successColor = color || '#4CAF50';

  const circleScaleAnim = useRef(new Animated.Value(0)).current;
  const checkScaleAnim = useRef(new Animated.Value(0)).current;
  const checkOpacityAnim = useRef(new Animated.Value(0)).current;
  const messageOpacityAnim = useRef(new Animated.Value(0)).current;

  const playAnimation = useCallback(() => {
    // Reset animations
    circleScaleAnim.setValue(0);
    checkScaleAnim.setValue(0);
    checkOpacityAnim.setValue(0);
    messageOpacityAnim.setValue(0);

    Animated.sequence([
      // Circle pops in
      Animated.spring(circleScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Checkmark appears with bounce
      Animated.parallel([
        Animated.spring(checkScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Message fades in
      Animated.timing(messageOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete?.();
    });
  }, [
    circleScaleAnim,
    checkScaleAnim,
    checkOpacityAnim,
    messageOpacityAnim,
    onAnimationComplete,
  ]);

  useEffect(() => {
    if (autoPlay) {
      playAnimation();
    }
  }, [autoPlay, playAnimation]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: successColor,
            transform: [{scale: circleScaleAnim}],
          },
        ]}>
        <Animated.View
          style={{
            transform: [{scale: checkScaleAnim}],
            opacity: checkOpacityAnim,
          }}>
          <Icon name="check" size={size * 0.5} color="#ffffff" />
        </Animated.View>
      </Animated.View>
      {message && (
        <Animated.View style={{opacity: messageOpacityAnim}}>
          <Text style={[styles.message, {color: theme.colors.onSurface}]}>
            {message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

/**
 * ErrorCross - Animated error indicator
 */
interface ErrorCrossProps {
  size?: number;
  color?: string;
  message?: string;
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ErrorCross: React.FC<ErrorCrossProps> = ({
  size = 80,
  color,
  message,
  autoPlay = true,
  onAnimationComplete,
  style,
}) => {
  const theme = useTheme();
  const errorColor = color || '#F44336';

  const circleScaleAnim = useRef(new Animated.Value(0)).current;
  const crossScaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const messageOpacityAnim = useRef(new Animated.Value(0)).current;

  const playAnimation = useCallback(() => {
    circleScaleAnim.setValue(0);
    crossScaleAnim.setValue(0);
    shakeAnim.setValue(0);
    messageOpacityAnim.setValue(0);

    Animated.sequence([
      // Circle pops in
      Animated.spring(circleScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Cross appears
      Animated.spring(crossScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      // Message fades in
      Animated.timing(messageOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete?.();
    });
  }, [circleScaleAnim, crossScaleAnim, shakeAnim, messageOpacityAnim, onAnimationComplete]);

  useEffect(() => {
    if (autoPlay) {
      playAnimation();
    }
  }, [autoPlay, playAnimation]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: errorColor,
            transform: [
              {scale: circleScaleAnim},
              {translateX: shakeAnim},
            ],
          },
        ]}>
        <Animated.View style={{transform: [{scale: crossScaleAnim}]}}>
          <Icon name="close" size={size * 0.5} color="#ffffff" />
        </Animated.View>
      </Animated.View>
      {message && (
        <Animated.View style={{opacity: messageOpacityAnim}}>
          <Text style={[styles.message, {color: theme.colors.onSurface}]}>
            {message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SuccessCheckmark;
