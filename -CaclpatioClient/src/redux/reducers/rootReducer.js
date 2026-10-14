import { combineReducers } from 'redux';

import authReducer from './authReducer';
import {LOGOUT} from "../actions/types";


const rootReducer = (state, action) => {
    if (action.type === LOGOUT){
        state = undefined;
    }

    return combineReducers({
        auth: authReducer,
    })(state ,action);
};

export default rootReducer;