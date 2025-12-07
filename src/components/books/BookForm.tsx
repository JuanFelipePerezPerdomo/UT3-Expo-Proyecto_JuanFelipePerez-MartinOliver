import { Button, Input } from "@/src/components/ui";
import { useTheme } from "@/src/hooks/useTheme";
import { Spacing, Typography } from "@/src/theme";
import type { Book, BookFormData } from "@/src/types";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

const TITLE_MAX_LENGTH = 80;
const AUTHOR_MAX_LENGTH = 60;

interface BookFormProps {
    book?: Book;
    onSubmit: (data: BookFormData) => void;
    onCancel: () => void;
    isLoading: boolean;
}

export function BookForm({
    book,
    onSubmit,
    onCancel,
    isLoading = false,
}: BookFormProps) {
    const { colors } = useTheme();
    const isEditing = !!book;

    const [title, setTitle] = useState(book?.title ?? "");
    const [author, setAuthor] = useState(book?.author ?? "");
    const [synopsis, setSynopsis] = useState(book?.synopsis ?? "");
    const [numPage, setNumPage] = useState(book?.numPage?.toString() ?? "");
    const [isFavorite, setIsFavorite] = useState(book?.isFavorite ?? false);
    const [titleError, setTitleError] = useState<string | undefined>();
    const [authorError, setAuthorError] = useState<string | undefined>();

    useEffect(() => {
        if (book) {
            setTitle(book.title);
            setAuthor(book.author);
            setSynopsis(book.synopsis);
            setNumPage(book.numPage.toString());
            setIsFavorite(book.isFavorite);
        }
    }, [book]);

    const validateTitle = (value: string) => {
        if (value.trim().length === 0) {
            return "El título es obligatorio";
        }
        if (value.trim().length > TITLE_MAX_LENGTH) {
            return `Máximo ${TITLE_MAX_LENGTH} caracteres`;
        }
        return undefined;
    };

    const validateAuthor = (value: string) => {
        if (value.trim().length === 0) {
            return "El autor es obligatorio";
        }
        if (value.trim().length > AUTHOR_MAX_LENGTH) {
            return `Máximo ${AUTHOR_MAX_LENGTH} caracteres`;
        }
        return undefined;
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        setTitleError(validateTitle(value));
    };

    const handleAuthorChange = (value: string) => {
        setAuthor(value);
        setAuthorError(validateAuthor(value));
    };

    const handleSubmit = () => {
        const titleErr = validateTitle(title);
        const authorErr = validateAuthor(author);
        
        if (titleErr) {
            setTitleError(titleErr);
        }
        if (authorErr) {
            setAuthorError(authorErr);
        }
        
        if (titleErr || authorErr) {
            return;
        }

        onSubmit({
            title: title.trim(),
            author: author.trim(),
            synopsis: synopsis.trim(),
            numPage: parseInt(numPage, 10) || 0,
            isFavorite,
        });
    };

    const isValid = 
        title.trim().length > 0 && 
        author.trim().length > 0 && 
        !titleError && 
        !authorError;

    return (
        <View style={styles.container}>
            <Input
                label="Título"
                value={title}
                onChangeText={handleTitleChange}
                placeholder="Título del libro"
                maxLength={TITLE_MAX_LENGTH}
                showCharCount
                error={titleError}
            />

            <Input
                label="Autor"
                value={author}
                onChangeText={handleAuthorChange}
                placeholder="Nombre del autor"
                maxLength={AUTHOR_MAX_LENGTH}
                showCharCount
                error={authorError}
            />

            <Input
                label="Número de páginas"
                value={numPage}
                onChangeText={setNumPage}
                placeholder="Ej: 350"
                keyboardType="numeric"
            />

            <Input
                label="Sinopsis"
                value={synopsis}
                onChangeText={setSynopsis}
                placeholder="Escribe una breve descripción del libro..."
                multiline
                numberOfLines={4}
            />

            <View style={styles.favoriteRow}>
                <Text style={[styles.favoriteLabel, { color: colors.text }]}>
                    Marcar como favorito
                </Text>
                <Switch
                    value={isFavorite}
                    onValueChange={setIsFavorite}
                    trackColor={{ false: colors.border, true: colors.primaryLight }}
                    thumbColor={isFavorite ? colors.primary : colors.surface}
                />
            </View>

            <View style={styles.actions}>
                <Button
                    title="Cancelar"
                    onPress={onCancel}
                    variant="outline"
                    style={styles.actionButton}
                />
                <Button
                    title={isEditing ? "Guardar" : "Crear"}
                    onPress={handleSubmit}
                    disabled={!isValid}
                    loading={isLoading}
                    style={styles.actionButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Spacing.sm,
    },
    favoriteRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    favoriteLabel: {
        ...Typography.label,
    },
    actions: {
        flexDirection: "row",
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
    actionButton: {
        flex: 1,
    },
});