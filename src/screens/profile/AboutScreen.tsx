import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'About'>;

const colors = {
  primary: '#1a237e',
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

interface LinkItemProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const LinkItem: React.FC<LinkItemProps> = ({icon, label, onPress}) => (
  <TouchableOpacity
    style={styles.linkItem}
    onPress={onPress}
    accessibilityRole="link"
    accessibilityLabel={label}>
    <View style={styles.linkLeft}>
      <Icon name={icon} size={20} color={colors.primary} />
      <Text style={styles.linkLabel}>{label}</Text>
    </View>
    <Icon name="open-in-new" size={16} color={colors.textSecondary} />
  </TouchableOpacity>
);

export const AboutScreen: React.FC<Props> = ({navigation}) => {
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePrivacyPolicy = useCallback(() => {
    Linking.openURL('https://prabhavai.com/privacy');
  }, []);

  const handleTermsOfService = useCallback(() => {
    Linking.openURL('https://prabhavai.com/terms');
  }, []);

  const handleWebsite = useCallback(() => {
    Linking.openURL('https://prabhavai.com');
  }, []);

  const handleTwitter = useCallback(() => {
    Linking.openURL('https://twitter.com/prabhavai');
  }, []);

  const handleLinkedIn = useCallback(() => {
    Linking.openURL('https://linkedin.com/company/prabhavai');
  }, []);

  const handleRateApp = useCallback(() => {
    // In production, this would open the app store
    console.log('Rate app');
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
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.appIconContainer}>
            <Icon name="brain" size={48} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Prabhav AI</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>
            Your AI-powered interview coach for career success
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.missionSection}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <View style={styles.missionCard}>
            <Text style={styles.missionText}>
              We believe everyone deserves access to quality interview preparation.
              Prabhav AI uses advanced artificial intelligence to provide personalized
              coaching, helping job seekers build confidence and ace their interviews.
            </Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.linksCard}>
            <LinkItem
              icon="shield-check-outline"
              label="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <View style={styles.linkDivider} />
            <LinkItem
              icon="file-document-outline"
              label="Terms of Service"
              onPress={handleTermsOfService}
            />
          </View>

          <Text style={styles.sectionTitle}>Connect</Text>
          <View style={styles.linksCard}>
            <LinkItem
              icon="web"
              label="Visit Website"
              onPress={handleWebsite}
            />
            <View style={styles.linkDivider} />
            <LinkItem
              icon="twitter"
              label="Follow on Twitter"
              onPress={handleTwitter}
            />
            <View style={styles.linkDivider} />
            <LinkItem
              icon="linkedin"
              label="Connect on LinkedIn"
              onPress={handleLinkedIn}
            />
          </View>

          <Text style={styles.sectionTitle}>Support Us</Text>
          <View style={styles.linksCard}>
            <LinkItem
              icon="star-outline"
              label="Rate the App"
              onPress={handleRateApp}
            />
          </View>
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>Made with ❤️ in India</Text>
          <Text style={styles.copyrightText}>
            © 2024 Prabhav AI. All rights reserved.
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
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
  },
  appIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  appTagline: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  missionSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  missionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  missionText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  linksSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  linksCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  linkLabel: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  linkDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 52,
  },
  credits: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  creditsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  copyrightText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default AboutScreen;
