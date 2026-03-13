import { Text } from "@/components/ui/text";
import { RECURRENCE_OPTIONS } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type RecurrencePickerProps = {
  value: string;
  onSelect: (value: string) => void;
};

export function RecurrencePicker({ value, onSelect }: RecurrencePickerProps) {
  return (
    <View className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      {RECURRENCE_OPTIONS.map((option, index) => (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option.value)}
          className={`flex-row items-center justify-between px-4 py-3 active:bg-gray-100 ${index > 0 ? "border-t border-gray-200" : ""}`}
        >
          <Text className="font-medium text-gray-900">{option.label}</Text>
          {value === option.value && (
            <Ionicons name="checkmark" size={18} color="#4F46E5" />
          )}
        </Pressable>
      ))}
    </View>
  );
}
