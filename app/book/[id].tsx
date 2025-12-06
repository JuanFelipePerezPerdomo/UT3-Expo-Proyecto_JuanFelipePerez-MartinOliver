import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { Spacing, Typography } from "@/src/theme";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function BookDetailScreen(){
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Card style={styles.card}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
                ID del libro
            </Text>
            <Text style={[styles.id, { color: colors.text }]}>{id}</Text>

            <View style={styles.divider} />

            <Text style={[styles.placeholder, { color: colors.textTertiary }]}>
                El contenido del libro se mostrará aquí cuando se implemente el store
                de libros
            </Text>
        </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
    },
    card: {
        gap: Spacing.sm,
    },
    label: {
        ...Typography.caption,
    },
    id: {
        ...Typography.h3,
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: Spacing.sm,
    },
    placeholder: {
        ...Typography.body,
        fontStyle: "italic",
    },
});