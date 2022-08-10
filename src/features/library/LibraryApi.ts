// LibraryApi ----------------------------------------------------------------

// Redux Toolkit Query API for Library models.

// External Modules ----------------------------------------------------------

import {createApi} from "@reduxjs/toolkit/query/react";

// Internal Modules ----------------------------------------------------------

import {Library, LIBRARY, paginationParams} from "../../types";
import {apiBaseQuery, appendQueryParameters} from "../../util/ApiUtil";
import * as Sorters from "../../util/Sorters";

// Parameter Types -----------------------------------------------------------

interface includeLibraryParams {
    withAuthors?: boolean;              // Include child Authors
    withSeries?: boolean;               // Include child Series
    withStories?: boolean;              // Include child Stories
    withVolumes?: boolean;              // Include child Volumes
}

interface matchLibraryParams {
    active?: boolean;                   // Select active Libraries
    name?: string;                      // Wildcard match on name
    scope?: string;                     // Exact match on scope
}

export interface allLibrariesParams
    extends includeLibraryParams, matchLibraryParams, paginationParams {
}

// Public Objects ------------------------------------------------------------

export const LibraryApi = createApi({
    baseQuery: apiBaseQuery(),
    endpoints: (builder) => ({
        allLibraries: builder.query<Library[], allLibrariesParams>({
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: LIBRARY, id: id ? id : "ALL" })),
                        { type: LIBRARY, id: "ALL" },
                    ]
                    : [{ type: LIBRARY, id: "ALL" }],
//            query: () => `/libraries`,
            query: (params) => appendQueryParameters("/libraries", params),
/*
            {
                let appended: string = "";
                if (params) {
                    const output = new URLSearchParams(params as any).toString();
                    if (output.length > 0) {
                        appended = `?${output}`;
                    }
                }
                return `/libraries${appended}`;
            },
*/
            // NOTE - Immutability does not matter before results are cached
            transformResponse: (response: Library[]) => Sorters.LIBRARIES(response),
        }),
        exactLibrary: builder.query<Library, string>({
/*
            providesTags: (result, error, arg) => [
                { type: LIBRARY, id: arg }
            ],
*/
            query: (name) => `/libraries/exact/${name}`,
        }),
        findLibrary: builder.query<Library, number>({
            providesTags: (result, error, arg) => [
                { type: LIBRARY, id: arg }
            ],
            query: (libraryId) => `/libraries/${libraryId}`,
        }),
        insertLibrary: builder.mutation<Library, Partial<Library>>({
            invalidatesTags: [
                { type: LIBRARY, id: "ALL" }
            ],
            query: (library) => ({
                body: library,
                method: "POST",
                url: "/libraries",
            }),
        }),
        removeLibrary: builder.mutation<Library, number>({
            invalidatesTags: (result, error, arg) => [
                { type: LIBRARY, id: "ALL" },
                { type: LIBRARY, id: arg }
            ],
            query: (libraryId) => ({
                method: "DELETE",
                url: `/libraries/${libraryId}`,
            }),
        }),
        updateLibrary: builder.mutation<Library, { libraryId: number; body: Partial<Library> }>({
            invalidatesTags: (result, error, { libraryId }) => [
                { type:  LIBRARY, id: "ALL" },
                { type: LIBRARY, id: libraryId }
            ],
            query: ({ libraryId, body }) => ({
                body: body,
                method: "PUT",
                url: `/libraries/${libraryId}`,
            })
        }),
    }),
    reducerPath: "libraries", // Base name in RootState
    tagTypes: [ LIBRARY ],
});

export const {
    useAllLibrariesQuery,
    useExactLibraryQuery,
    useFindLibraryQuery,
    useInsertLibraryMutation,
    useRemoveLibraryMutation,
    useUpdateLibraryMutation,
} = LibraryApi;
