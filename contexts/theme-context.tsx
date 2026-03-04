import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "budget-brain-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "dark") {
        setIsDark(true);
        setColorScheme("dark");
      } else if (stored === "light") {
        setIsDark(false);
        setColorScheme("light");
      }
    });
  }, [setColorScheme]);

  const toggleTheme = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    setColorScheme(next ? "dark" : "light");
    AsyncStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }, [isDark, setColorScheme]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
