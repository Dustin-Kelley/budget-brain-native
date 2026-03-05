import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

const menuItems = [
  { label: "Account", icon: "person-outline" as const, route: "/(app)/settings/account" },
  { label: "Appearance", icon: "color-palette-outline" as const, route: "/(app)/settings/appearance" },
  { label: "Budget", icon: "wallet-outline" as const, route: "/(app)/settings/budget" },
  { label: "Household", icon: "people-outline" as const, route: "/(app)/settings/household" },
] as const;

export default function SettingsMenuScreen() {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="bg-card border border-border rounded-xl overflow-hidden">
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route)}
            className={`flex-row items-center px-4 py-4 ${
              index < menuItems.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <Ionicons name={item.icon} size={22} color="#6b7280" />
            <Text className="flex-1 ml-3 text-base">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
