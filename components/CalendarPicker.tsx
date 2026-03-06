import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let index = 0; index < firstDay; index++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);
  return days;
}

function toDateString(year: number, month: number, day: number): string {
  const monthPad = String(month + 1).padStart(2, "0");
  const dayPad = String(day).padStart(2, "0");
  return `${year}-${monthPad}-${dayPad}`;
}

type CalendarPickerProps = {
  value: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
};

export function CalendarPicker({ value, onSelect }: CalendarPickerProps) {
  const selected = value ? new Date(value + "T12:00:00") : new Date();
  const [displayYear, setDisplayYear] = useState(selected.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(selected.getMonth());
  const today = new Date();
  const todayString = toDateString(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const goToPrevMonth = () => {
    const next = new Date(displayYear, displayMonth - 1);
    setDisplayYear(next.getFullYear());
    setDisplayMonth(next.getMonth());
  };

  const goToNextMonth = () => {
    const next = new Date(displayYear, displayMonth + 1);
    setDisplayYear(next.getFullYear());
    setDisplayMonth(next.getMonth());
  };

  const days = getCalendarDays(displayYear, displayMonth);
  const monthLabel = new Date(displayYear, displayMonth).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const rows: (number | null)[][] = [];
  for (let start = 0; start < days.length; start += 7) {
    rows.push(days.slice(start, start + 7));
  }

  return (
    <View className="gap-3 px-2">
      <View className="flex-row items-center justify-between px-2">
        <Pressable
          onPress={goToPrevMonth}
          hitSlop={12}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900">
          {monthLabel}
        </Text>
        <Pressable
          onPress={goToNextMonth}
          hitSlop={12}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
        >
          <Ionicons name="chevron-forward" size={24} color="#374151" />
        </Pressable>
      </View>

      <View className="flex-row">
        {DAY_LABELS.map((label) => (
          <View key={label} className="flex-1 items-center py-2">
            <Text className="text-xs font-medium text-gray-400">{label}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row">
          {row.map((day, colIndex) => {
            const index = rowIndex * 7 + colIndex;
            if (day === null) {
              return (
                <View key={`empty-${index}`} className="h-10 flex-1" />
              );
            }
            const dateString = toDateString(displayYear, displayMonth, day);
            const isSelected = dateString === value;
            const isToday = dateString === todayString;
            return (
              <Pressable
                key={`${displayYear}-${displayMonth}-${day}`}
                onPress={() => onSelect(dateString)}
                className="h-10 flex-1 items-center justify-center rounded-lg active:opacity-80"
                style={{
                  backgroundColor: isSelected ? "#4F46E5" : "transparent",
                }}
              >
                <Text
                  className={`text-base font-medium ${
                    isSelected
                      ? "text-white"
                      : isToday
                        ? "text-indigo-600"
                        : "text-gray-900"
                  }`}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
