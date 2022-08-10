// AsyncValidators -----------------------------------------------------------

// Validation mechanisms that require asynchronous contact with a server,
// outside the context of a React component.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Library} from "../types";
import {store} from "../app/store";
import {exactLibraryParams, LibraryApi} from "../features/library/LibraryApi";

// Public Objects ------------------------------------------------------------

export const validateLibraryNameUnique = async (library: Library): Promise<boolean> => {
    if (library && library.name) {
        const params: exactLibraryParams = {
            name: library.name,
        }
        const initiate = store.dispatch(LibraryApi.endpoints.exactLibrary.initiate(params));
        const selector = LibraryApi.endpoints.exactLibrary.select(params);
        const result = selector(store.getState());
        const {data} = result;
        initiate.unsubscribe();
        if (data) {
            return (data.id === library.id);
        } else {
            return true;
        }
    } else {
        return true;
    }
}
