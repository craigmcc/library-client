// AsyncValidators -----------------------------------------------------------

// Validation mechanisms that require asynchronous contact with a server,
// outside the context of a React component.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Library} from "../types";
import {store} from "../app/store";
import {LibraryApi} from "../features/library/LibraryApi";

// Public Objects ------------------------------------------------------------

export const validateLibraryNameUnique = async (library: Library): Promise<boolean> => {
    if (library && library.name) {
        console.log("validateLibraryNameUnique():", library);
        const initiate = store.dispatch(LibraryApi.endpoints.exactLibrary.initiate(library.name));
        console.log("  Initiate Result: ", initiate);
        const selector = LibraryApi.endpoints.exactLibrary.select(library.name);
        console.log("  selector:", selector);
        const result = selector(store.getState());
        console.log("  result:  ", result);
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
