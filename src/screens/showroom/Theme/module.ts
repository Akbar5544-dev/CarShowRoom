export type ThemeModeId = 'light' | 'dark' | 'midnight' | 'cloud';

export type AccentColorId =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'red'
  | 'teal';

export type ThemeModeOption = {
  id: ThemeModeId;
  label: string;
  preview: string;
};

export type AccentColorOption = {
  id: AccentColorId;
  color: string;
};

export type ThemeController = {
  userName: string;
  dateLabel: string;
  modes: ThemeModeOption[];
  accents: AccentColorOption[];
  selectedModeId: ThemeModeId;
  selectedAccentId: AccentColorId;
  onSelectMode: (id: ThemeModeId) => void;
  onSelectAccent: (id: AccentColorId) => void;
  onApplyPress: () => void;
  onBackPress: () => void;
};
