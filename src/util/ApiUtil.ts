// ApiUtil -------------------------------------------------------------------

// Generic utility methods for model-specific ApiSlice implementations.

// External Modules ----------------------------------------------------------

import {BaseQueryFn, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import axios, {AxiosRequestConfig, AxiosError} from "axios";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Return the base URL we should pass to for API slices.
 */
export const BASE_URL = () : string => {
    return "http://localhost:2999"; // For testing via json-server
}

/**
 * Return the baseQuery implementation we should use.
 *
 * @param baseUrl                       Base URL to be configured
 */
export const apiBaseQuery = (baseUrl: string = BASE_URL()): BaseQueryFn => {
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

/**
 * Return a baseQuery implementation around the built in fetch interface.
 *
 * @param baseUrl                       Base URL to be configured
 */
const standardBaseQuery = (baseUrl: string) => {
    // Can customize with prepareHeaders(headers) element
    return fetchBaseQuery({ baseUrl: baseUrl });
}

