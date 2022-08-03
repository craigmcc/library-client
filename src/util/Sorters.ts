// Sorters -------------------------------------------------------------------

// Standard sort methods for each model type.  In each case, the caller can
// request immutability, meaning the origin array will NOT be affected.

// Internal Modules ----------------------------------------------------------

import {Library} from "../types";

// Public Objects ------------------------------------------------------------

export const LIBRARIES = (libraries: Library[], immutable = false): Library[] => {
    const results: Library[] = immutable
            ? [ ...libraries ]
            : libraries;
    return results.sort(function (a, b) {
        const aName = a.name ? a.name : "";
        const bName = b.name ? b.name : "";
        return aName.localeCompare(bName);
    })
}
