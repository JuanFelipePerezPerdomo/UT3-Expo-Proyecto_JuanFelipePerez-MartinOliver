import { AnimatedBookCard, GRID_GAP, GRID_PADDING } from "@/src/components/books";
import { EmptyState } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { useBooksStore, useSettingsStore, useUserStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import type { Book } from "@/src/types";
import { router } from "expo-router";
import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const userName = useUserStore((s) => s.name);
  const sortBy = useSettingsStore((s) => s.sortBy);

  // Suscribirse a books directamente para reactividad
  const allBooks = useBooksStore((s) => s.books);
  const { toggleFavorite } = useBooksStore();

  // Filtrar favoritos y ordenar según sortBy
  const favorites = allBooks
    .filter((book) => book.isFavorite)
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "date":
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

  const handleBookPress = useCallback((book: Book) => {
    router.push(`/book/${book.id}`);
  }, []);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Book; index: number }) => (
      <AnimatedBookCard
        book={item}
        index={index}
        onPress={() => handleBookPress(item)}
        onFavoritePress={() => handleToggleFavorite(item.id)}
      />
    ),
    [handleBookPress, handleToggleFavorite]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Subheader con saludo y contador */}
      {userName && (
        <View style={[styles.subHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Hola, <Text style={{ color: colors.primary }}>{userName}</Text>
          </Text>
          <Text style={[styles.bookCount, { color: colors.textTertiary }]}>
            {favorites.length} {favorites.length === 1 ? "favorito" : "favoritos"}
          </Text>
        </View>
      )}

      {favorites.length === 0 ? (
        <EmptyState
          emoji="⭐"
          title="No hay favoritos"
          message="Marca libros como favoritos para verlos aquí"
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  greeting: {
    ...Typography.body,
  },
  bookCount: {
    ...Typography.caption,
  },
  grid: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: GRID_PADDING,
    paddingBottom: Spacing.lg,
  },
  row: {
    justifyContent: "flex-start",
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
});