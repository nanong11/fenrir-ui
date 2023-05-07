import { combineReducers } from 'redux';
import authReducer from './auth/reducer'
import usersReducer from './users/reducer';
import utilityReducer from './utility/reducer';


export default combineReducers({
    authReducer,
    usersReducer,
    utilityReducer,
});
