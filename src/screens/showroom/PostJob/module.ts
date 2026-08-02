import {IconName} from '../../../assets/iconXml';

export type PostJobStepId = 0 | 1 | 2 | 3;

export type PostJobStep = {
  id: PostJobStepId;
  label: string;
  icon: IconName;
};

export type PostJobForm = {
  jobTitle: string;
  department: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  workMode: string;
  openings: string;
  applicationDeadline: string;
  summary: string;
  responsibilities: string;
  whatYoullDo: string;
  mustHaveSkills: string;
  niceToHaveSkills: string;
  education: string;
  yearsOfExperience: string;
  certifications: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  payFrequency: string;
  benefits: string;
};

export type PostJobReviewCard = {
  id: string;
  label: string;
  value: string;
  icon: IconName;
};

export type PostJobController = {
  currentStep: PostJobStepId;
  steps: PostJobStep[];
  form: PostJobForm;
  stepSubtitle: string;
  canGoPrevious: boolean;
  isLastStep: boolean;
  reviewDescription: string;
  reviewCards: PostJobReviewCard[];
  setField: <K extends keyof PostJobForm>(
    key: K,
    value: PostJobForm[K],
  ) => void;
  onBackPress: () => void;
  onPrevious: () => void;
  onContinue: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};
