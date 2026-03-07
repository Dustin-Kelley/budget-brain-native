import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex, cn } from "@/lib/utils";
import { BlurView } from "expo-blur";
import { useCallback, useEffect, useState } from "react";
import { type LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

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

  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>(
    PLAN_TABS.map(() => ({ x: 0, width: 0 }))
  );

  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const activeIndex = PLAN_TABS.findIndex((t) => t.value === value);

  const handleTabLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      setTabLayouts((prev) => {
        const next = [...prev];
        next[index] = { x, width };
        return next;
      });
    },
    []
  );

  useEffect(() => {
    const layout = tabLayouts[activeIndex];
    if (layout && layout.width > 0) {
      indicatorX.value = withTiming(layout.x, { duration: 250 });
      indicatorW.value = withTiming(layout.width, { duration: 250 });
    }
  }, [activeIndex, tabLayouts]);

  const indicatorStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: indicatorX.value,
    width: indicatorW.value,
    top: 4,
    bottom: 4,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.85)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  }));

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
        <Animated.View style={indicatorStyle} />
        {PLAN_TABS.map((tab, index) => {
          const isActive = value === tab.value;
          return (
            <Pressable
              key={tab.value}
              onLayout={handleTabLayout(index)}
              className="flex-1 items-center justify-center rounded-md py-1.5"
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
