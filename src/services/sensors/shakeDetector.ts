import { Accelerometer, type AccelerometerMeasurement } from "expo-sensors";

/**
 * Configuración del detector de shake
 */
export interface ShakeConfig {
  /** Umbral de aceleración para detectar shake (default: 1.5) */
  threshold: number;
  /** Tiempo mínimo entre detecciones en ms (default: 1000) */
  debounceMs: number;
  /** Intervalo de muestreo del acelerómetro en ms (default: 100) */
  updateIntervalMs: number;
}

const DEFAULT_CONFIG: ShakeConfig = {
  threshold: 1.5,
  debounceMs: 1000,
  updateIntervalMs: 100,
};

/**
 * Crea un detector de shake basado en el acelerómetro
 *
 * @param onShake - Callback que se ejecuta cuando se detecta un shake
 * @param config - Configuración opcional del detector
 * @returns Función para cancelar la suscripción
 */
export function createShakeDetector(
  onShake: () => void,
  config: Partial<ShakeConfig> = {}
): () => void {
  const { threshold, debounceMs, updateIntervalMs } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  let lastShakeTime = 0;
  let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;

  // Configurar intervalo de actualización
  Accelerometer.setUpdateInterval(updateIntervalMs);

  // Calcular la magnitud del vector de aceleración
  const calculateMagnitude = ({
    x,
    y,
    z,
  }: AccelerometerMeasurement): number => {
    return Math.sqrt(x * x + y * y + z * z);
  };

  // Manejar lectura del acelerómetro
  const handleAccelerometerData = (data: AccelerometerMeasurement): void => {
    const magnitude = calculateMagnitude(data);
    const now = Date.now();

    // Detectar shake si supera el umbral y ha pasado el debounce
    // Restamos 1 porque en reposo la magnitud es ~1 (gravedad)
    if (magnitude - 1 > threshold && now - lastShakeTime > debounceMs) {
      lastShakeTime = now;
      console.log("[ShakeDetector] Shake detected! Magnitude:", magnitude);
      onShake();
    }
  };

  // Iniciar suscripción
  subscription = Accelerometer.addListener(handleAccelerometerData);

  // Retornar función de cleanup
  return () => {
    if (subscription) {
      subscription.remove();
      subscription = null;
    }
  };
}

/**
 * Verifica si el acelerómetro está disponible y solicita permisos si es necesario
 *
 * NOTA iOS: El simulador no tiene acelerómetro físico.
 * Para probar shake en simulador: Device → Shake (Cmd + Ctrl + Z)
 *
 * NOTA Android: Requiere permisos explícitos que se solicitan aquí.
 */
export async function isAccelerometerAvailable(): Promise<boolean> {
  try {
    // Verificar si el sensor está disponible en el dispositivo
    const isAvailable = await Accelerometer.isAvailableAsync();
    if (!isAvailable) {
      console.warn(
        "[ShakeDetector] Accelerometer not available on this device"
      );
      return false;
    }

    // Solicitar permisos (principalmente necesario en Android)
    const { status } = await Accelerometer.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Accelerometer.requestPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  } catch (error) {
    console.error("[ShakeDetector] Permission error:", error);
    return false;
  }
}