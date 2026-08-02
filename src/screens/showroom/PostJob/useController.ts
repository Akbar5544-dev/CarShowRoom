import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  PostJobController,
  PostJobForm,
  PostJobReviewCard,
  PostJobStep,
  PostJobStepId,
} from './module';

const STEPS: PostJobStep[] = [
  {id: 0, label: 'Basics', icon: 'briefcase'},
  {id: 1, label: 'Description', icon: 'documentFile'},
  {id: 2, label: 'Requirements', icon: 'listCheck'},
  {id: 3, label: 'Review', icon: 'roleEye'},
];

const INITIAL_FORM: PostJobForm = {
  jobTitle: '',
  department: '',
  employmentType: '',
  experienceLevel: '',
  location: '',
  workMode: '',
  openings: '',
  applicationDeadline: '',
  summary: '',
  responsibilities: '',
  whatYoullDo: '',
  mustHaveSkills: '',
  niceToHaveSkills: '',
  education: '',
  yearsOfExperience: '',
  certifications: '',
  salaryMin: '',
  salaryMax: '',
  currency: '',
  payFrequency: '',
  benefits: '',
};

function formatSalary(min: string, max: string) {
  const clean = (v: string) => v.replace(/[^\d.]/g, '');
  const minNum = Number(clean(min));
  const maxNum = Number(clean(max));
  if (Number.isFinite(minNum) && Number.isFinite(maxNum) && minNum > 100) {
    return `$${minNum.toLocaleString('en-US')} – ${maxNum.toLocaleString(
      'en-US',
    )} / month`;
  }
  return '$4,200 – 5,800 / month';
}

function formatExperience(level: string, years: string) {
  const selectedLevel = level.trim();
  const selectedYears = years.trim();

  if (selectedLevel && selectedYears) {
    return `${selectedLevel} · ${selectedYears}`;
  }
  return selectedYears || selectedLevel || 'Not specified';
}

export function usePostJobController(): PostJobController {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList, 'PostJob'>>();
  const [currentStep, setCurrentStep] = useState<PostJobStepId>(0);
  const [form, setForm] = useState<PostJobForm>(INITIAL_FORM);

  const setField = useCallback(
    <K extends keyof PostJobForm>(key: K, value: PostJobForm[K]) => {
      setForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const canGoPrevious = currentStep > 0;
  const isLastStep = currentStep === 3;
  const stepSubtitle = `Step ${currentStep + 1} of 4 · ${STEPS[currentStep].label}`;

  const reviewDescription =
    form.summary.trim() && form.summary !== 'Senior Fleet Manager'
      ? form.summary
      : "Lead our growing fleet operations across the region. You'll own driver scheduling, vehicle rotation, and cost optimization.";

  const reviewCards = useMemo<PostJobReviewCard[]>(
    () => [
      {
        id: 'title',
        label: 'Title',
        value: form.jobTitle,
        icon: 'briefcase',
      },
      {
        id: 'department',
        label: 'Department',
        value: `${form.department} · ${form.employmentType}`,
        icon: 'building',
      },
      {
        id: 'location',
        label: 'Location',
        value: `${form.location} · ${form.workMode}`,
        icon: 'location',
      },
      {
        id: 'openings',
        label: 'Openings',
        value: `${form.openings} position${form.openings === '1' ? '' : 's'}`,
        icon: 'customers',
      },
      {
        id: 'experience',
        label: 'Experience',
        value: formatExperience(
          form.experienceLevel,
          form.yearsOfExperience,
        ),
        icon: 'shiftClock',
      },
      {
        id: 'salary',
        label: 'Salary',
        value: formatSalary(form.salaryMin, form.salaryMax),
        icon: 'activityDollar',
      },
    ],
    [form],
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPrevious = useCallback(() => {
    if (!canGoPrevious) {
      return;
    }
    setCurrentStep(prev => (prev - 1) as PostJobStepId);
  }, [canGoPrevious]);

  const onContinue = useCallback(() => {
    if (isLastStep) {
      return;
    }
    setCurrentStep(prev => (prev + 1) as PostJobStepId);
  }, [isLastStep]);

  const onSaveDraft = useCallback(() => {
    showMessage({
      message:
        'Draft save is unavailable — backend has no hiring job-post create API yet.',
      type: 'warning',
    });
  }, []);

  const onPublish = useCallback(() => {
    showMessage({
      message:
        'Cannot publish: Swagger only exposes public browse/apply (/public/jobs). No admin create job-post endpoint.',
      type: 'danger',
      duration: 4500,
    });
  }, []);

  return {
    currentStep,
    steps: STEPS,
    form,
    stepSubtitle,
    canGoPrevious,
    isLastStep,
    reviewDescription,
    reviewCards,
    setField,
    onBackPress,
    onPrevious,
    onContinue,
    onSaveDraft,
    onPublish,
  };
}
