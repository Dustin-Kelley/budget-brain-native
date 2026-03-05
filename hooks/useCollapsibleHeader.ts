import { useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  runOnJS,
  clamp,
} from "react-native-reanimated";

/**
 * Hook that provides collapsible header behavior.
 * The header scrolls away with the content and scrolls back in 1:1 when returning to top.
 */
export function useCollapsibleHeader() {
  const headerHeight = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(0);

  useAnimatedReaction(
    () => headerHeight.value,
    (height) => {
      if (height > 0) {
        runOnJS(setMeasuredHeaderHeight)(height);
      }
    },
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      // Translate the header up 1:1 with scroll, clamped to header bounds
      headerTranslateY.value = -clamp(currentY, 0, headerHeight.value);
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  return { scrollHandler, headerAnimatedStyle, headerHeight, measuredHeaderHeight };
}
