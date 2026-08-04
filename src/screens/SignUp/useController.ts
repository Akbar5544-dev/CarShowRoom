import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {
  extractAuthToken,
  extractAuthUser,
  getApiErrorMessage,
  setAuthTokenForRole,
  setAuthUser,
} from '../../api';
import type {RootStackParamList} from '../../navigation/types';
import {authService, publicSiteAuthService} from '../../services';
import {setSession} from '../../store/appSlice';
import {useAppDispatch} from '../../store/hooks';
import {
  rememberAuthRole,
  setActiveAuthRole,
  type AuthRole,
  withAuthRole,
} from '../../utils/authRole';
import {
  validateAuthEmail,
  validateAuthFullName,
  validateAuthPassword,
  validateAuthPhone,
} from '../../utils/authValidation';
import {pickFromGallery, type PickedMedia} from '../../utils/mediaPicker';
import {
  CITY_OPTIONS,
  type SignUpController,
  type SignUpFieldErrors,
  type SignUpRoleOption,
} from './module';

type SignUpNav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const ROLE_OPTIONS: SignUpRoleOption[] = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Buy, rent, save & message showrooms',
  },
  {
    id: 'admin',
    title: 'Showroom / Admin',
    description: 'List inventory and manage leads',
  },
];

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length > 10) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return `92${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `92${digits}`;
  }
  return digits;
}

export function useSignUpController(): SignUpController {
  const navigation = useNavigation<SignUpNav>();
  const dispatch = useAppDispatch();
  const [role, setRoleState] = useState<AuthRole>('customer');
  const [email, setEmailState] = useState('');
  const [fullName, setFullNameState] = useState('');
  const [showroomName, setShowroomNameState] = useState('');
  const [logo, setLogo] = useState<PickedMedia | null>(null);
  const [country, setCountryState] = useState<string | null>(null);
  const [city, setCityState] = useState<string | null>(null);
  const [address, setAddressState] = useState('');
  const [phone, setPhoneState] = useState('');
  const [password, setPasswordState] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<SignUpFieldErrors>({});
  const [loading, setLoading] = useState(false);

  const cityOptions = useMemo(
    () => (country ? CITY_OPTIONS[country] ?? [] : []),
    [country],
  );

  const setRole = useCallback((value: AuthRole) => {
    setRoleState(value);
    setErrors({});
  }, []);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    setErrors(prev => ({...prev, email: undefined}));
  }, []);

  const setFullName = useCallback((value: string) => {
    setFullNameState(value);
    setErrors(prev => ({...prev, fullName: undefined}));
  }, []);

  const setShowroomName = useCallback((value: string) => {
    setShowroomNameState(value);
    setErrors(prev => ({...prev, showroomName: undefined}));
  }, []);

  const setPhone = useCallback((value: string) => {
    setPhoneState(value);
    setErrors(prev => ({...prev, phone: undefined}));
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors(prev => ({...prev, password: undefined}));
  }, []);

  const setCountry = useCallback((value: string | null) => {
    setCountryState(value);
    setCityState(null);
  }, []);

  const setCity = useCallback((value: string | null) => {
    setCityState(value);
  }, []);

  const setAddress = useCallback((value: string) => {
    setAddressState(value);
  }, []);

  const onTogglePassword = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  const onToggleTerms = useCallback(() => {
    setAgreedToTerms(prev => !prev);
    setErrors(prev => ({...prev, terms: undefined}));
  }, []);

  const onPickLogo = useCallback(async () => {
    const picked = await pickFromGallery();
    if (picked) {
      if (picked.fileSize && picked.fileSize > 5 * 1024 * 1024) {
        showMessage({message: 'Logo must be under 5MB', type: 'warning'});
        return;
      }
      setLogo(picked);
    }
  }, []);

  const onClearLogo = useCallback(() => setLogo(null), []);

  const onCreateAccount = useCallback(async () => {
    const nextErrors: SignUpFieldErrors = {};
    const emailError = validateAuthEmail(email);
    const fullNameError = validateAuthFullName(fullName);
    const passwordError = validateAuthPassword(password, {minLength: 8});
    const phoneError = validateAuthPhone(phone);
    if (emailError) nextErrors.email = emailError;
    if (fullNameError) nextErrors.fullName = fullNameError;
    if (passwordError) nextErrors.password = passwordError;
    if (phoneError) nextErrors.phone = phoneError;
    if (role === 'admin' && !showroomName.trim()) {
      nextErrors.showroomName = 'Please enter showroom name';
    }
    if (!agreedToTerms) {
      nextErrors.terms = 'Please agree to the Terms of Service';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    try {
      setLoading(true);
      const ownerName = fullName.trim();
      const trimmedEmail = email.trim();
      const phoneValue = normalizePhone(phone);

      let response: unknown;
      if (role === 'customer') {
        response = await publicSiteAuthService.register({
          name: ownerName,
          email: trimmedEmail,
          password,
          phone: phoneValue,
          country: country || undefined,
          city: city || undefined,
        });
      } else if (logo) {
        const form = new FormData();
        form.append('showroom_name', showroomName.trim());
        form.append('owner_name', ownerName);
        form.append('email', trimmedEmail);
        form.append('password', password);
        form.append('phone', phoneValue);
        form.append('role', 'admin');
        if (country) form.append('country', country);
        if (city) form.append('city', city);
        if (address.trim()) form.append('address', address.trim());
        form.append('logo', {
          uri: logo.uri,
          type: logo.type,
          name: logo.name,
        } as any);
        response = await authService.register(form as any);
      } else {
        response = await authService.register({
          showroom_name: showroomName.trim(),
          owner_name: ownerName,
          email: trimmedEmail,
          password,
          phone: phoneValue,
          role: 'admin',
          country: country || undefined,
          city: city || undefined,
          address: address.trim() || undefined,
        } as any);
      }

      await rememberAuthRole(trimmedEmail, role);

      const token = extractAuthToken(response);
      if (token) {
        await setAuthTokenForRole(token, role);
        await setActiveAuthRole(role);
        const user = withAuthRole(extractAuthUser(response), role);
        await setAuthUser(user);
        dispatch(setSession({user, authenticated: true}));
        navigation.reset({
          index: 0,
          routes: [{name: role === 'customer' ? 'CustomerHome' : 'Main'}],
        });
        return;
      }

      showMessage({
        message: 'Account created. Please log in.',
        type: 'success',
      });
      navigation.navigate('Login');
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Sign up failed'),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [
    address,
    agreedToTerms,
    city,
    country,
    dispatch,
    email,
    fullName,
    logo,
    navigation,
    password,
    phone,
    role,
    showroomName,
  ]);

  const onLoginPress = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const onGooglePress = useCallback(() => {}, []);
  const onApplePress = useCallback(() => {}, []);

  return {
    role,
    roleOptions: ROLE_OPTIONS,
    fullName,
    showroomName,
    logo,
    country,
    city,
    address,
    email,
    phone,
    password,
    passwordVisible,
    agreedToTerms,
    cityOptions,
    errors,
    loading,
    setRole,
    setFullName,
    setShowroomName,
    onPickLogo,
    onClearLogo,
    setCountry,
    setCity,
    setAddress,
    setEmail,
    setPhone,
    setPassword,
    onTogglePassword,
    onToggleTerms,
    onCreateAccount,
    onLoginPress,
    onGooglePress,
    onApplePress,
  };
}
