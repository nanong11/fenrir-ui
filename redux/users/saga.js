import { all, put, takeEvery, fork, select } from 'redux-saga/effects'
// post, get, fetch * edit resApuRequestor to add more
import { post, putR, get } from '@/helpers/resApiRequestor';
import actions from './actions';
import authactions from '@/redux/auth/actions';

export function* signUp() {
    yield takeEvery('SIGNUP', function* ({payload}) {
        try {
            yield put({
                type: actions.SIGNUP_RESET,
            });

            yield put({
                type: actions.SIGNUP_LODING,
            });

            const usersInputData = {
                mobile: +payload.mobile,
                email: payload.email,
                password: payload.password,
                firstName: payload.firstName,
                lastName: payload.lastName,
                birthday: payload.birthday,
                address: payload.address,
                verifiedPhone: true,
            }
            
            const apiResult = yield signupRequest(usersInputData);
            // console.log('apiResult', apiResult)
            const result = apiResult.data;
            
            if (apiResult.status === 201) {
                yield put({
                    type: actions.SIGNUP_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.SIGNUP_FAILED,
                    payload: {
                        data: result,
                        message: 'Sign Up Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.SIGNUP_FAILED,
                payload: {
                    data: error,
                    message: 'Sign Up Error'
                }
            });
        }
    });
}

export function* updateUser() {
    yield takeEvery('UPDATE_USER', function* ({payload}) {
        try {
            yield put({
                type: actions.UPDATE_USER_RESET,
            });

            yield put({
                type: actions.UPDATE_USER_LOADING,
            });

            if (payload.body.oldPassword) {
                const userData = {
                    password: payload.body.oldPassword,
                }
                const apiResult = yield checkOldPasswordRequest(userData)
                // console.log('apiResult', apiResult)
                const result = apiResult.data;
                
                if (apiResult.status === 200) {
                    if (result.isPasswordMatching) {
                        payload.body = {
                            oldPassword: payload.body.oldPassword,
                            password: payload.body.newPassword
                        }
                    } else {
                        yield put({
                            type: actions.UPDATE_USER_FAILED,
                            payload: {
                                data: result,
                                message: 'Incorrect Old Password'
                            }
                        });
                        return
                    }
                } else {
                    yield put({
                        type: actions.UPDATE_USER_FAILED,
                        payload: {
                            data: result,
                            message: 'Updating User Account Failed'
                        }
                    });
                    return
                }
            }
            
            const apiResult = yield updateUserRequest(payload.userId, payload.body);
            // console.log('apiResult', apiResult)
            const result = apiResult.data;

            if (apiResult.status === 200) {
                yield put({
                    type: authactions.AUTHENTICATE_SUCCESS,
                    payload: result,
                });
                yield put({
                    type: actions.UPDATE_USER_SUCCESS,
                    payload: {
                        message: 'Updating User Account Success'
                    }
                });
            } else {
                yield put({
                    type: actions.UPDATE_USER_FAILED,
                    payload: {
                        data: result,
                        message: 'Updating User Account Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.UPDATE_USER_FAILED,
                payload: {
                    data: result,
                    message: 'Updating User Account Error'
                }
            });
        }
    });
}

export function* checkMobileEmail() {
    yield takeEvery('CHECK_MOBILE_EMAIL', function* ({payload}) {
        try {
            yield put({
                type: actions.CHECK_MOBILE_EMAIL_RESET,
            });

            yield put({
                type: actions.CHECK_MOBILE_EMAIL_LOADING,
            });

            const apiResult = yield checkMobileEmailRequest(payload);
            // console.log('apiResult', apiResult)
            const result = apiResult.data;

            if (apiResult.status === 200) {
                yield put({
                    type: actions.CHECK_MOBILE_EMAIL_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.CHECK_MOBILE_EMAIL_FAILED,
                    payload: {
                        data: result,
                        message: 'Checking Mobile or Email Data Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.CHECK_MOBILE_EMAIL_FAILED,
                payload: {
                    data: error,
                    message: 'Checking Mobile or Email Data Error'
                }
            });
        }
    });
}

export function* fetchAllUsers() {
    yield takeEvery('FETCH_ALL_USERS', function* () {
        try {
            yield put({
                type: actions.FETCH_ALL_USERS_LOADING,
            });

            const apiResult = yield fetchAllUsersRequest();
            // console.log('apiResult', apiResult)
            const result = apiResult.data;

            if (apiResult.status === 200) {
                yield put({
                    type: actions.FETCH_ALL_USERS_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.FETCH_ALL_USERS_FAILED,
                    payload: result,
                });
            }
        } catch (error) {
            yield put({
                type: actions.FETCH_ALL_USERS_FAILED,
                payload: error,
            });
        }
    });
}

// FUNCTION REQUESTS START HERE
function signupRequest(payload) {
    return post(`/users/create`, payload);
}

function updateUserRequest(userId, body) {
    return putR(`/users/update/${userId}`, body);
}

function checkOldPasswordRequest(payload) {
    return post(`/users/check_old_password`, payload);
}

function checkMobileEmailRequest(payload) {
    return post(`/users/check_mobile_email`, payload);  
}

function fetchAllUsersRequest() {
    return get(`/users`);  
}

export default function* rootSaga() {
    yield all([
        fork(signUp),
        fork(checkMobileEmail),
        fork(updateUser),
        fork(fetchAllUsers),
    ])
}
