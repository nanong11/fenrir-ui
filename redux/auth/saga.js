import { all, put, takeEvery, fork } from 'redux-saga/effects'
import { post } from '@/helpers/resApiRequestor';
import actions from './actions';
import usersActions from '@/redux/users/actions'

export function* login() {
    yield takeEvery('LOGIN', function* ({payload}) {
        try {
            yield put({
                type: actions.LOGIN_LOADING,
            });

            const apiResult = yield loginRequest(payload);
            // console.log('apiResult', apiResult)
            const result = apiResult.data;
            
            if (apiResult.status === 200) {
                yield localStorage.setItem('idToken', result.token);
                yield put({
                    type: actions.AUTHENTICATE_SUCCESS,
                    payload: result,
                });
                yield put({
                    type: actions.LOGOUT_RESET,
                });
                yield put({
                    type: usersActions.LOAD_PROFILE_PHOTO_RESET,
                });
            } else {
                yield put({
                    type: actions.LOGIN_FAILED,
                    payload: {
                        data: result,
                        message: 'Login Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.LOGIN_FAILED,
                payload: {
                    data: error,
                    message: 'Login Error'
                }
            });
        }
    });
}

export function* logout() {
    yield takeEvery('LOGOUT', function* () {
        try {
            yield put({
                type: actions.LOGOUT_LOADING,
            });
            
            const apiResult = yield logoutRequest();
            // console.log('apiResult', apiResult)
            const result = apiResult.data;
            
            if (apiResult.status === 200) {
                yield localStorage.removeItem('idToken');
                yield window.location.reload();
                yield put({
                    type: actions.LOGOUT_SUCCESS,
                    payload: result,
                });
                yield put({
                    type: actions.LOGIN_RESET,
                });
            } else {
                yield put({
                    type: actions.LOGOUT_FAILED,
                    payload: {
                        data: result,
                        message: 'Logout Failed'
                    }
                });
                yield put({
                    type: actions.LOGIN_RESET,
                });
            }
        } catch (error) {
            yield put({
                type: actions.LOGOUT_FAILED,
                payload: {
                    data: error,
                    message: 'Logout Error'
                }
            });
            yield put({
                type: actions.LOGIN_RESET,
            });
        }
    });
}

export function* authenticate() {
    yield takeEvery('AUTHENTICATE', function* () {
        try {
            yield put({
                type: actions.AUTHENTICATE_LOADING,
            });
            
            const apiResult = yield authenticateRequest();
            // console.log('apiResult', apiResult)
            const result = apiResult.data;
            
            if (apiResult.status === 200) {
                yield put({
                    type: actions.AUTHENTICATE_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.AUTHENTICATE_FAILED,
                    payload: {
                        data: result,
                        message: 'Authenticate Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.AUTHENTICATE_FAILED,
                payload: {
                    data: error,
                    message: 'Authenticate Error'
                }
            });
        }
    });
}

function loginRequest(payload) {
    return post(`/login`, payload);
}

function logoutRequest() {
    return post(`/logout`);
}

function authenticateRequest() {
    return post(`/authenticate`);
}

// DONT FORGET TO FORK YOUR FUNCTION
export default function* rootSaga() {
    yield all([
      fork(login),
      fork(logout),
      fork(authenticate),
    ])
}