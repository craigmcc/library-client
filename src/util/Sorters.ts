// Sorters -------------------------------------------------------------------

// Standard sort methods for each model type.  In each case, the caller can
// request immutability, meaning the origin array will NOT be affected.

// Internal Modules ----------------------------------------------------------

import {Library, User} from "../types";

// Public Objects ------------------------------------------------------------

export const LIBRARIES = (libraries: Library[], immutable = false): Library[] => {
    const results: Library[] = immutable
            ? [ ...libraries ]
            : libraries;
    return results.sort(function (a, b) {
        const aName = a.name ? a.name : "";
        const bName = b.name ? b.name : "";
        return aName.localeCompare(bName);
    });
}

export const USERS = (users: User[], immutable = false): User[] => {
    const results: User[] = immutable
        ? [ ...users ]
        : users;
    return results.sort(function (a, b) {
        const aUsername = a.username ? a.username : "";
        const bUsername = b.username ? b.username : "";
        return aUsername.localeCompare(bUsername);
    });
}

