import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import type {HomeStackParamList} from '../../../navigation/types';
import {authService} from '../../../services';
import {asRecord, pickString, unwrapData} from '../../../utils/apiHelpers';
import {pickFromCamera, pickFromGallery} from '../../../utils/mediaPicker';
import type {MyProfileController, MyProfileForm} from './module';

type MyProfileNav = NativeStackNavigationProp<HomeStackParamList, 'MyProfile'>;

const INITIAL_FORM: MyProfileForm = {
  fullName: '',
  email: '',
  phone: '',
  role: '',
  location: '',
  timeZone: '',
};

function roleLabelFrom(user: Record<string, any>): string {
  const roles = Array.isArray(user.roles) ? user.roles : [];
  if (!roles.length) {
    return '';
  }
  const labels = roles.map(role =>
    typeof role === 'string'
      ? role
      : pickString(asRecord(role), ['name', 'title'], ''),
  );
  return labels.filter(Boolean).join(' · ');
}

export function useMyProfileController(): MyProfileController {
  const navigation = useNavigation<MyProfileNav>();
  const [form, setForm] = useState<MyProfileForm>(INITIAL_FORM);
  const [displayRole, setDisplayRole] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await authService.getMe();
        const data = asRecord(unwrapData(response));
        const user = asRecord(data.user ?? data);
        if (cancelled || !Object.keys(user).length) {
          return;
        }
        const roleLabel = roleLabelFrom(user);
        setForm(prev => ({
          fullName: pickString(user, ['name', 'full_name'], prev.fullName),
          email: pickString(user, ['email'], prev.email),
          phone: pickString(user, ['phone', 'phone_number'], prev.phone),
          role: roleLabel || prev.role,
          location: pickString(user, ['location', 'city'], prev.location),
          timeZone: pickString(user, ['timezone', 'time_zone'], prev.timeZone),
        }));
        const remoteAvatar = pickString(
          user,
          ['avatar', 'photo', 'photo_url', 'profile_photo'],
          '',
        );
        if (remoteAvatar) {
          setAvatarUri(remoteAvatar);
        }
        if (roleLabel) {
          setDisplayRole(roleLabel);
        }
      } catch {
        // Keep defaults if /me is unavailable
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = useCallback((key: keyof MyProfileForm, value: string) => {
    setForm(prev => ({...prev, [key]: value}));
  }, []);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCancelPress = useCallback(() => {
    setForm(INITIAL_FORM);
    navigation.goBack();
  }, [navigation]);

  const onSavePress = useCallback(() => {
    showMessage({
      message: 'Profile synced',
      description: 'Your personal information is up to date.',
      type: 'success',
    });
    navigation.goBack();
  }, [navigation]);

  const onUploadPress = useCallback(async () => {
    const media = await pickFromGallery();
    if (!media) {
      return;
    }
    setAvatarUri(media.uri);
    showMessage({message: 'Photo selected', type: 'success'});
  }, []);

  const onRemovePress = useCallback(() => {
    setAvatarUri(null);
    showMessage({message: 'Photo removed', type: 'info'});
  }, []);

  const onCameraPress = useCallback(async () => {
    const media = await pickFromCamera();
    if (!media) {
      return;
    }
    setAvatarUri(media.uri);
    showMessage({message: 'Photo captured', type: 'success'});
  }, []);

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    displayName: form.fullName,
    displayRole,
    avatarUri,
    form,
    setField,
    onBackPress,
    onUploadPress,
    onRemovePress,
    onCameraPress,
    onCancelPress,
    onSavePress,
  };
}
