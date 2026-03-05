import { MonthSelector } from "@/components/MonthSelector";
import { useTheme } from "@/contexts/theme-context";
import { getHeaderTheme } from "@/lib/themes";
import { LinearGradient } from "expo-linear-gradient";
import { type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import Animated, { type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AppHeaderProps {
  animatedStyle?: StyleProp<ViewStyle>;
  headerHeight?: SharedValue<number>;
}

export function AppHeader({ animatedStyle, headerHeight }: AppHeaderProps) {
  const { top } = useSafeAreaInsets();
  const { headerTheme } = useTheme();
  const theme = getHeaderTheme(headerTheme);

  const handleLayout = (e: LayoutChangeEvent) => {
    if (headerHeight) {
      headerHeight.value = e.nativeEvent.layout.height;
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
