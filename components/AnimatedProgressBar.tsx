import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

type AnimatedProgressBarProps = {
  percent: number;
  height?: number;
  color: string;
  className?: string;
};

export function AnimatedProgressBar({
  percent,
  height = 6,
  color,
  className,
}: AnimatedProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(percent, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      className={className ?? "h-1.5 w-full overflow-hidden rounded-full bg-gray-100"}
      style={className ? undefined : { height }}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: color }, animatedStyle]}
      />
    </View>
  );
}
