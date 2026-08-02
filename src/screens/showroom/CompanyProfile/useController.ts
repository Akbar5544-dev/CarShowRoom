import {colors as defaultColors, useThemeColors} from '../../../theme';
import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {settingsShowroomProfileService} from '../../../services';
import {asRecord, pickString, unwrapData} from '../../../utils/apiHelpers';
import {createMediaFormData, pickFromGallery} from '../../../utils/mediaPicker';
import type {
  CompanyBrandColor,
  CompanyBrandColorId,
  CompanyForm,
  CompanyProfileController,
} from './module';

type CompanyNav = NativeStackNavigationProp<HomeStackParamList, 'CompanyProfile'>;

const BRAND_COLORS: CompanyBrandColor[] = [
  {id: 'blue', color: defaultColors.statusRented},
  {id: 'green', color: '#22C55E'},
  {id: 'orange', color: '#F97316'},
  {id: 'purple', color: '#A855F7'},
];

const INITIAL_FORM: CompanyForm = {
  companyName: '',
  taxId: '',
  address: '',
  website: '',
  supportEmail: '',
  currency: '',
};

export function useCompanyProfileController(): CompanyProfileController {
  const colors = useThemeColors();
  const navigation = useNavigation<CompanyNav>();
  const [form, setForm] = useState<CompanyForm>(INITIAL_FORM);
  const [selectedColorId, setSelectedColorId] =
    useState<CompanyBrandColorId>('blue');
  const [isSaving, setIsSaving] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response =
          await settingsShowroomProfileService.listShowroomProfile();
        const profile = asRecord(unwrapData(response));
        if (cancelled || !Object.keys(profile).length) {
          return;
        }
        setForm(prev => ({
          companyName: pickString(
            profile,
            ['name', 'showroom_name'],
            prev.companyName,
          ),
          taxId: pickString(profile, ['registration_no', 'tax_id'], prev.taxId),
          address: pickString(profile, ['address'], prev.address),
          website: pickString(profile, ['website'], prev.website),
          supportEmail: pickString(
            profile,
            ['support_email', 'email'],
            prev.supportEmail,
          ),
          currency: pickString(profile, ['currency'], prev.currency),
        }));
        const remoteLogo = pickString(
          profile,
          ['logo', 'logo_url', 'image', 'image_url'],
          '',
        );
        if (remoteLogo) {
          setLogoUri(remoteLogo);
        }
      } catch {
        // Keep defaults if showroom profile can't be loaded
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = useCallback((key: keyof CompanyForm, value: string) => {
    setForm(prev => ({...prev, [key]: value}));
  }, []);

  const onSelectColor = useCallback((id: CompanyBrandColorId) => {
    setSelectedColorId(id);
  }, []);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSavePress = useCallback(async () => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      await settingsShowroomProfileService.updateShowroomProfile({
        name: form.companyName,
        registration_no: form.taxId,
        address: form.address,
        website: form.website,
        support_email: form.supportEmail,
        currency: form.currency,
      });
      showMessage({message: 'Company profile updated', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to update company profile'),
        type: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  }, [form, isSaving, navigation]);

  const onUploadLogoPress = useCallback(async () => {
    if (isUploadingLogo) {
      return;
    }
    const media = await pickFromGallery();
    if (!media) {
      return;
    }
    setIsUploadingLogo(true);
    try {
      await settingsShowroomProfileService.uploadLogo(
        createMediaFormData('logo', media),
      );
      setLogoUri(media.uri);
      showMessage({message: 'Logo uploaded', type: 'success'});
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to upload logo'),
        type: 'danger',
      });
    } finally {
      setIsUploadingLogo(false);
    }
  }, [isUploadingLogo]);

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    brandColors: BRAND_COLORS,
    selectedColorId,
    form,
    logoUri,
    isUploadingLogo,
    setField,
    onSelectColor,
    onBackPress,
    onUploadLogoPress,
    onSavePress,
  };
}
