import { MonthSelector } from "@/components/MonthSelector";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";
import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface PlanHeaderProps {
  animatedStyle?: StyleProp<ViewStyle>;
  headerHeight?: SharedValue<number>;
  children?: React.ReactNode;
}

/**
 * Header for the Plan screen: same gradient and month selector as AppHeader,
 * with an optional slot below (e.g. tab triggers) via children.
 */
export function PlanHeader({
  animatedStyle,
  headerHeight,
  children,
}: PlanHeaderProps) {
  const { top } = useSafeAreaInsets();
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);

  const handleLayout = (event: LayoutChangeEvent) => {
    if (headerHeight) {
      headerHeight.value = event.nativeEvent.layout.height;
    }
  };

  return (
    <AnimatedLinearGradient
      colors={theme.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      onLayout={handleLayout}
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingHorizontal: 16,
          paddingBottom: 8,
          paddingTop: top,
        },
        animatedStyle,
      ]}
    >
      <MonthSelector />
      {children}
    </AnimatedLinearGradient>
  );
}
