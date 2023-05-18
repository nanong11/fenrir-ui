import actions from "./actions";

const initialState = {
    fectchConversationByUserIdData: null,
    fectchConversationByUserIdLoading: false,
    fectchConversationByUserIdFailed: null,

    createConversationData: null,
    createConversationLoading: false,
    createConversationFailed: null,

    allConversations: null,
    allConversationsLoading: false,
    allConversationsFailed: null,
}

export default function conversationReducer(state = initialState, action) {
    switch(action.type) {
        case actions.FETCH_CONVERSATION_BY_USERID_SUCCESS:
            return {
                ...state,
                fectchConversationByUserIdData: action.payload,
                fectchConversationByUserIdFailed: null,
                fectchConversationByUserIdLoading: false,
            }
        case actions.FETCH_CONVERSATION_BY_USERID_LOADING:
            return {
                ...state,
                fectchConversationByUserIdLoading: true,
            }
        case actions.FETCH_CONVERSATION_BY_USERID_FAILED:
            return {
                ...state,
                fectchConversationByUserIdFailed: action.payload,
                fectchConversationByUserIdData: null,
                fectchConversationByUserIdLoading: false,
            }
        case actions.FETCH_CONVERSATION_BY_USERID_RESET:
            return {
                ...state,
                fectchConversationByUserIdData: null,
                fectchConversationByUserIdLoading: false,
                fectchConversationByUserIdFailed: null,
            }
        case actions.CREATE_CONVERSATION_SUCCESS:
            return {
                ...state,
                createConversationData: action.payload,
                createConversationLoading: false,
                createConversationFailed: null,
            }
        case actions.CREATE_CONVERSATION_LOADING:
            return {
                ...state,
                createConversationLoading: true,
            }
        case actions.CREATE_CONVERSATION_FAILED:
            return {
                ...state,
                createConversationData: null,
                createConversationLoading: false,
                createConversationFailed: action.payload,
            }
        case actions.CREATE_CONVERSATION_RESET:
            return {
                ...state,
                createConversationData: null,
                createConversationLoading: false,
                createConversationFailed: null,
            }
        case actions.FETCH_ALL_CONVERSTION_SUCCESS:
            return {
                ...state,
                allConversations: action.payload,
                allConversationsLoading: false,
                allConversationsFailed: null,
            }
        case actions.FETCH_ALL_CONVERSTION_LOADING:
            return {
                ...state,
                allConversationsLoading: true,
            }
        case actions.FETCH_ALL_CONVERSTION_FAILED:
            return {
                ...state,
                allConversations: null,
                allConversationsLoading: false,
                allConversationsFailed: action.payload,
            }
        case actions.FETCH_ALL_CONVERSTION_RESET:
            return {
                ...state,
                allConversations: null,
                allConversationsLoading: false,
                allConversationsFailed: null,
            }
        
        default:
            return state;
    }
}