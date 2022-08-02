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

export type ProcessLibrary = (library: Library) => Promise<Library>;

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

// Prefixes ------------------------------------------------------------------

export const AUTHOR: string = "Author";
export const LIBRARY: string = "Library";
export const SERIES: string = "Series";
export const STORY: string = "Story";
export const VOLUME :string = "Volume";



