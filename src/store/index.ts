import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from '../saga';
import type {DataCacheState} from './dataCacheSlice';

const resetLoadingTransform = createTransform(
  (inbound: DataCacheState) => inbound,
  (outbound: DataCacheState & {home?: {sections?: unknown; meta?: DataCacheState['home']['meta']}}) => {
    const home = outbound.home;
    const legacySections = (
      home as {sections?: Record<string, DataCacheState['home']['meta']>}
    ).sections;
    const meta =
      home.meta ??
      ({
        loading: false,
        error: null,
        fetchedAt: legacySections
          ? Math.max(
              legacySections.overview?.fetchedAt ?? 0,
              legacySections.rentals?.fetchedAt ?? 0,
              legacySections.activity?.fetchedAt ?? 0,
            ) || null
          : null,
      } as DataCacheState['home']['meta']);

    const emptyMeta = {
      loading: false,
      error: null,
      fetchedAt: null as number | null,
    };

    return {
      ...outbound,
      home: {
        ...home,
        meta: {...meta, loading: false, error: null},
      },
      activityLogs: {
        ...outbound.activityLogs,
        meta: {...outbound.activityLogs.meta, loading: false, error: null},
      },
      vehicles: {
        raw: outbound.vehicles?.raw ?? [],
        inventory: outbound.vehicles?.inventory ?? [],
        meta: {
          ...(outbound.vehicles?.meta ?? emptyMeta),
          loading: false,
          error: null,
        },
      },
      rentals: {
        raw: outbound.rentals?.raw ?? [],
        meta: {
          ...(outbound.rentals?.meta ?? emptyMeta),
          loading: false,
          error: null,
        },
      },
      customers: {
        items: outbound.customers?.items ?? [],
        meta: {
          ...(outbound.customers?.meta ?? emptyMeta),
          loading: false,
          error: null,
        },
      },
    };
  },
  {whitelist: ['dataCache']},
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['app', 'dataCache'],
  transforms: [resetLoadingTransform],
};

const sagaMiddleware = createSagaMiddleware();

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer as never,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type {RootState} from './rootReducer';
