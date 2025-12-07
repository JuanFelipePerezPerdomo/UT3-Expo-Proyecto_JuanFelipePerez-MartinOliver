import { SwipeableBookCard } from "@/src/components/books";
import { EmptyState } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { useBooksStore } from "@/src/stores";
import { Spacing } from "@/src/theme";
import type { Book } from "@/src/types";
import { router } from "expo-router";
import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function FavoritesScreen() {
  const { colors } = useTheme();

  // Suscribirse a books directamente para reactividad
  const allBooks = useBooksStore((s) => s.books);
  const { deleteBook, toggleFavorite } = useBooksStore();

  // Filtrar favoritos (se recalcula cuando allBooks cambia)
  const favorites = allBooks
    .filter((book) => book.isFavorite)
    .sort((a, b) => b.updatedAt - a.updatedAt);

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
        {favorites.length === 0 ? (
          <EmptyState
            emoji="⭐"
            title="No hay favoritos"
            message="Marca notas como favoritas para verlas aquí"
          />
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});