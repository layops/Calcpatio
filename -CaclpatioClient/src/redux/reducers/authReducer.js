import {LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT} from "../actions/types";

const initState = {
    user: undefined,
    token: undefined,
    error: false,
    errorMessage: '',
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:{
            return {
                ...state,
                user: action.user,
                token: action.token,
                error: false,
                errorMessage: ''
            };
        }

        case LOGIN_ERROR:{
            return {
                ...state,
                user: undefined,
                token: undefined,
                error: true,
                errorMessage: action.error
            };
        }

        case LOGOUT:{
            return {
                ...state,
                user: undefined,
                token: undefined,
                error: false,
                errorMessage: ''
            };
        }
        default:{
            return state;
        }

    }
}

export default authReducer;