import { AppHeader } from "@/components/AppHeader";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_CONTENT_HEIGHT = 62;
const DEFAULT_CONTENT_PADDING_BOTTOM = 96;

interface ScreenWrapperProps {
  children: ReactNode;
  contentPaddingBottom?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Wraps a screen with the collapsible AppHeader and an Animated.ScrollView.
 * Use this for app tab screens that need the month selector header and scrollable content.
 */
export function ScreenWrapper({
  children,
  contentPaddingBottom = DEFAULT_CONTENT_PADDING_BOTTOM,
  contentContainerStyle,
}: ScreenWrapperProps) {
  const { top } = useSafeAreaInsets();
  const { scrollHandler, headerAnimatedStyle, headerHeight } =
    useCollapsibleHeader();
  const headerPaddingTop = top + HEADER_CONTENT_HEIGHT;

  return (
    <View className="flex-1 p-4">
      <AppHeader
        animatedStyle={headerAnimatedStyle}
        headerHeight={headerHeight}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          {
            paddingTop: headerPaddingTop,
            paddingBottom: contentPaddingBottom,
          },
          contentContainerStyle,
        ]}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}
