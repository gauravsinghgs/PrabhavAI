import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const colors = {
  primary: '#1a237e',
  background: '#f5f5f5',
  divider: '#e0e0e0',
  textSecondary: '#757575',
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}
      accessibilityValue={{min: 1, max: totalSteps, now: currentStep}}>
      <View style={styles.dotsContainer}>
        {Array.from({length: totalSteps}, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index + 1 <= currentStep ? styles.dotActive : styles.dotInactive,
              index + 1 === currentStep && styles.dotCurrent,
            ]}
          />
        ))}
      </View>
      <Text style={styles.stepText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  dotInactive: {
    backgroundColor: colors.divider,
  },
  dotCurrent: {
    width: 24,
    borderRadius: 4,
  },
  stepText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default StepIndicator;
