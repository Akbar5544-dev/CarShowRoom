import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {
  getApiErrorMessage,
  setAuthToken,
  setAuthUser,
} from '../../api';
import type {RootStackParamList} from '../../navigation/types';
import {authService} from '../../services';
import {setSession} from '../../store/appSlice';
import {useAppDispatch} from '../../store/hooks';
import {asRecord} from '../../utils/apiHelpers';
import {
  rememberAuthRole,
  setActiveAuthRole,
  type AuthRole,
  withAuthRole,
} from '../../utils/authRole';
import {validateSignUpForm} from '../../utils/authValidation';
import type {
  SignUpController,
  SignUpFieldErrors,
  SignUpRoleOption,
} from './module';

type SignUpNav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const ROLE_OPTIONS: SignUpRoleOption[] = [
  {
    id: 'customer',
    title: 'Buyer / Renter',
    description: 'Save cars and contact showrooms',
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'List inventory and manage leads',
  },
];

export function useSignUpController(): SignUpController {
  const navigation = useNavigation<SignUpNav>();
  const dispatch = useAppDispatch();
  const [role, setRoleState] = useState<AuthRole>('customer');
  const [email, setEmailState] = useState('');
  const [fullName, setFullNameState] = useState('');
  const [phone, setPhoneState] = useState('');
  const [password, setPasswordState] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<SignUpFieldErrors>({});
  const [loading, setLoading] = useState(false);

  const setRole = useCallback((value: AuthRole) => {
    setRoleState(value);
  }, []);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    setErrors(prev => ({...prev, email: undefined}));
  }, []);

  const setFullName = useCallback((value: string) => {
    setFullNameState(value);
    setErrors(prev => ({...prev, fullName: undefined}));
  }, []);

  const setPhone = useCallback((value: string) => {
    setPhoneState(value);
    setErrors(prev => ({...prev, phone: undefined}));
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors(prev => ({...prev, password: undefined}));
  }, []);

  const onTogglePassword = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  const onToggleTerms = useCallback(() => {
    setAgreedToTerms(prev => !prev);
    setErrors(prev => ({...prev, terms: undefined}));
  }, []);

  const onCreateAccount = useCallback(async () => {
    const nextErrors = validateSignUpForm(email, fullName, password, {
      phone,
      requireTerms: true,
      agreedToTerms,
    });
    setErrors(nextErrors);
    if (
      nextErrors.email ||
      nextErrors.fullName ||
      nextErrors.phone ||
      nextErrors.password ||
      nextErrors.terms
    ) {
      return;
    }

    const ownerName = fullName.trim();
    const showroomName =
      role === 'admin' ? `${ownerName}'s Showroom` : `${ownerName} Account`;
    const trimmedEmail = email.trim();

    try {
      setLoading(true);
      const response = await authService.register({
        showroom_name: showroomName,
        owner_name: ownerName,
        email: trimmedEmail,
        password,
        phone: phone.trim() || undefined,
        role,
      });
      await rememberAuthRole(trimmedEmail, role);

      const token = response?.data?.token;
      if (token) {
        await setAuthToken(token);
        await setActiveAuthRole(role);
        const user = withAuthRole(asRecord(response.data.user), role);
        await setAuthUser(user);
        dispatch(setSession({user, authenticated: true}));
        navigation.reset({
          index: 0,
          routes: [{name: role === 'customer' ? 'CustomerHome' : 'Main'}],
        });
        return;
      }

      showMessage({
        message: response?.message || 'Account created. Please log in.',
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
    agreedToTerms,
    dispatch,
    email,
    fullName,
    navigation,
    password,
    phone,
    role,
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
    email,
    phone,
    password,
    passwordVisible,
    agreedToTerms,
    errors,
    loading,
    setRole,
    setFullName,
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
