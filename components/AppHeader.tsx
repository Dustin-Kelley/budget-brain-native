import { OverviewHeader } from "@/components/OverviewHeader";
import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface AppHeaderProps {
  animatedStyle?: StyleProp<ViewStyle>;
  headerHeight?: SharedValue<number>;
}

/**
 * Default app header. Uses OverviewHeader (gradient + month selector).
 * Use OverviewHeader or PlanHeader directly when you need a specific screen header.
 */
export function AppHeader({ animatedStyle, headerHeight }: AppHeaderProps) {
  return (
    <OverviewHeader
      animatedStyle={animatedStyle}
      headerHeight={headerHeight}
    />
  );
}
