// UserApi ----------------------------------------------------------------

// Redux Toolkit Query API for User models.

// External Modules ----------------------------------------------------------

import {createApi} from "@reduxjs/toolkit/query/react";

// Internal Modules ----------------------------------------------------------

import {User, USER, paginationParams} from "../../types";
import {apiBaseQuery, appendQueryParameters} from "../../util/ApiUtil";
import * as Sorters from "../../util/Sorters";

// Parameter Types -----------------------------------------------------------

export interface allUsersParams
    extends includeUserParams, matchUserParams, paginationParams {
}

export interface exactUserParams {
    username: string;                   // Exact match on username
    params?: includeUserParams;         // Other parameters
}

export interface findUserParams {
    userId: number;                  // ID of the requested User
    params?: includeUserParams;         // Other parameters
}

interface includeUserParams {
}

interface matchUserParams {
    active?: boolean;                   // Select active Users
    username?: string;                  // Wildcard match on username
    scope?: string;                     // Exact match on scope
}

export interface removeUserParams {
    userId: number;                  // ID of the User to remove
}

export interface updateUserParams {
    userId: number;                  // ID of the User to update
    user: Partial<User>;          // User properties to update
}

// Public Objects ------------------------------------------------------------

export const UserApi = createApi({
    baseQuery: apiBaseQuery(),
    endpoints: (builder) => ({
        allUsers: builder.query<User[], allUsersParams>({
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: USER, id: id ? id : "ALL" })),
                        { type: USER, id: "ALL" },
                    ]
                    : [{ type: USER, id: "ALL" }],
            query: (params) => appendQueryParameters("/users", params),
            // NOTE - Immutability does not matter before results are cached
            transformResponse: (response: User[]) => Sorters.USERS(response),
        }),
        exactUser: builder.query<User, exactUserParams>({
            providesTags: (result, error, arg) => [
                { type: USER, id: "exact:" + arg.username }
            ],
            query: (params) =>
                appendQueryParameters(`/users/exact/${params.username}`, params.params),
        }),
        findUser: builder.query<User, findUserParams>({
            providesTags: (result, error, arg) => [
                { type: USER, id: arg.userId }
            ],
            query: (params) =>
                appendQueryParameters(`/users/${params.userId}`, params.params),
        }),
        insertUser: builder.mutation<User, Partial<User>>({
            invalidatesTags: [
                { type: USER, id: "ALL" }
            ],
            query: (user) => ({
                body: user,
                method: "POST",
                url: "/users",
            }),
        }),
        removeUser: builder.mutation<User, removeUserParams>({
            invalidatesTags: (result, error, arg) => [
                { type: USER, id: "ALL" },
                { type: USER, id: arg.userId }
            ],
            query: (params) => ({
                method: "DELETE",
                url: `/users/${params.userId}`,
            }),
        }),
        updateUser: builder.mutation<User, updateUserParams>({
            invalidatesTags: (result, error, { userId }) => [
                { type:  USER, id: "ALL" },
                { type: USER, id: userId }
            ],
            query: (params) => ({
                body: params.user,
                method: "PUT",
                url: `/users/${params.userId}`,
            })
        }),
    }),
    reducerPath: "users", // Base name in RootState
    tagTypes: [ USER ],
});

export const {
    useAllUsersQuery,
    useExactUserQuery,
    useFindUserQuery,
    useInsertUserMutation,
    useRemoveUserMutation,
    useUpdateUserMutation,
} = UserApi;
