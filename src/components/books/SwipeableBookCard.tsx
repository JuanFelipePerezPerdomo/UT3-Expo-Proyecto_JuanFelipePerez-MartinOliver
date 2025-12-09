import { useTheme } from "@/src/hooks/useTheme";
import { Spacing } from "@/src/theme";
import type { Book } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Animated, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { BookCard } from "./BookCard";

interface SwipeableBookCardProps {
  book: Book;
  onPress: () => void;
  onFavoritePress?: () => void;
  onDelete: () => void;
}

export function SwipeableBookCard({
  book,
  onPress,
  onFavoritePress,
  onDelete,
}: SwipeableBookCardProps) {
  const { colors } = useTheme();

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.deleteAction, { backgroundColor: colors.error }]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === "right") {
          onDelete();
        }
      }}
      rightThreshold={100}
    >
      <BookCard
        book={book}
        onPress={onPress}
        onFavoritePress={onFavoritePress}
      />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: Spacing.xs,
    borderRadius: 12,
    marginLeft: Spacing.sm,
  },
});