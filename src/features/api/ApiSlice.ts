// ApiSlice ------------------------------------------------------------------

// Redux slice for Redux Toolkit Query actions.

// External Modules ----------------------------------------------------------

import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

// Internal Modules ----------------------------------------------------------

import {
    Library,
    LIBRARY,
} from "../../types";

// Public Objects ------------------------------------------------------------

export const ApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:2999", // For testing via json-server
        prepareHeaders(headers) {
            // headers.set("Authorization", "xxx");
            return headers;
        }
    }),
    endpoints: (builder) => ({

        // Library -----------------------------------------------------------
        allLibraries: builder.query<Library[], void>({
            providesTags: (models, error, arg) => {
                const tags = [];
                tags.push({ type: LIBRARY, id: "ALL" });
                if (models) {
                    models.forEach(model => {
                        tags.push({ type: LIBRARY, id: model.id });
                    });
                }
                return tags;
            },
            query: () => `/libraries`,
            // TODO transformResponse to sort
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
    reducerPath: "api", // Base name in RootState
    tagTypes: [ LIBRARY ],
});

export const {
    useAllLibrariesQuery,
    useFindLibraryQuery,
    useInsertLibraryMutation,
    useRemoveLibraryMutation,
    useUpdateLibraryMutation,
} = ApiSlice;
