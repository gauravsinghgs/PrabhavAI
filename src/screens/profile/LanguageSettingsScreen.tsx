import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Language'>;

const colors = {
  primary: '#1a237e',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#388e3c',
  divider: '#e0e0e0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸'},
  {code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳'},
  {code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳'},
  {code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳'},
  {code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳'},
  {code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳'},
  {code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳'},
  {code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳'},
];

export const LanguageSettingsScreen: React.FC<Props> = ({navigation}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectLanguage = useCallback((code: string) => {
    setSelectedLanguage(code);
    // In production, this would save the language preference
    console.log(`Language changed to ${code}`);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Info Note */}
        <View style={styles.infoNote}>
          <Icon name="information-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoNoteText}>
            Select your preferred language for the app interface and AI interactions.
          </Text>
        </View>

        {/* Language List */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Available Languages</Text>
          <View style={styles.languageCard}>
            {languages.map((lang, index) => (
              <React.Fragment key={lang.code}>
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => handleSelectLanguage(lang.code)}
                  accessibilityRole="radio"
                  accessibilityState={{checked: selectedLanguage === lang.code}}>
                  <View style={styles.languageLeft}>
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text style={styles.languageNative}>{lang.nativeName}</Text>
                    </View>
                  </View>
                  {selectedLanguage === lang.code && (
                    <Icon name="check-circle" size={24} color={colors.success} />
                  )}
                </TouchableOpacity>
                {index < languages.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Coming Soon Note */}
        <View style={styles.comingSoonNote}>
          <Icon name="translate" size={20} color={colors.primary} />
          <Text style={styles.comingSoonText}>
            More languages coming soon! Let us know which language you'd like to see.
          </Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.sm,
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
    paddingBottom: spacing.xl,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  languageSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  languageCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  languageNative: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 60,
  },
  comingSoonNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    gap: spacing.sm,
  },
  comingSoonText: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    lineHeight: 20,
  },
});

export default LanguageSettingsScreen;
