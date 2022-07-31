// ApiSlice ------------------------------------------------------------------

// Redux slice for Redux Toolkit Query actions.

// External Modules ----------------------------------------------------------

import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

// Internal Modules ----------------------------------------------------------

import {
    Library
} from "../../types";

// Public Objects ------------------------------------------------------------

export const libraryApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api"}),
    endpoints: (builder) => ({
        // Library -----------------------------------------------------------
        allLibraries: builder.query<Library, void>({
            query: () => `/libraries`,
        }),
        findLibrary: builder.query<Library, number>({
            query: (libraryId) => `/libraries/${libraryId}`,
        })
    }),
    reducerPath: "libraryApi",
});

export const {
    useAllLibrariesQuery,
    useFindLibraryQuery,
} = libraryApi;
