// LoginUtil -----------------------------------------------------------------

// Common utility functions for handling OAuth interactions, plus managing
// local storage for LoginData.

// External Modules ----------------------------------------------------------

import {
    PasswordTokenRequest,
    RefreshTokenRequest,
    TokenResponse
} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import {LoginApi} from "./LoginApi";
import {store} from "../../app/store";
import {LOGIN_DATA_KEY, LOGIN_USER_KEY} from "../../constants";
import {Credentials, LoginData, User} from "../../types";
import LocalStorage from "../../util/LocalStorage";
import {EMPTY_USER} from "./LoginContext";

// Private Objects -----------------------------------------------------------

const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);
const loginUser = new LocalStorage<User>(LOGIN_USER_KEY);

// Public Objects ------------------------------------------------------------

/**
 * Handle login for the specified credentials.
 *
 * @param credentials                   Username and password to be submitted
 *
 * @returns                             Updated LoginData after login
 *
 * @throws Error                        If login was not successful
 */
export const login = (credentials: Credentials): LoginData => {

    // Attempt to authenticate the specified Credentials
    const params: PasswordTokenRequest = {
        grant_type: "password",
        password: credentials.password,
        username: credentials.username,
    }
    const initiate = store.dispatch(LoginApi.endpoints.login.initiate(params));
    // @ts-ignore -- TODO - why?
    const selector = LoginApi.endpoints.login.select(params);
    const result = selector(store.getState());
    const {data: tokenResponse, error} = result;
    initiate.unsubscribe();

    // Update and return state showing logged in information, or throw an error
    if (tokenResponse) {
        const newData: LoginData = convert(credentials.username, tokenResponse);
        loginData.value = newData;
        return newData;
    } else {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Invalid login credentials");
        }
    }

}

/**
 * Handle logout for the currently logged in User.
 *
 * @returns                             Updated LoginData after logout
 */
export const logout = (): LoginData => {

    // Revoke the currently assigned access token (and refresh token), if any
    let currentData = loginData.value;
    if (currentData.loggedIn && currentData.accessToken) {
        const initiate = store.dispatch(LoginApi.endpoints.logout.initiate(undefined));
        // @ts-ignore -- TODO - why?
        const selector = LoginApi.endpoints.logout.select(undefined);
        selector(store.getState());
    }

    // Update and return current state to show logged out result
    currentData = convert(null, null);
    loginData.value = currentData;
    loginUser.value = EMPTY_USER;
    return currentData;

}

/**
 * Look up and store the User object for the currently logged in User.
 */
export const me = (): void => {

    const initiate = store.dispatch(LoginApi.endpoints.me.initiate(undefined));
    const selector = LoginApi.endpoints.me.select(undefined);
    const result = selector(store.getState());
    const {data} = result;
    initiate.unsubscribe();
    if (data) {
        loginUser.value = data;
        return;
    }
    loginUser.value = EMPTY_USER;

}

/**
 * If the current access token is expired, and if there is a refresh token,
 * use the refresh token to request a new access token.  Return an updated
 * LoginData object if this was accomplished, or the current one if not.
 *
 * @returns                             Possibly updated LoginData after refresh
 *
 * @throws OAuthError                   If an authentication error occurs
 */
export const refresh = (): LoginData => {

    // If there is an unexpired current access token, just return current LoginData
    let currentData = loginData.value;
    if (!currentData.accessToken) {
        return currentData;
    }
    const now = new Date();
    if (currentData.expires) {
        // Coming back from local storage expires is a string
        const expiresDate = (typeof currentData.expires === "string")
            ? new Date(currentData.expires)
            : currentData.expires;
        if (expiresDate > now) {
            return currentData;
        }
    }

    // If there is no refresh token, just return current LoginData
    if (!currentData.refreshToken) {
        return currentData;
    }

    // Attempt to exchange the current refresh token for a new access token and refresh token
    const params: RefreshTokenRequest = {
        grant_type: "password",
        refresh_token: currentData.refreshToken,
    }
    const initiate = store.dispatch(LoginApi.endpoints.refresh.initiate(params));
    // @ts-ignore -- TODO - why?
    const selector = LoginApi.endpoints.refresh.select(params);
    const result = selector(store.getState());
    const {data: tokenResponse, error} = result;
    initiate.unsubscribe();

    if (tokenResponse) {
        const newData: LoginData = convert(currentData.username, tokenResponse);
        loginData.value = newData;
        return newData;
    } else {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Invalid login credentials");
        }
    }

}

// Private Objects -----------------------------------------------------------

/**
 * Convert the specified TokenResponse into appropriate LoginData information.
 */
const convert = (username: string | null, tokenResponse: TokenResponse | null): LoginData => {
    if (username && tokenResponse) {
        return {
            accessToken: tokenResponse.access_token,
            expires: new Date((new Date()).getTime() + (tokenResponse.expires_in * 1000)),
            loggedIn: true,
            refreshToken: tokenResponse.refresh_token ? tokenResponse.refresh_token : null,
            scope: tokenResponse.scope,
            username: username,
        }
    } else {
        return {
            accessToken: null,
            expires: null,
            loggedIn: false,
            refreshToken: null,
            scope: null,
            username: null,
        }
    }
}
