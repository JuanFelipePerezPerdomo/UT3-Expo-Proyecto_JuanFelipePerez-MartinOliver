import { BookForm, SwipeableBookCard } from "@/src/components/books";
import { BottomSheet, EmptyState, FAB } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { useBooksStore, useSettingsStore, useUserStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import type { Book, BookFormData } from "@/src/types";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
    const { colors } = useTheme();

    const userName = useUserStore((s) => s.name);
    const sortBy = useSettingsStore((s) => s.sortBy);

    // Suscribirse a books directamente para que re-renderice
    const allBooks = useBooksStore((s) => s.books);
    const { addBook, deleteBook, toggleFavorite } = useBooksStore();

    // esto Calcula los libros ordenados (se recalcula cuando allBooks cambia)
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
    }); //Estos filtros hay que moverlos de Settings a la pantalla principal en algun momento

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const openForm = useCallback(() => {
        setFormKey((k) => k + 1); // Fuerza remount del formulario
        setIsFormVisible(true);
    }, []);

    const handleAddBook = useCallback(
        async (formData: BookFormData) => {
            setIsSubmitting(true);
            try {
                addBook(formData, userName);
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
                        <Text style={[styles.noteCount, { color: colors.textTertiary }]}>
                            {books.length} {books.length === 1 ? "libro" : "libros"}
                        </Text>
                    </View>
                )}

                {books.length === 0 ? (
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
    noteCount: {
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
});