import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {
  authService,
  settingsStaffProfileService,
} from '../../../services';
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
        let user: Record<string, any> = {};
        try {
          const profileRes = await settingsStaffProfileService.getProfile();
          user = asRecord(unwrapData(profileRes));
        } catch {
          const response = await authService.getMe();
          const data = asRecord(unwrapData(response));
          user = asRecord(data.user ?? data);
        }
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
          timeZone: pickString(
            user,
            ['timezone', 'time_zone', 'language'],
            prev.timeZone,
          ),
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
        // Keep defaults if profile is unavailable
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
    navigation.goBack();
  }, [navigation]);

  const onSavePress = useCallback(async () => {
    try {
      await settingsStaffProfileService.updateProfile({
        name: form.fullName.trim(),
        phone: form.phone.trim() || null,
        language: form.timeZone.trim() || null,
      });
      showMessage({
        message: 'Profile updated',
        description: 'Your personal information is up to date.',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to update profile'),
        type: 'danger',
      });
    }
  }, [form.fullName, form.phone, form.timeZone, navigation]);

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
    userName: form.fullName.split(/\s+/)[0] || 'User',
    dateLabel: new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
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
