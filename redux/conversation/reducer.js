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

    addParticipantsData: null,
    addParticipantsDataLoading: false,
    addParticipantsDataFailed: null,

    removeParticipantsData: null,
    removeParticipantsDataLoading: false,
    removeParticipantsDataFailed: null,
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
        case actions.ADD_PARTICIPANTS_SUCCESS:
            return {
                ...state,
                addParticipantsData: action.payload,
                addParticipantsDataLoading: false,
                addParticipantsDataFailed: null,
            }
        case actions.ADD_PARTICIPANTS_LOADING:
            return {
                ...state,
                addParticipantsDataLoading: true,
            }
        case actions.ADD_PARTICIPANTS_FAILED:
            return {
                ...state,
                addParticipantsData: null,
                addParticipantsDataLoading: false,
                addParticipantsDataFailed: action.payload,
            }
        case actions.ADD_PARTICIPANTS_RESET:
            return {
                ...state,
                addParticipantsData: null,
                addParticipantsDataLoading: false,
                addParticipantsDataFailed: null,
            }
        case actions.REMOVE_PARTICIPANTS_SUCCESS:
            return {
                ...state,
                removeParticipantsData: action.payload,
                removeParticipantsDataLoading: false,
                removeParticipantsDataFailed: null,
            }
        case actions.REMOVE_PARTICIPANTS_LOADING:
            return {
                ...state,
                removeParticipantsDataLoading: true,
            }
        case actions.REMOVE_PARTICIPANTS_FAILED:
            return {
                ...state,
                removeParticipantsData: null,
                removeParticipantsDataLoading: false,
                removeParticipantsDataFailed: action.payload,
            }
        case actions.REMOVE_PARTICIPANTS_RESET:
            return {
                ...state,
                removeParticipantsData: null,
                removeParticipantsDataLoading: false,
                removeParticipantsDataFailed: null,
            }
        
        default:
            return state;
    }
}
