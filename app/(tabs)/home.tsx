import { BookForm, SwipeableBookCard } from "@/src/components/books";
import { BottomSheet, Button, EmptyState, FAB } from "@/src/components/ui";
import { useShakeDetector, useTheme } from "@/src/hooks";
import { useBooksStore, useSettingsStore, useUserStore } from "@/src/stores";
import { BorderRadius, Spacing, Typography } from "@/src/theme";
import type { Book, BookFormData } from "@/src/types";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const { colors } = useTheme();

  const userName = useUserStore((s) => s.name);
  const sortBy = useSettingsStore((s) => s.sortBy);
  const welcomeShown = useSettingsStore((s) => s.welcomeShown);
  const setWelcomeShown = useSettingsStore((s) => s.setWelcomeShown);
  const shakeEnabled = useSettingsStore((s) => s.shakeEnabled);

  // Suscribirse a books directamente para que re-renderice
  const allBooks = useBooksStore((s) => s.books);
  const isLoading = useBooksStore((s) => s.isLoading);
  const { loadBooks, addBook, deleteBook, toggleFavorite } = useBooksStore();

  // Cargar libros desde SQLite al montar
  useEffect(() => {
    loadBooks(sortBy);
  }, [loadBooks, sortBy]);

  // Modal de bienvenida
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!welcomeShown && userName) {
      setShowWelcome(true);
    }
  }, [welcomeShown, userName]);

  const handleCloseWelcome = useCallback(() => {
    setShowWelcome(false);
    setWelcomeShown(true);
  }, [setWelcomeShown]);

  // Calcular libros ordenados (se recalcula cuando allBooks cambia)
  const books = [...allBooks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "favorites":
        if (a.isFavorite === b.isFavorite) {
          return b.updatedAt - a.updatedAt;
        }
        return a.isFavorite ? -1 : 1;
      case "date":
      default:
        return b.updatedAt - a.updatedAt;
    }
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const openForm = useCallback(() => {
    setFormKey((k) => k + 1); // Fuerza remount del formulario
    setIsFormVisible(true);
  }, []);

  // Shake-to-create: abre el formulario al agitar el dispositivo
  useShakeDetector({
    enabled: shakeEnabled,
    onShake: openForm,
  });

  const handleAddBook = useCallback(
    async (formData: BookFormData) => {
      setIsSubmitting(true);
      try {
        await addBook(formData, userName);
        setIsFormVisible(false);
      } catch (error) {
        console.error("Error al agregar libro:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [addBook, userName]
  );

  const handleBookPress = useCallback((book: Book) => {
    router.push(`/book/${book.id}`);
  }, []);

  const handleDeleteBook = useCallback(
    (id: string) => {
      deleteBook(id);
    },
    [deleteBook]
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  const renderItem = useCallback(
    ({ item }: { item: Book }) => (
      <SwipeableBookCard
        book={item}
        onPress={() => handleBookPress(item)}
        onFavoritePress={() => handleToggleFavorite(item.id)}
        onDelete={() => handleDeleteBook(item.id)}
      />
    ),
    [handleBookPress, handleToggleFavorite, handleDeleteBook]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {userName && (
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Hola, <Text style={{ color: colors.primary }}>{userName}</Text>
            </Text>
            <Text style={[styles.bookCount, { color: colors.textTertiary }]}>
              {books.length} {books.length === 1 ? "libro" : "libros"}
            </Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : books.length === 0 ? (
          <EmptyState
            emoji="📖"
            title="No hay libros"
            message="Pulsa el botón + para crear tu primer libro"
          />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        <FAB onPress={openForm} />

        {/* Modal de bienvenida */}
        <Modal
          visible={showWelcome}
          transparent
          animationType="fade"
          onRequestClose={handleCloseWelcome}
        >
          <View style={styles.welcomeOverlay}>
            <View
              style={[styles.welcomeCard, { backgroundColor: colors.surface }]}
            >
              <Text style={styles.welcomeEmoji}>👋</Text>
              <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                ¡Bienvenido, {userName}!
              </Text>
              <Text
                style={[styles.welcomeMessage, { color: colors.textSecondary }]}
              >
                Esta es tu biblioteca personal. Puedes crear, editar y organizar tus
                libros fácilmente.
              </Text>
              <Button title="¡Empezar!" onPress={handleCloseWelcome} />
            </View>
          </View>
        </Modal>

        <BottomSheet
          visible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
        >
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            Nuevo libro
          </Text>
          <BookForm
            key={formKey}
            onSubmit={handleAddBook}
            onCancel={() => setIsFormVisible(false)}
            isLoading={isSubmitting}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  greeting: {
    ...Typography.body,
  },
  bookCount: {
    ...Typography.caption,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sheetTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
  welcomeOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  welcomeCard: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.md,
  },
  welcomeEmoji: {
    fontSize: 48,
  },
  welcomeTitle: {
    ...Typography.h2,
    textAlign: "center",
  },
  welcomeMessage: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
});