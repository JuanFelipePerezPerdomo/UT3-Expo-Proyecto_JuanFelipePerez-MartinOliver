# BookApp - Biblioteca Personal

Aplicación móvil para gestionar tu colección personal de libros con integración a Open Library API.

---

## 1. Datos del Proyecto

| Campo | Información |
|-------|-------------|
| **Nombre** | BookApp - Biblioteca Personal |
| **Autor** | Juan Felipe Perez Perdomo Martín Oliver Pellarres |
| **Fecha** | Diciembre 2025 |
| **Versión Expo SDK** | 54 |
| **Versión de la App** | 1.0.0 |

---

## 2. Tecnología Elegida y Justificación

### ¿Por qué Expo?

Se ha elegido **Expo** como framework de desarrollo por las siguientes razones:

- **Desarrollo rápido**: Expo permite crear aplicaciones React Native sin necesidad de configurar entornos nativos complejos (Xcode, Android Studio) desde cero.

- **Expo Router**: Sistema de navegación basado en archivos similar a Next.js, que simplifica la estructura de rutas y la navegación entre pantallas.

- **Acceso a APIs nativas**: Expo proporciona módulos preconstruidos para acceder a cámara, galería de imágenes, sensores del dispositivo (acelerómetro), y almacenamiento local sin configuración adicional.

- **Hot Reload**: Cambios en el código se reflejan instantáneamente en el dispositivo/emulador, acelerando el ciclo de desarrollo.

- **Expo Go**: Permite probar la aplicación en dispositivos físicos escaneando un código QR, sin necesidad de compilar APK/IPA durante el desarrollo.

### Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| React Native | Framework base para UI móvil |
| TypeScript | Tipado estático para mayor robustez |
| Expo Router | Navegación basada en archivos |
| Zustand | Gestión de estado global ligera |
| AsyncStorage | Persistencia de configuración y preferencias |
| Expo SQLite | Base de datos local para libros |
| React Native Reanimated | Animaciones fluidas |
| Expo Image Picker | Acceso a cámara y galería |
| Expo Sensors | Acelerómetro (shake detection) |
| Open Library API | Obtención de datos de libros externos |

---

## 3. Configuración del Entorno y Ejecución

### Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Dispositivo físico con Expo Go o emulador Android/iOS

### Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd UT3-EXPO-PROYECTO_JUANFEL

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

### Ejecución

**En dispositivo físico:**
1. Instalar la app "Expo Go" desde Play Store / App Store
2. Escanear el código QR que aparece en la terminal
3. La app se cargará automáticamente

**En emulador Android:**
```bash
npx expo start --android
```

**En simulador iOS (solo macOS):**
```bash
npx expo start --ios
```

### Variables de Entorno

La aplicación usa la API pública de Open Library, no requiere claves API adicionales.

---

## 4. Estructura del Proyecto

