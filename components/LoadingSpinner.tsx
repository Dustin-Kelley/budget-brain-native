import { useEffect, useRef } from "react";
import { Animated, Easing, Image, View } from "react-native";

const logoDarkSource = require("../assets/images/logo-dark.png");

interface LoadingSpinnerProps {
  size?: number;
}

export function LoadingSpinner({ size = 64 }: LoadingSpinnerProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View style={{ opacity }}>
        <Image
          source={logoDarkSource}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
