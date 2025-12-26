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
import type {LearnStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<LearnStackParamList, 'ModuleContent'>;

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

// Mock lesson content
const mockLessonContent: Record<string, {
  moduleTitle: string;
  totalLessons: number;
  lessons: {
    id: string;
    title: string;
    duration: string;
    content: {
      type: 'text' | 'heading' | 'image' | 'tip' | 'example';
      content: string;
    }[];
  }[];
}> = {
  'tell-me-about-yourself': {
    moduleTitle: 'Tell Me About Yourself',
    totalLessons: 4,
    lessons: [
      {
        id: '1',
        title: 'Understanding the Question',
        duration: '3 min',
        content: [
          {type: 'heading', content: 'Why This Question Matters'},
          {type: 'text', content: '"Tell me about yourself" is often the opening question in interviews. It sets the tone for the entire conversation and gives you a chance to make a strong first impression.'},
          {type: 'image', content: 'interview_opening'},
          {type: 'heading', content: 'What Interviewers Really Want'},
          {type: 'text', content: 'Interviewers aren\'t asking for your life story. They want to know:\n\n• Your professional background\n• Why you\'re qualified for this role\n• What makes you unique\n• Your motivation and enthusiasm'},
          {type: 'tip', content: 'Keep your answer between 1-2 minutes. Longer responses lose the interviewer\'s attention.'},
          {type: 'heading', content: 'Common Mistakes to Avoid'},
          {type: 'text', content: '1. Starting with "Well, I was born in..."\n2. Listing your entire resume\n3. Being too vague or generic\n4. Forgetting to connect to the role'},
        ],
      },
      {
        id: '2',
        title: 'The Present-Past-Future Formula',
        duration: '5 min',
        content: [
          {type: 'heading', content: 'A Proven Structure'},
          {type: 'text', content: 'The Present-Past-Future formula is a simple yet effective way to structure your answer. It keeps you focused and ensures you cover all the important points.'},
          {type: 'heading', content: '1. Present'},
          {type: 'text', content: 'Start with your current role and what you do. Highlight your main responsibilities and recent achievements.\n\nExample: "I\'m currently a software developer at TechCorp, where I lead the mobile app development team."'},
          {type: 'heading', content: '2. Past'},
          {type: 'text', content: 'Briefly mention your relevant background - education, previous roles, key experiences that led you here.\n\nExample: "I studied Computer Science at Delhi University and spent 2 years building e-commerce platforms."'},
          {type: 'image', content: 'timeline_visual'},
          {type: 'heading', content: '3. Future'},
          {type: 'text', content: 'Connect to why you\'re excited about this opportunity and how it aligns with your career goals.\n\nExample: "I\'m excited about this role because it combines my mobile development expertise with my passion for fintech."'},
          {type: 'tip', content: 'The "Future" part should directly connect to the job you\'re applying for.'},
        ],
      },
      {
        id: '3',
        title: 'Crafting Your Story',
        duration: '4 min',
        content: [
          {type: 'heading', content: 'Make It Personal'},
          {type: 'text', content: 'Your introduction should feel authentic, not rehearsed. Include elements that make you memorable and showcase your personality.'},
          {type: 'heading', content: 'Key Elements to Include'},
          {type: 'text', content: '• A hook that grabs attention\n• Specific achievements with numbers\n• Relevant skills and experiences\n• Genuine enthusiasm for the role'},
          {type: 'example', content: '"I\'m a product designer who believes great design should be invisible. At my current role, I redesigned our checkout flow which increased conversions by 34%. I\'m passionate about creating experiences that delight users, which is why I\'m excited about this opportunity at [Company]."'},
          {type: 'heading', content: 'Tailoring for Different Contexts'},
          {type: 'text', content: 'Your answer should vary based on:\n\n• The company culture (formal vs. casual)\n• The role level (entry vs. senior)\n• The industry (tech vs. finance vs. creative)'},
          {type: 'tip', content: 'Research the company beforehand and adjust your language and examples accordingly.'},
        ],
      },
      {
        id: '4',
        title: 'Practice & Examples',
        duration: '3 min',
        content: [
          {type: 'heading', content: 'Example Answers'},
          {type: 'example', content: 'For a Marketing Role:\n\n"I\'m a digital marketing specialist with 4 years of experience driving growth for B2B SaaS companies. Currently at StartupX, I\'ve built a content strategy that increased organic traffic by 150%. Before this, I worked at an agency where I managed campaigns for Fortune 500 clients. I\'m excited about this role because [Company]\'s mission to democratize education aligns perfectly with my passion for creating meaningful impact."'},
          {type: 'example', content: 'For a Fresh Graduate:\n\n"I recently graduated from IIT Delhi with a degree in Computer Science, where I maintained a 9.0 GPA while leading the technical team for our college fest app. During my internship at TechCorp, I developed a feature that reduced customer complaints by 40%. I\'m eager to bring my technical skills and fresh perspective to [Company]\'s engineering team."'},
          {type: 'heading', content: 'Practice Tips'},
          {type: 'text', content: '1. Record yourself and watch it back\n2. Practice in front of a mirror\n3. Time your response (aim for 60-90 seconds)\n4. Get feedback from friends or mentors'},
          {type: 'tip', content: 'The more you practice, the more natural your delivery will become. But don\'t memorize word-for-word - that sounds robotic.'},
        ],
      },
    ],
  },
};

// Default content for other modules
const defaultLessonContent = {
  moduleTitle: 'Module',
  totalLessons: 3,
  lessons: [
    {
      id: '1',
      title: 'Introduction',
      duration: '3 min',
      content: [
        {type: 'heading' as const, content: 'Welcome to this Module'},
        {type: 'text' as const, content: 'This lesson will introduce you to the key concepts and prepare you for the learning journey ahead.'},
        {type: 'image' as const, content: 'placeholder'},
        {type: 'tip' as const, content: 'Take notes as you go through the lessons to reinforce your learning.'},
      ],
    },
  ],
};

export const ModuleContentScreen: React.FC<Props> = ({navigation, route}) => {
  const {moduleId, lessonIndex} = route.params;
  const [isCompleted, setIsCompleted] = useState(false);

  const moduleContent = mockLessonContent[moduleId] || defaultLessonContent;
  const currentLesson = moduleContent.lessons[lessonIndex] || moduleContent.lessons[0];
  const totalLessons = moduleContent.totalLessons;
  const progress = (lessonIndex + 1) / totalLessons;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePrevious = useCallback(() => {
    if (lessonIndex > 0) {
      navigation.replace('ModuleContent', {
        moduleId,
        lessonIndex: lessonIndex - 1,
      });
    }
  }, [navigation, moduleId, lessonIndex]);

  const handleNext = useCallback(() => {
    if (lessonIndex < totalLessons - 1) {
      navigation.replace('ModuleContent', {
        moduleId,
        lessonIndex: lessonIndex + 1,
      });
    } else {
      // Last lesson, go to completion
      navigation.navigate('ModuleComplete', {
        moduleId,
        xpEarned: 50,
        badgeEarned: lessonIndex === totalLessons - 1 ? 'Module Master' : undefined,
      });
    }
  }, [navigation, moduleId, lessonIndex, totalLessons]);

  const handleMarkComplete = useCallback(() => {
    setIsCompleted(true);
    // Auto-navigate to next after marking complete
    setTimeout(() => {
      handleNext();
    }, 500);
  }, [handleNext]);

  const renderContentBlock = (
    block: {type: string; content: string},
    index: number
  ) => {
    switch (block.type) {
      case 'heading':
        return (
          <Text key={index} style={styles.contentHeading}>
            {block.content}
          </Text>
        );
      case 'text':
        return (
          <Text key={index} style={styles.contentText}>
            {block.content}
          </Text>
        );
      case 'image':
        return (
          <View key={index} style={styles.imagePlaceholder}>
            <Icon name="image" size={48} color={colors.divider} />
            <Text style={styles.imagePlaceholderText}>
              Illustration: {block.content}
            </Text>
          </View>
        );
      case 'tip':
        return (
          <View key={index} style={styles.tipBox}>
            <View style={styles.tipHeader}>
              <Icon name="lightbulb-on" size={18} color={colors.secondary} />
              <Text style={styles.tipTitle}>Pro Tip</Text>
            </View>
            <Text style={styles.tipContent}>{block.content}</Text>
          </View>
        );
      case 'example':
        return (
          <View key={index} style={styles.exampleBox}>
            <View style={styles.exampleHeader}>
              <Icon name="format-quote-open" size={18} color={colors.primary} />
              <Text style={styles.exampleTitle}>Example</Text>
            </View>
            <Text style={styles.exampleContent}>{block.content}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Progress Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Icon name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Lesson {lessonIndex + 1} of {totalLessons}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Lesson Title */}
        <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
        <View style={styles.lessonMeta}>
          <Icon name="clock-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.lessonDuration}>{currentLesson.duration}</Text>
        </View>

        {/* Lesson Content */}
        <View style={styles.contentContainer}>
          {currentLesson.content.map((block, index) =>
            renderContentBlock(block, index)
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            onPress={handlePrevious}
            style={[
              styles.navButton,
              lessonIndex === 0 && styles.navButtonDisabled,
            ]}
            disabled={lessonIndex === 0}
            accessibilityRole="button"
            accessibilityLabel="Previous lesson">
            <Icon
              name="chevron-left"
              size={24}
              color={lessonIndex === 0 ? colors.divider : colors.textSecondary}
            />
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={isCompleted ? handleNext : handleMarkComplete}
            style={[
              styles.completeButton,
              isCompleted && styles.completeButtonDone,
            ]}
            contentStyle={styles.completeButtonContent}
            labelStyle={styles.completeButtonLabel}
            icon={({color}) => (
              <Icon
                name={isCompleted ? 'check' : 'check-circle-outline'}
                size={20}
                color={color}
              />
            )}
            accessibilityRole="button"
            accessibilityLabel={isCompleted ? 'Continue to next' : 'Mark lesson complete'}>
            {isCompleted
              ? lessonIndex < totalLessons - 1
                ? 'Next Lesson'
                : 'Complete Module'
              : 'Mark Complete'}
          </Button>

          <TouchableOpacity
            onPress={handleNext}
            style={styles.navButton}
            accessibilityRole="button"
            accessibilityLabel="Next lesson">
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: spacing.md,
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
    marginRight: spacing.sm,
  },
  progressSection: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  lessonDuration: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  contentContainer: {
    gap: spacing.md,
  },
  contentHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  contentText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  imagePlaceholder: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  tipBox: {
    backgroundColor: `${colors.secondary}10`,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: spacing.sm,
  },
  tipContent: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  exampleBox: {
    backgroundColor: `${colors.primary}08`,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  exampleContent: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  bottomContainer: {
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
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  completeButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  completeButtonDone: {
    backgroundColor: colors.success,
  },
  completeButtonContent: {
    height: 48,
    flexDirection: 'row-reverse',
  },
  completeButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

export default ModuleContentScreen;