```
UT3-EXPO-PROYECTO_JUANFEL/
├── app/                          # Rutas (Expo Router)
│   ├── (tabs)/                   # Navegación con pestañas
│   │   ├── _layout.tsx           # Configuración del TabNavigator
│   │   ├── home.tsx              # Pantalla principal (grid de libros)
│   │   ├── favorites.tsx         # Pantalla de favoritos
│   │   └── settings.tsx          # Pantalla de ajustes
│   ├── book/
│   │   ├── _layout.tsx           # Layout para detalle de libro
│   │   └── [id].tsx              # Pantalla de detalle (ruta dinámica)
│   ├── index.tsx                 # Punto de entrada (redirección)
│   ├── login.tsx                 # Pantalla de login
│   └── _layout.tsx               # Layout raíz
│
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── books/                # Componentes específicos de libros
│   │   │   ├── AnimatedBookCard.tsx  # Tarjeta con animaciones
│   │   │   ├── BookCard.tsx          # Tarjeta de libro (grid)
│   │   │   ├── BookForm.tsx          # Formulario crear/editar
│   │   │   ├── ImageSelector.tsx     # Selector de imagen
│   │   │   └── SwipeableBookCard.tsx # Tarjeta con swipe
│   │   ├── login/
│   │   │   └── MathCaptcha.tsx   # Captcha matemático
│   │   └── ui/                   # Componentes UI genéricos
│   │       ├── BottomSheet.tsx   # Modal inferior
│   │       ├── Button.tsx        # Botón personalizado
│   │       ├── Card.tsx          # Tarjeta contenedora
│   │       ├── EmptyState.tsx    # Estado vacío
│   │       ├── FAB.tsx           # Botón flotante
│   │       ├── Input.tsx         # Campo de texto
│   │       └── SortMenu.tsx      # Menú de ordenación
│   │
│   ├── api/                      # Servicios externos
│   │   ├── client.ts             # Cliente HTTP base
│   │   ├── imageApi.ts           # URLs de portadas
│   │   └── openLibrary.ts        # Integración Open Library
│   │
│   ├── database/                 # Capa de persistencia
│   │   ├── db.ts                 # Inicialización SQLite
│   │   ├── booksDao.ts           # Operaciones CRUD libros
│   │   ├── schema.ts             # Esquema de tablas
│   │   └── mappers.ts            # Mapeo DB ↔ Modelos
│   │
│   ├── stores/                   # Estado global (Zustand)
│   │   ├── useBooksStore.ts      # Estado de libros
│   │   ├── useSettingsStore.ts   # Configuración app
│   │   └── useUserStore.ts       # Datos del usuario
│   │
│   ├── hooks/                    # Hooks personalizados
│   │   ├── useImagePicker.ts     # Selección de imágenes
│   │   ├── useShakeDetector.ts   # Detección de shake
│   │   └── useTheme.ts           # Acceso al tema
│   │
│   ├── sensors/                  # Sensores del dispositivo
│   │   └── shakeDetector.ts      # Lógica del acelerómetro
│   │
│   ├── theme/                    # Sistema de diseño
│   │   ├── colors.ts             # Paleta de colores
│   │   ├── spacing.ts            # Espaciados
│   │   └── typography.ts         # Tipografía
│   │
│   ├── types/                    # Definiciones TypeScript
│   │   ├── book.ts               # Tipo Book
│   │   ├── settings.ts           # Tipo Settings
│   │   └── user.ts               # Tipo User
│   │
│   ├── utils/                    # Utilidades
│   │   └── validation.ts         # Validaciones
│   │
│   └── config/                   # Configuración
│       └── env.ts                # Variables de entorno
│
├── assets/                       # Recursos estáticos
├── app.json                      # Configuración Expo
├── package.json                  # Dependencias
└── tsconfig.json                 # Configuración TypeScript
```

### Descripción de Carpetas Principales

| Carpeta | Función |
|---------|---------|
| `app/` | Define las rutas de navegación usando el sistema de archivos de Expo Router |
| `src/components/` | Componentes React reutilizables divididos por dominio |
| `src/api/` | Servicios para comunicación con APIs externas |
| `src/database/` | Capa de acceso a datos con SQLite |
| `src/stores/` | Gestión de estado global con Zustand |
| `src/hooks/` | Hooks personalizados para lógica reutilizable |
| `src/theme/` | Sistema de diseño (colores, espaciados, tipografía) |
| `src/types/` | Definiciones de tipos TypeScript |

---

## 5. Perfil de Despliegue

### Configuración Técnica

| Parámetro | Valor |
|-----------|-------|
| **Expo SDK** | 54 |
| **React Native** | 0.76.x |
| **Plataforma objetivo** | Android / iOS |
| **Versión mínima Android** | API 24 (Android 7.0) |
| **Versión mínima iOS** | 13.4 |

### Dispositivo de Pruebas

| Parámetro | Valor |
|-----------|-------|
| **Dispositivo** | [Nombre del dispositivo/emulador] |
| **Sistema Operativo** | Android 13 / iOS 17 |
| **Resolución** | 1080 x 2400 px |
| **Densidad** | 420 dpi (xxhdpi) |

### Dependencias Principales

