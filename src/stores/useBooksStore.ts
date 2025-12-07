import type { Book, BookFormData, SortBy } from "@/src/types";
import { create } from "zustand";

interface BooksState {
    books: Book[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    addBook: (formData: BookFormData, userName: string) => void;
    updateBook: (id: string, formData: Partial<BookFormData>) => void;
    deleteBook: (id: string) => void;
    toggleFavorite: (id: string) => void;
    clearError: () => void;

    // Selectors
    getBookById: (id: string) => Book | undefined;
    getSortedBooks: (sortBy: SortBy) => Book[];
    getFavoriteBooks: () => Book[];
}

const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useBooksStore = create<BooksState>((set, get) => ({
    books: [],
    isLoading: false,
    error: null,

    addBook: (formData, userName) => {
        const now = Date.now();
        const newBook: Book = {
            id: generateId(),
            title: formData.title.trim(),
            author: formData.author.trim(),
            numPage: formData.numPage,
            synopsis: formData.synopsis?.trim() ?? "",
            isFavorite: formData.isFavorite ?? false,
            imageUrl: formData.imageUrl,
            createdAt: now,
            updatedAt: now,
            createdBy: userName,
        };

        set((state) => ({
            books: [newBook, ...state.books],
        }));
    },

    updateBook: (id, formData) => {
        set((state) => ({
            books: state.books.map((book) =>
                book.id === id
                    ? {
                        ...book,
                        ...(formData.title !== undefined && {
                            title: formData.title.trim(),
                        }),
                        ...(formData.author !== undefined && {
                            author: formData.author.trim(),
                        }),
                        ...(formData.numPage !== undefined && {
                            numPage: formData.numPage,
                        }),
                        ...(formData.synopsis !== undefined && {
                            synopsis: formData.synopsis.trim(),
                        }),
                        ...(formData.isFavorite !== undefined && {
                            isFavorite: formData.isFavorite,
                        }),
                        ...(formData.imageUrl !== undefined && {
                            imageUrl: formData.imageUrl,
                        }),
                        updatedAt: Date.now(),
                    }
                    : book
            ),
        }));
    },

    deleteBook: (id) => {
        set((state) => ({
            books: state.books.filter((book) => book.id !== id),
        }));
    },

    toggleFavorite: (id) => {
        set((state) => ({
            books: state.books.map((book) =>
                book.id === id
                    ? { ...book, isFavorite: !book.isFavorite, updatedAt: Date.now() }
                    : book
            ),
        }));
    },

    clearError: () => set({ error: null }),

    getBookById: (id) => {
        return get().books.find((book) => book.id === id);
    },

    getSortedBooks: (sortBy) => {
        const books = [...get().books];

        switch (sortBy) {
            case "title":
                return books.sort((a, b) => a.title.localeCompare(b.title));
            case "favorites":
                return books.sort((a, b) => {
                    if (a.isFavorite === b.isFavorite) {
                        return b.updatedAt - a.updatedAt;
                    }
                    return a.isFavorite ? -1 : 1;
                });
            case "date":
            default:
                return books.sort((a, b) => b.updatedAt - a.updatedAt);
        }
    },

    getFavoriteBooks: () => {
        return get()
            .books.filter((book) => book.isFavorite)
            .sort((a, b) => b.updatedAt - a.updatedAt);
    },
}));