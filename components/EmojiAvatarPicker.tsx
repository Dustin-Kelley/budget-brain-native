import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

const PEOPLE_EMOJIS = [
  "\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F606}",
  "\u{1F605}", "\u{1F602}", "\u{1F60A}", "\u{1F607}", "\u{1F642}",
  "\u{1F643}", "\u{1F609}", "\u{1F60C}", "\u{1F60D}", "\u{1F970}",
  "\u{1F618}", "\u{1F617}", "\u{1F619}", "\u{1F61A}", "\u{1F60B}",
  "\u{1F61B}", "\u{1F61C}", "\u{1F92A}", "\u{1F61D}", "\u{1F911}",
  "\u{1F917}", "\u{1F92D}", "\u{1F92B}", "\u{1F914}", "\u{1F910}",
  "\u{1F928}", "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1F60F}",
  "\u{1F612}", "\u{1F644}", "\u{1F62C}", "\u{1F925}", "\u{1F60E}",
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
    <View className="flex-row flex-wrap gap-2">
      {PEOPLE_EMOJIS.map((emoji) => {
        const isSelected = emoji === selected;
        return (
          <Pressable
            key={emoji}
            onPress={() => onSelect(emoji)}
            className={cn(
              "h-12 w-12 items-center justify-center rounded-xl",
              isSelected ? "scale-110" : "active:scale-95"
            )}
            style={isSelected ? { backgroundColor: accentColor + "30", borderWidth: 2, borderColor: accentColor } : undefined}
          >
            <Text className="text-2xl">{emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
