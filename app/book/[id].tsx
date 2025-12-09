import { BookForm } from "@/src/components/books";
import { BottomSheet, Button, Card } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { useBooksStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import type { BookFormData } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const navigation = useNavigation();

  // Suscribirse a books directamente para reactividad
  const allBooks = useBooksStore((s) => s.books);
  const { updateBook, deleteBook, toggleFavorite } = useBooksStore();

  // Buscar libro (se recalcula cuando allBooks cambia)
  const book = allBooks.find((b) => b.id === id);

  const [isEditVisible, setIsEditVisible] = useState(false);

  // Configurar header con título y botón de favorito
  useLayoutEffect(() => {
    navigation.setOptions({
      title: book?.title ?? "Libro",
      headerRight: book
        ? () => (
            <TouchableOpacity
              onPress={() => toggleFavorite(book.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={book.isFavorite ? "star" : "star-outline"}
                size={24}
                color={book.isFavorite ? colors.favorite : colors.icon}
              />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, book, colors, toggleFavorite]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = useCallback(
    async (formData: BookFormData) => {
      if (!book) return;
      try {
        await updateBook(book.id, formData);
        setIsEditVisible(false);
      } catch (error) {
        console.error("Error al actualizar libro:", error);
        Alert.alert("Error", "No se pudo actualizar el libro");
      }
    },
    [book, updateBook]
  );

  const handleDelete = useCallback(() => {
    if (!book) return;

    Alert.alert(
      "Eliminar libro",
      "¿Estás seguro de que quieres eliminar este libro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook(book.id);
              router.back();
            } catch (error) {
              console.error("Error al eliminar libro:", error);
              Alert.alert("Error", "No se pudo eliminar el libro");
            }
          },
        },
      ]
    );
  }, [book, deleteBook]);

  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🔍</Text>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Libro no encontrado
          </Text>
          <Button title="Volver" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {book.imageUrl && (
          <Image
            source={{ uri: book.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Card style={styles.card}>
          <Text style={[styles.title, { color: colors.text }]}>
            {book.title}
          </Text>

          <View style={styles.authorRow}>
            <Ionicons name="person-outline" size={20} color={colors.icon} />
            <Text style={[styles.author, { color: colors.textSecondary }]}>
              {book.author}
            </Text>
          </View>

          {book.numPage && (
            <View style={styles.pagesRow}>
              <Ionicons name="book-outline" size={20} color={colors.icon} />
              <Text style={[styles.pages, { color: colors.textSecondary }]}>
                {book.numPage} {book.numPage === 1 ? "página" : "páginas"}
              </Text>
            </View>
          )}

          {book.synopsis && book.synopsis.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.synopsisLabel, { color: colors.textTertiary }]}>
                Sinopsis
              </Text>
              <Text style={[styles.synopsis, { color: colors.textSecondary }]}>
                {book.synopsis}
              </Text>
            </>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <Ionicons name="person-circle-outline" size={16} color={colors.icon} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                Agregado por: {book.createdBy}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={colors.icon} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                Creado: {formatDate(book.createdAt)}
              </Text>
            </View>

            {book.updatedAt !== book.createdAt && (
              <View style={styles.metaRow}>
                <Ionicons name="create-outline" size={16} color={colors.icon} />
                <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                  Editado: {formatDate(book.updatedAt)}
                </Text>
              </View>
            )}
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Editar"
            onPress={() => setIsEditVisible(true)}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Eliminar"
            onPress={handleDelete}
            variant="outline"
            style={{ ...styles.actionButton, borderColor: colors.error }}
            textStyle={{ color: colors.error }}
          />
        </View>
      </ScrollView>

      <BottomSheet
        visible={isEditVisible}
        onClose={() => setIsEditVisible(false)}
      >
        <Text style={[styles.sheetTitle, { color: colors.text }]}>
          Editar libro
        </Text>
        <BookForm
                  book={book}
                  onSubmit={handleUpdate}
                  onCancel={() => setIsEditVisible(false)} isLoading={false}        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  card: {
    gap: Spacing.md,
  },
  title: {
    ...Typography.h2,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  author: {
    ...Typography.h3,
    fontStyle: "italic",
  },
  pagesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  pages: {
    ...Typography.body,
  },
  synopsisLabel: {
    ...Typography.label,
    textTransform: "uppercase",
    fontSize: 12,
  },
  synopsis: {
    ...Typography.body,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  meta: {
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  metaText: {
    ...Typography.caption,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.lg,
  },
  notFoundEmoji: {
    fontSize: 64,
  },
  notFoundText: {
    ...Typography.h3,
  },
  sheetTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
});