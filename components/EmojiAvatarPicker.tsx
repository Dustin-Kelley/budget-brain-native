import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

const PEOPLE_EMOJIS = [
  "\u{1F466}", "\u{1F467}", "\u{1F468}", "\u{1F469}", "\u{1F9D1}",
  "\u{1F474}", "\u{1F475}", "\u{1F476}", "\u{1F9D2}", "\u{1F9D3}",
  "\u{1F468}\u{200D}\u{1F9B0}", "\u{1F468}\u{200D}\u{1F9B1}", "\u{1F468}\u{200D}\u{1F9B3}", "\u{1F468}\u{200D}\u{1F9B2}", "\u{1F469}\u{200D}\u{1F9B0}",
  "\u{1F469}\u{200D}\u{1F9B1}", "\u{1F469}\u{200D}\u{1F9B3}", "\u{1F469}\u{200D}\u{1F9B2}", "\u{1F9D4}", "\u{1F471}",
  "\u{1F385}", "\u{1F936}", "\u{1F9B8}", "\u{1F9B9}", "\u{1F9D9}",
  "\u{1F9DA}", "\u{1F9DB}", "\u{1F9DC}", "\u{1F9DD}", "\u{1F9DE}",
  "\u{1F9DF}", "\u{1F477}", "\u{1F478}", "\u{1F934}", "\u{1F470}",
  "\u{1F935}", "\u{1F47C}", "\u{1F930}", "\u{1F931}", "\u{1F647}",
];

type EmojiAvatarPickerProps = {
  selected: string | null | undefined;
  onSelect: (emoji: string) => void;
};

export function EmojiAvatarPicker({ selected, onSelect }: EmojiAvatarPickerProps) {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const accentColor = blendHex(theme.colors[0], theme.colors[1]);

  return (
    <View className="flex-row flex-wrap gap-2.5">
      {PEOPLE_EMOJIS.map((emoji) => {
        const isSelected = emoji === selected;
        return (
          <Pressable
            key={emoji}
            onPress={() => onSelect(emoji)}
            className={cn(
              "h-12 w-12 items-center justify-center rounded-2xl",
              isSelected ? "scale-110" : "active:scale-95"
            )}
            style={isSelected ? { backgroundColor: accentColor + "30", borderWidth: 1.5, borderColor: accentColor } : undefined}
          >
            <Text className="text-2xl">{emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
