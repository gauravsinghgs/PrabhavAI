import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Premium'>;

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
  divider: '#e0e0e0',
  premium: '#9c27b0',
  gold: '#ffd700',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

type PlanType = 'monthly' | 'yearly';

interface FeatureItem {
  name: string;
  free: boolean | string;
  premium: boolean | string;
}

const features: FeatureItem[] = [
  {name: 'Mock Interviews', free: '5/month', premium: 'Unlimited'},
  {name: 'AI Feedback', free: 'Basic', premium: 'Detailed'},
  {name: 'Learning Modules', free: '3 modules', premium: 'All modules'},
  {name: 'Question Bank', free: '50 questions', premium: '500+ questions'},
  {name: 'Progress Analytics', free: false, premium: true},
  {name: 'Company-specific Prep', free: false, premium: true},
  {name: 'Resume Review', free: false, premium: true},
  {name: 'Priority Support', free: false, premium: true},
  {name: 'Ad-free Experience', free: false, premium: true},
  {name: 'Offline Access', free: false, premium: true},
];

const plans = {
  monthly: {
    price: 99,
    period: 'month',
    savings: null,
  },
  yearly: {
    price: 999,
    period: 'year',
    savings: '16%',
    monthlyEquivalent: 83,
  },
};

export const PremiumScreen: React.FC<Props> = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubscribe = useCallback(() => {
    // In production, this would initiate the payment flow
    console.log(`Subscribe to ${selectedPlan} plan`);
  }, [selectedPlan]);

  const handleRestorePurchase = useCallback(() => {
    // In production, this would restore purchases
    console.log('Restore purchase');
  }, []);

  const renderFeatureValue = (value: boolean | string, isPremium: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Icon name="check-circle" size={20} color={isPremium ? colors.premium : colors.success} />
      ) : (
        <Icon name="close-circle" size={20} color={colors.divider} />
      );
    }
    return (
      <Text style={[styles.featureValue, isPremium && styles.featureValuePremium]}>
        {value}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Icon name="crown" size={48} color={colors.gold} />
          </View>
          <Text style={styles.heroTitle}>Upgrade to Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock all features and accelerate your career growth
          </Text>

          {/* Current Plan Badge */}
          <View style={styles.currentPlanBadge}>
            <Icon name="account-circle" size={16} color={colors.textSecondary} />
            <Text style={styles.currentPlanText}>Current Plan: Free</Text>
          </View>
        </View>

        {/* Feature Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Compare Plans</Text>
          <View style={styles.comparisonCard}>
            {/* Header Row */}
            <View style={styles.comparisonHeader}>
              <Text style={styles.featureHeaderText}>Features</Text>
              <View style={styles.planHeaders}>
                <Text style={styles.planHeaderText}>Free</Text>
                <View style={styles.premiumHeader}>
                  <Icon name="crown" size={12} color={colors.gold} />
                  <Text style={styles.premiumHeaderText}>Premium</Text>
                </View>
              </View>
            </View>

            {/* Feature Rows */}
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureRow,
                  index % 2 === 0 && styles.featureRowAlt,
                ]}>
                <Text style={styles.featureName}>{feature.name}</Text>
                <View style={styles.featureValues}>
                  <View style={styles.featureValueContainer}>
                    {renderFeatureValue(feature.free, false)}
                  </View>
                  <View style={styles.featureValueContainer}>
                    {renderFeatureValue(feature.premium, true)}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>

          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.pricingCard,
              selectedPlan === 'monthly' && styles.pricingCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
            accessibilityRole="radio"
            accessibilityState={{checked: selectedPlan === 'monthly'}}>
            <View style={styles.pricingCardLeft}>
              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === 'monthly' && styles.radioOuterSelected,
                ]}>
                {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.planName}>Monthly</Text>
                <Text style={styles.planDescription}>Billed monthly</Text>
              </View>
            </View>
            <View style={styles.pricingCardRight}>
              <Text style={styles.priceAmount}>₹{plans.monthly.price}</Text>
              <Text style={styles.pricePeriod}>/{plans.monthly.period}</Text>
            </View>
          </TouchableOpacity>

          {/* Yearly Plan */}
          <TouchableOpacity
            style={[
              styles.pricingCard,
              selectedPlan === 'yearly' && styles.pricingCardSelected,
            ]}
            onPress={() => setSelectedPlan('yearly')}
            accessibilityRole="radio"
            accessibilityState={{checked: selectedPlan === 'yearly'}}>
            {plans.yearly.savings && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Save {plans.yearly.savings}</Text>
              </View>
            )}
            <View style={styles.pricingCardLeft}>
              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === 'yearly' && styles.radioOuterSelected,
                ]}>
                {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.planName}>Yearly</Text>
                <Text style={styles.planDescription}>
                  ₹{plans.yearly.monthlyEquivalent}/month, billed annually
                </Text>
              </View>
            </View>
            <View style={styles.pricingCardRight}>
              <Text style={styles.priceAmount}>₹{plans.yearly.price}</Text>
              <Text style={styles.pricePeriod}>/{plans.yearly.period}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitItem}>
            <Icon name="shield-check" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Cancel anytime, no questions asked</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="lock" size={20} color={colors.success} />
            <Text style={styles.benefitText}>Secure payment via Play Store</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="refresh" size={20} color={colors.success} />
            <Text style={styles.benefitText}>7-day money-back guarantee</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <Button
          mode="contained"
          onPress={handleSubscribe}
          style={styles.subscribeButton}
          contentStyle={styles.subscribeButtonContent}
          labelStyle={styles.subscribeButtonLabel}
          icon={({color}) => <Icon name="crown" size={20} color={color} />}
          accessibilityRole="button"
          accessibilityLabel={`Subscribe to ${selectedPlan} plan`}>
          Subscribe for ₹{selectedPlan === 'monthly' ? plans.monthly.price : plans.yearly.price}
          /{selectedPlan === 'monthly' ? plans.monthly.period : plans.yearly.period}
        </Button>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchase}
          accessibilityRole="button"
          accessibilityLabel="Restore purchase">
          <Text style={styles.restoreText}>Restore Purchase</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.premium}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  currentPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  currentPlanText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  comparisonSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  comparisonCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
  },
  featureHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
    flex: 1,
  },
  planHeaders: {
    flexDirection: 'row',
    width: 140,
  },
  planHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
    width: 60,
    textAlign: 'center',
    opacity: 0.8,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    gap: 4,
  },
  premiumHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  featureRowAlt: {
    backgroundColor: `${colors.primary}05`,
  },
  featureName: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  featureValues: {
    flexDirection: 'row',
    width: 140,
  },
  featureValueContainer: {
    width: 60,
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featureValuePremium: {
    color: colors.premium,
    fontWeight: '600',
  },
  pricingSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.divider,
    position: 'relative',
  },
  pricingCardSelected: {
    borderColor: colors.premium,
    backgroundColor: `${colors.premium}08`,
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.surface,
  },
  pricingCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.premium,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.premium,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  planDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pricingCardRight: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.premium,
  },
  pricePeriod: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  benefitsSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  subscribeButton: {
    backgroundColor: colors.premium,
    borderRadius: 12,
  },
  subscribeButtonContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },
  subscribeButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  restoreText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default PremiumScreen;
