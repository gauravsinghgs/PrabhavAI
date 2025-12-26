import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Text, ProgressBar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {LearnStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<LearnStackParamList, 'ModulesList'>;

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
  premium: '#9c27b0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

type FilterType = 'all' | 'in_progress' | 'completed';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  lessonsCount: number;
  completedLessons: number;
  isPremium: boolean;
  category: string;
}

const mockModules: Module[] = [
  {
    id: 'tell-me-about-yourself',
    title: 'Tell Me About Yourself',
    description: 'Master the most common interview opener',
    icon: 'account-voice',
    duration: '15 min',
    lessonsCount: 4,
    completedLessons: 4,
    isPremium: false,
    category: 'Interview Skills',
  },
  {
    id: 'professional-email-writing',
    title: 'Professional Email Writing',
    description: 'Write clear, effective business emails',
    icon: 'email-edit',
    duration: '20 min',
    lessonsCount: 5,
    completedLessons: 3,
    isPremium: false,
    category: 'Communication',
  },
  {
    id: 'first-impressions',
    title: 'First Impressions',
    description: 'Make a lasting positive impact',
    icon: 'star-face',
    duration: '12 min',
    lessonsCount: 3,
    completedLessons: 1,
    isPremium: false,
    category: 'Soft Skills',
  },
  {
    id: 'handshake-greetings',
    title: 'Handshake & Greetings',
    description: 'Professional greeting etiquette',
    icon: 'hand-wave',
    duration: '10 min',
    lessonsCount: 3,
    completedLessons: 0,
    isPremium: false,
    category: 'Soft Skills',
  },
  {
    id: 'dress-code-basics',
    title: 'Dress Code Basics',
    description: 'Dress for success in any setting',
    icon: 'tshirt-crew',
    duration: '18 min',
    lessonsCount: 4,
    completedLessons: 0,
    isPremium: true,
    category: 'Professional Image',
  },
];

const filterOptions: {id: FilterType; label: string}[] = [
  {id: 'all', label: 'All'},
  {id: 'in_progress', label: 'In Progress'},
  {id: 'completed', label: 'Completed'},
];

interface ModuleCardProps {
  module: Module;
  onPress: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({module, onPress}) => {
  const progress = module.lessonsCount > 0
    ? module.completedLessons / module.lessonsCount
    : 0;
  const isCompleted = progress === 1;
  const isStarted = progress > 0 && progress < 1;

  return (
    <TouchableOpacity
      style={styles.moduleCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${module.title} module, ${Math.round(progress * 100)}% complete`}>
      {/* Icon/Thumbnail */}
      <View
        style={[
          styles.moduleIconContainer,
          isCompleted && styles.moduleIconCompleted,
        ]}>
        <Icon
          name={module.icon}
          size={28}
          color={isCompleted ? colors.surface : colors.primary}
        />
        {module.isPremium && (
          <View style={styles.premiumBadge}>
            <Icon name="crown" size={10} color={colors.surface} />
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.moduleTitle} numberOfLines={2}>
        {module.title}
      </Text>

      {/* Progress Bar (if started) */}
      {isStarted && (
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}

      {/* Completed Badge */}
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Icon name="check-circle" size={14} color={colors.success} />
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}

      {/* Duration */}
      <View style={styles.durationContainer}>
        <Icon name="clock-outline" size={12} color={colors.textSecondary} />
        <Text style={styles.durationText}>{module.duration}</Text>
      </View>

      {/* Lock Icon (if premium and not unlocked) */}
      {module.isPremium && (
        <View style={styles.lockIcon}>
          <Icon name="lock" size={14} color={colors.premium} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const ModulesListScreen: React.FC<Props> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredModules = mockModules.filter(module => {
    // Search filter
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const progress = module.lessonsCount > 0
      ? module.completedLessons / module.lessonsCount
      : 0;

    if (activeFilter === 'completed') {
      return matchesSearch && progress === 1;
    }
    if (activeFilter === 'in_progress') {
      return matchesSearch && progress > 0 && progress < 1;
    }
    return matchesSearch;
  });

  const handleModulePress = useCallback((moduleId: string) => {
    navigation.navigate('ModuleDetail', {moduleId});
  }, [navigation]);

  const totalModules = mockModules.length;
  const completedModules = mockModules.filter(
    m => m.completedLessons === m.lessonsCount
  ).length;
  const inProgressModules = mockModules.filter(
    m => m.completedLessons > 0 && m.completedLessons < m.lessonsCount
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learn</Text>
          <Text style={styles.headerSubtitle}>
            Master professional skills at your own pace
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalModules}</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: colors.warning}]}>
              {inProgressModules}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: colors.success}]}>
              {completedModules}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search modules..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search modules"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Clear search">
              <Icon name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}>
          {filterOptions.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
              accessibilityRole="button"
              accessibilityState={{selected: activeFilter === filter.id}}>
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter.id && styles.filterChipTextActive,
                ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Module Grid */}
        <View style={styles.moduleGrid}>
          {filteredModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onPress={() => handleModulePress(module.id)}
            />
          ))}
        </View>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="book-open-variant" size={48} color={colors.divider} />
            <Text style={styles.emptyTitle}>No modules found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try a different search term'
                : 'No modules match this filter'}
            </Text>
          </View>
        )}
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },
  filterContainer: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moduleCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    minHeight: 180,
  },
  moduleIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  moduleIconCompleted: {
    backgroundColor: colors.success,
  },
  premiumBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.premium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
  },
  progressText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  completedText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  durationText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  lockIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default ModulesListScreen;
