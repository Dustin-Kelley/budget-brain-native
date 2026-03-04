import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  clamp,
} from "react-native-reanimated";

/**
 * Hook that provides scroll-direction-based header collapse behavior.
 * The header slides up (hides) when scrolling down, and slides back (shows) when scrolling up.
 */
export function useCollapsibleHeader() {
  const headerHeight = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = Math.max(0, event.contentOffset.y);
      const diff = currentY - lastScrollY.value;

      // Diff-clamp: accumulate the diff but clamp between -height and 0
      headerTranslateY.value = clamp(
        headerTranslateY.value - diff,
        -headerHeight.value,
        0
      );

      lastScrollY.value = currentY;
    },
    onEndDrag: () => {
      // Snap to fully shown or fully hidden
      const halfway = -headerHeight.value / 2;
      if (headerTranslateY.value < halfway) {
        headerTranslateY.value = withTiming(-headerHeight.value, {
          duration: 200,
        });
      } else {
        headerTranslateY.value = withTiming(0, { duration: 200 });
      }
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  return { scrollHandler, headerAnimatedStyle, headerHeight };
}