```json
{
  "expo": "~54.0.0",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-router": "6.0.17",
  "expo-sqlite": "~16.0.10",
  "expo-image-picker": "~17.0.9",
  "expo-sensors": "~15.0.8",
  "zustand": "^5.0.9",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-reanimated": "~4.1.1",
  "expo-image": "~3.0.11"
}
```

---

## 6. Funcionamiento de la App

### Descripción General

**BookShelf** es una aplicación de biblioteca personal que permite a los usuarios gestionar su colección de libros. Las principales funcionalidades son:

### Funcionalidades

| Característica | Descripción |
|----------------|-------------|
| **📖 Gestión de libros** | Crear, editar y eliminar libros con título, autor, páginas, sinopsis e imagen de portada |
| **⭐ Favoritos** | Marcar libros como favoritos para acceso rápido |
| **📷 Portadas personalizadas** | Añadir imágenes desde la cámara o galería del dispositivo |
| **🔍 Ordenación** | Ordenar libros por fecha, título o favoritos |
| **📚 Open Library** | Descubrir libros aleatorios desde la API de Open Library |
| **📱 Shake to Create** | Agitar el dispositivo para abrir el formulario de nuevo libro |
| **🌙 Temas** | Soporte para modo claro (ahuesado) y oscuro (azulado) |
| **💾 Persistencia** | Datos almacenados localmente con SQLite y AsyncStorage |

### Flujo de Usuario

1. **Login**: El usuario ingresa su nombre (con captcha matemático de verificación)
2. **Home**: Visualiza su biblioteca en formato grid de 3 columnas
3. **Crear libro**: Pulsa el botón + (FAB) o agita el dispositivo
4. **Detalle**: Toca una tarjeta para ver información completa
5. **Editar/Eliminar**: Desde la pantalla de detalle
6. **Favoritos**: Acceso rápido a libros marcados como favoritos
7. **Ajustes**: Cambiar tema, nombre, o descubrir libros de Open Library

### Video del proyecto

https://drive.google.com/file/d/1Ruu7R0avkwy8fZXXTACcWtzk5Eb5mBu2/view?usp=sharing

---

## 7. Cumplimiento de Requisitos MVP

### Resumen de Cumplimiento

| # | Requisito | Estado | Detalles |
|---|-----------|--------|----------|
| 1 | Navegación (Expo Router) | Cumplido | Login → Tabs (Home/Favoritos/Ajustes) → Detalle `[id]` |
| 2 | UI y Multimedia | Cumplido | Componentes RN, expo-image, StyleSheet, animaciones Reanimated |
| 3 | Estado Global y Persistencia | Cumplido | Zustand + **AsyncStorage** + SQLite |
| 4 | Conexión a API Externa | Cumplido | Open Library API con loading/error states |
| 5 | Permisos y Dispositivo Real | Cumplido | Cámara + Galería, probado en Expo Go |
| 6 | Sensores (Opcional) | Cumplido | Acelerómetro shake-to-create con toggle |

### 1. Navegación (Expo Router)

| Requisito | Implementación | Ubicación |
|-----------|----------------|-----------|
| Pantalla inicial | Login con nombre de usuario y captcha matemático | `app/login.tsx` |
| Grupo de pestañas | TabNavigator con Inicio, Favoritos y Ajustes | `app/(tabs)/_layout.tsx` |
| Pantalla de detalle por ID | Ruta dinámica `[id].tsx` para cada libro | `app/book/[id].tsx` |
| Navegación fluida | Navegación entre todas las pantallas con `router.push()` y `router.back()` | Toda la app |

### 2. UI y Multimedia

| Requisito | Implementación | Ubicación |
|-----------|----------------|-----------|
| Componentes básicos | `View`, `Text`, `FlatList`, `ScrollView`, `TextInput`, `TouchableOpacity`, `Modal` | Toda la app |
| Imágenes | `expo-image` para portadas (locales y remotas de Open Library) | `BookCard.tsx`, `ImageSelector.tsx` |
| StyleSheet.create() | Estilos organizados en cada componente | Todos los archivos `.tsx` |
| Animaciones | Entrada escalonada de tarjetas (`FadeInDown`), animación de favorito (scale), transiciones de modal | `AnimatedBookCard.tsx`, `SortMenu.tsx` |

