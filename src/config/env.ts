/**
 * Configuración de variables de entorno
 *
 * En Expo, las variables con prefijo EXPO_PUBLIC_ son accesibles
 * en el cliente a través de process.env
 *
 * NOTA: Para que los cambios en .env surtan efecto,
 * hay que reiniciar el servidor de desarrollo (npx expo start -c)
 */

export const env = {
  // API URLs - Open Library
  OPEN_LIBRARY_SEARCH_URL:
    process.env.EXPO_PUBLIC_OPEN_LIBRARY_SEARCH_URL ||
    "https://openlibrary.org/search.json",
  OPEN_LIBRARY_COVERS_URL:
    process.env.EXPO_PUBLIC_OPEN_LIBRARY_COVERS_URL ||
    "https://covers.openlibrary.org",

  // Configuración
  API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
} as const;