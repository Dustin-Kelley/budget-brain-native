import { MonthSelector } from "@/components/MonthSelector";
import { type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import Animated, { type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  animatedStyle?: StyleProp<ViewStyle>;
  headerHeight?: SharedValue<number>;
}

export function AppHeader({ animatedStyle, headerHeight }: AppHeaderProps) {
  const { top } = useSafeAreaInsets();

  const handleLayout = (e: LayoutChangeEvent) => {
    if (headerHeight) {
      // Use full header height so it translates completely off screen
      headerHeight.value = e.nativeEvent.layout.height;
    }
  };

  return (
    <Animated.View
      onLayout={handleLayout}
      className="absolute left-0 right-0 z-10 flex flex-col bg-cyan-400 items-center justify-center gap-2 px-4 pb-2"
      style={[{ paddingTop: top }, animatedStyle]}
    >
      <MonthSelector />
    </Animated.View>
  );
}
