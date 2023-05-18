import { all } from 'redux-saga/effects';
import authSaga from './auth/saga'
import usersSaga from './users/saga'
import utilitySaga from './utility/saga'
import conversationSaga from './conversation/saga'

export default function* rootSaga() {
  yield all([
    authSaga(),
    usersSaga(),
    utilitySaga(),
    conversationSaga(),
  ]);
}
