export type CompanyBrandColorId = 'blue' | 'green' | 'orange' | 'purple';

export type CompanyBrandColor = {
  id: CompanyBrandColorId;
  color: string;
};

export type CompanyForm = {
  companyName: string;
  taxId: string;
  address: string;
  website: string;
  supportEmail: string;
  currency: string;
};

export type CompanyProfileController = {
  userName: string;
  dateLabel: string;
  brandColors: CompanyBrandColor[];
  selectedColorId: CompanyBrandColorId;
  form: CompanyForm;
  logoUri: string | null;
  isUploadingLogo: boolean;
  setField: (key: keyof CompanyForm, value: string) => void;
  onSelectColor: (id: CompanyBrandColorId) => void;
  onBackPress: () => void;
  onUploadLogoPress: () => void;
  onSavePress: () => void;
};
