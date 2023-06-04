import { all, put, takeEvery, fork } from 'redux-saga/effects'
// post, get, fetch * edit resApuRequestor to add more
// import { get } from '@/helpers/resApiRequestor';
import actions from './actions';

export function* setView() {
    yield takeEvery('SET_VIEW', function* ({payload}) {
        yield put({
            type: actions.SET_VIEW_SIZE,
            payload
        });
    });
}

export function* setScrollbarUseRef() {
    yield takeEvery('SET_SCROLLBAR_USEREF', function* ({payload}) {
        if (payload) {
            yield put({
                type: actions.SET_SCROLLBAR_USEREF_SUCCESS,
                payload
            });
        } else {
            yield put({
                type: actions.SET_SCROLLBAR_USEREF_SUCCESS,
                payload: null
            });
        }
        
    });
}

export function* setMobileAction() {
    yield takeEvery('SET_MOBILE_ACTION', function* ({payload}) {
        if (payload) {
            yield put({
                type: actions.SET_MOBILE_ACTION_SUCCESS,
                payload
            });
        } else {
            yield put({
                type: actions.SET_MOBILE_ACTION_SUCCESS,
                payload: null
            });
        }
    });
}

export function* setSocketIo() {
    yield takeEvery('SET_SOCKETIO', function* ({payload}) {
        if (payload) {
            yield put({
                type: actions.SET_SOCKETIO_SUCCESS,
                payload
            });
        } else {
            yield put({
                type: actions.SET_SOCKETIO_SUCCESS,
                payload: null
            });
        }
    });
}

export function* setCurrentOnlineUsers() {
    yield takeEvery('SET_CURRENT_ONLINE_USERS', function* ({payload}) {
        if (payload) {
            yield put({
                type: actions.SET_CURRENT_ONLINE_USERS_SUCCESS,
                payload
            });
        } else {
            yield put({
                type: actions.SET_CURRENT_ONLINE_USERS_SUCCESS,
                payload: null
            });
        }
    });
}

export function* setConversationArray() {
    yield takeEvery('SET_CONVERSATION_ARRAY', function* ({payload}) {
        if (payload) {
            yield put({
                type: actions.SET_CONVERSATION_ARRAY_SUCCESS,
                payload
            });
        } else {
            yield put({
                type: actions.SET_CONVERSATION_ARRAY_SUCCESS,
                payload: []
            });
        }
    });
}

export function* setAllUsersArray() {
    yield takeEvery('SET_ALL_USERS_ARRAY', function* ({payload}) {
        if (payload) {
            yield put({
                type: actions.SET_ALL_USERS_ARRAY_SUCCESS,
                payload
            });
        } else {
            yield put({
                type: actions.SET_ALL_USERS_ARRAY_SUCCESS,
                payload: []
            });
        }
    });
}

export function* setUsersTableData() {
    yield takeEvery('SET_USERS_TABLE_DATA', function* ({payload}) {
        if (payload) {
            yield put({
                type: actions.SET_USERS_TABLE_DATA_SUCCESS,
                payload
            });
        } else {
            yield put({
                type: actions.SET_USERS_TABLE_DATA_SUCCESS,
                payload: null
            });
        }
    });
}

export default function* rootSaga() {
    yield all([
      fork(setView),
      fork(setScrollbarUseRef),
      fork(setMobileAction),
      fork(setSocketIo),
      fork(setCurrentOnlineUsers),
      fork(setConversationArray),
      fork(setAllUsersArray),
      fork(setUsersTableData),
    ])
}
