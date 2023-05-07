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

    LOAD_USER_PROFILE_FROM_POST: "LOAD_USER_PROFILE_FROM_POST",
    LOAD_USER_PROFILE_FROM_POST_SUCCESS: "LOAD_USER_PROFILE_FROM_POST_SUCCESS",
    LOAD_USER_PROFILE_FROM_POST_LOADING: "LOAD_USER_PROFILE_FROM_POST_LOADING",
    LOAD_USER_PROFILE_FROM_POST_FAILED: "LOAD_USER_PROFILE_FROM_POST_FAILED",
    LOAD_USER_PROFILE_FROM_POST_RESET: "LOAD_USER_PROFILE_FROM_POST_RESET",

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

    loadUserProfileFromPost: (payload) => ({
        type: actions.LOAD_USER_PROFILE_FROM_POST,
        payload
    }),

    loadUserProfileFromPostReset: () => ({
        type: actions.LOAD_USER_PROFILE_FROM_POST_RESET,
    }),
}
  
export default actions;
  