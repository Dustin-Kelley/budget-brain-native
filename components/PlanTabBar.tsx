import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex, cn, hexToRgba } from "@/lib/utils";
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

/**
 * Tab bar for the Plan screen. Uses the selected header theme for styling.
 * State-driven (no Tabs context) so it can live in the header while content is rendered by the screen.
 */
export function PlanTabBar({
  value,
  onValueChange,
  className,
}: PlanTabBarProps) {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const trackBackground = hexToRgba(theme.colors[0], 0.4);
  const selectedBackground = "white";

  return (
    <View
      className={cn("mt-1 w-full flex-row rounded-lg p-[3px]", className)}
      style={{ backgroundColor: trackBackground }}
    >
      {PLAN_TABS.map((tab) => {
        const isActive = value === tab.value;
        return (
          <Pressable
            key={tab.value}
            className="flex-1 items-center justify-center rounded-md py-1.5"
            style={isActive ? { backgroundColor: selectedBackground } : undefined}
            onPress={() => onValueChange(tab.value)}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: isActive ? blendHex(theme.colors[0], theme.colors[1]) : "#fff" }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
