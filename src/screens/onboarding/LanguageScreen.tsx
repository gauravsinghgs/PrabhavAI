import React, {useState, useCallback} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Button, Card, RadioButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from '@app-types/navigation';
import {StepIndicator} from '@components/onboarding';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Language'>;

const colors = {
  primary: '#1a237e',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  divider: '#e0e0e0',
  success: '#388e3c',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

type LanguageOption = 'english' | 'hindi' | 'hinglish';

const languageOptions: {
  value: LanguageOption;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'english',
    label: 'English Only',
    description: 'All content in English',
    icon: 'alpha-e-circle',
  },
  {
    value: 'hindi',
    label: 'Hindi Only',
    description: 'सभी सामग्री हिंदी में',
    icon: 'alpha-h-circle',
  },
  {
    value: 'hinglish',
    label: 'Hinglish (Mixed)',
    description: 'Mix of Hindi + English',
    icon: 'translate',
  },
];

const comfortLevels = [
  {level: 1, label: 'Beginner', description: 'Basic vocabulary'},
  {level: 2, label: 'Elementary', description: 'Simple sentences'},
  {level: 3, label: 'Intermediate', description: 'Conversational'},
  {level: 4, label: 'Advanced', description: 'Fluent speaker'},
  {level: 5, label: 'Native/Expert', description: 'Professional level'},
];

const previewTexts = {
  english: {
    greeting: 'Hello! Welcome to Prabhav AI.',
    question:
      'Tell me about a time when you faced a challenge at work. How did you handle it?',
  },
  hindi: {
    greeting: 'नमस्ते! प्रभाव AI में आपका स्वागत है।',
    question:
      'मुझे एक ऐसे समय के बारे में बताएं जब आपने काम पर किसी चुनौती का सामना किया। आपने इसे कैसे संभाला?',
  },
  hinglish: {
    greeting: 'Hello! Prabhav AI में आपका स्वागत है।',
    question:
      'Mujhe batao about a time when aapne kisi challenge ko face kiya at work. Aapne use kaise handle kiya?',
  },
};

export const LanguageScreen: React.FC<Props> = ({navigation}) => {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageOption>('english');
  const [comfortLevel, setComfortLevel] = useState(3);

  const handleContinue = useCallback(() => {
    navigation.navigate('OnboardingComplete');
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const currentComfort = comfortLevels.find(c => c.level === comfortLevel);
  const currentPreview = previewTexts[selectedLanguage];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator currentStep={4} totalSteps={5} />

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
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Language Preferences</Text>
        <Text style={styles.subtitle}>
          Choose how you'd like to practice interviews
        </Text>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred language for practice</Text>
          <RadioButton.Group
            onValueChange={value => setSelectedLanguage(value as LanguageOption)}
            value={selectedLanguage}>
            {languageOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.languageOption,
                  selectedLanguage === option.value &&
                    styles.languageOptionSelected,
                ]}
                onPress={() => setSelectedLanguage(option.value)}
                accessibilityRole="radio"
                accessibilityState={{checked: selectedLanguage === option.value}}
                accessibilityLabel={option.label}>
                <View style={styles.languageLeft}>
                  <Icon
                    name={option.icon}
                    size={28}
                    color={
                      selectedLanguage === option.value
                        ? colors.primary
                        : colors.textSecondary
                    }
                  />
                  <View style={styles.languageText}>
                    <Text
                      style={[
                        styles.languageLabel,
                        selectedLanguage === option.value &&
                          styles.languageLabelSelected,
                      ]}>
                      {option.label}
                    </Text>
                    <Text style={styles.languageDesc}>{option.description}</Text>
                  </View>
                </View>
                <RadioButton.Android
                  value={option.value}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ))}
          </RadioButton.Group>
        </View>

        {/* English Comfort Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>English comfort level</Text>
          <Card style={styles.sliderCard}>
            <Card.Content>
              <View style={styles.sliderHeader}>
                <Text style={styles.comfortLabel}>{currentComfort?.label}</Text>
                <Text style={styles.comfortDesc}>
                  {currentComfort?.description}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={comfortLevel}
                onValueChange={setComfortLevel}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.divider}
                thumbTintColor={colors.primary}
                accessibilityLabel="English comfort level slider"
                accessibilityValue={{
                  min: 1,
                  max: 5,
                  now: comfortLevel,
                  text: currentComfort?.label,
                }}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Beginner</Text>
                <Text style={styles.sliderLabel}>Expert</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <Card style={styles.previewCard}>
            <Card.Content>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Greeting</Text>
                <Text style={styles.previewText}>{currentPreview.greeting}</Text>
              </View>
              <View style={styles.previewDivider} />
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Sample Question</Text>
                <Text style={styles.previewText}>{currentPreview.question}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          labelStyle={styles.continueButtonLabel}
          accessibilityRole="button"
          accessibilityLabel="Continue to complete onboarding">
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
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 72,
  },
  languageOptionSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: `${colors.primary}08`,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  languageLabelSelected: {
    color: colors.primary,
  },
  languageDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sliderCard: {
    backgroundColor: colors.surface,
  },
  sliderHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  comfortLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  comfortDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewCard: {
    backgroundColor: colors.surface,
  },
  previewItem: {
    paddingVertical: spacing.sm,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  previewText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  previewDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
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
  continueButtonContent: {
    height: 52,
  },
  continueButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LanguageScreen;
