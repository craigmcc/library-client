// LoginApi ------------------------------------------------------------------

// Redux Toolkit Query API for User models.

// External Modules ----------------------------------------------------------

import {createApi} from "@reduxjs/toolkit/query/react";
import {PasswordTokenRequest, RefreshTokenRequest, TokenResponse} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import {LOGIN, User} from "../../types";
import {oauthBaseQuery} from "../../util/ApiUtil";

// Parameter Types -----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const LoginApi = createApi({
    baseQuery: oauthBaseQuery(),
    endpoints: (builder) => ({
        login: builder.mutation<TokenResponse, PasswordTokenRequest>({
            query: (tokenRequest) => ({
                body: tokenRequest,
                method: "POST",
                url: "/token",
            }),
        }),
        logout: builder.mutation<void, undefined>({
            query: () => ({
                method: "DELETE",
                url: "/token",
            }),
        }),
        me: builder.query<User, undefined>({
            query: () => ({
                method: "GET",
                url: "/me",
            }),
        }),
        refresh: builder.mutation<TokenResponse, RefreshTokenRequest>({
            query: (tokenRequest) => ({
                body: tokenRequest,
                method: "POST",
                url: "/token",
            }),
        }),
    }),
    reducerPath: "login",
    tagTypes: [ LOGIN ],
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useMeQuery,
    useRefreshMutation,
} = LoginApi;
