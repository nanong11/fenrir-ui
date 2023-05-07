// DECLARE HERE ALL THE FETCH REQUEST
import axios from 'axios';
import { put, select } from 'redux-saga/effects';
import actions from '@/redux/auth/actions';

// Enabled this if using Cookie
// axios.defaults.withCredentials = true;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// const userName = process.env.NEXT_PUBLIC_USER;
// const password = process.env.NEXT_PUBLIC_USER;

// console.log('apiUrl',apiUrl);
// console.log('userName',userName);
// console.log('password',password);

// const bearer = `${userName}:${password}`;
// const credentials = new Buffer.from(bearer).toString('base64');
// const authHeader = `Basic ${credentials}`;

export function* get(url) {
    const idToken = yield localStorage.getItem('idToken');
    // console.log('idToken', idToken)
    return yield fetch(`${apiUrl}${url}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        method: 'GET',
    });
}

export function* post(url, data) {
    const idToken = yield localStorage.getItem('idToken');
    // console.log('idToken', idToken)
    return yield fetch(`${apiUrl}${url}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        method: 'POST',
        data,
    });
}

export function* putR(url, data) {
    const idToken = yield localStorage.getItem('idToken');
    // console.log('idToken', idToken)
    return yield fetch(`${apiUrl}${url}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        method: 'PUT',
        data,
    });
}

function* forbidden() {
    const state = yield select()
    const authenticateFailed = state.authReducer.authenticateFailed
    if (!authenticateFailed) {
        yield put({
            type: actions.AUTHENTICATE,
        });
    }
}

export function* fetch(url, options) {
    const result = yield axios.request({
        url,
        baseURL: apiUrl,
        ...options,
    }).then((res) => {
        return res;
    }).catch((error) => {
        // console.log('error', error);
        return error
    })
    if (result.status) {
        return result;
    } else {
        if (result.response.status === 401 || result.response.status === 403) {
            yield forbidden();
            return result.response;
        } else {
            if (result.response) {
                return result.response;
            }
        }
    }
}
