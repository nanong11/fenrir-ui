import actions from "./actions";

// Define Initial State of reducers
const initialState = {
    view: "MOBILE",
    scrollbarUseRef: null,
    mobile: null,
    socketIo: null,
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

        default:
            return state;
    }
}
