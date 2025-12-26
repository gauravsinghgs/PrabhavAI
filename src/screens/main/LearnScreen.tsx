import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Text, Card, ProgressBar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {MainTabScreenProps} from '@app-types/navigation';

type Props = MainTabScreenProps<'Learn'>;

const colors = {
  primary: '#1a237e',
  secondary: '#ff6f00',
  background: '#f5f5f5',
  surface: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#388e3c',
};

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  lessons: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  progress,
  lessons,
}) => (
  <Card style={styles.moduleCard}>
    <Card.Content style={styles.moduleContent}>
      <View style={styles.moduleIcon}>
        <Icon name={icon} size={28} color={colors.primary} />
      </View>
      <View style={styles.moduleInfo}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleDesc}>{description}</Text>
        <View style={styles.moduleProgress}>
          <ProgressBar
            progress={progress}
            color={colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}% Complete
          </Text>
        </View>
        <Text style={styles.lessonCount}>{lessons} lessons</Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
    </Card.Content>
  </Card>
);

export const LearnScreen: React.FC<Props> = () => {
  const modules = [
    {
      title: 'Professional Greetings',
      description: 'Master formal introductions',
      icon: 'hand-wave',
      progress: 0.75,
      lessons: 5,
    },
    {
      title: 'Body Language',
      description: 'Non-verbal communication',
      icon: 'human-handsup',
      progress: 0.4,
      lessons: 8,
    },
    {
      title: 'Email Etiquette',
      description: 'Write professional emails',
      icon: 'email-outline',
      progress: 0.0,
      lessons: 6,
    },
    {
      title: 'Meeting Conduct',
      description: 'Behave in meetings',
      icon: 'account-group',
      progress: 0.0,
      lessons: 4,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>35%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        {/* Continue Learning */}
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <Card style={styles.continueCard}>
          <Card.Content style={styles.continueContent}>
            <View style={styles.continueLeft}>
              <Text style={styles.continueTitle}>Professional Greetings</Text>
              <Text style={styles.continueLesson}>
                Lesson 4: Handshake Etiquette
              </Text>
              <ProgressBar
                progress={0.75}
                color={colors.primary}
                style={styles.continueProgress}
              />
            </View>
            <View style={styles.playButton}>
              <Icon name="play" size={24} color={colors.surface} />
            </View>
          </Card.Content>
        </Card>

        {/* All Modules */}
        <Text style={styles.sectionTitle}>All Modules</Text>
        {modules.map((module, index) => (
          <ModuleCard key={index} {...module} />
        ))}
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
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    backgroundColor: colors.textSecondary + '30',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  continueCard: {
    backgroundColor: colors.surface,
    marginBottom: 24,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueLeft: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  continueLesson: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  continueProgress: {
    height: 4,
    borderRadius: 2,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  moduleCard: {
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  moduleDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moduleProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  lessonCount: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default LearnScreen;
