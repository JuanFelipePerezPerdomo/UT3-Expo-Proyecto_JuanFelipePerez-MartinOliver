import { useTheme } from "@/src/hooks/useTheme";
import { Spacing, Typography } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
    emoji?: string;
    title: string;
    message?: string;
}

export function EmptyState({ emoji = "📖", title, message }: EmptyStateProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {message && (
            <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
            </Text>
        )}
        </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    textAlign: "center",
  },
});