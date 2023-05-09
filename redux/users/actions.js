const actions = {
    // * Declare the actions types *
    SIGNUP: "SIGNUP",
    SIGNUP_LODING: "SIGNUP_LODING",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    SIGNUP_FAILED: "SIGNUP_FAILED",
    SIGNUP_RESET: "SIGNUP_RESET",

    CHECK_MOBILE_EMAIL: 'CHECK_MOBILE_EMAIL',
    CHECK_MOBILE_EMAIL_SUCCESS: 'CHECK_MOBILE_EMAIL_SUCCESS',
    CHECK_MOBILE_EMAIL_FAILED: 'CHECK_MOBILE_EMAIL_FAILED',
    CHECK_MOBILE_EMAIL_LOADING: 'CHECK_MOBILE_EMAIL_LOADING',
    CHECK_MOBILE_EMAIL_RESET: 'CHECK_MOBILE_EMAIL_RESET',

    UPDATE_USER: "UPDATE_USER",
    UPDATE_USER_SUCCESS: "UPDATE_USER_SUCCESS",
    UPDATE_USER_FAILED: "UPDATE_USER_FAILED",
    UPDATE_USER_LOADING: "UPDATE_USER_LOADING",
    UPDATE_USER_RESET: "UPDATE_USER_RESET",

    FETCH_ALL_USERS: "FETCH_ALL_USERS",
    FETCH_ALL_USERS_SUCCESS: "FETCH_ALL_USERS_SUCCESS",
    FETCH_ALL_USERS_LOADING: "FETCH_ALL_USERS_LOADING",
    FETCH_ALL_USERS_FAILED: "FETCH_ALL_USERS_FAILED",
    FETCH_ALL_USERS_RESET: "FETCH_ALL_USERS_RESET",

    // * Declare the actions function *
    signUp: (payload) => ({
        type: actions.SIGNUP,
        payload
    }),

    signUpReset: () => ({
        type: actions.SIGNUP_RESET,
    }),
    
    checkMobileEmail: (payload) => ({
        type: actions.CHECK_MOBILE_EMAIL,
        payload
    }),

    checkMobileEmailReset: () => ({
        type: actions.CHECK_MOBILE_EMAIL_RESET,
    }),

    updateUser: (payload) => ({
        type: actions.UPDATE_USER,
        payload
    }),

    updateUserReset: () => ({
        type: actions.UPDATE_USER_RESET,
    }),

    fetchAllUsers: () => ({
        type: actions.FETCH_ALL_USERS
    }),

    fetchAllUsersReset: () => ({
        type: actions.FETCH_ALL_USERS_RESET,
    }),
}
  
export default actions;
  