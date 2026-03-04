import { MonthSelector } from "@/components/MonthSelector";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AppHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <View className="flex flex-col bg-cyan-400 items-center justify-center gap-2 px-4 pb-2" style={{ paddingTop: top }}>
      <MonthSelector />
    </View>
  );
}
