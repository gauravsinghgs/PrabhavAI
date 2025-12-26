import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'HelpSupport'>;

const colors = {
  primary: '#1a237e',
  primaryLight: '#534bae',
  secondary: '#ff6f00',
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

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I start a mock interview?',
    answer: 'Go to the Interview tab, select your interview type (HR, Technical, or Behavioral), choose your target company and difficulty level, then tap "Start Interview" to begin.',
  },
  {
    id: '2',
    question: 'How does the AI feedback work?',
    answer: 'Our AI analyzes your responses for content quality, communication skills, confidence, and relevance. You get detailed feedback with scores and specific improvement suggestions after each interview.',
  },
  {
    id: '3',
    question: 'Can I practice offline?',
    answer: 'Premium users can download learning modules for offline access. However, mock interviews require an internet connection for real-time AI analysis.',
  },
  {
    id: '4',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription anytime from your device settings (Play Store or App Store). Your premium benefits will continue until the end of your billing period.',
  },
  {
    id: '5',
    question: 'Is my data secure?',
    answer: 'Yes, we take privacy seriously. Your interview recordings are processed securely and deleted after analysis. We never share your personal data with third parties.',
  },
];

interface FAQItemProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({item, isExpanded, onToggle}) => (
  <TouchableOpacity
    style={styles.faqItem}
    onPress={onToggle}
    accessibilityRole="button"
    accessibilityState={{expanded: isExpanded}}>
    <View style={styles.faqHeader}>
      <Text style={styles.faqQuestion}>{item.question}</Text>
      <Icon
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={24}
        color={colors.textSecondary}
      />
    </View>
    {isExpanded && (
      <Text style={styles.faqAnswer}>{item.answer}</Text>
    )}
  </TouchableOpacity>
);

export const HelpSupportScreen: React.FC<Props> = ({navigation}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleFAQ = useCallback((id: string) => {
    setExpandedFAQ(prev => prev === id ? null : id);
  }, []);

  const handleEmail = useCallback(() => {
    Linking.openURL('mailto:support@prabhavai.com?subject=Support Request');
  }, []);

  const handleWhatsApp = useCallback(() => {
    Linking.openURL('https://wa.me/919876543210');
  }, []);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
      // In production, this would submit the support request
    }
  }, [message]);

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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleEmail}
            accessibilityRole="button"
            accessibilityLabel="Email support">
            <View style={[styles.quickActionIcon, {backgroundColor: `${colors.primary}15`}]}>
              <Icon name="email-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionTitle}>Email Us</Text>
            <Text style={styles.quickActionSubtitle}>support@prabhavai.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleWhatsApp}
            accessibilityRole="button"
            accessibilityLabel="WhatsApp support">
            <View style={[styles.quickActionIcon, {backgroundColor: '#25D36615'}]}>
              <Icon name="whatsapp" size={24} color="#25D366" />
            </View>
            <Text style={styles.quickActionTitle}>WhatsApp</Text>
            <Text style={styles.quickActionSubtitle}>Chat with us</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqCard}>
            {faqs.map((faq, index) => (
              <React.Fragment key={faq.id}>
                <FAQItemComponent
                  item={faq}
                  isExpanded={expandedFAQ === faq.id}
                  onToggle={() => handleToggleFAQ(faq.id)}
                />
                {index < faqs.length - 1 && <View style={styles.faqDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Send Message Section */}
        <View style={styles.messageSection}>
          <Text style={styles.sectionTitle}>Send us a message</Text>
          <View style={styles.messageCard}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue or question..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Button
              mode="contained"
              onPress={handleSendMessage}
              style={styles.sendButton}
              labelStyle={styles.sendButtonLabel}
              disabled={!message.trim()}>
              Send Message
            </Button>
          </View>
        </View>

        {/* Response Time */}
        <View style={styles.responseNote}>
          <Icon name="clock-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.responseText}>
            We typically respond within 24 hours during business days.
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  faqSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  faqItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  faqDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  messageSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  messageCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  messageInput: {
    minHeight: 100,
    fontSize: 15,
    color: colors.textPrimary,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  sendButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  responseNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  responseText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default HelpSupportScreen;
