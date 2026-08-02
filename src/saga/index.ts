import {all} from 'redux-saga/effects';

// Import feature sagas here, e.g. import {carsSaga} from './carsSaga';

export default function* rootSaga() {
  yield all([
    // carsSaga(),
  ]);
}
