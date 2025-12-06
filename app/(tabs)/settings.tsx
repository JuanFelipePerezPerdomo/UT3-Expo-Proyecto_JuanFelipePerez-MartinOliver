import { useTheme } from "@/src/hooks/useTheme";
import { Spacing, Typography } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";


export default function SettingsScreen(){
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={styles.emoji}>⚙️</Text>
            <Text style={[styles.title, { color: colors.text }]}>Ajustes</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Personaliza tu experiencia
            </Text>
            <Text style={[styles.hint, { color: colors.textTertiary }]}>
                (Implementar luego)
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.xl,
    },
    emoji: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        textAlign: "center",
    },
    hint: {
        ...Typography.caption,
        marginTop: Spacing.lg,
    },
});