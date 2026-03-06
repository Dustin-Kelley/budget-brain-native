import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex, cn } from "@/lib/utils";
import { BlurView } from "expo-blur";
import { Pressable, View } from "react-native";

const PLAN_TABS = [
  { value: "planned" as const, label: "Planned" },
  { value: "remaining" as const, label: "Remaining" },
  { value: "transactions" as const, label: "Transactions" },
] as const;

interface PlanTabBarProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function PlanTabBar({
  value,
  onValueChange,
  className,
}: PlanTabBarProps) {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);

  return (
    <View
      className={cn("mt-1 w-full rounded-lg overflow-hidden", className)}
    >
      <BlurView
        tint="light"
        intensity={30}
        style={{
          flexDirection: "row",
          padding: 4,
        }}
      >
        {PLAN_TABS.map((tab) => {
          const isActive = value === tab.value;
          return (
            <Pressable
              key={tab.value}
              className="flex-1 items-center justify-center rounded-md py-1.5"
              style={
                isActive
                  ? {
                      backgroundColor: "rgba(255,255,255,0.85)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                    }
                  : undefined
              }
              onPress={() => onValueChange(tab.value)}
            >
              <Text
                className="text-sm font-bold"
                style={{
                  color: isActive
                    ? blendHex(theme.colors[0], theme.colors[1])
                    : "rgba(255,255,255,0.7)",
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}
