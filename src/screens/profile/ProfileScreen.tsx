import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

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
  gold: '#ffd700',
  premium: '#9c27b0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Mock user data
const mockUser = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  photo: null,
  level: 5,
  levelName: 'Explorer',
  xp: 1250,
  isPremium: false,
};

// Mock stats
const mockStats = {
  interviews: 12,
  modules: 8,
  streak: 7,
};

// Mock achievements
const mockAchievements = [
  {id: '1', name: '7-Day Streak', icon: 'fire', color: colors.secondary, earned: true},
  {id: '2', name: 'First Interview', icon: 'microphone', color: colors.primary, earned: true},
  {id: '3', name: 'Quick Learner', icon: 'lightning-bolt', color: colors.warning, earned: true},
  {id: '4', name: 'Perfect Score', icon: 'star', color: colors.gold, earned: true},
  {id: '5', name: 'Module Master', icon: 'school', color: colors.success, earned: false},
  {id: '6', name: 'Interview Pro', icon: 'trophy', color: colors.premium, earned: false},
];

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  rightText?: string;
  showBadge?: boolean;
  badgeColor?: string;
  isDestructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onPress,
  rightText,
  showBadge,
  badgeColor,
  isDestructive,
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}>
    <View style={styles.menuItemLeft}>
      <View
        style={[
          styles.menuIconContainer,
          isDestructive && {backgroundColor: `${colors.error}15`},
        ]}>
        <Icon
          name={icon}
          size={20}
          color={isDestructive ? colors.error : colors.primary}
        />
      </View>
      <Text
        style={[
          styles.menuItemLabel,
          isDestructive && {color: colors.error},
        ]}>
        {label}
      </Text>
    </View>
    <View style={styles.menuItemRight}>
      {rightText && <Text style={styles.menuItemRightText}>{rightText}</Text>}
      {showBadge && (
        <View style={[styles.menuBadge, {backgroundColor: badgeColor || colors.secondary}]}>
          <Text style={styles.menuBadgeText}>NEW</Text>
        </View>
      )}
      <Icon name="chevron-right" size={20} color={colors.textSecondary} />
    </View>
  </TouchableOpacity>
);

export const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleNotifications = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleLanguage = useCallback(() => {
    navigation.navigate('Language');
  }, [navigation]);

  const handlePremium = useCallback(() => {
    navigation.navigate('Premium');
  }, [navigation]);

  const handleHelpSupport = useCallback(() => {
    navigation.navigate('HelpSupport');
  }, [navigation]);

  const handleAbout = useCallback(() => {
    navigation.navigate('About');
  }, [navigation]);

  const handleLogout = useCallback(() => {
    // TODO: Implement logout
    console.log('Logout pressed');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.photoContainer}>
            {mockUser.photo ? (
              <Image source={{uri: mockUser.photo}} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Icon name="account" size={48} color={colors.surface} />
              </View>
            )}
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={handleEditProfile}
              accessibilityLabel="Edit profile photo">
              <Icon name="pencil" size={14} color={colors.surface} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>

          {/* Level Badge */}
          <View style={styles.levelBadge}>
            <Icon name="star" size={16} color={colors.secondary} />
            <Text style={styles.levelText}>
              Level {mockUser.level} • {mockUser.levelName}
            </Text>
            <Text style={styles.xpText}>{mockUser.xp} XP</Text>
          </View>

          {/* Premium Badge */}
          {mockUser.isPremium ? (
            <View style={styles.premiumBadge}>
              <Icon name="crown" size={14} color={colors.surface} />
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.upgradeBadge}
              onPress={handlePremium}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Premium">
              <Icon name="crown" size={14} color={colors.premium} />
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            accessibilityRole="button"
            accessibilityLabel="Edit profile">
            <Icon name="pencil" size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockStats.interviews}</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockStats.modules}</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.streakContainer}>
              <Icon name="fire" size={20} color={colors.secondary} />
              <Text style={[styles.statValue, {color: colors.secondary}]}>
                {mockStats.streak}
              </Text>
            </View>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Achievement Badges */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity accessibilityLabel="View all achievements">
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsScroll}>
            {mockAchievements.map(achievement => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementBadge,
                  !achievement.earned && styles.achievementBadgeLocked,
                ]}>
                <View
                  style={[
                    styles.achievementIcon,
                    {backgroundColor: achievement.earned ? `${achievement.color}20` : colors.divider},
                  ]}>
                  <Icon
                    name={achievement.icon}
                    size={24}
                    color={achievement.earned ? achievement.color : colors.textSecondary}
                  />
                  {!achievement.earned && (
                    <View style={styles.lockOverlay}>
                      <Icon name="lock" size={12} color={colors.textSecondary} />
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.achievementName,
                    !achievement.earned && styles.achievementNameLocked,
                  ]}
                  numberOfLines={2}>
                  {achievement.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Menu List */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="account-edit"
              label="Edit Profile"
              onPress={handleEditProfile}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="bell-outline"
              label="Notifications"
              onPress={handleNotifications}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="translate"
              label="Language"
              onPress={handleLanguage}
              rightText="English"
            />
          </View>

          <Text style={styles.menuSectionTitle}>Subscription</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="crown"
              label="Premium"
              onPress={handlePremium}
              showBadge={!mockUser.isPremium}
              rightText={mockUser.isPremium ? 'Active' : 'Free'}
            />
          </View>

          <Text style={styles.menuSectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={handleHelpSupport}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="information-outline"
              label="About"
              onPress={handleAbout}
            />
          </View>

          <View style={[styles.menuCard, {marginTop: spacing.md}]}>
            <MenuItem
              icon="logout"
              label="Logout"
              onPress={handleLogout}
              isDestructive
            />
          </View>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Prabhav AI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.secondary}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.sm,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: spacing.xs,
  },
  xpText: {
    fontSize: 13,
    color: colors.secondary,
    marginLeft: spacing.sm,
    opacity: 0.8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.premium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
    marginLeft: spacing.xs,
  },
  upgradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.premium}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.premium,
    marginLeft: spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementsSection: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  achievementsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  achievementBadge: {
    alignItems: 'center',
    width: 80,
  },
  achievementBadgeLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  achievementName: {
    fontSize: 11,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  achievementNameLocked: {
    color: colors.textSecondary,
  },
  menuSection: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  menuSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemLabel: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRightText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  menuBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  menuBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.surface,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 60,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default ProfileScreen;
