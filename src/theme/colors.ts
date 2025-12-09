/**
 * Paleta de colores para tema claro y oscuro
 * 
 * Tema claro: Tonos ahuesados/crema (estilo papel de libro)
 * Tema oscuro: Tonos azulados (más suave que negro puro)
 */

export const Colors = {
  light: {
    // Fondos - Tonos ahuesados/crema
    background: "#FAF8F5",
    surface: "#FFFFFF",
    surfaceVariant: "#F5F0E8",

    // Textos
    text: "#2C2416",
    textSecondary: "#5C5346",
    textTertiary: "#8C8578",

    // Primarios - Marrón cálido
    primary: "#8B6914",
    primaryLight: "#C4A35A",
    primaryDark: "#6B4F0E",

    // Estados
    error: "#C53030",
    success: "#2E7D32",
    warning: "#ED8936",

    // Bordes y separadores
    border: "#E8E0D5",
    divider: "#F0EBE3",

    // Especiales
    favorite: "#D4A017",
    icon: "#6B5D4D",
    placeholder: "#A99F93",
  },

  dark: {
    // Fondos - Tonos azulados
    background: "#0D1B2A",
    surface: "#1B2838",
    surfaceVariant: "#243447",

    // Textos
    text: "#E8EEF4",
    textSecondary: "#A8B8C8",
    textTertiary: "#6B7D8F",

    // Primarios - Azul claro
    primary: "#5BA4E6",
    primaryLight: "#7DB8ED",
    primaryDark: "#3D8AD4",

    // Estados
    error: "#F56565",
    success: "#48BB78",
    warning: "#ECC94B",

    // Bordes y separadores
    border: "#2D3F52",
    divider: "#243447",

    // Especiales
    favorite: "#F6C23E",
    icon: "#8BA3BA",
    placeholder: "#4A5E73",
  },
} as const;

export type ColorScheme = "light" | "dark";
export type ThemeColors = {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  error: string;
  success: string;
  warning: string;
  border: string;
  divider: string;
  favorite: string;
  icon: string;
  placeholder: string;
};