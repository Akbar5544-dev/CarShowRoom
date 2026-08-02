import type {IconName} from '../../../assets/iconXml';

export type LanguageId = 'en' | 'ur' | 'de' | 'ar' | 'fr' | 'es';

export type LanguageOption = {
  id: LanguageId;
  label: string;
  region: string;
  flag: IconName;
};

export type LanguagesController = {
  userName: string;
  dateLabel: string;
  options: LanguageOption[];
  selectedId: LanguageId;
  onSelect: (id: LanguageId) => void;
  onBackPress: () => void;
};
