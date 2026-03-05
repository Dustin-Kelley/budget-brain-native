import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getHeaderTheme } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";
import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface OverviewHeaderProps {
  displayName?: string;
  animatedStyle?: StyleProp<ViewStyle>;
  headerHeight?: SharedValue<number>;
}

export function OverviewHeader({
  displayName,
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
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingBottom: 16,
          paddingTop: top,
        },
        animatedStyle,
      ]}
    >
      <Text variant="h1" className="text-left m-4 font-bold text-white">
        Hi, {displayName || "there"} 👋
      </Text>
    </AnimatedLinearGradient>
  );
}
