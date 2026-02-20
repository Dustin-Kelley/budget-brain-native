import {
  formatMonthYearForDisplay,
  getMonthAndYearNumberFromDate,
  getMonthYearString,
} from "@/lib/utils";
import { useMonth } from "@/contexts/month-context";
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <View className="flex-row items-center justify-between py-3 px-1">
      <Pressable
        onPress={goPrevious}
        className="p-2 rounded-lg active:bg-gray-100"
        hitSlop={12}
      >
        <Ionicons name="chevron-back" size={24} color="#374151" />
      </Pressable>
      <Text className="text-lg font-semibold text-gray-900">{displayLabel}</Text>
      <Pressable
        onPress={goNext}
        className="p-2 rounded-lg active:bg-gray-100"
        hitSlop={12}
      >
        <Ionicons name="chevron-forward" size={24} color="#374151" />
      </Pressable>
    </View>
  );
}
