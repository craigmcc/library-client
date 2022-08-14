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
 * Library - A collection of authors, series, stories, and volumes.
 */
export interface Library {
    id: number | null;                  // Primary key
    active: boolean | null;             // Is this Library active?
    name: string | null;                // Formal name of this Library
    notes: string | null;               // Miscellaneous notes
    scope: string | null;               // Scope prefix for this Library
}

/**
 * User - An individual User allowed to log in to this application,
 * with specified scope permissions.
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
export const USER: string = "User";
export const VOLUME :string = "Volume";
