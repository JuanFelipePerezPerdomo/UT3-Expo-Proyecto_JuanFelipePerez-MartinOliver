import { env } from "@/src/config";
import { apiClient, getApiErrorMessage } from "./client";
import { getCoverUrl } from "./imageApi";

/**
 * Respuesta de la API de búsqueda de Open Library
 */
interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryWork[];
}

/**
 * Documento de trabajo (Work) de Open Library
 */
interface OpenLibraryWork {
  key: string; // e.g., "/works/OL27448W"
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  cover_i?: number; // Cover ID
  edition_count?: number;
  subject?: string[];
  first_sentence?: string[];
}

/**
 * Libro normalizado para nuestra app
 */
export interface OpenLibraryBook {
  title: string;
  author: string;
  numPage: number;
  synopsis: string;
  imageUrl: string;
}

/**
 * Temas populares para búsquedas aleatorias
 */
const RANDOM_SUBJECTS = [
  "fiction",
  "fantasy",
  "science_fiction",
  "mystery",
  "romance",
  "thriller",
  "adventure",
  "classic_literature",
  "horror",
  "historical_fiction",
  "biography",
  "philosophy",
  "psychology",
  "science",
  "history",
  "poetry",
  "drama",
  "comedy",
  "children",
  "young_adult",
];

/**
 * Obtiene un tema aleatorio de la lista de temas populares
 */
function getRandomSubject(): string {
  const randomIndex = Math.floor(Math.random() * RANDOM_SUBJECTS.length);
  return RANDOM_SUBJECTS[randomIndex];
}

/**
 * Obtiene un libro aleatorio de Open Library
 *
 * Busca en un tema aleatorio y selecciona un libro al azar de los resultados.
 * Solo devuelve libros que tienen portada disponible.
 *
 * @returns Promesa con los datos del libro
 * @throws Error si falla la petición
 */
export async function getRandomBook(): Promise<OpenLibraryBook> {
  try {
    const subject = getRandomSubject();
    // Usar sort=random para obtener resultados aleatorios
    // Limitar a 100 resultados para tener más opciones con portada
    const response = await apiClient.get<OpenLibrarySearchResponse>(
      env.OPEN_LIBRARY_SEARCH_URL,
      {
        params: {
          subject: subject,
          sort: "random",
          limit: 100,
          fields:
            "key,title,author_name,first_publish_year,number_of_pages_median,cover_i,first_sentence,subject",
        },
      }
    );

    const { docs } = response.data;

    if (!docs || docs.length === 0) {
      throw new Error("No se encontraron libros");
    }

    // Filtrar libros que tengan título Y portada (cover_i)
    const booksWithCover = docs.filter(
      (book) => 
        book.title && 
        book.title.trim().length > 0 && 
        book.cover_i !== undefined
    );

    if (booksWithCover.length === 0) {
      // Si no hay libros con portada, buscar en otro tema
      throw new Error("No se encontraron libros con portada, intenta de nuevo");
    }

    // Seleccionar un libro aleatorio de los que tienen portada
    const randomIndex = Math.floor(Math.random() * booksWithCover.length);
    const selectedBook = booksWithCover[randomIndex];

    // Construir sinopsis a partir de la primera oración o temas
    let synopsis = "";
    if (selectedBook.first_sentence && selectedBook.first_sentence.length > 0) {
      synopsis = selectedBook.first_sentence[0];
    } else if (selectedBook.subject && selectedBook.subject.length > 0) {
      const topSubjects = selectedBook.subject.slice(0, 5).join(", ");
      synopsis = `Temas: ${topSubjects}`;
    }

    return {
      title: selectedBook.title,
      author: selectedBook.author_name?.[0] || "Autor desconocido",
      numPage: selectedBook.number_of_pages_median || 200,
      synopsis: synopsis || "Sin sinopsis disponible",
      imageUrl: getCoverUrl(selectedBook.cover_i!, "M"),
    };
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("[OpenLibraryAPI] Failed to fetch random book:", message);
    throw new Error(message);
  }
}

/**
 * Busca libros en Open Library por query
 *
 * @param query - Término de búsqueda
 * @param limit - Número máximo de resultados (default: 10)
 * @param onlyWithCover - Si solo devolver libros con portada (default: true)
 * @returns Promesa con array de libros
 * @throws Error si falla la petición
 */
export async function searchBooks(
  query: string,
  limit: number = 10,
  onlyWithCover: boolean = true
): Promise<OpenLibraryBook[]> {
  try {
    const response = await apiClient.get<OpenLibrarySearchResponse>(
      env.OPEN_LIBRARY_SEARCH_URL,
      {
        params: {
          q: query,
          limit: onlyWithCover ? limit * 3 : limit, // Pedir más si filtramos por portada
          fields:
            "key,title,author_name,first_publish_year,number_of_pages_median,cover_i,first_sentence,subject",
        },
      }
    );

    const { docs } = response.data;

    if (!docs || docs.length === 0) {
      return [];
    }

    let filteredDocs = docs.filter(
      (book) => book.title && book.title.trim().length > 0
    );

    if (onlyWithCover) {
      filteredDocs = filteredDocs.filter((book) => book.cover_i !== undefined);
    }

    return filteredDocs.slice(0, limit).map((book) => ({
      title: book.title,
      author: book.author_name?.[0] || "Autor desconocido",
      numPage: book.number_of_pages_median || 200,
      synopsis:
        book.first_sentence?.[0] ||
        (book.subject ? `Temas: ${book.subject.slice(0, 5).join(", ")}` : "") ||
        "Sin sinopsis disponible",
      imageUrl: book.cover_i 
        ? getCoverUrl(book.cover_i, "M") 
        : "",
    }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("[OpenLibraryAPI] Failed to search books:", message);
    throw new Error(message);
  }
}