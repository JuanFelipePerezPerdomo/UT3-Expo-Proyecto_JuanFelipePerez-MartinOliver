import type { Book, BookEntity, SortBy } from "@/src/types";
import { getDatabase } from "./db";
import { bookEntityToBook, bookToEntity } from "./mappers";

/**
 * Data Access Object para operaciones con libros en SQLite
 */
export const booksDao = {
  /**
   * Obtiene todos los libros ordenados según criterio
   */
  async getAllBooks(sortBy: SortBy = "date"): Promise<Book[]> {
    const db = getDatabase();
    let orderClause: string;

    switch (sortBy) {
      case "title":
        orderClause = "ORDER BY title COLLATE NOCASE ASC";
        break;
      case "favorites":
        orderClause = "ORDER BY is_favorite DESC, updated_at DESC";
        break;
      case "date":
      default:
        orderClause = "ORDER BY updated_at DESC";
    }

    const entities = await db.getAllAsync<BookEntity>(
      `SELECT * FROM books ${orderClause}`
    );
    return entities.map(bookEntityToBook);
  },

  /**
   * Obtiene un libro por su ID
   */
  async getBookById(id: string): Promise<Book | null> {
    const db = getDatabase();
    const entity = await db.getFirstAsync<BookEntity>(
      "SELECT * FROM books WHERE id = ?",
      [id]
    );
    return entity ? bookEntityToBook(entity) : null;
  },

  /**
   * Inserta un nuevo libro
   */
  async insertBook(book: Book): Promise<void> {
    const db = getDatabase();
    const entity = bookToEntity(book);

    await db.runAsync(
      `INSERT INTO books (id, title, author, synopsis, numPage, is_favorite, image_url, created_at, updated_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entity.id,
        entity.title,
        entity.author,
        entity.synopsis,
        entity.numPage,
        entity.is_favorite,
        entity.image_url,
        entity.created_at,
        entity.updated_at,
        entity.created_by,
      ]
    );
  },

  /**
   * Actualiza un libro existente
   */
  async updateBook(book: Book): Promise<void> {
    const db = getDatabase();
    const entity = bookToEntity(book);

    await db.runAsync(
      `UPDATE books 
       SET title = ?, author = ?, synopsis = ?, numPage = ?, is_favorite = ?, image_url = ?, updated_at = ?
       WHERE id = ?`,
      [
        entity.title,
        entity.author,
        entity.synopsis,
        entity.numPage,
        entity.is_favorite,
        entity.image_url,
        entity.updated_at,
        entity.id,
      ]
    );
  },

  /**
   * Elimina un libro por su ID
   */
  async deleteBook(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync("DELETE FROM books WHERE id = ?", [id]);
  },

  /**
   * Alterna el estado de favorito de un libro
   */
  async toggleFavorite(id: string): Promise<Book | null> {
    const db = getDatabase();
    const now = Date.now();

    // Actualizar en una sola operación
    await db.runAsync(
      `UPDATE books 
       SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END,
           updated_at = ?
       WHERE id = ?`,
      [now, id]
    );

    // Retornar el libro actualizado
    return this.getBookById(id);
  },

  /**
   * Obtiene solo los libros favoritos
   */
  async getFavoriteBooks(): Promise<Book[]> {
    const db = getDatabase();
    const entities = await db.getAllAsync<BookEntity>(
      "SELECT * FROM books WHERE is_favorite = 1 ORDER BY updated_at DESC"
    );
    return entities.map(bookEntityToBook);
  },

  /**
   * Cuenta el total de libros
   */
  async getBooksCount(): Promise<number> {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM books"
    );
    return result?.count ?? 0;
  },
};