import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Text, Button, TextInput, RadioButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from '@app-types/navigation';
import {StepIndicator} from '@components/onboarding';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProfileBasic'>;

const colors = {
  primary: '#1a237e',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  divider: '#e0e0e0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

const genderOptions: {value: Gender; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'other', label: 'Other'},
  {value: 'prefer_not_to_say', label: 'Prefer not to say'},
];

export const ProfileBasicScreen: React.FC<Props> = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDateChange = useCallback(
    (event: any, selectedDate?: Date) => {
      setShowDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
        setDateOfBirth(selectedDate);
      }
    },
    [],
  );

  const handleContinue = useCallback(() => {
    // Save data and navigate to next screen
    navigation.navigate('Education');
  }, [navigation]);

  const handleSkip = useCallback(() => {
    navigation.navigate('Education');
  }, [navigation]);

  const handlePhotoPress = useCallback(() => {
    // TODO: Implement image picker
    console.log('Photo picker pressed');
  }, []);

  const isFormValid = fullName.trim().length >= 2;

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16); // Minimum 16 years old

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 60); // Maximum 60 years old

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator currentStep={1} totalSteps={5} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            onPress={handlePhotoPress}
            style={styles.photoContainer}
            accessibilityRole="button"
            accessibilityLabel="Add profile photo"
            accessibilityHint="Tap to select a profile photo">
            <View style={styles.photoPlaceholder}>
              <Icon name="camera" size={32} color={colors.textSecondary} />
            </View>
            <View style={styles.photoBadge}>
              <Icon name="plus" size={16} color={colors.surface} />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Add your photo</Text>
        </View>

        {/* Full Name */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            mode="outlined"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            style={styles.textInput}
            outlineColor={colors.divider}
            activeOutlineColor={colors.primary}
            accessibilityLabel="Full name input"
          />
        </View>

        {/* Gender */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group
            onValueChange={value => setGender(value as Gender)}
            value={gender || ''}>
            <View style={styles.radioGroup}>
              {genderOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radioItem,
                    gender === option.value && styles.radioItemSelected,
                  ]}
                  onPress={() => setGender(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{checked: gender === option.value}}
                  accessibilityLabel={option.label}>
                  <RadioButton.Android
                    value={option.value}
                    color={colors.primary}
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      gender === option.value && styles.radioLabelSelected,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </RadioButton.Group>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Select date of birth"
            accessibilityHint="Opens a date picker">
            <Icon
              name="calendar"
              size={20}
              color={colors.textSecondary}
              style={styles.dateIcon}
            />
            <Text
              style={[
                styles.dateText,
                !dateOfBirth && styles.datePlaceholder,
              ]}>
              {dateOfBirth ? formatDate(dateOfBirth) : 'Select your birth date'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth || maxDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={maxDate}
            minimumDate={minDate}
          />
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!isFormValid}
          style={[
            styles.continueButton,
            !isFormValid && styles.continueButtonDisabled,
          ]}
          contentStyle={styles.continueButtonContent}
          labelStyle={styles.continueButtonLabel}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
          accessibilityState={{disabled: !isFormValid}}>
          Continue
        </Button>

        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityRole="button"
          accessibilityLabel="Skip for now"
          accessibilityHint="Skip this step and continue">
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  photoContainer: {
    position: 'relative',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.divider,
    borderStyle: 'dashed',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    minHeight: 48,
  },
  radioItemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  radioLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  radioLabelSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    height: 56,
    paddingHorizontal: spacing.md,
  },
  dateIcon: {
    marginRight: spacing.sm,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  datePlaceholder: {
    color: colors.textSecondary,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  continueButtonDisabled: {
    backgroundColor: colors.divider,
  },
  continueButtonContent: {
    height: 52,
  },
  continueButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

export default ProfileBasicScreen;
