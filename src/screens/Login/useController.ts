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
  resolveLoginRole,
  setActiveAuthRole,
  withAuthRole,
} from '../../utils/authRole';
import {validateLoginForm} from '../../utils/authValidation';
import type {LoginController, LoginFieldErrors} from './module';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function useLoginController(): LoginController {
  const navigation = useNavigation<LoginNav>();
  const dispatch = useAppDispatch();
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [loading, setLoading] = useState(false);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    setErrors(prev => ({...prev, email: undefined}));
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors(prev => ({...prev, password: undefined}));
  }, []);

  const onTogglePassword = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  const onToggleRememberMe = useCallback(() => {
    setRememberMe(prev => !prev);
  }, []);

  const onForgotPasswordPress = useCallback(() => {
    showMessage({
      message: 'Password reset will be available soon',
      type: 'info',
    });
  }, []);

  const onLogin = useCallback(async () => {
    const nextErrors = validateLoginForm(email, password);
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      return;
    }

    try {
      setLoading(true);
      const trimmedEmail = email.trim();
      const response = await authService.login({
        email: trimmedEmail,
        password,
      });
      const token = response?.data?.token;
      if (!token) {
        throw new Error('Login succeeded but no token was returned');
      }
      await setAuthToken(token);
      const user = asRecord(response.data.user);
      const role = await resolveLoginRole(
        trimmedEmail,
        user,
        response.data.roles,
      );
      await rememberAuthRole(trimmedEmail, role);
      await setActiveAuthRole(role);
      const userWithRole = withAuthRole(user, role);
      await setAuthUser(userWithRole);
      dispatch(setSession({user: userWithRole, authenticated: true}));
      navigation.reset({
        index: 0,
        routes: [{name: role === 'customer' ? 'CustomerHome' : 'Main'}],
      });
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Login failed'),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, email, navigation, password]);

  const onSignUpPress = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onGooglePress = useCallback(() => {}, []);
  const onApplePress = useCallback(() => {}, []);

  return {
    email,
    password,
    passwordVisible,
    rememberMe,
    errors,
    loading,
    setEmail,
    setPassword,
    onTogglePassword,
    onToggleRememberMe,
    onForgotPasswordPress,
    onLogin,
    onSignUpPress,
    onGooglePress,
    onApplePress,
  };
}
