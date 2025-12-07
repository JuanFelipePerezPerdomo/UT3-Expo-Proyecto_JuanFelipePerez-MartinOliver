import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { Spacing, Typography } from "@/src/theme";
import type { Book } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const synopsisPreview =
    book.synopsis.length > 100 
      ? `${book.synopsis.substring(0, 100)}...` 
      : book.synopsis;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {book.imageUrl && (
          <Image
            source={{ uri: book.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
              >
                {book.title}
              </Text>
              <Text
                style={[styles.author, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {book.author}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={book.isFavorite ? "star" : "star-outline"}
                size={20}
                color={book.isFavorite ? colors.favorite : colors.icon}
              />
            </TouchableOpacity>
          </View>

          {synopsisPreview.length > 0 && (
            <Text
              style={[styles.synopsis, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {synopsisPreview}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Ionicons 
                name="book-outline" 
                size={14} 
                color={colors.textTertiary} 
              />
              <Text style={[styles.pages, { color: colors.textTertiary }]}>
                {book.numPage} págs.
              </Text>
            </View>
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {formatDate(book.updatedAt)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.h3,
  },
  author: {
    ...Typography.bodySmall,
    fontStyle: "italic",
  },
  synopsis: {
    ...Typography.bodySmall,
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  pages: {
    ...Typography.caption,
  },
  date: {
    ...Typography.caption,
  },
});