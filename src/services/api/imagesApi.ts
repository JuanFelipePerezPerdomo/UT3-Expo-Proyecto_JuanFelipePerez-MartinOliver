import { env } from "@/src/config";

/**
 * Genera una URL de imagen aleatoria de Lorem Picsum
 *
 * @param width - Ancho de la imagen (default: 400)
 * @param height - Alto de la imagen (default: 200)
 * @returns URL de imagen aleatoria
 */
export function getRandomImageUrl(width = 400, height = 200): string {
  // Añadir timestamp para evitar caché y obtener imagen diferente cada vez
  const timestamp = Date.now();
  return `${env.IMAGES_API_URL}/${width}/${height}?random=${timestamp}`;
}

/**
 * Genera una URL de imagen aleatoria con un seed específico
 * Útil para obtener la misma imagen dado el mismo seed
 *
 * @param seed - Identificador único para la imagen
 * @param width - Ancho de la imagen
 * @param height - Alto de la imagen
 * @returns URL de imagen con seed
 */
export function getSeededImageUrl(
  seed: string,
  width = 400,
  height = 200
): string {
  return `${env.IMAGES_API_URL}/seed/${seed}/${width}/${height}`;
}