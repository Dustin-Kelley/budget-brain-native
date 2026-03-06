import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import {
  formatMonthYearForDisplay,
  getMonthAndYearNumberFromDate,
  getMonthYearString,
} from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, View } from "react-native";

export function MonthSelector() {
  const { monthKey, setMonthKey } = useMonth();
  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);
  const displayLabel = formatMonthYearForDisplay(monthKey);

  const goPrevious = () => {
    let prevMonth = monthNumber - 1;
    let prevYear = yearNumber;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    setMonthKey(getMonthYearString(prevMonth, prevYear));
  };

  const goNext = () => {
    let nextMonth = monthNumber + 1;
    let nextYear = yearNumber;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    setMonthKey(getMonthYearString(nextMonth, nextYear));
  };

  return (
    <View className="m-4" style={{ borderRadius: 9999, overflow: "hidden" }}>
      <BlurView
        tint="light"
        intensity={40}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: 8,
        }}
      >
        <Pressable
          onPress={goPrevious}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-white/20"
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.8)" />
        </Pressable>
        <Text className="text-base font-semibold tracking-tight text-white">
          {displayLabel}
        </Text>
        <Pressable
          onPress={goNext}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-white/20"
          hitSlop={12}
        >
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </Pressable>
      </BlurView>
    </View>
  );
}
