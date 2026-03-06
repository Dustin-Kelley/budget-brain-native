import { DEFAULT_APP_THEME } from "@/lib/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeContextValue = {
  appTheme: string;
  setAppTheme: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const APP_THEME_KEY = "budget-brain-header-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appTheme, setAppThemeState] = useState(DEFAULT_APP_THEME);

  useEffect(() => {
    AsyncStorage.getItem(APP_THEME_KEY).then((stored) => {
      if (stored) {
        setAppThemeState(stored);
      }
    });
  }, []);

  const setAppTheme = useCallback((id: string) => {
    setAppThemeState(id);
    AsyncStorage.setItem(APP_THEME_KEY, id);
  }, []);

  return (
    <ThemeContext.Provider value={{ appTheme, setAppTheme }}>
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
