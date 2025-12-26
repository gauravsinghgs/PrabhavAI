import React, {useCallback} from 'react';
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
import type {LearnStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<LearnStackParamList, 'ModuleDetail'>;

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
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Mock module data
const mockModuleData: Record<string, {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  lessonsCount: number;
  completedLessons: number;
  category: string;
  overview: string;
  learningOutcomes: string[];
  lessons: {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
  }[];
}> = {
  'tell-me-about-yourself': {
    id: 'tell-me-about-yourself',
    title: 'Tell Me About Yourself',
    description: 'Master the most common interview opener',
    icon: 'account-voice',
    duration: '15 min',
    lessonsCount: 4,
    completedLessons: 4,
    category: 'Interview Skills',
    overview: 'This module will help you craft a compelling personal introduction that leaves a lasting impression. You\'ll learn the proven formula used by successful candidates to answer this crucial question confidently.',
    learningOutcomes: [
      'Structure your answer using the Present-Past-Future formula',
      'Highlight relevant achievements without bragging',
      'Tailor your response to different interview contexts',
      'Practice confident body language while speaking',
    ],
    lessons: [
      {id: '1', title: 'Understanding the Question', duration: '3 min', isCompleted: true},
      {id: '2', title: 'The Present-Past-Future Formula', duration: '5 min', isCompleted: true},
      {id: '3', title: 'Crafting Your Story', duration: '4 min', isCompleted: true},
      {id: '4', title: 'Practice & Examples', duration: '3 min', isCompleted: true},
    ],
  },
  'professional-email-writing': {
    id: 'professional-email-writing',
    title: 'Professional Email Writing',
    description: 'Write clear, effective business emails',
    icon: 'email-edit',
    duration: '20 min',
    lessonsCount: 5,
    completedLessons: 3,
    category: 'Communication',
    overview: 'Email is the backbone of professional communication. This module teaches you to write emails that get read, understood, and acted upon. From subject lines to sign-offs, master every element.',
    learningOutcomes: [
      'Write compelling subject lines that get opened',
      'Structure emails for clarity and action',
      'Use appropriate tone for different situations',
      'Avoid common email mistakes that hurt your image',
    ],
    lessons: [
      {id: '1', title: 'Email Basics & Structure', duration: '4 min', isCompleted: true},
      {id: '2', title: 'Subject Lines That Work', duration: '3 min', isCompleted: true},
      {id: '3', title: 'Professional Tone & Language', duration: '5 min', isCompleted: true},
      {id: '4', title: 'Formatting & Attachments', duration: '4 min', isCompleted: false},
      {id: '5', title: 'Email Templates & Examples', duration: '4 min', isCompleted: false},
    ],
  },
  'first-impressions': {
    id: 'first-impressions',
    title: 'First Impressions',
    description: 'Make a lasting positive impact',
    icon: 'star-face',
    duration: '12 min',
    lessonsCount: 3,
    completedLessons: 1,
    category: 'Soft Skills',
    overview: 'You never get a second chance to make a first impression. Learn the psychology behind first impressions and practical techniques to make every introduction count.',
    learningOutcomes: [
      'Understand the 7-second rule of first impressions',
      'Master confident body language and posture',
      'Create memorable introductions',
      'Build instant rapport with new contacts',
    ],
    lessons: [
      {id: '1', title: 'The Science of First Impressions', duration: '4 min', isCompleted: true},
      {id: '2', title: 'Body Language Essentials', duration: '5 min', isCompleted: false},
      {id: '3', title: 'Building Instant Rapport', duration: '3 min', isCompleted: false},
    ],
  },
  'handshake-greetings': {
    id: 'handshake-greetings',
    title: 'Handshake & Greetings',
    description: 'Professional greeting etiquette',
    icon: 'hand-wave',
    duration: '10 min',
    lessonsCount: 3,
    completedLessons: 0,
    category: 'Soft Skills',
    overview: 'A proper greeting sets the tone for any professional interaction. Learn the art of the perfect handshake and culturally appropriate greetings for global business settings.',
    learningOutcomes: [
      'Master the professional handshake technique',
      'Understand cultural greeting variations',
      'Navigate virtual meeting greetings',
      'Handle awkward greeting situations gracefully',
    ],
    lessons: [
      {id: '1', title: 'The Perfect Handshake', duration: '3 min', isCompleted: false},
      {id: '2', title: 'Cultural Greeting Etiquette', duration: '4 min', isCompleted: false},
      {id: '3', title: 'Virtual & Modern Greetings', duration: '3 min', isCompleted: false},
    ],
  },
  'dress-code-basics': {
    id: 'dress-code-basics',
    title: 'Dress Code Basics',
    description: 'Dress for success in any setting',
    icon: 'tshirt-crew',
    duration: '18 min',
    lessonsCount: 4,
    completedLessons: 0,
    category: 'Professional Image',
    overview: 'Your appearance speaks before you do. This module covers dress codes from business formal to smart casual, helping you always look appropriate and confident.',
    learningOutcomes: [
      'Decode different dress code requirements',
      'Build a professional capsule wardrobe',
      'Dress appropriately for interviews',
      'Understand industry-specific expectations',
    ],
    lessons: [
      {id: '1', title: 'Understanding Dress Codes', duration: '4 min', isCompleted: false},
      {id: '2', title: 'Interview Attire Guide', duration: '5 min', isCompleted: false},
      {id: '3', title: 'Building Your Professional Wardrobe', duration: '5 min', isCompleted: false},
      {id: '4', title: 'Grooming & Final Touches', duration: '4 min', isCompleted: false},
    ],
  },
};

export const ModuleDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {moduleId} = route.params;
  const module = mockModuleData[moduleId] || mockModuleData['tell-me-about-yourself'];

  const progress = module.lessonsCount > 0
    ? module.completedLessons / module.lessonsCount
    : 0;
  const isCompleted = progress === 1;
  const isStarted = progress > 0;

  const getNextLessonIndex = (): number => {
    const index = module.lessons.findIndex(lesson => !lesson.isCompleted);
    return index === -1 ? 0 : index;
  };

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartModule = useCallback(() => {
    navigation.navigate('ModuleContent', {
      moduleId: module.id,
      lessonIndex: getNextLessonIndex(),
    });
  }, [navigation, module.id]);

  const handleLessonPress = useCallback((lessonIndex: number) => {
    navigation.navigate('ModuleContent', {
      moduleId: module.id,
      lessonIndex,
    });
  }, [navigation, module.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Icon name="arrow-left" size={24} color={colors.surface} />
          </TouchableOpacity>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Icon name={module.icon} size={48} color={colors.surface} />
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{module.category}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          {/* Title & Meta */}
          <Text style={styles.title}>{module.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="clock-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{module.duration}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Icon name="book-open-variant" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{module.lessonsCount} lessons</Text>
            </View>
            {isCompleted && (
              <>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Text style={[styles.metaText, {color: colors.success}]}>Completed</Text>
                </View>
              </>
            )}
          </View>

          {/* Progress (if started) */}
          {isStarted && !isCompleted && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Your Progress</Text>
                <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.descriptionText}>{module.overview}</Text>
          </View>

          {/* Learning Outcomes */}
          <View style={styles.outcomesSection}>
            <Text style={styles.sectionTitle}>What You'll Learn</Text>
            {module.learningOutcomes.map((outcome, index) => (
              <View key={index} style={styles.outcomeItem}>
                <View style={styles.outcomeIcon}>
                  <Icon name="check" size={14} color={colors.surface} />
                </View>
                <Text style={styles.outcomeText}>{outcome}</Text>
              </View>
            ))}
          </View>

          {/* Lessons List */}
          <View style={styles.lessonsSection}>
            <Text style={styles.sectionTitle}>Lessons</Text>
            {module.lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() => handleLessonPress(index)}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.title}, ${lesson.isCompleted ? 'completed' : 'not completed'}`}>
                <View style={styles.lessonLeft}>
                  <View
                    style={[
                      styles.lessonNumber,
                      lesson.isCompleted && styles.lessonNumberCompleted,
                    ]}>
                    {lesson.isCompleted ? (
                      <Icon name="check" size={14} color={colors.surface} />
                    ) : (
                      <Text style={styles.lessonNumberText}>{index + 1}</Text>
                    )}
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleStartModule}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
          icon={({color}) => (
            <Icon
              name={isCompleted ? 'refresh' : isStarted ? 'play' : 'book-open-variant'}
              size={20}
              color={color}
            />
          )}
          accessibilityRole="button"
          accessibilityLabel={isCompleted ? 'Restart Module' : isStarted ? 'Continue' : 'Start Module'}>
          {isCompleted ? 'Restart Module' : isStarted ? 'Continue' : 'Start Module'}
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
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    backgroundColor: colors.primary,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -spacing.sm,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: colors.surface,
    fontWeight: '500',
  },
  contentSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  progressSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  outcomesSection: {
    marginBottom: spacing.lg,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  outcomeIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  outcomeText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  lessonsSection: {
    marginBottom: spacing.lg,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  lessonNumberCompleted: {
    backgroundColor: colors.success,
  },
  lessonNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  lessonDuration: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  startButtonContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

export default ModuleDetailScreen;
