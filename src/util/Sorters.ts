// Sorters -------------------------------------------------------------------

// Standard sort methods for each model type

// Internal Modules ----------------------------------------------------------

import {Library} from "../types";

// Public Objects ------------------------------------------------------------

export const LIBRARIES = (libraries: Library[]): Library[] => {
    return libraries.sort(function (a, b) {
        const aName = a.name ? a.name : "";
        const bName = b.name ? b.name : "";
        return aName.localeCompare(bName);
    })
}
