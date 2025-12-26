import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '@app-types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

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
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Mock initial data
const initialData = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  college: 'Delhi University',
  branch: 'Computer Science',
  graduationYear: '2024',
  targetRole: 'Software Developer',
  targetCompanies: ['Google', 'Microsoft', 'Amazon'],
};

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const branchOptions = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Other',
];

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  editable?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
  multiline?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = true,
  rightIcon,
  onRightIconPress,
  multiline,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          !editable && styles.inputDisabled,
          multiline && styles.inputMultiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        editable={editable}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {rightIcon && (
        <TouchableOpacity
          style={styles.rightIconButton}
          onPress={onRightIconPress}
          accessibilityLabel="Edit">
          <Icon name={rightIcon} size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export const EditProfileScreen: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [phone, setPhone] = useState(initialData.phone);
  const [college, setCollege] = useState(initialData.college);
  const [branch, setBranch] = useState(initialData.branch);
  const [graduationYear, setGraduationYear] = useState(initialData.graduationYear);
  const [targetRole, setTargetRole] = useState(initialData.targetRole);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleBack = useCallback(() => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Discard', style: 'destructive', onPress: () => navigation.goBack()},
        ],
      );
    } else {
      navigation.goBack();
    }
  }, [navigation, hasChanges]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    Alert.alert('Success', 'Your profile has been updated.', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  }, [navigation]);

  const handlePhoneChange = useCallback(() => {
    Alert.alert(
      'Change Phone Number',
      'Changing your phone number requires OTP verification. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Continue', onPress: () => console.log('Navigate to phone change')},
      ],
    );
  }, []);

  const handlePhotoChange = useCallback(() => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        {text: 'Take Photo', onPress: () => console.log('Open camera')},
        {text: 'Choose from Gallery', onPress: () => console.log('Open gallery')},
        {text: 'Remove Photo', style: 'destructive', onPress: () => console.log('Remove photo')},
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  }, []);

  const updateField = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setHasChanges(true);
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
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Button
          mode="text"
          onPress={handleSave}
          loading={isSaving}
          disabled={!hasChanges || isSaving}
          labelStyle={[
            styles.saveButtonLabel,
            (!hasChanges || isSaving) && styles.saveButtonLabelDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Save changes">
          Save
        </Button>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <View style={styles.photoPlaceholder}>
              <Icon name="account" size={48} color={colors.surface} />
            </View>
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handlePhotoChange}
              accessibilityLabel="Change profile photo">
              <Icon name="camera" size={18} color={colors.surface} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handlePhotoChange}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.sectionCard}>
            <FormField
              label="Full Name"
              value={name}
              onChangeText={updateField(setName)}
              placeholder="Enter your full name"
            />
            <View style={styles.fieldDivider} />
            <FormField
              label="Email"
              value={email}
              onChangeText={updateField(setEmail)}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            <View style={styles.fieldDivider} />
            <FormField
              label="Phone Number"
              value={phone}
              onChangeText={() => {}}
              editable={false}
              rightIcon="pencil"
              onRightIconPress={handlePhoneChange}
            />
            <View style={styles.otpNote}>
              <Icon name="information-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.otpNoteText}>
                Changing phone number requires OTP verification
              </Text>
            </View>
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.sectionCard}>
            <FormField
              label="College/University"
              value={college}
              onChangeText={updateField(setCollege)}
              placeholder="Enter your college name"
            />
            <View style={styles.fieldDivider} />
            <FormField
              label="Branch/Major"
              value={branch}
              onChangeText={updateField(setBranch)}
              placeholder="Select your branch"
            />
            <View style={styles.fieldDivider} />
            <FormField
              label="Graduation Year"
              value={graduationYear}
              onChangeText={updateField(setGraduationYear)}
              placeholder="YYYY"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Career Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Goals</Text>
          <View style={styles.sectionCard}>
            <FormField
              label="Target Role"
              value={targetRole}
              onChangeText={updateField(setTargetRole)}
              placeholder="What role are you targeting?"
            />
            <View style={styles.fieldDivider} />
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Target Companies</Text>
              <View style={styles.chipsContainer}>
                {initialData.targetCompanies.map((company, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{company}</Text>
                    <TouchableOpacity
                      style={styles.chipRemove}
                      accessibilityLabel={`Remove ${company}`}>
                      <Icon name="close" size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addChip}>
                  <Icon name="plus" size={16} color={colors.primary} />
                  <Text style={styles.addChipText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteAccountButton}>
          <Icon name="delete-outline" size={20} color={colors.error} />
          <Text style={styles.deleteAccountText}>Delete Account</Text>
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
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  saveButtonLabelDisabled: {
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  section: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  fieldContainer: {
    paddingVertical: spacing.md,
  },
  fieldLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  inputDisabled: {
    color: colors.textSecondary,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rightIconButton: {
    padding: spacing.sm,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  otpNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  otpNoteText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  chipRemove: {
    marginLeft: spacing.xs,
    padding: 2,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addChipText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  deleteAccountText: {
    fontSize: 15,
    color: colors.error,
    marginLeft: spacing.sm,
  },
});

export default EditProfileScreen;
