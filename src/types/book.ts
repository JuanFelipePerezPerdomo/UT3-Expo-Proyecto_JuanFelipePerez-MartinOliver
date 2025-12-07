/**
 * Representa una nota en la aplicación
 */
export interface Book {
    id: string;
    title: string;
    author: string;
    numPage: number;
    synopsis: string;
    isFavorite: boolean;
    imageUrl?: string;
    createdAt: number; // timestamp
    updatedAt: number; // timestamp
    createdBy: string; // nickname del usuario
}

/**
 * Datos del formulario para crear/editar nota
 */
export interface BookFormData {
    title: string;
    author: string;
    numPage: number;
    synopsis?: string;
    isFavorite?: boolean;
    imageUrl?: string;
}

/**
 * Representación de nota para SQLite
 */
export interface BookEntity {
    id: string;
    title: string;
    author: string;
    numPage: number;
    synopsis: string | null;
    is_favorite: number; // 0 o 1
    image_url: string | null;
    created_at: number;
    updated_at: number;
    created_by: string;
}