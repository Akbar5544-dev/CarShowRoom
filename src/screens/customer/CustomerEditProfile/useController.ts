import {useCallback, useMemo, useState} from 'react';
import {Alert, type ImageSourcePropType} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Images} from '../../../assets';
import {pickFromGallery} from '../../../utils/mediaPicker';
import {useAppSelector} from '../../../store/hooks';
import type {CustomerHomeStackParamList} from '../../../navigation/types';
import type {BackgroundThumb, EditProfileController} from './module';

type Nav = NativeStackNavigationProp<
  CustomerHomeStackParamList,
  'CustomerEditProfile'
>;

function splitName(full: string): {first: string; last: string} {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return {first: 'Ali', last: 'Hassan'};
  }
  if (parts.length === 1) {
    return {first: parts[0], last: ''};
  }
  return {first: parts[0], last: parts.slice(1).join(' ')};
}

export function useEditProfileController(): EditProfileController {
  const navigation = useNavigation<Nav>();
  const storedName = useAppSelector(state => state.app.userName);
  const storedEmail = useAppSelector(state => {
    const email = state.app.user?.email;
    return typeof email === 'string' && email.trim()
      ? email
      : 'ali@email.com';
  });

  const initial = useMemo(
    () => splitName(storedName || 'Ali Hassan'),
    [storedName],
  );

  const [firstName, setFirstName] = useState(initial.first || 'Ali');
  const [lastName, setLastName] = useState(initial.last || 'Hassan');
  const [phone, setPhone] = useState('0300-1234567');
  const [email, setEmail] = useState(storedEmail);
  const [password, setPassword] = useState('password');
  const [city, setCity] = useState('Lahore, Pakistan');
  const [address, setAddress] = useState(
    'House 12, Street 4, DHA Phase 5, Lahore',
  );
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [customBgUri, setCustomBgUri] = useState<string | null>(null);
  const [selectedBgId, setSelectedBgId] = useState('bg-1');

  const backgroundThumbs = useMemo<BackgroundThumb[]>(
    () => [
      {id: 'bg-1', source: Images.fleetVehicle, tint: '#1e3a8a'},
      {id: 'bg-2', source: null, tint: '#0f172a'},
      {id: 'bg-3', source: Images.profileAvatar, tint: '#334155'},
      {id: 'bg-4', source: null, tint: '#1d4ed8'},
      {id: 'bg-5', source: null, tint: '#64748b'},
    ],
    [],
  );

  const selectedThumb = backgroundThumbs.find(t => t.id === selectedBgId);

  const profileSource = useMemo<ImageSourcePropType | null>(() => {
    if (profileUri) {
      return {uri: profileUri};
    }
    return Images.profileAvatar;
  }, [profileUri]);

  const backgroundSource = useMemo<ImageSourcePropType | null>(() => {
    if (customBgUri) {
      return {uri: customBgUri};
    }
    return selectedThumb?.source ?? null;
  }, [customBgUri, selectedThumb]);

  const backgroundTint = selectedThumb?.tint ?? '#e5e7eb';

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSave = useCallback(() => {
    Alert.alert('Saved', 'Your profile changes have been saved.');
    navigation.goBack();
  }, [navigation]);

  const onChangeProfilePhoto = useCallback(async () => {
    const media = await pickFromGallery();
    if (media?.uri) {
      setProfileUri(media.uri);
    }
  }, []);

  const onChangeBackground = useCallback(async () => {
    const media = await pickFromGallery();
    if (media?.uri) {
      setCustomBgUri(media.uri);
      setSelectedBgId('custom');
    }
  }, []);

  const onSelectBackground = useCallback((id: string) => {
    setSelectedBgId(id);
    setCustomBgUri(null);
  }, []);

  const onUseCurrentLocation = useCallback(() => {
    setCity('Lahore, Pakistan');
    setAddress('Current location · Lahore, Pakistan');
    Alert.alert('Location', 'Using your current location.');
  }, []);

  return {
    firstName,
    lastName,
    phone,
    email,
    password,
    city,
    address,
    profileSource,
    backgroundSource,
    backgroundTint,
    backgroundThumbs,
    selectedBgId: customBgUri ? 'custom' : selectedBgId,
    setFirstName,
    setLastName,
    setPhone,
    setEmail,
    setPassword,
    setCity,
    setAddress,
    onBack,
    onSave,
    onChangeProfilePhoto,
    onChangeBackground,
    onSelectBackground,
    onUseCurrentLocation,
  };
}
