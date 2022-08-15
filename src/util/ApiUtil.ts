// ApiUtil -------------------------------------------------------------------

// Generic utility methods for model-specific ApiSlice and OauthSlice
// implementations.

// External Modules ----------------------------------------------------------

import {BaseQueryFn, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
//import axios, {AxiosRequestConfig, AxiosError} from "axios";

// Internal Modules ----------------------------------------------------------

import LocalStorage from "./LocalStorage";
import {LOGIN_DATA_KEY} from "../constants";
import {LoginData} from "../types";

const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);

// Public Objects ------------------------------------------------------------

/**
 * Return the base URL we should pass to for API slices.
 */
export const API_BASE_URL = () : string => {
    return "/api"; // For testing via local dev server (see "proxy" in package.json)
//    return "http://localhost:2999"; // For testing via json-server
}

/**
 * Return the baseQuery implementation we should use.
 *
 * @param baseUrl                       Base URL to be configured
 */
export const apiBaseQuery = (baseUrl: string = API_BASE_URL()): BaseQueryFn => {
    return standardBaseQuery(baseUrl);
}

/**
 * Append the specified query parameters (if any) to the specified URL, and return
 * the updated string.
 *
 * @param url                           URL to be appended to
 * @param params                        Parameters (if any) to be appended
 */
export const appendQueryParameters = (url: string, params?: any): string => {
    let appended: string = "";
    if (params) {
        const output = new URLSearchParams(params).toString();
        if (output.length > 0) {
            appended = `?${output}`;
        }
    }
    return `${url}${appended}`;
}

/**
 * Return the base URL we should pass to for OAUTH slices.
 */
export const OAUTH_BASE_URL = () : string => {
    return "/oauth"; // For testing via local dev server (see "proxy" in package.json)
//    return "http://localhost:2999"; // For testing via json-server
}

/**
 * Return the baseQuery implementation we should use for OAUTH slices.
 *
 * @param baseUrl                       Base URL to be configured
 */
export const oauthBaseQuery = (baseUrl: string = OAUTH_BASE_URL()): BaseQueryFn => {
    return standardBaseQuery(baseUrl);
}

// Private Objects -----------------------------------------------------------

/**
 * Return a baseQuery implementation around Axios.
 *
 * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#axios-basequery
 *
 * @param baseUrl                       Base URL to be configured
 */
// Can customize headers etc. with interceptors
/*
const axiosBaseQuery = (baseUrl: string): BaseQueryFn<{
    url: string
    method: AxiosRequestConfig["method"]
    data?: AxiosRequestConfig["data"]
    params?: AxiosRequestConfig["params"]
},
    unknown,
    unknown
> => async ({ url, method, data, params }) => {
    try {
        console.log("AXIOS Trying", {
            baseUrl: baseUrl,
            url: url,
            method: method,
            data: data,
            params: params,
        }); // TODO
        const result = await axios({ url: baseUrl + url, method, data, params });
        return { data: result.data };
    } catch (axiosError) {
        let err = axiosError as AxiosError;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
            },
        }
    }
}
*/

/**
 * Return a baseQuery implementation around the built in fetch interface.
 *
 * @param baseUrl                       Base URL to be configured
 */
const standardBaseQuery = (baseUrl: string) => {
    // Can customize with prepareHeaders(headers) element
    return fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const currentData = loginData.value; // TODO call refresh
            if (currentData.loggedIn) {
                if (currentData.accessToken) {
                    headers.set("Authorization", `Bearer ${currentData.accessToken}`);
                }
                if (currentData.username) {
                    headers.set("x-username", currentData.username);
                }
            }
            return headers;
        }
    });
}

