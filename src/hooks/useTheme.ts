import { useSettingsStore } from "@/src/stores";
import { Colors, type ColorScheme, type ThemeColors } from "@/src/theme";
import { useColorScheme } from "react-native";

/**
 * Hook para acceder a los colores del tema actual
 * Respeta la preferencia del usuario: light, dark o system
 */
export function useTheme() {
  const systemColorScheme = useColorScheme();
  const themePreference = useSettingsStore((s) => s.theme);

  // Determinar el esquema de color efectivo
  const colorScheme: ColorScheme =
    themePreference === "system"
      ? systemColorScheme ?? "light"
      : themePreference;

  const colors: ThemeColors = Colors[colorScheme];

  return {
    colors,
    colorScheme,
    isDark: colorScheme === "dark",
  };
}