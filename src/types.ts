// types ---------------------------------------------------------------------

// Typescript type definitions for client application components.

// External Modules ----------------------------------------------------------

import React from "react";

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


