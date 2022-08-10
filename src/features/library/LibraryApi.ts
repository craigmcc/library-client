// LibraryApi ----------------------------------------------------------------

// Redux Toolkit Query API for Library models.

// External Modules ----------------------------------------------------------

import {createApi} from "@reduxjs/toolkit/query/react";

// Internal Modules ----------------------------------------------------------

import {Library, LIBRARY, paginationParams} from "../../types";
import {apiBaseQuery, appendQueryParameters} from "../../util/ApiUtil";
import * as Sorters from "../../util/Sorters";

// Parameter Types -----------------------------------------------------------

export interface allLibrariesParams
    extends includeLibraryParams, matchLibraryParams, paginationParams {
}

export interface exactLibraryParams {
    name: string;                       // Exact match on name
    params?: includeLibraryParams;      // Other parameters
}

export interface findLibraryParams {
    libraryId: number;                  // ID of the requested Library
    params?: includeLibraryParams;      // Other parameters
}

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

export interface removeLibraryParams {
    libraryId: number;                  // ID of the Library to remove
}

export interface updateLibraryParams {
    libraryId: number;                  // ID of the Library to update
    library: Partial<Library>;          // Library properties to update
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
            query: (params) => appendQueryParameters("/libraries", params),
            // NOTE - Immutability does not matter before results are cached
            transformResponse: (response: Library[]) => Sorters.LIBRARIES(response),
        }),
        exactLibrary: builder.query<Library, exactLibraryParams>({
            providesTags: (result, error, arg) => [
                { type: LIBRARY, id: "exact:" + arg.name }
            ],
            query: (params) =>
                appendQueryParameters(`/libraries/exact/${params.name}`, params.params),
        }),
        findLibrary: builder.query<Library, findLibraryParams>({
            providesTags: (result, error, arg) => [
                { type: LIBRARY, id: arg.libraryId }
            ],
            query: (params) =>
                appendQueryParameters(`/libraries/${params.libraryId}`, params.params),
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
        removeLibrary: builder.mutation<Library, removeLibraryParams>({
            invalidatesTags: (result, error, arg) => [
                { type: LIBRARY, id: "ALL" },
                { type: LIBRARY, id: arg.libraryId }
            ],
            query: (params) => ({
                method: "DELETE",
                url: `/libraries/${params.libraryId}`,
            }),
        }),
        updateLibrary: builder.mutation<Library, updateLibraryParams>({
            invalidatesTags: (result, error, { libraryId }) => [
                { type:  LIBRARY, id: "ALL" },
                { type: LIBRARY, id: libraryId }
            ],
            query: (params) => ({
                body: params.library,
                method: "PUT",
                url: `/libraries/${params.libraryId}`,
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
