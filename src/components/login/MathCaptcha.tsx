import { Input } from "../ui";
import { useTheme } from "@/src/hooks/useTheme";
import { Spacing, Typography } from "@/src/theme";
import { generateCaptcha, validateCaptcha } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MathCaptchaProps {
    onValidChange: (isValid: boolean) => void;
}

export function MathCaptcha({ onValidChange }: MathCaptchaProps){
    const {colors} = useTheme();

    const[captcha, setCaptcha] = useState(() => generateCaptcha());
    const[answer, setAnswer] = useState("");
    const[isValid, setIsValid] = useState(false);
    const [showError, setShowError] = useState(false);

    const refreshCaptcha = useCallback(() => {
        setCaptcha(generateCaptcha());
        setAnswer("");
        setIsValid(false);
        setShowError(false);
        onValidChange(false);
    }, [onValidChange]);

    useEffect(() => {
        if (answer.length === 0) {
            setIsValid(false);
            setShowError(false);
            onValidChange(false);
            return;
        }

        const valid = validateCaptcha(answer, captcha.answer);
        setIsValid(valid);
        setShowError(!valid && answer.length > 0);
        onValidChange(valid);
    }, [answer, captcha.answer, onValidChange]);

    return (
        <View style={styles.container}>
        <View style={styles.questionRow}>
            <View
            style={[
                styles.questionBox,
                { backgroundColor: colors.surfaceVariant },
            ]}
            >
            <Text style={[styles.question, { color: colors.text }]}>
                {captcha.question}
            </Text>
            </View>

            <TouchableOpacity
            onPress={refreshCaptcha}
            style={[styles.refreshButton, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
            >
            <Ionicons name="refresh" size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>

        <Input
            value={answer}
            onChangeText={setAnswer}
            placeholder="Tu respuesta"
            keyboardType="number-pad"
            error={showError ? "Respuesta incorrecta" : undefined}
        />

        {isValid && (
            <View style={styles.successRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>
                ¡Correcto!
            </Text>
            </View>
        )}
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    questionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    questionBox: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: 8,
        alignItems: "center",
    },
    question: {
        ...Typography.h3,
    },
    refreshButton: {
        padding: Spacing.md,
        borderRadius: 8,
    },
    successRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    successText: {
        ...Typography.label,
    },
});