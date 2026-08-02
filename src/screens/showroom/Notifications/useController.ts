import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {settingsKeyvalueSettingsService} from '../../../services';
import {asRecord, unwrapList} from '../../../utils/apiHelpers';
import type {
  NotificationChannel,
  NotificationEventId,
  NotificationSection,
  NotificationsController,
} from './module';

type NotificationsNav = NativeStackNavigationProp<
  HomeStackParamList,
  'Notifications'
>;

const SETTINGS_GROUP = 'notifications';
const SETTINGS_KEY = 'preferences';

const INITIAL_SECTIONS: NotificationSection[] = [
  {
    id: 'rentals',
    title: 'Rentals',
    events: [
      {
        id: 'newRental',
        title: 'New rental created',
        subtitle: 'Alert when a rental is booked',
        email: true,
        sms: true,
      },
      {
        id: 'returnDue',
        title: 'Return due soon',
        subtitle: '24h before scheduled return',
        email: true,
        sms: false,
      },
      {
        id: 'lateReturns',
        title: 'Late returns',
        subtitle: 'Immediate SMS + push',
        email: true,
        sms: true,
      },
    ],
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    events: [
      {
        id: 'maintenanceDue',
        title: 'Maintenance due',
        subtitle: 'Scheduled service reminders',
        email: true,
        sms: false,
      },
      {
        id: 'insuranceExpiring',
        title: 'Insurance expiring',
        subtitle: '30 days before expiration',
        email: true,
        sms: false,
      },
      {
        id: 'newVehicle',
        title: 'New vehicle added',
        subtitle: 'Fleet inventory changes',
        email: false,
        sms: false,
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    events: [
      {
        id: 'invoicePaid',
        title: 'Invoice paid',
        subtitle: 'Payment received confirmation',
        email: true,
        sms: false,
      },
      {
        id: 'payrollProcessed',
        title: 'Payroll processed',
        subtitle: 'Monthly payroll completion',
        email: true,
        sms: false,
      },
    ],
  },
];

function applyPrefs(
  sections: NotificationSection[],
  prefs: Record<string, {email?: boolean; sms?: boolean}>,
): NotificationSection[] {
  return sections.map(section => ({
    ...section,
    events: section.events.map(event => {
      const saved = prefs[event.id];
      if (!saved) {
        return event;
      }
      return {
        ...event,
        email: saved.email ?? event.email,
        sms: saved.sms ?? event.sms,
      };
    }),
  }));
}

export function useNotificationsController(): NotificationsController {
  const navigation = useNavigation<NotificationsNav>();
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await settingsKeyvalueSettingsService.listSettings({
          group: SETTINGS_GROUP,
        });
        const list = unwrapList(response);
        const entry = list
          .map(item => asRecord(item))
          .find(row => row.key === SETTINGS_KEY);
        if (!entry || cancelled) {
          return;
        }
        const raw = entry.value;
        const parsed =
          typeof raw === 'string' ? JSON.parse(raw) : asRecord(raw);
        if (parsed && typeof parsed === 'object' && !cancelled) {
          setSections(prev => applyPrefs(prev, parsed));
        }
      } catch {
        // Keep default preferences if settings can't be loaded/parsed
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

  const onSavePress = useCallback(async () => {
    try {
      const prefs: Record<string, {email: boolean; sms: boolean}> = {};
      sections.forEach(section => {
        section.events.forEach(event => {
          prefs[event.id] = {email: event.email, sms: event.sms};
        });
      });
      await settingsKeyvalueSettingsService.createSettings({
        group: SETTINGS_GROUP,
        key: SETTINGS_KEY,
        value: JSON.stringify(prefs),
      });
      showMessage({message: 'Notification preferences saved', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to save preferences'),
        type: 'danger',
      });
    }
  }, [navigation, sections]);

  const onToggle = useCallback(
    (
      sectionId: string,
      eventId: NotificationEventId,
      channel: NotificationChannel,
      value: boolean,
    ) => {
      setSections(prev =>
        prev.map(section => {
          if (section.id !== sectionId) {
            return section;
          }
          return {
            ...section,
            events: section.events.map(event =>
              event.id === eventId ? {...event, [channel]: value} : event,
            ),
          };
        }),
      );
    },
    [],
  );

  return {
    userName: 'Ali',
    dateLabel: 'Mon, Jul 13',
    sections,
    onToggle,
    onBackPress,
    onSavePress,
  };
}
