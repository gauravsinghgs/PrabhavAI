import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Notifications'>;

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

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  hasTimePicker?: boolean;
  time?: string;
}

const initialSettings: NotificationSetting[] = [
  {
    id: 'daily_reminder',
    title: 'Daily Reminder',
    description: 'Get reminded to practice every day',
    icon: 'bell-ring-outline',
    enabled: true,
    hasTimePicker: true,
    time: '09:00 AM',
  },
  {
    id: 'interview_feedback',
    title: 'Interview Feedback',
    description: 'Receive notifications when feedback is ready',
    icon: 'message-text-outline',
    enabled: true,
  },
  {
    id: 'new_modules',
    title: 'New Modules',
    description: 'Get notified about new learning content',
    icon: 'book-plus-outline',
    enabled: true,
  },
  {
    id: 'weekly_summary',
    title: 'Weekly Summary',
    description: 'Receive your weekly progress report',
    icon: 'chart-line',
    enabled: true,
  },
  {
    id: 'tips_tricks',
    title: 'Tips & Tricks',
    description: 'Helpful tips to improve your skills',
    icon: 'lightbulb-on-outline',
    enabled: true,
  },
  {
    id: 'promotional',
    title: 'Promotional',
    description: 'Special offers and announcements',
    icon: 'tag-outline',
    enabled: false,
  },
];

interface ToggleItemProps {
  setting: NotificationSetting;
  onToggle: (id: string) => void;
  onTimePress?: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({setting, onToggle, onTimePress}) => (
  <View style={styles.toggleItem}>
    <View style={styles.toggleLeft}>
      <View style={styles.iconContainer}>
        <Icon name={setting.icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleTitle}>{setting.title}</Text>
        <Text style={styles.toggleDescription}>{setting.description}</Text>
        {setting.hasTimePicker && setting.enabled && (
          <TouchableOpacity
            style={styles.timeButton}
            onPress={onTimePress}
            accessibilityLabel={`Change time to ${setting.time}`}>
            <Icon name="clock-outline" size={14} color={colors.primary} />
            <Text style={styles.timeText}>{setting.time}</Text>
            <Icon name="chevron-down" size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
    <Switch
      value={setting.enabled}
      onValueChange={() => onToggle(setting.id)}
      trackColor={{false: colors.divider, true: `${colors.primary}50`}}
      thumbColor={setting.enabled ? colors.primary : colors.surface}
      ios_backgroundColor={colors.divider}
      accessibilityLabel={`${setting.title} toggle`}
    />
  </View>
);

export const NotificationsScreen: React.FC<Props> = ({navigation}) => {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggle = useCallback((id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? {...setting, enabled: !setting.enabled} : setting,
      ),
    );
  }, []);

  const handleTimePress = useCallback(() => {
    // In production, this would open a time picker
    console.log('Open time picker');
    setShowTimePicker(true);
  }, []);

  const handleEnableAll = useCallback(() => {
    setSettings(prev =>
      prev.map(setting => ({...setting, enabled: true})),
    );
  }, []);

  const handleDisableAll = useCallback(() => {
    setSettings(prev =>
      prev.map(setting => ({...setting, enabled: false})),
    );
  }, []);

  const enabledCount = settings.filter(s => s.enabled).length;
  const allEnabled = enabledCount === settings.length;
  const allDisabled = enabledCount === 0;

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              allEnabled && styles.quickActionButtonActive,
            ]}
            onPress={handleEnableAll}
            disabled={allEnabled}
            accessibilityRole="button"
            accessibilityLabel="Enable all notifications">
            <Icon
              name="bell-check-outline"
              size={18}
              color={allEnabled ? colors.surface : colors.primary}
            />
            <Text
              style={[
                styles.quickActionText,
                allEnabled && styles.quickActionTextActive,
              ]}>
              Enable All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              allDisabled && styles.quickActionButtonActive,
            ]}
            onPress={handleDisableAll}
            disabled={allDisabled}
            accessibilityRole="button"
            accessibilityLabel="Disable all notifications">
            <Icon
              name="bell-off-outline"
              size={18}
              color={allDisabled ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.quickActionText,
                allDisabled && styles.quickActionTextActive,
              ]}>
              Disable All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Summary */}
        <View style={styles.statusSummary}>
          <Icon
            name={enabledCount > 0 ? 'bell-ring' : 'bell-off'}
            size={20}
            color={enabledCount > 0 ? colors.success : colors.textSecondary}
          />
          <Text style={styles.statusText}>
            {enabledCount} of {settings.length} notifications enabled
          </Text>
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <View style={styles.settingsCard}>
            {settings.map((setting, index) => (
              <React.Fragment key={setting.id}>
                <ToggleItem
                  setting={setting}
                  onToggle={handleToggle}
                  onTimePress={setting.hasTimePicker ? handleTimePress : undefined}
                />
                {index < settings.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Icon name="information-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoNoteText}>
            You can also manage notification permissions in your device settings.
          </Text>
        </View>

        {/* Device Settings Link */}
        <TouchableOpacity style={styles.deviceSettingsButton}>
          <Icon name="cog-outline" size={20} color={colors.primary} />
          <Text style={styles.deviceSettingsText}>Open Device Settings</Text>
          <Icon name="open-in-new" size={16} color={colors.primary} />
        </TouchableOpacity>
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
    gap: spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  quickActionButtonActive: {
    backgroundColor: colors.primary,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  quickActionTextActive: {
    color: colors.surface,
  },
  statusSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingsSection: {
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
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 72,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  deviceSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: spacing.sm,
  },
  deviceSettingsText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default NotificationsScreen;
