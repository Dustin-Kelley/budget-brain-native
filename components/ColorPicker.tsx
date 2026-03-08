import { CATEGORY_COLORS } from "@/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type ColorPickerProps = {
  selectedColor?: string;
  onSelectColor: (color: string) => void;
};

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {CATEGORY_COLORS.map((color) => {
        const isSelected = selectedColor === color;
        return (
          <Pressable
            key={color}
            onPress={() => onSelectColor(color)}
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: color }}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={18} color="white" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
