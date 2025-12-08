import * as SQlite from "expo-sqlite";

import { DATABASE_NAME, INIT_STATEMENTS } from "./schema";

/**
 * Instancia singleton de la base de datos
 */
let db: SQlite.SQLiteDatabase | null = null;

/**
 * Obtiene la instancia de la base de datos.
 * Lanza error si no está inicializada.
 */
export function getDatabase(): SQlite.SQLiteDatabase {
    if(!db)  {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return db;
}

/**
 * Inicializa la base de datos y ejecuta el schema.
 * Debe llamarse al iniciar la app.
 */
export async function initDatabase(): Promise<void> {
  if (db) {
    console.log("[DB] Database already initialized");
    return;
  }

  try {
    console.log("[DB] Opening database...");
    db = await SQlite.openDatabaseAsync(DATABASE_NAME);

    console.log("[DB] Executing schema...");
    await db.execAsync(INIT_STATEMENTS.join("\n"));

    console.log("[DB] Database initialized successfully");
  } catch (error) {
    console.error("[DB] Failed to initialize database:", error);
    throw error;
  }
}

/**
 * Cierra la conexión a la base de datos.
 * Útil para tests o cleanup.
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
    console.log("[DB] Database closed");
  }
}