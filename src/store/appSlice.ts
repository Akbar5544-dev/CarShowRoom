import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {AuthUser} from '../api';
import type {AccentColorId, ThemeModeId} from '../theme/accents';

interface AppState {
  isLoading: boolean;
  isHydrated: boolean;
  isAuthenticated: boolean;
  bootstrapping: boolean;
  user: AuthUser | null;
  userName: string;
  themeMode: ThemeModeId;
  accentId: AccentColorId;
}

const initialState: AppState = {
  isLoading: false,
  isHydrated: false,
  isAuthenticated: false,
  bootstrapping: true,
  user: null,
  userName: 'User',
  themeMode: 'light',
  accentId: 'blue',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
    setBootstrapping(state, action: PayloadAction<boolean>) {
      state.bootstrapping = action.payload;
    },
    setSession(
      state,
      action: PayloadAction<{user: AuthUser | null; authenticated: boolean}>,
    ) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.authenticated;
      const name =
        action.payload.user?.name ||
        (typeof action.payload.user?.email === 'string'
          ? String(action.payload.user.email).split('@')[0]
          : '') ||
        'User';
      state.userName = name;
    },
    clearSession(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.userName = 'User';
    },
    setThemeMode(state, action: PayloadAction<ThemeModeId>) {
      state.themeMode = action.payload;
    },
    setAccentId(state, action: PayloadAction<AccentColorId>) {
      state.accentId = action.payload;
    },
    applyTheme(
      state,
      action: PayloadAction<{mode: ThemeModeId; accent: AccentColorId}>,
    ) {
      state.themeMode = action.payload.mode;
      state.accentId = action.payload.accent;
    },
  },
});

export const {
  setLoading,
  setHydrated,
  setBootstrapping,
  setSession,
  clearSession,
  setThemeMode,
  setAccentId,
  applyTheme,
} = appSlice.actions;
export default appSlice.reducer;