### 3. Estado Global y Persistencia

| Requisito | Implementación | Ubicación |
|-----------|----------------|-----------|
| Zustand | 3 stores: `useBooksStore`, `useSettingsStore`, `useUserStore` | `src/stores/` |
| CRUD de elementos | Crear, editar, borrar y marcar favorito en libros | `useBooksStore.ts` |
| Ajustes de app | Tema (claro/oscuro/sistema), orden de lista, shake habilitado | `useSettingsStore.ts` |
| **AsyncStorage** | Persistencia de ajustes y datos de usuario con middleware `persist` de Zustand | `useSettingsStore.ts`, `useUserStore.ts` |
| SQLite | Persistencia completa de libros con operaciones CRUD | `src/database/` |

**Estrategia de Persistencia Dual:**

La aplicación utiliza **dos sistemas de persistencia** según el tipo de datos:

1. **AsyncStorage** (vía `@react-native-async-storage/async-storage`):
   - Configuración de la app (tema, preferencias)
   - Datos del usuario (nombre)
   - Integrado con Zustand mediante middleware `persist`
   - Ideal para datos pequeños y de acceso frecuente

2. **SQLite** (vía `expo-sqlite`):
   - Colección completa de libros
   - Operaciones CRUD con consultas SQL
   - Ideal para datos estructurados y voluminosos

**Stores implementados:**

```typescript
// useUserStore - Persistido con AsyncStorage
- name: string (nombre del usuario)
- updateName(), logout()

// useSettingsStore - Persistido con AsyncStorage  
- theme: 'light' | 'dark' | 'system'
- sortBy: 'date' | 'title' | 'favorites'
- shakeEnabled: boolean
- welcomeShown: boolean

// useBooksStore - Persistido con SQLite
- books: Book[]
- loadBooks(), addBook(), updateBook(), deleteBook(), toggleFavorite()
```

**Ejemplo de configuración AsyncStorage con Zustand:**

```typescript
// useSettingsStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'system',
      sortBy: 'date',
      shakeEnabled: true,
      // ... acciones
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 4. Conexión a API Externa

| Requisito | Implementación | Ubicación |
|-----------|----------------|-----------|
| API HTTP externa | Open Library API (`openlibrary.org`) | `src/api/openLibrary.ts` |
| Uso concreto | "Descubrir libro aleatorio" - importa libro con portada desde la API | `SettingsScreen.tsx` |
| Estado de carga | Botón muestra "Buscando libro..." mientras carga | `SettingsScreen.tsx` |
| Manejo de errores | Alert de error si falla la petición | `SettingsScreen.tsx` |

**Endpoints utilizados:**
- `https://openlibrary.org/search.json` - Búsqueda de libros por tema
- `https://covers.openlibrary.org/b/id/{id}-M.jpg` - Portadas de libros

### 5. Permisos y Ejecución en Dispositivo Real

| Requisito | Implementación | Ubicación |
|-----------|----------------|-----------|
| Permiso de Cámara | `expo-image-picker` para capturar foto de portada | `useImagePicker.ts` |
| Permiso de Galería | `expo-image-picker` para seleccionar imagen existente | `useImagePicker.ts` |
| Dispositivo real | Probado en dispositivo físico Android via Expo Go | - |

**Justificación de permisos:**

| Permiso | Justificación |
|---------|---------------|
| `CAMERA` | Permite al usuario tomar una foto para usarla como portada del libro |
| `MEDIA_LIBRARY` | Permite seleccionar una imagen existente de la galería como portada |

Los permisos se solicitan solo cuando el usuario intenta añadir una imagen, siguiendo las buenas prácticas de permisos "just-in-time".

### 6. Sensores (Opcional - Implementado)

