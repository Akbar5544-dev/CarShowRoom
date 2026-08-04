import type {IconName} from '../../../assets/iconXml';

export const FEED_PRIMARY = '#2563eb';
export const FEED_MUTED = '#6b7280';
export const FEED_BORDER = '#e5e7eb';
export const FEED_BG = '#f9fafb';

export type NotifChip = 'All' | 'Unread' | 'Likes' | 'Messages' | 'Jobs';

export const NOTIF_CHIPS: NotifChip[] = [
  'All',
  'Unread',
  'Likes',
  'Messages',
  'Jobs',
];

export type NotifKind = 'like' | 'msg' | 'follow' | 'job' | 'sys' | 'avatar';

export type NotificationItem = {
  id: string;
  kind: NotifKind;
  /** Parts with bold flags for rich text */
  parts: Array<{text: string; bold?: boolean}>;
  time: string;
  unread: boolean;
  category: 'Likes' | 'Messages' | 'Jobs' | 'Other';
  icon: IconName;
  iconBg: string;
  iconColor: string;
  gapAfter?: boolean;
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    kind: 'like',
    parts: [
      {text: 'Ali Motors', bold: true},
      {text: ' liked your listing BMW 220i M Sport Coupe'},
    ],
    time: '2 min ago',
    unread: true,
    category: 'Likes',
    icon: 'heartFill',
    iconBg: '#fef2f2',
    iconColor: '#ef4444',
  },
  {
    id: 'n2',
    kind: 'msg',
    parts: [
      {text: 'Supreme Cars', bold: true},
      {text: ' sent you a message about Toyota Prius Hybrid'},
    ],
    time: '15 min ago',
    unread: true,
    category: 'Messages',
    icon: 'message',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
  {
    id: 'n3',
    kind: 'follow',
    parts: [
      {text: 'Auto World', bold: true},
      {text: ' started following you'},
    ],
    time: '1 hour ago',
    unread: true,
    category: 'Other',
    icon: 'userCheck',
    iconBg: '#eff6ff',
    iconColor: FEED_PRIMARY,
    gapAfter: true,
  },
  {
    id: 'n4',
    kind: 'avatar',
    parts: [
      {text: 'Imran Auto Care', bold: true},
      {text: ' replied to your service request'},
    ],
    time: 'Yesterday',
    unread: false,
    category: 'Messages',
    icon: 'userOutline',
    iconBg: '#e5e7eb',
    iconColor: '#4b5563',
  },
  {
    id: 'n5',
    kind: 'job',
    parts: [
      {text: 'New job match: '},
      {text: 'Sales Advisor', bold: true},
      {text: ' at City Cars Lahore'},
    ],
    time: 'Yesterday',
    unread: false,
    category: 'Jobs',
    icon: 'briefcase',
    iconBg: '#fff7ed',
    iconColor: '#ea580c',
  },
  {
    id: 'n6',
    kind: 'like',
    parts: [
      {text: 'City Cars', bold: true},
      {text: ' and 12 others liked your post'},
    ],
    time: '2 days ago',
    unread: false,
    category: 'Likes',
    icon: 'heartFill',
    iconBg: '#fef2f2',
    iconColor: '#ef4444',
  },
  {
    id: 'n7',
    kind: 'sys',
    parts: [
      {text: 'Your showroom listing for '},
      {text: 'Honda Civic RS', bold: true},
      {text: ' is now live'},
    ],
    time: '3 days ago',
    unread: false,
    category: 'Other',
    icon: 'bell',
    iconBg: '#f3f4f6',
    iconColor: '#6b7280',
  },
  {
    id: 'n8',
    kind: 'msg',
    parts: [
      {text: 'Raza Khan Workshop', bold: true},
      {text: ' — missed call regarding AC service'},
    ],
    time: '4 days ago',
    unread: false,
    category: 'Messages',
    icon: 'phoneOutline',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
];
