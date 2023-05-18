import { all, put, takeEvery, fork } from 'redux-saga/effects'
// post, get, fetch * edit resApuRequestor to add more
import { post, get, putR } from '@/helpers/resApiRequestor';
import actions from './actions';

export function* fetchConversationByUserId() {
    yield takeEvery('FETCH_CONVERSATION_BY_USERID', function* ({payload}) {
        try {
            yield put({
                type: actions.FETCH_CONVERSATION_BY_USERID_LOADING,
            });

            const apiResult = yield fetchConversationByUserIdRequest(payload.userId);
            const result = apiResult.data;

            if (apiResult.status === 200) {
                yield put({
                    type: actions.FETCH_CONVERSATION_BY_USERID_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.FETCH_CONVERSATION_BY_USERID_FAILED,
                    payload: {
                        data: result,
                        message: 'Fetching Conversation By UserId Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.FETCH_CONVERSATION_BY_USERID_FAILED,
                payload: {
                    data: error,
                    message: 'Fetching Conversation By UserId Error'
                }
            });
        }
    });
}

export function* createConversation() {
    yield takeEvery('CREATE_CONVERSATION', function* ({payload}) {
        try {
            yield put({
                type: actions.CREATE_CONVERSATION_LOADING,
            });

            const apiResult = yield createConversationRequest(payload);
            const result = apiResult.data;

            if (apiResult.status === 201) {
                yield put({
                    type: actions.CREATE_CONVERSATION_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.CREATE_CONVERSATION_FAILED,
                    payload: {
                        data: result,
                        message: 'Create Conversation Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.CREATE_CONVERSATION_FAILED,
                payload: {
                    data: error,
                    message: 'Create Conversation Error'
                }
            });
        }
    });
}

export function* fetchAllConversation() {
    yield takeEvery('FETCH_ALL_CONVERSTION', function* () {
        try {
            yield put({
                type: actions.FETCH_ALL_CONVERSTION_LOADING,
            });

            const apiResult = yield fetchAllConversationRequest();
            // console.log('apiResult', apiResult)
            const result = apiResult.data;

            if (apiResult.status === 200) {
                yield put({
                    type: actions.FETCH_ALL_CONVERSTION_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.FETCH_ALL_CONVERSTION_FAILED,
                    payload: {
                        data: result,
                        message: 'Fetch All Conversation Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.FETCH_ALL_CONVERSTION_FAILED,
                payload: {
                    data: error,
                    message: 'Fetch All Conversation Error'
                }
            });
        }
    });
}

export function* addParticipants() {
    yield takeEvery('ADD_PARTICIPANTS', function* ({payload}) {
        try {
            yield put({
                type: actions.ADD_PARTICIPANTS_LOADING,
            });

            const apiResult = yield addParticipantsRequest(payload);
            console.log('apiResult', apiResult)
            const result = apiResult.data;

            if (apiResult.status === 200) {
                yield put({
                    type: actions.ADD_PARTICIPANTS_SUCCESS,
                    payload: result,
                });
            } else {
                yield put({
                    type: actions.ADD_PARTICIPANTS_FAILED,
                    payload: {
                        data: result,
                        message: 'Add Participant Failed'
                    }
                });
            }
        } catch (error) {
            yield put({
                type: actions.ADD_PARTICIPANTS_FAILED,
                payload: {
                    data: error,
                    message: 'Add Participant Error'
                }
            });
        }
    });
}

function fetchConversationByUserIdRequest(payload) {
    return get(`/conversation/find_conversation_by_userid/${payload}`);  
}

function createConversationRequest(payload) {
    return post(`/conversation/create`, payload);  
}

function fetchAllConversationRequest() {
    return get(`/conversation`);  
}

function addParticipantsRequest(payload) {
    return putR(`/conversation/add_participant/${payload.conversationId}`, payload.body);  
}

export default function* rootSaga() {
    yield all([
      fork(fetchConversationByUserId),
      fork(createConversation),
      fork(fetchAllConversation),
      fork(addParticipants),
    ])
}
