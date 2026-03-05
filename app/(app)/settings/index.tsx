import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

const menuItems = [
  {
    label: "Account",
    description: "Email, password & sign out",
    icon: "person-outline" as const,
    route: "/(app)/settings/account",
  },
  {
    label: "Appearance",
    description: "Dark mode & header theme",
    icon: "color-palette-outline" as const,
    route: "/(app)/settings/appearance",
  },
  {
    label: "Budget",
    description: "Reset & rollover budget",
    icon: "wallet-outline" as const,
    route: "/(app)/settings/budget",
  },
  {
    label: "Household",
    description: "Manage household members",
    icon: "people-outline" as const,
    route: "/(app)/settings/household",
  },
] as const;

export default function SettingsMenuScreen() {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const accentColor = blendHex(theme.colors[0], theme.colors[1]);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-3">
        {menuItems.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route)}
            className="bg-card border-border flex-row items-center rounded-2xl border px-5 py-4 shadow-sm shadow-black/5 active:opacity-80"
          >
            <View
              className="items-center justify-center rounded-xl"
              style={{ width: 40, height: 40, backgroundColor: accentColor + "18" }}
            >
              <Ionicons name={item.icon} size={22} color={accentColor} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold">{item.label}</Text>
              <Text className="text-sm text-muted-foreground">{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
