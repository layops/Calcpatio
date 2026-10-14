import jwtDecode from "jwt-decode";

export const TOKEN_KEY = "token";

/**
 * Restores a previously saved session from localStorage.
 * Returns null (and clears storage) if the token is missing, malformed or expired.
 */
export const loadSession = () => {
    try {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (!raw)
            return null;

        const token = JSON.parse(raw);
        const user = jwtDecode(token);
        if (!user.exp || user.exp * 1000 <= Date.now()) {
            localStorage.removeItem(TOKEN_KEY);
            return null;
        }
        return {token, user};
    } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
    }
};
