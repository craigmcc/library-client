// LoginContext --------------------------------------------------------------

// React context containing information about the currently logged in User,
// if there is one, and associated state.  This information, and the
// User of the logged in User, are stored in Local Storage as well as
// being available in the API provided by this context.

// External Modules ----------------------------------------------------------

import React, {createContext, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {login, logout, me} from "./LoginUtil";
import {LOGIN_DATA_KEY, LOGIN_USER_KEY} from "../../constants";
import {Credentials, Level, Library, LoginData, Scope,User} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import logger from "../../util/ClientLogger";

// Context Properties --------------------------------------------------------

const LOG_PREFIX = "log:";

// Initial values for Login Data
export const EMPTY_DATA: LoginData = {
    accessToken: null,
    expires: null,
    loggedIn: false,
    refreshToken: null,
    scope: null,
    username: null
}

// Initial values for Login User
export const EMPTY_USER: User = {
    id: null,
    active: false,
    googleBooksApiKey: null,
    name: null,
    password: null,
    scope: null,
    username: null,
}

// Context state visible to LoginContext children
export interface LoginState {
    data: LoginData;                    // Externally visible information
    user: User;                         // Logged in User (if any)
    handleLogin: (credentials: Credentials) => void;
    handleLogout: () => void;
    validateAdmin: (library: Library) => boolean;
    validateRegular: (library: Library) => boolean;
    validateScope: (scope: string) => boolean;
}

// Initially created LoginContext state
const LoginContext = createContext<LoginState>({
    data: EMPTY_DATA,
    user: EMPTY_USER,
    handleLogin: (credentials) => {},
    handleLogout: () => {},
    validateAdmin: (library) => { return false },
    validateRegular: (library) => { return false },
    validateScope: (scope) => { return false }
});

// LoginContext Provider -----------------------------------------------------

// @ts-ignore
export const LoginContextProvider = ({ children }) => {

    const [alloweds, setAlloweds] = useState<string[]>([]);
    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY, EMPTY_DATA);
    const [user] = useLocalStorage<User>(LOGIN_USER_KEY, EMPTY_USER);

    /**
     * Authenticate the specified credentials and, if successful,
     * record the newly logged in User.
     *
     * @param credentials
     */
    const handleLogin = (credentials: Credentials): void => {

        // Authenticate using the specified credentials
        const newData = login(credentials);

        // Save allowed scope(s) and set logging level
        let logLevel = Level.INFO.toString();
        if (newData.scope) {
            const theAlloweds = newData.scope.split(" ");
            setAlloweds(theAlloweds);
            theAlloweds.forEach(allowed => {
                if (allowed.startsWith(LOG_PREFIX)) {
                    logLevel = allowed.substring(LOG_PREFIX.length);
                }
            });
        } else {
            setAlloweds([]);
        }
        logger.setLevel(logLevel);

        // Document this login
        logger.info({
            context: "LoginContext.handleLogin",
            username: newData.username,
            scope: newData.scope,
            logLevel: logLevel,
        });

        // Refresh current User information
        me();

    }

    /**
     * Update state to reflect that the currently logged in User
     * (if any) has been logged out.
     */
    const handleLogout = (): void => {
        logger.info({
            context: "LoginContext.handleLogout",
            username: data.username,
        });
        setAlloweds([]);
        logger.setLevel(Level.INFO.toString());
        logout();
    }

    /**
     * Return true if the currently logged in User has admin permissions
     * for the specified Library.
     *
     * @param library                   Library to check permission for
     */
    const validateAdmin = (library: Library): boolean => {
        return validateScope(`${library.scope}:${Scope.ADMIN.toString()}`);
    }

    /**
     * Return true if the currently logged in User has regular permissions
     * for the specified Library.
     *
     * @param library                   Library to check permission for
     */
    const validateRegular = (library: Library): boolean => {
        if (validateScope(`${library.scope}:${Scope.REGULAR.toString()}`)) {
            return true;
        } else {
            return validateScope(`${library.scope}:${Scope.ADMIN.toString()}`);
        }
    }

    /**
     * Return true if the currently logged in User has authorization
     * for the specified scope.
     */
    const validateScope = (scope: string): boolean => {

        // Users not logged in will never pass scope requirements
        if (!data.loggedIn) {
            return false;
        }

        // Special handling for superuser scope
        if (alloweds.includes(Scope.SUPERUSER)) {
            return true;
        }

        // Special handling for a logged in User with *any* scope
        if (scope === "") {
            return true;
        }

        // Otherwise, check required scope(s) versus allowed scope(s)
        const requireds = scope ? scope.split(" ") : [];
        if (requireds.length === 0) {
            return true;
        }
        let missing = false;
        requireds.forEach(required => {
            if (!alloweds.includes(required)) {
                missing = true;
            }
        });
        if (missing) {
            return false;
        }

        // The requested scope is allowed
        return true;

    }

    const loginContext: LoginState = {
        data: data,
        user: user,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
        validateAdmin: validateAdmin,
        validateRegular: validateRegular,
        validateScope: validateScope,
    }

    return (
        <LoginContext.Provider value={loginContext}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContext;
