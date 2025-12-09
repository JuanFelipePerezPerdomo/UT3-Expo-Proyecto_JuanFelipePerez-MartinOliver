import { env } from "@/src/config";

/**
 * Genera una URL de portada de Open Library por Cover ID
 *
 * @param coverId - ID de la portada de Open Library
 * @param size - Tamaño: S (pequeño), M (mediano), L (grande)
 * @returns URL de la portada
 */
export function getCoverUrl(coverId: number, size: "S" | "M" | "L" = "M"): string {
  return `${env.OPEN_LIBRARY_COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

/**
 * Genera una URL de portada de Open Library por ISBN
 *
 * @param isbn - ISBN del libro (10 o 13 dígitos)
 * @param size - Tamaño: S (pequeño), M (mediano), L (grande)
 * @returns URL de la portada
 */
export function getCoverUrlByIsbn(isbn: string, size: "S" | "M" | "L" = "M"): string {
  return `${env.OPEN_LIBRARY_COVERS_URL}/b/isbn/${isbn}-${size}.jpg`;
}

/**
 * Genera una URL de portada de Open Library por OLID (Open Library ID)
 *
 * @param olid - Open Library ID del libro (ej: OL7440033M)
 * @param size - Tamaño: S (pequeño), M (mediano), L (grande)
 * @returns URL de la portada
 */
export function getCoverUrlByOlid(olid: string, size: "S" | "M" | "L" = "M"): string {
  return `${env.OPEN_LIBRARY_COVERS_URL}/b/olid/${olid}-${size}.jpg`;
}

/**
 * Genera una URL de foto de autor de Open Library
 *
 * @param authorId - ID del autor o OLID del autor
 * @param size - Tamaño: S (pequeño), M (mediano), L (grande)
 * @returns URL de la foto del autor
 */
export function getAuthorPhotoUrl(authorId: string | number, size: "S" | "M" | "L" = "M"): string {
  const key = typeof authorId === "number" ? "id" : "olid";
  return `${env.OPEN_LIBRARY_COVERS_URL}/a/${key}/${authorId}-${size}.jpg`;
}