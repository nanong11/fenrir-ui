import actions from "./actions";

// Define Initial State of reducers
const initialState = {
    usersData: null,

    loginLoading: false,
    loginFailed: null,

    logoutLoading: false,
    logoutFailed: null,

    authenticateFailed: null,
    authenticateLoading: false,
}

// Define reducer function
export default function authReducer(state = initialState, action) {
    switch(action.type) {
        // AUTHENTICATE
        case actions.AUTHENTICATE_SUCCESS:
            return {
                ...state,
                usersData: action.payload,
                loginFailed: null,
                authenticateFailed: null,
                loginLoading: false,
                authenticateLoading: false,
            }
        case actions.AUTHENTICATE_FAILED:
            return {
                ...state,
                authenticateFailed: action.payload,
                usersData: null,
                authenticateLoading: false,
            }
        case actions.AUTHENTICATE_LOADING:
            return {
                ...state,
                authenticateLoading: true,
            }
        case actions.LOGIN_FAILED:
            return {
                ...state,
                loginFailed: action.payload,
                usersData: null,
                loginLoading: false,
            }
        case actions.LOGIN_LOADING:
            return {
                ...state,
                loginLoading: true,
            }
        
        case actions.LOGIN_RESET:
            return {
                ...state,
                usersData: null,
                loginLoading: false,
                loginFailed: null,
            }
        // LOGOUT
        case actions.LOGOUT_SUCCESS:
            return {
                ...state,
                logoutFailed: null,
                logoutLoading: false,
            }
        case actions.LOGOUT_LOADING:
            return {
                ...state,
                logoutLoading: true,
            }
        case actions.LOGOUT_FAILED:
            return {
                ...state,
                logoutFailed: action.payload,
                logoutLoading: false,
            }
        case actions.LOGOUT_RESET:
            return {
                ...state,
                logoutData: null,
                logoutLoading: false,
                logoutFailed: null,
            }

        default:
            return state;
    }
}
