import { combineReducers } from 'redux';
import authReducer from './auth/reducer'
import usersReducer from './users/reducer';
import utilityReducer from './utility/reducer';
import conversationReducer from './conversation/reducer';


export default combineReducers({
    authReducer,
    usersReducer,
    utilityReducer,
    conversationReducer,
});
