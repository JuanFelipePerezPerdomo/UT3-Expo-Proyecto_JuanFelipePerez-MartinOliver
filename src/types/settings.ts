/**
 * Opciones de ordenación de notas
 */
export type SortBy = "date" | "title" | "favorites";

/**
 * Opciones de tema
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Configuración de la aplicación
 */
export interface Settings {
    theme: ThemeMode;
    sortBy: SortBy;
    welcomeShown: boolean;
    shakeEnabled: boolean;
}

/**
 * Valores por defecto
 */
export const DEFAULT_SETTINGS: Settings = {
    theme: "system",
    sortBy: "date",
    welcomeShown: false,
    shakeEnabled: true,
};