| Requisito | Implementación | Ubicación |
|-----------|----------------|-----------|
| Sensor utilizado | Acelerómetro via `expo-sensors` | `src/sensors/shakeDetector.ts` |
| Funcionalidad | "Shake-to-Create": agitar el dispositivo abre el formulario de nuevo libro | `home.tsx` |
| Toggle on/off | Switch en Ajustes para activar/desactivar | `settings.tsx` |

**Funcionamiento del sensor:**

El acelerómetro detecta cambios bruscos en la aceleración del dispositivo. Cuando se supera un umbral configurado (SHAKE_THRESHOLD), se dispara el evento de "shake".

```typescript
// shakeDetector.ts
const SHAKE_THRESHOLD = 1.5;  // Sensibilidad del shake
const SHAKE_TIMEOUT = 500;    // Cooldown entre shakes (ms)

// Se calcula la magnitud de la aceleración:
// magnitude = sqrt(x² + y² + z²)
// Si magnitude > SHAKE_THRESHOLD → disparar evento
```

**Activar/Desactivar:**
- En Ajustes → "Shake para crear libro" (toggle)
- Cuando está desactivado, el listener del acelerómetro se detiene completamente

---

## 8. Conclusión y Limitaciones

### Aprendizajes

Durante el desarrollo de esta aplicación se han adquirido conocimientos en:

- **Expo Router**: Navegación declarativa basada en el sistema de archivos, incluyendo rutas dinámicas (`[id].tsx`) y layouts anidados con tabs.

- **Gestión de estado con Zustand**: Implementación de múltiples stores con middleware `persist` para AsyncStorage, separando responsabilidades (usuario, ajustes, libros).

- **AsyncStorage con Zustand**: Uso de `@react-native-async-storage/async-storage` integrado con el middleware `persist` de Zustand para persistir configuración del usuario y preferencias de la app de forma automática.

- **Doble persistencia (AsyncStorage + SQLite)**: Estrategia de usar AsyncStorage para datos ligeros (configuración, preferencias) y SQLite para datos estructurados complejos (colección de libros), aprovechando las fortalezas de cada sistema.

- **Integración de APIs externas**: Consumo de la API de Open Library con manejo de estados de carga y errores.

- **Sensores del dispositivo**: Uso del acelerómetro para detectar gestos de "shake" mediante `expo-sensors`, con opción de activar/desactivar.

- **Permisos en tiempo de ejecución**: Solicitud de permisos de cámara y galería solo cuando son necesarios.

- **Theming dinámico**: Implementación de temas claro/oscuro con detección automática de preferencias del sistema.

- **Animaciones con Reanimated**: Animaciones fluidas de entrada escalonada y feedback visual en interacciones.

### Limitaciones Encontradas

| Limitación | Descripción |
|------------|-------------|
| **Rendimiento en listas grandes** | Con muchos libros (+100), el renderizado del grid puede volverse lento. Se mitigaría con virtualización más agresiva o paginación. |
| **Imágenes locales** | Las imágenes se guardan como URIs locales; si se elimina la imagen del dispositivo, se pierde la portada. Una mejora sería copiar las imágenes al almacenamiento de la app. |
| **Sin sincronización cloud** | Los datos solo existen en el dispositivo local. No hay backup ni sincronización entre dispositivos. |
| **Open Library API** | La API es pública y gratuita pero puede ser lenta. Algunos libros no tienen portadas disponibles. |
| **Shake detection en emulador** | La funcionalidad de shake no funciona correctamente en algunos emuladores; requiere dispositivo físico para probarse. |
| **Permisos iOS** | En iOS los permisos requieren configuración adicional en `app.json` y aceptación manual del usuario. |

### Mejoras Futuras

- Implementar búsqueda de libros por título/autor
- Añadir categorías o etiquetas personalizadas
- Sincronización con servicios cloud (Firebase, Supabase)
- Exportar/importar biblioteca en formato JSON
- Estadísticas de lectura (libros leídos, páginas totales)
- Escaneo de código de barras ISBN para añadir libros

---
