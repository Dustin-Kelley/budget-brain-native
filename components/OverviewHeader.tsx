import { MonthSelector } from "@/components/MonthSelector";
import { useTheme } from "@/contexts/theme-context";
import { getHeaderTheme } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";
import type { LayoutChangeEvent } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface OverviewHeaderProps {
  animatedStyle?: StyleProp<ViewStyle>;
  headerHeight?: SharedValue<number>;
}

/**
 * Header for the Overview (home) screen: gradient and month selector.
 */
export function OverviewHeader({
  animatedStyle,
  headerHeight,
}: OverviewHeaderProps) {
  const { top } = useSafeAreaInsets();
  const { headerTheme } = useTheme();
  const theme = getHeaderTheme(headerTheme);

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
    </AnimatedLinearGradient>
  );
}
