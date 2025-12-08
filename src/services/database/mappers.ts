import type { Book, BookEntity } from "@/src/types";

/**
 * Convierte una entidad de SQLite a modelo Book
 */
export function bookEntityToBook(entity: BookEntity): Book {
  return {
    id: entity.id,
    title: entity.title,
    author: entity.author,
    synopsis: entity.synopsis ?? "",
    numPage: entity.numPage ?? undefined,
    isFavorite: entity.is_favorite === 1,
    imageUrl: entity.image_url ?? undefined,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    createdBy: entity.created_by,
  };
}

/**
 * Convierte un modelo Book a entidad para SQLite
 */
export function bookToEntity(book: Book): BookEntity {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    synopsis: book.synopsis || null,
    numPage: book.numPage ?? null,
    is_favorite: book.isFavorite ? 1 : 0,
    image_url: book.imageUrl ?? null,
    created_at: book.createdAt,
    updated_at: book.updatedAt,
    created_by: book.createdBy,
  };
}