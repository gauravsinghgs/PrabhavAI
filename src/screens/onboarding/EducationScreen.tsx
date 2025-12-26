import React, {useState, useCallback} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Button, TextInput, Menu} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from '@app-types/navigation';
import {StepIndicator} from '@components/onboarding';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Education'>;

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

type CurrentStatus = 'student' | 'graduate' | 'working';

const branchOptions = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
  'Chemical',
  'Biotechnology',
  'MBA',
  'BBA',
  'Commerce',
  'Arts',
  'Other',
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({length: 9}, (_, i) => currentYear - 4 + i); // 2020-2028

const statusOptions: {value: CurrentStatus; label: string; icon: string}[] = [
  {value: 'student', label: 'Student', icon: 'school'},
  {value: 'graduate', label: 'Graduate', icon: 'account-school'},
  {value: 'working', label: 'Working', icon: 'briefcase'},
];

const popularColleges = [
  'IIT Delhi',
  'IIT Bombay',
  'IIT Madras',
  'NIT Trichy',
  'BITS Pilani',
  'VIT Vellore',
  'SRM Chennai',
  'Manipal University',
];

export const EducationScreen: React.FC<Props> = ({navigation}) => {
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null);

  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showYearMenu, setShowYearMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredColleges = popularColleges.filter(college =>
    college.toLowerCase().includes(collegeName.toLowerCase()),
  );

  const handleCollegeChange = useCallback((text: string) => {
    setCollegeName(text);
    setShowSuggestions(text.length > 0);
  }, []);

  const handleSelectCollege = useCallback((college: string) => {
    setCollegeName(college);
    setShowSuggestions(false);
  }, []);

  const handleContinue = useCallback(() => {
    navigation.navigate('Goals');
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isFormValid = collegeName.trim().length >= 2;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator currentStep={2} totalSteps={5} />

      {/* Back Button */}
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <Icon name="arrow-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Tell us about your education</Text>
        <Text style={styles.subtitle}>
          This helps us personalize interview questions for you
        </Text>

        {/* College Name with Autocomplete */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>College/University *</Text>
          <TextInput
            mode="outlined"
            value={collegeName}
            onChangeText={handleCollegeChange}
            placeholder="Start typing your college name"
            style={styles.textInput}
            outlineColor={colors.divider}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="school" />}
            accessibilityLabel="College name input"
          />
          {showSuggestions && filteredColleges.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {filteredColleges.slice(0, 4).map((college, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectCollege(college)}
                  accessibilityRole="button"
                  accessibilityLabel={college}>
                  <Icon
                    name="school-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.suggestionText}>{college}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Branch/Major Dropdown */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Branch/Major</Text>
          <Menu
            visible={showBranchMenu}
            onDismiss={() => setShowBranchMenu(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowBranchMenu(true)}
                accessibilityRole="button"
                accessibilityLabel="Select branch or major">
                <Text
                  style={[
                    styles.dropdownText,
                    !branch && styles.dropdownPlaceholder,
                  ]}>
                  {branch || 'Select your branch'}
                </Text>
                <Icon
                  name="chevron-down"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}>
            <ScrollView style={styles.menuScroll}>
              {branchOptions.map((option, index) => (
                <Menu.Item
                  key={index}
                  onPress={() => {
                    setBranch(option);
                    setShowBranchMenu(false);
                  }}
                  title={option}
                  titleStyle={branch === option ? styles.menuItemSelected : undefined}
                />
              ))}
            </ScrollView>
          </Menu>
        </View>

        {/* Graduation Year */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Graduation Year</Text>
          <Menu
            visible={showYearMenu}
            onDismiss={() => setShowYearMenu(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowYearMenu(true)}
                accessibilityRole="button"
                accessibilityLabel="Select graduation year">
                <Text
                  style={[
                    styles.dropdownText,
                    !graduationYear && styles.dropdownPlaceholder,
                  ]}>
                  {graduationYear || 'Select year'}
                </Text>
                <Icon
                  name="chevron-down"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}>
            {yearOptions.map(year => (
              <Menu.Item
                key={year}
                onPress={() => {
                  setGraduationYear(year);
                  setShowYearMenu(false);
                }}
                title={year.toString()}
                titleStyle={graduationYear === year ? styles.menuItemSelected : undefined}
              />
            ))}
          </Menu>
        </View>

        {/* Current Status */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Current Status</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusItem,
                  currentStatus === option.value && styles.statusItemSelected,
                ]}
                onPress={() => setCurrentStatus(option.value)}
                accessibilityRole="radio"
                accessibilityState={{checked: currentStatus === option.value}}
                accessibilityLabel={option.label}>
                <Icon
                  name={option.icon}
                  size={24}
                  color={
                    currentStatus === option.value
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.statusLabel,
                    currentStatus === option.value && styles.statusLabelSelected,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
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
  suggestionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    height: 56,
    paddingHorizontal: spacing.md,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  dropdownPlaceholder: {
    color: colors.textSecondary,
  },
  menuContent: {
    backgroundColor: colors.surface,
  },
  menuScroll: {
    maxHeight: 250,
  },
  menuItemSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: spacing.md,
    minHeight: 80,
  },
  statusItemSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: `${colors.primary}08`,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  statusLabelSelected: {
    color: colors.primary,
    fontWeight: '500',
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
});

export default EducationScreen;
