import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.icon,
            tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            },
            headerStyle: {
            backgroundColor: colors.surface,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
        }}
        >
        <Tabs.Screen
            name="index"
            options={{
            title: "Notas",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="documents-outline" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="favorites"
            options={{
            title: "Favoritos",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="star-outline" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="settings"
            options={{
            title: "Ajustes",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
            ),
            }}
        />
    </Tabs>
  );
}