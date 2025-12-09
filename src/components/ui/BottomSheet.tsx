import { useTheme } from "@/src/hooks/useTheme";
import { BorderRadius, Spacing } from "@/src/theme";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Padding inferior: safe area + tab bar + extra espacio
  const bottomPadding = 0

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                maxHeight: "100%",
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.content,
                { paddingBottom: bottomPadding },
              ]}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              bounces={true}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>{children}</View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardView: {
    width: "100%",
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  scrollView: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
});