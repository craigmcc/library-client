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

// Models --------------------------------------------------------------------

/**
 * Library - A collection of authors, series, stories, and volumes.
 */
export interface Library {
    id: number;                         // Primary key
    active: boolean;                    // Is this Library active?
    name: string;                       // Formal name of this Library
    notes: string;                      // Miscellaneous notes
    scope: string;                      // Scope prefix for this Library
}

// Prefixes ------------------------------------------------------------------

export const AUTHOR: string = "Author";
export const LIBRARY: string = "Library";
export const SERIES: string = "Series";
export const STORY: string = "Story";
export const VOLUME :string = "Volume";



