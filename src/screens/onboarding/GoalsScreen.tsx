import React, {useState, useCallback} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Button, Chip, Searchbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from '@app-types/navigation';
import {StepIndicator} from '@components/onboarding';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Goals'>;

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

const roleOptions = [
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'Business Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'UI/UX Designer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'QA Engineer',
  'Cloud Engineer',
  'ML Engineer',
  'Consultant',
];

const popularCompanies = [
  {name: 'Google', logo: 'google'},
  {name: 'Microsoft', logo: 'microsoft'},
  {name: 'Amazon', logo: 'amazon'},
  {name: 'Meta', logo: 'facebook'},
  {name: 'Apple', logo: 'apple'},
  {name: 'TCS', logo: 'office-building'},
  {name: 'Infosys', logo: 'office-building'},
  {name: 'Wipro', logo: 'office-building'},
  {name: 'Accenture', logo: 'office-building'},
  {name: 'Deloitte', logo: 'office-building'},
  {name: 'Goldman Sachs', logo: 'bank'},
  {name: 'JP Morgan', logo: 'bank'},
  {name: 'Flipkart', logo: 'shopping'},
  {name: 'Paytm', logo: 'wallet'},
  {name: 'Swiggy', logo: 'food'},
  {name: 'Zomato', logo: 'food'},
];

export const GoalsScreen: React.FC<Props> = ({navigation}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [companySearch, setCompanySearch] = useState('');

  const filteredCompanies = popularCompanies.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase()),
  );

  const toggleRole = useCallback((role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role],
    );
  }, []);

  const toggleCompany = useCallback((company: string) => {
    setSelectedCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company],
    );
  }, []);

  const handleContinue = useCallback(() => {
    navigation.navigate('Language');
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isFormValid = selectedRoles.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator currentStep={3} totalSteps={5} />

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
        <Text style={styles.title}>What are your career goals?</Text>
        <Text style={styles.subtitle}>
          Select roles and companies you're interested in
        </Text>

        {/* Roles Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What roles interest you? *
            {selectedRoles.length > 0 && (
              <Text style={styles.selectedCount}>
                {' '}
                ({selectedRoles.length} selected)
              </Text>
            )}
          </Text>
          <View style={styles.chipsContainer}>
            {roleOptions.map(role => (
              <Chip
                key={role}
                mode="outlined"
                selected={selectedRoles.includes(role)}
                onPress={() => toggleRole(role)}
                style={[
                  styles.chip,
                  selectedRoles.includes(role) && styles.chipSelected,
                ]}
                textStyle={[
                  styles.chipText,
                  selectedRoles.includes(role) && styles.chipTextSelected,
                ]}
                showSelectedCheck={false}
                accessibilityRole="checkbox"
                accessibilityState={{checked: selectedRoles.includes(role)}}>
                {role}
              </Chip>
            ))}
          </View>
        </View>

        {/* Companies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Target companies
            {selectedCompanies.length > 0 && (
              <Text style={styles.selectedCount}>
                {' '}
                ({selectedCompanies.length} selected)
              </Text>
            )}
          </Text>

          {/* Search */}
          <Searchbar
            placeholder="Search companies"
            onChangeText={setCompanySearch}
            value={companySearch}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={colors.textSecondary}
            accessibilityLabel="Search companies"
          />

          {/* Selected Companies */}
          {selectedCompanies.length > 0 && (
            <View style={styles.selectedChipsContainer}>
              {selectedCompanies.map(company => (
                <Chip
                  key={company}
                  mode="flat"
                  onClose={() => toggleCompany(company)}
                  style={styles.selectedChip}
                  textStyle={styles.selectedChipText}
                  closeIconAccessibilityLabel={`Remove ${company}`}>
                  {company}
                </Chip>
              ))}
            </View>
          )}

          {/* Company Grid */}
          <View style={styles.companiesGrid}>
            {filteredCompanies.map(company => (
              <TouchableOpacity
                key={company.name}
                style={[
                  styles.companyItem,
                  selectedCompanies.includes(company.name) &&
                    styles.companyItemSelected,
                ]}
                onPress={() => toggleCompany(company.name)}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: selectedCompanies.includes(company.name),
                }}
                accessibilityLabel={company.name}>
                <Icon
                  name={company.logo}
                  size={24}
                  color={
                    selectedCompanies.includes(company.name)
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.companyName,
                    selectedCompanies.includes(company.name) &&
                      styles.companyNameSelected,
                  ]}
                  numberOfLines={1}>
                  {company.name}
                </Text>
                {selectedCompanies.includes(company.name) && (
                  <Icon
                    name="check-circle"
                    size={16}
                    color={colors.primary}
                    style={styles.checkIcon}
                  />
                )}
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
  selectedCount: {
    fontWeight: '400',
    color: colors.primary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.divider,
  },
  chipSelected: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  searchBar: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchInput: {
    fontSize: 14,
  },
  selectedChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  selectedChipText: {
    color: colors.surface,
    fontSize: 12,
  },
  companiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  companyItem: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 80,
    position: 'relative',
  },
  companyItemSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: `${colors.primary}08`,
  },
  companyName: {
    fontSize: 11,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  companyNameSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
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

export default GoalsScreen;
