import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  ApplicationCardData,
  ApplicationsController,
} from './module';

type ApplicationsNav = NativeStackNavigationProp<
  HomeStackParamList,
  'Applications'
>;

export function useApplicationsController(): ApplicationsController {
  const navigation = useNavigation<ApplicationsNav>();
  const [searchQuery, setSearchQuery] = useState('');
  const [applications] = useState<ApplicationCardData[]>([]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return applications;
    }
    return applications.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query),
    );
  }, [applications, searchQuery]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onOnboardingPress = useCallback(() => {
    navigation.navigate('JobsOnboarding');
  }, [navigation]);

  const onReviewPress = useCallback(
    (applicationId: string) => {
      navigation.navigate('ReviewApplication', {applicationId});
    },
    [navigation],
  );

  const onStageFilterPress = useCallback(() => {
    showMessage({
      message: 'Applications list API is not available in the backend yet.',
      type: 'info',
    });
  }, []);

  const onPositionFilterPress = useCallback(() => {
    showMessage({
      message: 'Applications list API is not available in the backend yet.',
      type: 'info',
    });
  }, []);

  return {
    subtitle:
      'No applications admin API — only public apply endpoint exists',
    searchQuery,
    applications: filtered,
    setSearchQuery,
    onStageFilterPress,
    onPositionFilterPress,
    onBackPress,
    onOnboardingPress,
    onReviewPress,
  };
}
