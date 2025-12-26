/**
 * StreakFlame - Animated streak fire indicator
 * Shows current streak with flame animation
 */

import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StreakFlameProps {
  streak: number;
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SIZES = {
  small: {iconSize: 20, fontSize: 14},
  medium: {iconSize: 32, fontSize: 20},
  large: {iconSize: 48, fontSize: 28},
};

export const StreakFlame: React.FC<StreakFlameProps> = ({
  streak,
  isActive = true,
  size = 'medium',
  showLabel = false,
  style,
}) => {
  const theme = useTheme();
  const {iconSize, fontSize} = SIZES[size];

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const flickerAnim = useRef(new Animated.Value(0)).current;

  // Flame flicker animation
  useEffect(() => {
    if (!isActive) {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0.4);
      return undefined;
    }

    // Continuous flicker effect
    const flickerAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0.5,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    flickerAnimation.start();

    return () => flickerAnimation.stop();
  }, [isActive, scaleAnim, flickerAnim, opacityAnim]);

  const flameColor = isActive ? '#FF6B35' : '#9E9E9E';
  const textColor = isActive ? '#FF6B35' : theme.colors.onSurfaceVariant;

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.flameContainer,
          {
            transform: [{scale: scaleAnim}],
            opacity: opacityAnim,
          },
        ]}>
        <Icon name="fire" size={iconSize} color={flameColor} />
      </Animated.View>
      <Text style={[styles.streakNumber, {fontSize, color: textColor}]}>
        {streak}
      </Text>
      {showLabel && (
        <Text style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
          day streak
        </Text>
      )}
    </View>
  );
};

/**
 * StreakCalendar - Week view of streak activity
 */
interface StreakCalendarProps {
  streakHistory: Array<{date: string; completed: boolean}>;
  style?: StyleProp<ViewStyle>;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  streakHistory,
  style,
}) => {
  const theme = useTheme();
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get last 7 days
  const lastWeek = streakHistory.slice(-7);

  // Pad if less than 7 days
  while (lastWeek.length < 7) {
    lastWeek.unshift({date: '', completed: false});
  }

  return (
    <View style={[styles.calendarContainer, style]}>
      {lastWeek.map((day, index) => (
        <View key={index} style={styles.dayColumn}>
          <Text style={[styles.dayLabel, {color: theme.colors.onSurfaceVariant}]}>
            {dayLabels[index]}
          </Text>
          <View
            style={[
              styles.dayDot,
              {
                backgroundColor: day.completed
                  ? '#FF6B35'
                  : theme.colors.surfaceVariant,
              },
            ]}>
            {day.completed && (
              <Icon name="check" size={12} color="#ffffff" />
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * StreakMilestone - Animated milestone celebration
 */
interface StreakMilestoneProps {
  milestone: number;
  onComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StreakMilestone: React.FC<StreakMilestoneProps> = ({
  milestone,
  onComplete,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const flameScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Pop in
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      // Flame pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameScale, {
            toValue: 1.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(flameScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        {iterations: 3},
      ),
    ]).start(() => {
      onComplete?.();
    });
  }, [scaleAnim, rotateAnim, flameScale, onComplete]);

  return (
    <Animated.View
      style={[
        styles.milestoneContainer,
        {transform: [{scale: scaleAnim}]},
        style,
      ]}>
      <Animated.View style={{transform: [{scale: flameScale}]}}>
        <Icon name="fire" size={64} color="#FF6B35" />
      </Animated.View>
      <Text style={styles.milestoneNumber}>{milestone}</Text>
      <Text style={styles.milestoneLabel}>Day Streak!</Text>
      <Text style={styles.milestoneSubtext}>Keep it going!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameContainer: {
    marginRight: 4,
  },
  streakNumber: {
    fontWeight: 'bold',
  },
  label: {
    marginLeft: 4,
    fontSize: 12,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  milestoneNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 8,
  },
  milestoneLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E65100',
  },
  milestoneSubtext: {
    fontSize: 14,
    color: '#FF8A65',
    marginTop: 4,
  },
});

export default StreakFlame;
