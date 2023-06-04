import actions from "./actions";

// Define Initial State of reducers
const initialState = {
    view: "MOBILE",
    scrollbarUseRef: null,
    mobile: null,
    socketIo: null,
    currentOnlineUsers: null,
    conversationArray: [],
    allUsersArray: [],
    usesTableData: null,
}

// Define reducer function
export default function utilityReducer(state = initialState, action) {
    switch(action.type) {
        case actions.SET_VIEW_SIZE:
            return {
                ...state,
                view: action.payload,
            }
        case actions.SET_SCROLLBAR_USEREF_SUCCESS:
            return {
                ...state,
                scrollbarUseRef: action.payload,
            }
        case actions.SET_MOBILE_ACTION_SUCCESS:
            return {
                ...state,
                mobile: action.payload,
            }
        case actions.SET_SOCKETIO_SUCCESS:
            return {
                ...state,
                socketIo: action.payload,
            }
        case actions.SET_CURRENT_ONLINE_USERS_SUCCESS:
            return {
                ...state,
                currentOnlineUsers: action.payload,
            }
        case actions.SET_CONVERSATION_ARRAY_SUCCESS:
            return {
                ...state,
                conversationArray: action.payload,
            }
        case actions.SET_ALL_USERS_ARRAY_SUCCESS:
            return {
                ...state,
                allUsersArray: action.payload,
            }
        case actions.SET_USERS_TABLE_DATA_SUCCESS:
            return {
                ...state,
                usesTableData: action.payload,
            }

        default:
            return state;
    }
}
