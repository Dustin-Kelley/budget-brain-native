import { OverviewHeader } from "@/components/OverviewHeader";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_CONTENT_HEIGHT = 62;
const DEFAULT_CONTENT_PADDING_BOTTOM = 96;

interface CustomHeaderProps {
  animatedStyle: StyleProp<ViewStyle>;
  headerHeight: SharedValue<number>;
}

interface ScreenWrapperProps {
  children: ReactNode;
  contentPaddingBottom?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** When provided, used instead of the default AppHeader (e.g. PlanHeader with tabs). */
  customHeader?: (props: CustomHeaderProps) => ReactNode;
}

/**
 * Wraps a screen with a collapsible header (OverviewHeader by default) and an Animated.ScrollView.
 * Use customHeader for screens that need a different header (e.g. PlanHeader with tabs).
 */
export function ScreenWrapper({
  children,
  contentPaddingBottom = DEFAULT_CONTENT_PADDING_BOTTOM,
  contentContainerStyle,
  customHeader,
}: ScreenWrapperProps) {
  const { top } = useSafeAreaInsets();
  const { scrollHandler, headerAnimatedStyle, headerHeight, measuredHeaderHeight } =
    useCollapsibleHeader();
  const headerPaddingTop = top + HEADER_CONTENT_HEIGHT;
  const contentPaddingTop = measuredHeaderHeight > 0 ? measuredHeaderHeight : headerPaddingTop;

  const header = customHeader ? (
    customHeader({ animatedStyle: headerAnimatedStyle, headerHeight })
  ) : (
    <OverviewHeader
      animatedStyle={headerAnimatedStyle}
      headerHeight={headerHeight}
    />
  );

  return (
    <View className="flex-1 p-4">
      {header}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          {
            paddingTop: contentPaddingTop,
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
