import { useTheme } from "@/src/hooks/useTheme";
import { useSettingsStore } from "@/src/stores";
import { BorderRadius, Spacing, Typography } from "@/src/theme";
import type { SortBy } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SORT_OPTIONS: { value: SortBy; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "date", label: "Fecha", icon: "time-outline" },
  { value: "title", label: "Título", icon: "text-outline" },
  { value: "favorites", label: "Favoritos", icon: "star-outline" },
];

interface SortMenuProps {
  excludeFavorites?: boolean;
}

export function SortMenu({ excludeFavorites = false }: SortMenuProps) {
  const { colors } = useTheme();
  const { sortBy, setSortBy } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Filtrar opciones según la prop
  const sortOptions = excludeFavorites
    ? SORT_OPTIONS.filter((opt) => opt.value !== "favorites")
    : SORT_OPTIONS;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [isOpen, fadeAnim, scaleAnim]);

  const handleSelect = (value: SortBy) => {
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <View>
      {/* Botón de filtros */}
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: colors.surface }]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="options-outline" size={22} color={colors.primary} />
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Animated.View
            style={[
              styles.menu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={[styles.menuTitle, { color: colors.textSecondary }]}>
              Ordenar por
            </Text>
            
            {sortOptions.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.menuItem,
                    isSelected && { backgroundColor: colors.primaryLight + "20" },
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <Ionicons
                      name={option.icon}
                      size={18}
                      color={isSelected ? colors.primary : colors.icon}
                    />
                    <Text
                      style={[
                        styles.menuItemText,
                        { color: isSelected ? colors.primary : colors.text },
                        isSelected && styles.menuItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: Spacing.lg,
  },
  menu: {
    minWidth: 180,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingVertical: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuTitle: {
    ...Typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  menuItemText: {
    ...Typography.body,
  },
  menuItemTextSelected: {
    fontWeight: "600",
  },
});