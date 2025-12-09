import { useImagePicker, useTheme } from "@/src/hooks";
import { BorderRadius, Spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ImageSelectorProps {
  /** URL de la imagen actual */
  imageUrl?: string;
  /** Callback cuando se selecciona/cambia imagen */
  onImageChange: (uri: string | undefined) => void;
  /** Si el componente está deshabilitado */
  disabled?: boolean;
}

/**
 * Componente para seleccionar imagen desde galería o cámara
 */
export function ImageSelector({
  imageUrl,
  onImageChange,
  disabled = false,
}: ImageSelectorProps) {
  const { colors } = useTheme();
  const { pickFromGallery, takePhoto } = useImagePicker();

  const handleSelectImage = () => {
    Alert.alert("Añadir portada", "¿De dónde quieres obtener la imagen?", [
      {
        text: "Cámara",
        onPress: async () => {
          const uri = await takePhoto();
          if (uri) onImageChange(uri);
        },
      },
      {
        text: "Galería",
        onPress: async () => {
          const uri = await pickFromGallery();
          if (uri) onImageChange(uri);
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleRemoveImage = () => {
    Alert.alert("Eliminar portada", "¿Seguro que quieres eliminar la imagen?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => onImageChange(undefined),
      },
    ]);
  };

  if (imageUrl) {
    return (
      <View style={styles.container}>
        <View 
          style={[
            styles.imageContainer, 
            { backgroundColor: colors.surfaceVariant }
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
          {!disabled && (
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.error }]}
              onPress={handleRemoveImage}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        {!disabled && (
          <TouchableOpacity
            style={[styles.changeButton, { borderColor: colors.border }]}
            onPress={handleSelectImage}
          >
            <Ionicons name="image-outline" size={16} color={colors.primary} />
            <Text style={[styles.changeButtonText, { color: colors.primary }]}>
              Cambiar portada
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.placeholder,
        { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
      onPress={handleSelectImage}
      disabled={disabled}
    >
      <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
      <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
        Añadir portada (opcional)
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  imageContainer: {
    position: "relative",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  placeholder: {
    height: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xs,
  },
  placeholderText: {
    fontSize: 14,
  },
});