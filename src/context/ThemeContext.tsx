import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { getSettings, saveSettings } from "../storage/storage";
import { AppSettings } from "../types/subscription";

type ThemeMode = "light" | "dark" | "system";

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  subtext: string;
  primary: string;
  accent: string;
  border: string;
  card: string;
  error: string;
  success: string;
}

const lightColors: ThemeColors = {
  background: "#F8F9FB",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  subtext: "#666666",
  primary: "#4A7AFF",
  accent: "#FF9F43",
  border: "#F0F0F0",
  card: "#FFFFFF",
  error: "#FF4D4D",
  success: "#00C853",
};

const darkColors: ThemeColors = {
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F8FAFC",
  subtext: "#94A3B8",
  primary: "#6366F1",
  accent: "#F59E0B",
  border: "#334155",
  card: "#1E293B",
  error: "#FF4D4D",
  success: "#00C853",
};

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>("system");

  useEffect(() => {
    const loadTheme = async () => {
      const settings = await getSettings();
      setThemeState(settings.theme || "system");
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    const settings = await getSettings();
    await saveSettings({ ...settings, theme: newTheme });
  };

  const isDark = theme === "system" ? systemColorScheme === "dark" : theme === "dark";
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
