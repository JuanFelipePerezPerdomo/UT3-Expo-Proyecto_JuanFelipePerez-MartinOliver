import type { Book } from "@/src/types";
import { useEffect } from "react";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from "react-native-reanimated";
import { BookCard } from "./BookCard";

interface AnimatedBookCardProps {
  book: Book;
  index: number;
  onPress: () => void;
  onFavoritePress?: () => void;
}

/**
 * BookCard con animaciones de entrada escalonadas
 * y animación al marcar/desmarcar favorito
 */
export function AnimatedBookCard({
  book,
  index,
  onPress,
  onFavoritePress,
}: AnimatedBookCardProps) {
  const scale = useSharedValue(1);
  const prevIsFavorite = useSharedValue(book.isFavorite);

  // Animación cuando cambia isFavorite
  useEffect(() => {
    if (book.isFavorite !== prevIsFavorite.value) {
      scale.value = withSequence(
        withSpring(1.05, { damping: 10, stiffness: 400 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );
      prevIsFavorite.value = book.isFavorite;
    }
  }, [book.isFavorite, scale, prevIsFavorite]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .duration(300)
        .springify()
        .damping(15)}
      style={animatedStyle}
    >
      <BookCard
        book={book}
        onPress={onPress}
        onFavoritePress={onFavoritePress}
      />
    </Animated.View>
  );
}