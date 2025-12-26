import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Text, Button, Menu} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {InterviewStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<InterviewStackParamList, 'InterviewSetup'>;

const colors = {
  primary: '#1a237e',
  primaryLight: '#534bae',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#388e3c',
  warning: '#ffa000',
  error: '#d32f2f',
  divider: '#e0e0e0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

type InterviewType = 'hr' | 'technical' | 'behavioral';
type Difficulty = 'easy' | 'medium' | 'hard';

const interviewTypes: {
  id: InterviewType;
  title: string;
  description: string;
  icon: string;
  questionCount: number;
}[] = [
  {
    id: 'hr',
    title: 'HR Interview',
    description: 'Personality, background & soft skills',
    icon: 'account-tie',
    questionCount: 8,
  },
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Role-specific & problem solving',
    icon: 'code-braces',
    questionCount: 6,
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'STAR method & situation handling',
    icon: 'brain',
    questionCount: 5,
  },
];

const companies = [
  {name: 'Google', icon: 'alpha-g-circle'},
  {name: 'Microsoft', icon: 'microsoft-windows'},
  {name: 'Amazon', icon: 'alpha-a-circle'},
  {name: 'Meta', icon: 'alpha-m-circle'},
  {name: 'Apple', icon: 'apple-ios'},
  {name: 'TCS', icon: 'office-building'},
  {name: 'Infosys', icon: 'office-building'},
  {name: 'Wipro', icon: 'office-building'},
  {name: 'Accenture', icon: 'office-building'},
  {name: 'Deloitte', icon: 'office-building'},
  {name: 'Goldman Sachs', icon: 'bank'},
  {name: 'JP Morgan', icon: 'bank'},
  {name: 'Flipkart', icon: 'cart'},
  {name: 'Swiggy', icon: 'food-outline'},
  {name: 'Other', icon: 'office-building-outline'},
];

const difficultyConfig: {
  [key in Difficulty]: {
    label: string;
    color: string;
    duration: number;
    description: string;
  };
} = {
  easy: {
    label: 'Easy',
    color: colors.success,
    duration: 15,
    description: 'Basic questions, relaxed pace',
  },
  medium: {
    label: 'Medium',
    color: colors.warning,
    duration: 30,
    description: 'Standard difficulty, moderate pace',
  },
  hard: {
    label: 'Hard',
    color: colors.error,
    duration: 45,
    description: 'Challenging questions, fast pace',
  },
};

export const InterviewSetupScreen: React.FC<Props> = ({navigation}) => {
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  const getDifficultyValue = (diff: Difficulty): number => {
    switch (diff) {
      case 'easy':
        return 1;
      case 'medium':
        return 2;
      case 'hard':
        return 3;
      default:
        return 2;
    }
  };

  const getDifficultyFromValue = (value: number): Difficulty => {
    if (value <= 1.5) return 'easy';
    if (value <= 2.5) return 'medium';
    return 'hard';
  };

  const handleSliderChange = useCallback((value: number) => {
    setDifficulty(getDifficultyFromValue(value));
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartInterview = useCallback(() => {
    if (selectedType && selectedCompany) {
      const typeConfig = interviewTypes.find(t => t.id === selectedType);
      navigation.navigate('InterviewReady', {
        type: selectedType,
        company: selectedCompany,
        difficulty: difficulty,
        totalQuestions: typeConfig?.questionCount ?? 5,
      });
    }
  }, [navigation, selectedType, selectedCompany, difficulty]);

  const isFormValid = selectedType !== null && selectedCompany !== null;
  const currentDifficultyConfig = difficultyConfig[difficulty];
  const selectedTypeConfig = interviewTypes.find(t => t.id === selectedType);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Up Interview</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Interview Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interview Type</Text>
          <View style={styles.typeCards}>
            {interviewTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
                accessibilityRole="radio"
                accessibilityState={{checked: selectedType === type.id}}
                accessibilityLabel={type.title}>
                <View
                  style={[
                    styles.typeIconContainer,
                    selectedType === type.id && styles.typeIconContainerSelected,
                  ]}>
                  <Icon
                    name={type.icon}
                    size={28}
                    color={
                      selectedType === type.id
                        ? colors.surface
                        : colors.primary
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.typeTitle,
                    selectedType === type.id && styles.typeTitleSelected,
                  ]}>
                  {type.title}
                </Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
                <View style={styles.typeQuestionCount}>
                  <Icon
                    name="help-circle-outline"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.typeQuestionText}>
                    {type.questionCount} questions
                  </Text>
                </View>
                {selectedType === type.id && (
                  <View style={styles.selectedCheck}>
                    <Icon name="check" size={16} color={colors.surface} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Target Company */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Company</Text>
          <Menu
            visible={showCompanyMenu}
            onDismiss={() => setShowCompanyMenu(false)}
            anchor={
              <TouchableOpacity
                style={[
                  styles.companyDropdown,
                  selectedCompany ? styles.companyDropdownSelected : undefined,
                ]}
                onPress={() => setShowCompanyMenu(true)}
                accessibilityRole="button"
                accessibilityLabel="Select target company">
                {selectedCompany ? (
                  <View style={styles.selectedCompany}>
                    <Icon
                      name={
                        companies.find(c => c.name === selectedCompany)?.icon ||
                        'office-building'
                      }
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.companyText}>{selectedCompany}</Text>
                  </View>
                ) : (
                  <Text style={styles.companyPlaceholder}>
                    Select a company
                  </Text>
                )}
                <Icon
                  name="chevron-down"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}>
            <ScrollView style={styles.menuScroll}>
              {companies.map(company => (
                <Menu.Item
                  key={company.name}
                  onPress={() => {
                    setSelectedCompany(company.name);
                    setShowCompanyMenu(false);
                  }}
                  title={company.name}
                  leadingIcon={company.icon}
                  titleStyle={
                    selectedCompany === company.name
                      ? styles.menuItemSelected
                      : undefined
                  }
                />
              ))}
            </ScrollView>
          </Menu>
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty Level</Text>
          <View style={styles.difficultyCard}>
            <View style={styles.difficultyHeader}>
              <Text
                style={[
                  styles.difficultyLabel,
                  {color: currentDifficultyConfig.color},
                ]}>
                {currentDifficultyConfig.label}
              </Text>
              <Text style={styles.difficultyDescription}>
                {currentDifficultyConfig.description}
              </Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={3}
              step={1}
              value={getDifficultyValue(difficulty)}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={currentDifficultyConfig.color}
              maximumTrackTintColor={colors.divider}
              thumbTintColor={currentDifficultyConfig.color}
              accessibilityLabel="Difficulty level slider"
            />

            <View style={styles.difficultyLabels}>
              <Text
                style={[
                  styles.difficultyLabelText,
                  difficulty === 'easy' && {color: colors.success},
                ]}>
                Easy
              </Text>
              <Text
                style={[
                  styles.difficultyLabelText,
                  difficulty === 'medium' && {color: colors.warning},
                ]}>
                Medium
              </Text>
              <Text
                style={[
                  styles.difficultyLabelText,
                  difficulty === 'hard' && {color: colors.error},
                ]}>
                Hard
              </Text>
            </View>
          </View>
        </View>

        {/* Duration Info */}
        <View style={styles.durationCard}>
          <Icon name="clock-outline" size={24} color={colors.primary} />
          <View style={styles.durationInfo}>
            <Text style={styles.durationTitle}>
              Estimated Duration: {currentDifficultyConfig.duration} minutes
            </Text>
            <Text style={styles.durationSubtitle}>
              {selectedTypeConfig
                ? `${selectedTypeConfig.questionCount} questions • ${Math.floor(currentDifficultyConfig.duration / selectedTypeConfig.questionCount)} min per question`
                : 'Select interview type to see details'}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Icon name="lightbulb-on" size={20} color={colors.secondary} />
            <Text style={styles.tipsTitle}>Quick Tips</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check" size={14} color={colors.success} />
            <Text style={styles.tipText}>
              Find a quiet place with good lighting
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check" size={14} color={colors.success} />
            <Text style={styles.tipText}>
              Speak clearly and maintain eye contact
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check" size={14} color={colors.success} />
            <Text style={styles.tipText}>
              Use the STAR method for behavioral questions
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleStartInterview}
          disabled={!isFormValid}
          style={[
            styles.startButton,
            !isFormValid && styles.startButtonDisabled,
          ]}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
          icon={({color}) => (
            <Icon name="play" size={20} color={color} />
          )}
          accessibilityRole="button"
          accessibilityLabel="Start Interview"
          accessibilityState={{disabled: !isFormValid}}>
          Start Interview
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  typeCards: {
    gap: spacing.sm,
  },
  typeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.divider,
    position: 'relative',
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  typeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeIconContainerSelected: {
    backgroundColor: colors.primary,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  typeTitleSelected: {
    color: colors.primary,
  },
  typeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  typeQuestionCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeQuestionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  selectedCheck: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    height: 56,
    paddingHorizontal: spacing.md,
  },
  companyDropdownSelected: {
    borderColor: colors.primary,
  },
  selectedCompany: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  companyPlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  menuContent: {
    backgroundColor: colors.surface,
  },
  menuScroll: {
    maxHeight: 300,
  },
  menuItemSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  difficultyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  difficultyHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  difficultyLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  difficultyDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  difficultyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  difficultyLabelText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  durationInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  durationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  durationSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: `${colors.secondary}10`,
    borderRadius: 16,
    padding: spacing.md,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  startButtonDisabled: {
    backgroundColor: colors.divider,
  },
  startButtonContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

export default InterviewSetupScreen;
