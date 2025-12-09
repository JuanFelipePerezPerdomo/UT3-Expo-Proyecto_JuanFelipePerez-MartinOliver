import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

interface ImagePickerOptions {
    /** Calidad de la imagen (0-1), default: 0.8 */
    quality?: number;
    /** Permitir edición después de seleccionar, default: true */
    allowsEditing?: boolean;
    /** Aspect ratio para edición [width, height], default: [4, 3] */
    aspect?: [number, number];
}

interface UseImagePickerResult {
  /** Seleccionar imagen de la galería */
  pickFromGallery: () => Promise<string | null>;
  /** Tomar foto con la cámara */
  takePhoto: () => Promise<string | null>;
  /** Verificar permisos de cámara */
  requestCameraPermission: () => Promise<boolean>;
  /** Verificar permisos de galería */
  requestGalleryPermission: () => Promise<boolean>;
}

const DEFAULT_OPTIONS: ImagePickerOptions = {
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
};

/**
 * Hook para seleccionar imágenes de la galería o tomar fotos
 *
 * @example
 * ```tsx
 * const { pickFromGallery, takePhoto } = useImagePicker();
 *
 * const handlePickImage = async () => {
 *   const uri = await pickFromGallery();
 *   if (uri) setImageUrl(uri);
 * };
 * ```
 */
export function useImagePicker(
  options: ImagePickerOptions = {}
): UseImagePickerResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a la cámara para tomar fotos.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a la galería para seleccionar fotos.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const pickFromGallery = async (): Promise<string | null> => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: opts.allowsEditing,
        aspect: opts.aspect,
        quality: opts.quality,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      return result.assets[0].uri;
    } catch (error) {
      console.error("[useImagePicker] Gallery error:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: opts.allowsEditing,
        aspect: opts.aspect,
        quality: opts.quality,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      return result.assets[0].uri;
    } catch (error) {
      console.error("[useImagePicker] Camera error:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
      return null;
    }
  };

  return {
    pickFromGallery,
    takePhoto,
    requestCameraPermission,
    requestGalleryPermission,
  };
}