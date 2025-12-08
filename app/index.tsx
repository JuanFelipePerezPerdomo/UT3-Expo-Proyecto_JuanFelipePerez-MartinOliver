import { useSettingsStore, useUserStore } from "@/src/stores";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

/**
 * Entry point de la app - Redirige según estado de autenticación
 * Espera a que los stores se hidraten antes de redirigir
 */
export default function Index() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const userHydrated = useUserStore((state) => state._hasHydrated);
  const settingsHydrated = useSettingsStore((state) => state._hasHydrated);

  // Esperar a que ambos stores se hidraten
  if (!userHydrated || !settingsHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  // Redirigir según estado de autenticación
  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});