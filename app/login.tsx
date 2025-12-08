import { MathCaptcha } from "@/src/components/login";
import { Button, Card, Input } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { useUserStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import { NICKNAME_MAX_LENGTH, validateNickname } from "@/src/utils";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LoginScreen() {
  const { colors } = useTheme();
  const login = useUserStore((state) => state.login);

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState<string | undefined>();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleNicknameChange = useCallback((value: string) => {
    setNickname(value);
    if (value.length > 0) {
      const validation = validateNickname(value);
      setNicknameError(validation.error);
    } else {
      setNicknameError(undefined);
    }
  }, []);

  const handleCaptchaValidChange = useCallback((isValid: boolean) => {
    setIsCaptchaValid(isValid);
  }, []);

  const isFormValid =
    nickname.trim().length > 0 && !nicknameError && isCaptchaValid;

  const handleLogin = useCallback(() => {
    if (!isFormValid) return;

    login(nickname.trim());
    router.replace("/(tabs)/home");
  }, [isFormValid, nickname, login]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            📝 NotesApp
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Tu espacio para tomar notas
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Iniciar sesión
          </Text>

          <View style={styles.form}>
            <Input
              label="Nickname"
              value={nickname}
              onChangeText={handleNicknameChange}
              placeholder="Tu nombre de usuario"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={NICKNAME_MAX_LENGTH}
              showCharCount
              error={nicknameError}
            />

            <View style={styles.captchaSection}>
              <Text style={[styles.captchaLabel, { color: colors.text }]}>
                Verificación
              </Text>
              <Text
                style={[styles.captchaHint, { color: colors.textSecondary }]}
              >
                Resuelve la operación para continuar
              </Text>
              <MathCaptcha onValidChange={handleCaptchaValidChange} />
            </View>

            <Button
              title="Entrar"
              onPress={handleLogin}
              disabled={!isFormValid}
              fullWidth
              size="large"
            />
          </View>
        </Card>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Expo Notes App • PGL DAM
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  card: {
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.lg,
  },
  captchaSection: {
    gap: Spacing.xs,
  },
  captchaLabel: {
    ...Typography.label,
  },
  captchaHint: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  footer: {
    ...Typography.caption,
    textAlign: "center",
  },
});