const actions = {
    // * Declare the actions types *
    SET_VIEW: "SET_VIEW",
    SET_VIEW_SIZE: "SET_VIEW_SIZE",

    SET_SCROLLBAR_USEREF: "SET_SCROLLBAR_USEREF",
    SET_SCROLLBAR_USEREF_SUCCESS: "SET_SCROLLBAR_USEREF_SUCCESS",

    SET_MOBILE_ACTION: "SET_MOBILE_ACTION",
    SET_MOBILE_ACTION_SUCCESS: "SET_MOBILE_ACTION_SUCCESS",

    SET_SOCKETIO: "SET_SOCKETIO",
    SET_SOCKETIO_SUCCESS: "SET_SOCKETIO_SUCCESS",

    SET_CURRENT_ONLINE_USERS: "SET_CURRENT_ONLINE_USERS",
    SET_CURRENT_ONLINE_USERS_SUCCESS: "SET_CURRENT_ONLINE_USERS_SUCCESS",

    SET_CONVERSATION_ARRAY: "SET_CONVERSATION_ARRAY",
    SET_CONVERSATION_ARRAY_SUCCESS: "SET_CONVERSATION_ARRAY_SUCCESS",

    // * Declare the actions function *
    setView: (payload) => ({
        type: actions.SET_VIEW,
        payload
    }),

    setScrollbarUseRef: (payload) => ({
        type: actions.SET_SCROLLBAR_USEREF,
        payload
    }),

    setMobileAction: (payload) => ({
        type: actions.SET_MOBILE_ACTION,
        payload
    }),

    setSocketIo: (payload) => ({
        type: actions.SET_SOCKETIO,
        payload
    }),

    setCurrentOnlineUsers: (payload) => ({
        type: actions.SET_CURRENT_ONLINE_USERS,
        payload
    }),

    setConversationArray: (payload) => ({
        type: actions.SET_CONVERSATION_ARRAY,
        payload
    }),
 }
  
  
export default actions;
  