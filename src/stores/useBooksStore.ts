import { booksDao } from "@/src/services/database";
import type { Book, BookFormData, SortBy } from "@/src/types";
import { create } from "zustand";

interface BooksState {
  books: Book[];
  isLoading: boolean;
  error: string | null;

  // Async Actions (SQLite)
  loadBooks: (sortBy?: SortBy) => Promise<void>;
  addBook: (formData: BookFormData, userName: string) => Promise<void>;
  updateBook: (id: string, formData: Partial<BookFormData>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearError: () => void;

  // Selectors (memoria local)
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

  loadBooks: async (sortBy = "date") => {
    set({ isLoading: true, error: null });
    try {
      const books = await booksDao.getAllBooks(sortBy);
      set({ books, isLoading: false });
    } catch (error) {
      console.error("[BooksStore] Error loading books:", error);
      set({
        error: "Error al cargar los libros",
        isLoading: false,
      });
    }
  },

  addBook: async (formData, userName) => {
    const now = Date.now();
    const newBook: Book = {
      id: generateId(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      synopsis: formData.synopsis?.trim() ?? "",
      numPage: formData.numPage,
      isFavorite: formData.isFavorite ?? false,
      imageUrl: formData.imageUrl,
      createdAt: now,
      updatedAt: now,
      createdBy: userName,
    };

    try {
      await booksDao.insertBook(newBook);
      // Añadir a memoria local también
      set((state) => ({
        books: [newBook, ...state.books],
      }));
    } catch (error) {
      console.error("[BooksStore] Error adding book:", error);
      set({ error: "Error al crear el libro" });
    }
  },

  updateBook: async (id, formData) => {
    const currentBook = get().books.find((b) => b.id === id);
    if (!currentBook) return;

    const updatedBook: Book = {
      ...currentBook,
      ...(formData.title !== undefined && {
        title: formData.title.trim(),
      }),
      ...(formData.author !== undefined && {
        author: formData.author.trim(),
      }),
      ...(formData.synopsis !== undefined && {
        synopsis: formData.synopsis.trim(),
      }),
      ...(formData.numPage !== undefined && {
        numPage: formData.numPage,
      }),
      ...(formData.isFavorite !== undefined && {
        isFavorite: formData.isFavorite,
      }),
      ...(formData.imageUrl !== undefined && {
        imageUrl: formData.imageUrl,
      }),
      updatedAt: Date.now(),
    };

    try {
      await booksDao.updateBook(updatedBook);
      set((state) => ({
        books: state.books.map((book) => (book.id === id ? updatedBook : book)),
      }));
    } catch (error) {
      console.error("[BooksStore] Error updating book:", error);
      set({ error: "Error al actualizar el libro" });
    }
  },

  deleteBook: async (id) => {
    try {
      await booksDao.deleteBook(id);
      set((state) => ({
        books: state.books.filter((book) => book.id !== id),
      }));
    } catch (error) {
      console.error("[BooksStore] Error deleting book:", error);
      set({ error: "Error al eliminar el libro" });
    }
  },

  toggleFavorite: async (id) => {
    try {
      const updatedBook = await booksDao.toggleFavorite(id);
      if (updatedBook) {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? updatedBook : book
          ),
        }));
      }
    } catch (error) {
      console.error("[BooksStore] Error toggling favorite:", error);
      set({ error: "Error al cambiar favorito" });
    }
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