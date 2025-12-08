import {
    createShakeDetector,
    isAccelerometerAvailable,
    type ShakeConfig,
} from "@/src/services/sensors";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";

interface UseShakeDetectorProps {
  /** Si el detector está habilitado */
  enabled: boolean;
  /** Callback cuando se detecta un shake */
  onShake: () => void;
  /** Si se debe activar feedback háptico (default: true) */
  hapticFeedback?: boolean;
  /** Configuración opcional del detector */
  config?: Partial<ShakeConfig>;
}

interface UseShakeDetectorResult {
  /** Si el acelerómetro está disponible */
  isAvailable: boolean;
  /** Si el detector está activo */
  isActive: boolean;
}

/**
 * Hook para detectar shake del dispositivo
 *
 * @example
 * ```tsx
 * const { isAvailable, isActive } = useShakeDetector({
 *   enabled: shakeEnabled,
 *   onShake: () => openNewNoteForm(),
 * });
 * ```
 */
export function useShakeDetector({
  enabled,
  onShake,
  hapticFeedback = true,
  config,
}: UseShakeDetectorProps): UseShakeDetectorResult {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Verificar disponibilidad del acelerómetro
  useEffect(() => {
    isAccelerometerAvailable().then(setIsAvailable);
  }, []);

  // Configurar detector de shake
  useEffect(() => {
    if (!enabled || !isAvailable) {
      setIsActive(false);
      return;
    }

    const handleShake = () => {
      // Feedback háptico
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onShake();
    };

    const cleanup = createShakeDetector(handleShake, config);
    setIsActive(true);

    return () => {
      cleanup();
      setIsActive(false);
    };
  }, [enabled, isAvailable, onShake, hapticFeedback, config]);

  return { isAvailable, isActive };
}