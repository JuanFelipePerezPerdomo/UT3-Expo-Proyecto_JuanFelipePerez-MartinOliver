import { useUserStore } from "@/src/stores";
import { Redirect } from "expo-router";

/**
 * Entry point de la app - Redirige según estado de autenticación
 * Esto evita conflictos entre app/index.tsx y app/(tabs)/home.tsx
 */
export default function Index() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  // Usar <Redirect> en lugar de router.replace para evitar
  // "Attempted to navigate before mounting the Root Layout"
  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}