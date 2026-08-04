export const FEED_PRIMARY = '#2563eb';
export const FEED_MUTED = '#6b7280';
export const FEED_BORDER = '#e5e7eb';
export const FEED_BG = '#f9fafb';

export type AvatarTone = 'sc' | 'aw' | 'am' | 'mech' | 'cc';

export type ConversationPreview = {
  id: string;
  name: string;
  initials: string;
  tone: AvatarTone;
  preview: string;
  time: string;
  unread: number;
  online?: boolean;
  verified?: boolean;
};

export const CONVERSATIONS: ConversationPreview[] = [
  {
    id: 'supreme-cars',
    name: 'Supreme Cars',
    initials: 'SC',
    tone: 'sc',
    preview: 'Shukriya! Location share kar den please.',
    time: '2:48 PM',
    unread: 2,
    online: true,
    verified: true,
  },
  {
    id: 'imran-auto',
    name: 'Imran Auto Care',
    initials: 'IA',
    tone: 'mech',
    preview: 'Aap ki service request confirm ho gayi hai...',
    time: 'Yesterday',
    unread: 1,
    online: true,
  },
  {
    id: 'auto-world',
    name: 'Auto World',
    initials: 'AW',
    tone: 'aw',
    preview: 'BMW 220i ke documents ready hain. Kab aana hai?',
    time: 'Mon',
    unread: 0,
    verified: true,
  },
  {
    id: 'ali-motors',
    name: 'Ali Motors',
    initials: 'AM',
    tone: 'am',
    preview: 'Rent ke liye Mercedes S 500 available hai.',
    time: 'Sun',
    unread: 0,
    verified: true,
  },
  {
    id: 'city-cars',
    name: 'City Cars Lahore',
    initials: 'CC',
    tone: 'cc',
    preview: 'Sales Advisor job application received. Thank you!',
    time: 'Sat',
    unread: 0,
  },
];

export const AVATAR_COLORS: Record<AvatarTone, [string, string]> = {
  sc: ['#dc2626', '#111827'],
  aw: ['#2563eb', '#1e40af'],
  am: ['#0ea5e9', '#0369a1'],
  mech: ['#0f766e', '#134e4a'],
  cc: ['#64748b', '#334155'],
};

export type ChatMessage =
  | {
      id: string;
      kind: 'day';
      label: string;
    }
  | {
      id: string;
      kind: 'listing';
      title: string;
      subtitle: string;
      price: string;
    }
  | {
      id: string;
      kind: 'text';
      from: 'me' | 'them';
      text: string;
      time: string;
    }
  | {
      id: string;
      kind: 'voice';
      from: 'me' | 'them';
      duration: string;
      time: string;
    };

export const SUPREME_THREAD: ChatMessage[] = [
  {id: 'd1', kind: 'day', label: 'Today'},
  {
    id: 'l1',
    kind: 'listing',
    title: 'Toyota Prius Hybrid',
    subtitle: '2022 · 28,000 km',
    price: 'PKR 72 Lakh',
  },
  {
    id: 't1',
    kind: 'text',
    from: 'them',
    text: 'Assalam o Alaikum! Is Toyota Prius Hybrid ke bare mein poochna tha — available hai?',
    time: '2:40 PM',
  },
  {
    id: 'm1',
    kind: 'text',
    from: 'me',
    text: 'Walaikum Assalam. Haan, showroom pe ready hai. Kab dekhnay aana hai?',
    time: '2:42 PM',
  },
  {
    id: 't2',
    kind: 'text',
    from: 'them',
    text: 'Aaj shaam 5 baje possible hai? Hybrid battery health bhi check karwani hai.',
    time: '2:45 PM',
  },
  {
    id: 'm2',
    kind: 'text',
    from: 'me',
    text: 'Bilkul — 5 PM pe aa jao. Address DHA / Lahore showroom pe hai. Main wait karunga.',
    time: '2:46 PM',
  },
  {
    id: 't3',
    kind: 'text',
    from: 'them',
    text: 'Shukriya! Location share kar den please.',
    time: '2:48 PM',
  },
  {
    id: 'm3',
    kind: 'text',
    from: 'me',
    text: 'Location: Supreme Cars, Main Boulevard, Lahore. Maps pe “Supreme Cars” search kar lo.',
    time: '2:50 PM',
  },
  {
    id: 'v1',
    kind: 'voice',
    from: 'them',
    duration: '0:12',
    time: '2:52 PM',
  },
];

export function threadForConversation(id: string): ChatMessage[] {
  if (id === 'supreme-cars') {
    return SUPREME_THREAD;
  }
  return [
    {id: 'd1', kind: 'day', label: 'Today'},
    {
      id: 't1',
      kind: 'text',
      from: 'them',
      text: 'Assalam o Alaikum! Kaise madad kar sakte hain?',
      time: '10:00 AM',
    },
  ];
}
