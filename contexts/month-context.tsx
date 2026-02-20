import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { getCurrentMonthYearString } from "@/lib/utils";

type MonthContextValue = {
  monthKey: string;
  setMonthKey: (key: string) => void;
  resetToCurrentMonth: () => void;
};

const MonthContext = createContext<MonthContextValue | null>(null);

export function MonthProvider({ children }: { children: ReactNode }) {
  const [monthKey, setMonthKey] = useState(getCurrentMonthYearString);

  const resetToCurrentMonth = useCallback(() => {
    setMonthKey(getCurrentMonthYearString());
  }, []);

  const value: MonthContextValue = {
    monthKey,
    setMonthKey,
    resetToCurrentMonth,
  };

  return (
    <MonthContext.Provider value={value}>{children}</MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error("useMonth must be used within MonthProvider");
  }
  return context;
}
