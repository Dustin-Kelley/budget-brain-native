import { MonthSelector } from "@/components/MonthSelector";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedView = Animated.View;

interface PlanHeaderProps {
  animatedStyle?: StyleProp<ViewStyle>;
  headerHeight?: SharedValue<number>;
  children?: React.ReactNode;
}

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
    <AnimatedView
      onLayout={handleLayout}
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 10,
          overflow: "hidden",
        },
        animatedStyle,
      ]}
    >
      <BlurView
        tint="prominent"
        intensity={60}
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingHorizontal: 20,
          paddingBottom: 16,
          paddingTop: top,
        }}
      >
        <LinearGradient
          colors={theme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.6,
          }}
        />
        <MonthSelector />
        {children}
      </BlurView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: "rgba(255,255,255,0.2)",
        }}
      />
    </AnimatedView>
  );
}
