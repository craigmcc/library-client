// types ---------------------------------------------------------------------

// Typescript type definitions for client application components.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Enumerations --------------------------------------------------------------

// Logging levels
export enum Level {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

// OAuth scopes
export enum Scope {
    ADMIN = "admin",
    ANY = "any",
    REGULAR = "regular",
    SUPERUSER = "superuser",
}

// Handlers ------------------------------------------------------------------

export type HandleAction = () => void; // Synonym for OnAction
export type HandleBoolean = (newBoolean: boolean) => void;
export type HandleDate = (date: string) => void;
export type HandleIndex = (newIndex: number) => void;
export type HandleMonth = (month: string) => void;
export type HandleResults = () => Promise<object>;
export type HandleValue = (newValue: string) => void;

export type HandleLibrary = (library: Library) => void;
export type HandleUser = (user: User) => void;

export type ProcessLibrary = (library: Library) => Promise<Library>;
export type ProcessUser = (user: User) => Promise<User>;

// Models --------------------------------------------------------------------

/**
 * Credentials required to log in to this application.
 */
export interface Credentials {
    password: string;                   // Login password
    username: string;                   // Login username
}

/**
 * A collection of authors, series, stories, and volumes.
 */
export interface Library {
    id: number | null;                  // Primary key
    active: boolean | null;             // Is this Library active?
    name: string | null;                // Formal name of this Library
    notes: string | null;               // Miscellaneous notes
    scope: string | null;               // Scope prefix for this Library
}

/**
 * Data related to the currently logged in user and associated tokens.
 */
export interface LoginData {
    accessToken: string | null;         // Current access token (if logged in)
    expires: Date | null;               // Access token expiration time (if logged in)
    loggedIn: boolean;                  // Is user currently logged in?
    refreshToken: string | null;        // Current refresh token (if logged in)
    scope: string | null;               // Allowed scope(s) (if logged in)
    username: string | null;            // Logged in username (if logged in)
}

/**
 * Authentication request parameters for an OAuth authentication server.
 */
export interface TokenRequest {
    grant_type: string;                 // Request type
    password: string;                   // Request password
    username: string;                   // Request username
}

/**
 * Authentication successful response from an OAuth authentication server.
 */
export interface TokenResponse {
    access_token: string;               // Assigned access token
    expires_in: number;                 // Number of seconds before the access token expires
    refresh_token?: string;             // Assigned refresh token (if any)
    scope: string;                      // Authorized scope(s) - space separated
    token_type: string;                 // Token type supported by this server
}

/**
 * An individual User allowed to log in to this application, with specified
 * scope permissions.
 */
export interface User {
    id: number | null;                  // Primary key
    active: boolean | null;             // Is this User active?
    googleBooksApiKey: string | null;   // Google Books API key for this User
    name: string | null;                // Name of this User
    password: string | null;            // Login password (only if being inserted/updated)
    scope: string | null;               // Permissions scope(s) for this User
    username: string | null;            // Login username (must be globally unique)
}

// Params --------------------------------------------------------------------

export interface paginationParams {
    limit?: number;                     // Maximum number of rows to return [no limit]
    offset?: number;                    // Zero-relative offset to first returned row [0]
}

// Prefixes ------------------------------------------------------------------

export const AUTHOR: string = "Author";
export const LIBRARY: string = "Library";
export const SERIES: string = "Series";
export const STORY: string = "Story";
export const LOGIN: string = "Login";
export const USER: string = "User";
export const VOLUME :string = "Volume";
