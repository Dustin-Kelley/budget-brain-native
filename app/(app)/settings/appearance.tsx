import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { appThemes } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import { getAppTheme } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppearanceScreen() {
  const { isDark, toggleTheme, appTheme, setAppTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const theme = getAppTheme(appTheme);
  const accentColor = blendHex(theme.colors[0], theme.colors[1]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: insets.top + 56,
      }}
    >
      <View className="gap-8">
        <View className="bg-card rounded-2xl px-5 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-gray-800">Dark Mode</Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-base text-gray-800">Header Theme</Text>
          <View className="flex-row flex-wrap gap-3">
            {appThemes.map((t) => {
              const isSelected = appTheme === t.id;
              const selectedBorder = blendHex(t.colors[0], t.colors[1]);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setAppTheme(t.id)}
                >
                  <LinearGradient
                    colors={t.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: isSelected ? selectedBorder : "transparent",
                      ...(isSelected
                        ? {
                            shadowColor: selectedBorder,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                          }
                        : {}),
                    }}
                  />
                  <Text className="mt-1 text-center text-xs text-gray-500">
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
