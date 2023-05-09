import actions from "./actions";

// Define Initial State of reducers
const initialState = {
    signupSuccessData: null,
    signupLoading: false,
    signupFailed: null,

    isMobileEmailExist: null,
    isMobileEmailLoading: false,
    isMobileEmailFailed: null,

    allUsers: null,
    allUsersLoading: false,
    allUsersFailed: null,
}

// Define reducer function
export default function usersReducer(state = initialState, action) {
    switch(action.type) {
        // SIGN UP
        case actions.SIGNUP_SUCCESS:
            return {
                ...state,
                signupSuccessData: action.payload,
                signupFailed: null,
                signupLoading: false,
            }
        case actions.SIGNUP_LODING:
            return {
                ...state,
                signupLoading: true,
            }
        case actions.SIGNUP_FAILED:
            return {
                ...state,
                signupFailed: action.payload,
                signupSuccessData: null,
                signupLoading: false,
            }
        case actions.SIGNUP_RESET:
            return {
                ...state,
                signupSuccessData: null,
                signupFailed: null,
                signupLoading: false,
            }
        case actions.CHECK_MOBILE_EMAIL_SUCCESS:
            return {
                ...state,
                isMobileEmailExist: action.payload,
                isMobileEmailFailed: null,
                isMobileEmailLoading: false,
            }
        case actions.CHECK_MOBILE_EMAIL_LOADING:
            return {
                ...state,
                isMobileEmailLoading: true,
                isMobileEmailExist: null,
                isMobileEmailFailed: null,
            }
        case actions.CHECK_MOBILE_EMAIL_FAILED:
            return {
                ...state,
                isMobileEmailFailed: action.payload,
                isMobileEmailExist: null,
                isMobileEmailLoading: false,
            }
        case actions.CHECK_MOBILE_EMAIL_RESET:
            return {
                ...state,
                isMobileEmailExist: null,
                isMobileEmailLoading: false,
                isMobileEmailFailed: null,
            }
        
        case actions.UPDATE_USER_SUCCESS:
            return {
                ...state,
                updateUserSuccess: action.payload,
                updateUserFailed: null,
                updateUserLoading: false,
        }
        case actions.UPDATE_USER_LOADING:
            return {
                ...state,
                updateUserLoading: true,
            }
        case actions.UPDATE_USER_FAILED:
            return {
                ...state,
                updateUserFailed: action.payload,
                updateUserLoading: false,
            }
        case actions.UPDATE_USER_RESET:
            return {
                ...state,
                updateUserSuccess: null,
                updateUserFailed: null,
                updateUserLoading: null,
            }
        case actions.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                allUsers: action.payload,
                allUsersFailed: null,
                allUsersLoading: false,
        }
        case actions.FETCH_ALL_USERS_LOADING:
            return {
                ...state,
                allUsersLoading: true,
            }
        case actions.FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                allUsersFailed: action.payload,
                allUsers: null,
                allUsersLoading: false,
            }
        case actions.FETCH_ALL_USERS_RESET:
            return {
                ...state,
                allUsers: null,
                allUsersFailed: null,
                allUsersLoading: false,
            }
        
        default:
            return state;
    }
}
