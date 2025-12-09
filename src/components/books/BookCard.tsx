import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { BorderRadius, Spacing } from "@/src/theme";
import type { Book } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Calcular ancho de cada tarjeta (3 columnas con gaps)
const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_PADDING = Spacing.md; // Reducido para más espacio
const GRID_GAP = Spacing.md; // Aumentado para mejor separación
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * 2) / 3;
const IMAGE_HEIGHT = CARD_WIDTH * 1.5; // Aspect ratio de portada de libro

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onFavoritePress?: () => void;
}

export function BookCard({ book, onPress, onFavoritePress }: BookCardProps) {
  const { colors } = useTheme();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, { width: CARD_WIDTH }]} padding="none">
        {/* Imagen de portada */}
        <View style={[styles.imageContainer, { backgroundColor: colors.surfaceVariant }]}>
          {book.imageUrl ? (
            <Image
              source={{ uri: book.imageUrl }}
              style={styles.image}
              contentFit="contain"
              transition={200}
              placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="book-outline" size={32} color={colors.textTertiary} />
            </View>
          )}
          
          {/* Botón de favorito superpuesto */}
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: colors.surface }]}
            onPress={(e) => {
              e.stopPropagation();
              onFavoritePress?.();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={book.isFavorite ? "star" : "star-outline"}
              size={16}
              color={book.isFavorite ? colors.favorite : colors.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {book.title}
          </Text>
          
          <Text
            style={[styles.author, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {book.author}
          </Text>

          {/* Footer: páginas y fecha */}
          <View style={styles.footer}>
            <View style={styles.pagesContainer}>
              <Ionicons name="book-outline" size={10} color={colors.textTertiary} />
              <Text style={[styles.pages, { color: colors.textTertiary }]}>
                {book.numPage || 0}
              </Text>
            </View>
            
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {formatDate(book.createdAt)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// Exportar constantes para uso en el grid
export { CARD_WIDTH, GRID_GAP, GRID_PADDING };

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: Spacing.sm,
    gap: 2,
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
  },
  author: {
    fontSize: 9,
    fontStyle: "italic",
    lineHeight: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  pagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  pages: {
    fontSize: 8,
  },
  date: {
    fontSize: 8,
  },
});