"use client";

import { createContext, useContext } from "react";

/**
 * ExportModeContext — when `true`, compositions should simplify their DOM
 * (e.g. reduce particle counts) to speed up html-to-image serialization
 * during client-side video export.
 */
export const ExportModeContext = createContext<boolean>(false);
export const useExportMode = () => useContext(ExportModeContext);
