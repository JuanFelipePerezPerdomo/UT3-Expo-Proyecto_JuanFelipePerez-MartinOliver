import { useTheme } from "@/src/hooks/useTheme";
import { Spacing } from "@/src/theme";
import type { Book } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle
} from "react-native-reanimated";
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
        progress: SharedValue<number>,
        dragX: SharedValue<number>
    ) => {
        const animatedStyle = useAnimatedStyle(() => {
            const scale = interpolate(
                dragX.value,
                [-100, 0],
                [1, 0.5],
                'clamp'
            );

            return {
                transform: [{ scale }],
            };
        });

        return (
            <View style={[styles.deleteAction, { backgroundColor: colors.error }]}>
                <Animated.View style={animatedStyle}>
                    <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
                </Animated.View>
            </View>
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={(direction) => {
                if (direction === "right") {
                    onDelete();
                }
            }}
            overshootRight={false}
        >
            <Animated.View>
                <BookCard
                    book={book}
                    onPress={onPress}
                    onFavoritePress={onFavoritePress}
                />
            </Animated.View>
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