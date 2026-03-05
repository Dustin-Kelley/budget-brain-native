import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { appThemes } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Switch, View } from "react-native";

export default function AppearanceScreen() {
  const { isDark, toggleTheme, appTheme, setAppTheme } = useTheme();

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-base text-gray-900">Dark Mode</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        <View className="gap-2">
          <Text className="text-base text-gray-900">Header Theme</Text>
          <View className="flex-row flex-wrap gap-3">
            {appThemes.map((theme) => (
              <Pressable
                key={theme.id}
                onPress={() => setAppTheme(theme.id)}
              >
                <LinearGradient
                  colors={theme.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    borderWidth: appTheme === theme.id ? 3 : 0,
                    borderColor: isDark ? "#fff" : "#111",
                  }}
                />
                <Text className="mt-1 text-center text-xs text-gray-500">
                  {theme.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
