import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {
  extractAuthRoles,
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
  recallAuthRole,
  rememberAuthRole,
  resolveApiRole,
  resolveLoginRole,
  setActiveAuthRole,
  withAuthRole,
  type AuthRole,
} from '../../utils/authRole';
import {validateLoginForm} from '../../utils/authValidation';
import type {LoginController, LoginFieldErrors} from './module';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

async function loginForRole(email: string, password: string, role: AuthRole) {
  if (role === 'customer') {
    return publicSiteAuthService.login({email, password});
  }
  return authService.login({email, password});
}

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
      const remembered = await recallAuthRole(trimmedEmail);

      let response: unknown;
      let role: AuthRole;

      if (remembered) {
        // Customer must use /public/login so Saved/Liked/Shared get a valid token
        response = await loginForRole(trimmedEmail, password, remembered);
        role = remembered;
      } else {
        try {
          response = await authService.login({
            email: trimmedEmail,
            password,
          });
          const previewUser = extractAuthUser(response);
          role = await resolveLoginRole(
            trimmedEmail,
            previewUser,
            extractAuthRoles(response),
          );
          if (role === 'customer') {
            response = await publicSiteAuthService.login({
              email: trimmedEmail,
              password,
            });
          }
        } catch {
          response = await publicSiteAuthService.login({
            email: trimmedEmail,
            password,
          });
          role =
            resolveApiRole(
              extractAuthUser(response),
              extractAuthRoles(response),
            ) ?? 'customer';
        }
      }

      const token = extractAuthToken(response);
      if (!token) {
        throw new Error('Login succeeded but no token was returned');
      }

      await setAuthTokenForRole(token, role);
      const user = extractAuthUser(response);
      if (!remembered) {
        role = await resolveLoginRole(
          trimmedEmail,
          user,
          extractAuthRoles(response),
        );
      }

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
