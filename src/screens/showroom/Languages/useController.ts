import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {
  settingsKeyvalueSettingsService,
  settingsLanguagesService,
} from '../../../services';
import {asRecord, pickString, unwrapList} from '../../../utils/apiHelpers';
import type {
  LanguageId,
  LanguageOption,
  LanguagesController,
} from './module';

type LanguagesNav = NativeStackNavigationProp<HomeStackParamList, 'Languages'>;

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'en',
    label: 'English',
    region: 'United States',
    flag: 'flagUs',
  },
  {
    id: 'ur',
    label: 'اردو',
    region: 'Pakistan',
    flag: 'flagPk',
  },
  {
    id: 'de',
    label: 'Deutsch',
    region: 'Germany',
    flag: 'flagDe',
  },
  {
    id: 'ar',
    label: 'العربية',
    region: 'UAE',
    flag: 'flagAe',
  },
  {
    id: 'fr',
    label: 'Français',
    region: 'France',
    flag: 'flagFr',
  },
  {
    id: 'es',
    label: 'Español',
    region: 'Spain',
    flag: 'flagEs',
  },
];

const LANGUAGE_IDS = new Set(LANGUAGE_OPTIONS.map(option => option.id));

function toLanguageId(code: string): LanguageId | undefined {
  const key = code.trim().toLowerCase();
  return LANGUAGE_IDS.has(key as LanguageId) ? (key as LanguageId) : undefined;
}

export function useLanguagesController(): LanguagesController {
  const navigation = useNavigation<LanguagesNav>();
  const [selectedId, setSelectedId] = useState<LanguageId>('en');
  const [remoteIds, setRemoteIds] = useState<Record<string, string | number>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await settingsLanguagesService.listLanguages();
        const list = unwrapList(response);
        if (cancelled || !list.length) {
          return;
        }
        const idsByCode: Record<string, string | number> = {};
        let defaultId: LanguageId | undefined;
        list.forEach(item => {
          const row = asRecord(item);
          const code = pickString(row, ['code', 'locale', 'key']);
          const languageId = toLanguageId(code);
          if (!languageId) {
            return;
          }
          if (row.id != null) {
            idsByCode[languageId] = row.id;
          }
          if (row.is_default || row.default) {
            defaultId = languageId;
          }
        });
        if (!cancelled) {
          setRemoteIds(idsByCode);
          if (defaultId) {
            setSelectedId(defaultId);
          }
        }
      } catch {
        // Keep static defaults if languages can't be loaded
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSelect = useCallback(
    (id: LanguageId) => {
      setSelectedId(id);
      (async () => {
        try {
          await settingsKeyvalueSettingsService.createSettings({
            group: 'app',
            key: 'language',
            value: id,
          });
          const remoteId = remoteIds[id];
          if (remoteId != null) {
            await settingsLanguagesService
              .updateLanguagesById(remoteId, {is_default: true})
              .catch(() => undefined);
          }
        } catch (error) {
          showMessage({
            message: getApiErrorMessage(error, 'Failed to update language'),
            type: 'danger',
          });
        }
      })();
    },
    [remoteIds],
  );

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    options: LANGUAGE_OPTIONS,
    selectedId,
    onSelect,
    onBackPress,
  };
}
