import React, { ReactNode } from "react";
import {
  KeyboardTypeOptions,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "./theme";

const TOP_SAFE_INSET = Platform.OS === "ios" ? Math.max(Constants.statusBarHeight, 52) : Math.max(Constants.statusBarHeight, 16);

export function Screen({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  if (scroll) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.scrollContent, { paddingTop: TOP_SAFE_INSET + 18 }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={styles.screen}>{children}</View>;
}

export function GradientButton({
  title,
  onPress,
  disabled = false
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.55 : 1 }}>
      <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </Pressable>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Chip({
  label,
  active = false,
  onPress
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function Input({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  autoCapitalize = "sentences",
  autoCorrect = true
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      style={[styles.input, multiline && styles.textArea]}
    />
  );
}

export function HeroCard({
  image,
  children,
  height = 240
}: {
  image: string;
  children: ReactNode;
  height?: number;
}) {
  return (
    <ImageBackground source={{ uri: image }} imageStyle={{ borderRadius: 28 }} style={[styles.heroCard, { height }]}>
      <LinearGradient colors={["transparent", "rgba(15,10,30,0.94)"]} style={styles.heroOverlay}>
        {children}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)"
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 15,
    fontWeight: "600"
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    color: theme.colors.text
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.muted
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3F0FF",
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  chipActive: {
    backgroundColor: theme.colors.primary
  },
  chipText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "600"
  },
  chipTextActive: {
    color: "#fff"
  },
  input: {
    backgroundColor: "#F3F0FF",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.colors.text,
    fontSize: 15
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top"
  },
  heroCard: {
    width: "100%",
    justifyContent: "flex-end"
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 28,
    padding: 18
  }
});
