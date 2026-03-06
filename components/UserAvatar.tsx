import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type UserAvatarProps = {
  emoji: string | null | undefined;
  size?: "sm" | "md";
};

const sizeStyles = {
  sm: { container: "h-8 w-8", emoji: "text-base", iconSize: 16 },
  md: { container: "h-12 w-12", emoji: "text-2xl", iconSize: 24 },
} as const;

export function UserAvatar({ emoji, size = "sm" }: UserAvatarProps) {
  const s = sizeStyles[size];

  return (
    <View
      className={cn(
        "items-center justify-center rounded-full bg-gray-100",
        s.container
      )}
    >
      {emoji ? (
        <Text className={s.emoji}>{emoji}</Text>
      ) : (
        <Ionicons name="person-outline" size={s.iconSize} color="#9ca3af" />
      )}
    </View>
  );
}
