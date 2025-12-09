import { Button, Card, Input } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { getRandomBook } from "@/src/services";
import { useBooksStore, useSettingsStore, useUserStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import type { ThemeMode } from "@/src/types";
import { NICKNAME_MAX_LENGTH, validateNickname } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: "Claro", icon: "sunny-outline" },
  { value: "dark", label: "Oscuro", icon: "moon-outline" },
  { value: "system", label: "Sistema", icon: "phone-portrait-outline" },
];

export default function SettingsScreen() {
  const { colors } = useTheme();

  const { name, updateName, logout } = useUserStore();
  const {
    theme,
    welcomeShown,
    shakeEnabled,
    setTheme,
    setWelcomeShown,
    setShakeEnabled,
  } = useSettingsStore();
  const { addBook } = useBooksStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(name);
  const [nameError, setNameError] = useState<string | undefined>();
  const [isLoadingBook, setIsLoadingBook] = useState(false);

  const handleNameChange = (value: string) => {
    setNewName(value);
    if (value.length > 0) {
      const validation = validateNickname(value);
      setNameError(validation.error);
    } else {
      setNameError(undefined);
    }
  };

  const handleSaveName = () => {
    const validation = validateNickname(newName);
    if (validation.error) {
      setNameError(validation.error);
      return;
    }
    updateName(newName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setNewName(name);
    setNameError(undefined);
    setIsEditingName(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const handleCreateFromOpenLibrary = async () => {
    setIsLoadingBook(true);
    try {
      const bookData = await getRandomBook();

      await addBook(
        {
          title: bookData.title,
          author: bookData.author,
          numPage: bookData.numPage,
          synopsis: bookData.synopsis,
          imageUrl: bookData.imageUrl,
          isFavorite: false,
        },
        name
      );

      Alert.alert(
        "¡Éxito!",
        `Se ha añadido "${bookData.title}" de ${bookData.author} a tu biblioteca.`
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo obtener el libro. Inténtalo de nuevo."
      );
    } finally {
      setIsLoadingBook(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Perfil */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Perfil
        </Text>

        {isEditingName ? (
          <View style={styles.editNameContainer}>
            <Input
              value={newName}
              onChangeText={handleNameChange}
              placeholder="Tu nombre"
              maxLength={NICKNAME_MAX_LENGTH}
              showCharCount
              error={nameError}
            />
            <View style={styles.editActions}>
              <Button
                title="Cancelar"
                onPress={handleCancelEdit}
                variant="ghost"
                size="small"
              />
              <Button
                title="Guardar"
                onPress={handleSaveName}
                size="small"
                disabled={!!nameError || newName.trim().length === 0}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => setIsEditingName(true)}
          >
            <View style={styles.profileInfo}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Text style={styles.avatarText}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {name}
              </Text>
            </View>
            <Ionicons name="pencil" size={20} color={colors.icon} />
          </TouchableOpacity>
        )}
      </Card>

      {/* Tema */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tema</Text>

        {THEME_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.optionRow}
            onPress={() => setTheme(option.value)}
          >
            <View style={styles.optionInfo}>
              <Ionicons
                name={option.icon as any}
                size={20}
                color={colors.icon}
              />
              <Text style={[styles.optionLabel, { color: colors.text }]}>
                {option.label}
              </Text>
            </View>
            <View
              style={[
                styles.radio,
                {
                  borderColor:
                    theme === option.value ? colors.primary : colors.border,
                },
              ]}
            >
              {theme === option.value && (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Acciones */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Acciones
        </Text>

        <Button
          title={isLoadingBook ? "Buscando libro..." : "📚 Descubrir libro aleatorio"}
          onPress={handleCreateFromOpenLibrary}
          disabled={isLoadingBook}
          variant="outline"
          fullWidth
        />
        <Text style={[styles.actionHint, { color: colors.textTertiary }]}>
          Añade un libro aleatorio de Open Library a tu colección
        </Text>
      </Card>

      {/* Otros */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Otros</Text>

        {/* Toggle Shake-to-create */}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setShakeEnabled(!shakeEnabled)}
        >
          <View style={styles.optionInfo}>
            <Ionicons
              name="phone-portrait-outline"
              size={20}
              color={colors.icon}
            />
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Shake para crear libro
            </Text>
          </View>
          <View
            style={[
              styles.toggle,
              {
                backgroundColor: shakeEnabled ? colors.primary : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                shakeEnabled && styles.toggleKnobActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Reset bienvenida */}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setWelcomeShown(false)}
          disabled={!welcomeShown}
        >
          <View style={styles.optionInfo}>
            <Ionicons name="refresh-outline" size={20} color={colors.icon} />
            <Text
              style={[
                styles.optionLabel,
                {
                  color: welcomeShown ? colors.text : colors.textTertiary,
                },
              ]}
            >
              Mostrar bienvenida de nuevo
            </Text>
          </View>
          {!welcomeShown && (
            <Ionicons name="checkmark" size={20} color={colors.success} />
          )}
        </TouchableOpacity>
      </Card>

      {/* Cerrar sesión */}
      <Button
        title="Cerrar sesión"
        onPress={handleLogout}
        variant="outline"
        fullWidth
        style={{ borderColor: colors.error }}
        textStyle={{ color: colors.error }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 100,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  profileName: {
    ...Typography.body,
  },
  editNameContainer: {
    gap: Spacing.sm,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  optionLabel: {
    ...Typography.body,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  toggleKnobActive: {
    alignSelf: "flex-end",
  },
  actionHint: {
    ...Typography.caption,
    textAlign: "center",
    marginTop: -Spacing.xs,
  },
});