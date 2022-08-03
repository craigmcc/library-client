// LibraryApi ----------------------------------------------------------------

// Redux Toolkit Query API for Library models.

// External Modules ----------------------------------------------------------

import {createApi} from "@reduxjs/toolkit/query/react";

// Internal Modules ----------------------------------------------------------

import {Library, LIBRARY} from "../../types";
import {apiBaseQuery} from "../../util/ApiUtil";
import * as Sorters from "../../util/Sorters";

// Public Objects ------------------------------------------------------------

export const LibraryApi = createApi({
    baseQuery: apiBaseQuery(),
    endpoints: (builder) => ({

        // Library -----------------------------------------------------------
        allLibraries: builder.query<Library[], void>({
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: LIBRARY, id: id ? id : "ALL" })),
                        { type: LIBRARY, id: "ALL" },
                    ]
                    : [{ type: LIBRARY, id: "ALL" }],
            query: () => `/libraries`,
            // NOTE - Immutability does not matter before results are cached
            transformResponse: (response: Library[]) => Sorters.LIBRARIES(response),
        }),
        findLibrary: builder.query<Library, number>({
            providesTags: (result, error, arg) => [
                { type: LIBRARY, id: arg }
            ],
            query: (libraryId) => `/libraries/${libraryId}`,
        }),
        insertLibrary: builder.mutation<Library, void>({
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
        updateLibrary: builder.mutation<Library, { libraryId: number; body: Library }>({
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
    useFindLibraryQuery,
    useInsertLibraryMutation,
    useRemoveLibraryMutation,
    useUpdateLibraryMutation,
} = LibraryApi;
