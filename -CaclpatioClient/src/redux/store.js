import {applyMiddleware, createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import axios from "axios";
import rootReducer from './reducers/rootReducer';
import {createLogger} from "redux-logger";
import {loadSession} from "../utils/session";
import {setAuthorizationToken} from "../utils/setAuthorizationToken";
import {logout} from "./actions/authAction";


const session = loadSession();
if (session)
    setAuthorizationToken(session.token);

const preloadedState = session
    ? {auth: {user: session.user, token: session.token, error: false, errorMessage: ''}}
    : {};

const middlewares = [thunkMiddleware];
if (process.env.NODE_ENV === 'development')
    middlewares.push(createLogger());

//const store = createStore(rootReducer, persistedState, applyMiddleware(thunkMiddleware));
const store = createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(...middlewares)));

// Expired/invalid token on any authenticated request -> log the user out
axios.interceptors.response.use(
    response => response,
    error => {
        const status = error.response && error.response.status;
        const url = (error.config && error.config.url) || '';
        if (status === 401 && !url.includes('user/login') && store.getState().auth.token)
            store.dispatch(logout());
        return Promise.reject(error);
    }
);


export default store;