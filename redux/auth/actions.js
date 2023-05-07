const actions = {
    LOGIN: 'LOGIN',
    LOGIN_LOADING: 'LOGIN_LOADING',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGIN_RESET: 'LOGIN_RESET',
    
    LOGOUT: 'LOGOUT',
    LOGOUT_LOADING: 'LOGOUT_LOADING',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILED: 'LOGOUT_FAILED',
    LOGOUT_RESET: 'LOGOUT_RESET',

    AUTHENTICATE: "AUTHENTICATE",
    AUTHENTICATE_SUCCESS: "AUTHENTICATE_SUCCESS",
    AUTHENTICATE_FAILED: "AUTHENTICATE_FAILED",
    AUTHENTICATE_LOADING: "AUTHENTICATE_LOADING",

    login: (payload) => ({
        type: actions.LOGIN,
        payload
    }),

    loginReset: () => ({
        type: actions.LOGIN_RESET,
    }),

    logout: () => ({
        type: actions.LOGOUT,
    }),

    authenticate: () => ({
        type: actions.AUTHENTICATE,
    }),
}
  
export default actions;
  