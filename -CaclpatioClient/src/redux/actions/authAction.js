import {LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT} from "./types";
import axios from "axios";
import {setAuthorizationToken} from "../../utils/setAuthorizationToken";
import jwtDecode from "jwt-decode";


const loginSuccess = (user, token) => {
    return {
        type: LOGIN_SUCCESS,
        user,
        token
    };
};

const loginError = error => {
    return {
        type: LOGIN_ERROR,
        error
    };
};

export const login = (username, password, setSubmitting) => {
    return dispatch => {
        axios.post("/user/login", {username, password})
            .then(res => {
                setSubmitting(false);
                const {token} = res.data;
                setAuthorizationToken(token);
                localStorage.setItem("token", JSON.stringify(token));
                let user = jwtDecode(token);
                dispatch(loginSuccess(user, token));
            })
            .catch(err => {
                setSubmitting(false);
                if (err.response) {
                    let {message} = err.response.data;
                    if (message)
                        dispatch(loginError(message));
                } else {
                    dispatch(loginError("Sunucuya bağlanılamadı. Lütfen yöneticiye bildiriniz."));
                }

            });
    }
}

export const logout = () => {
    setAuthorizationToken(false);
    localStorage.removeItem("token");
    return {
        type: LOGOUT
    };
}