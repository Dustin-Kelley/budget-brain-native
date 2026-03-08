import { OverviewHeader } from "@/components/OverviewHeader";
import { PlanHeader } from "@/components/PlanHeader";
import { PlanTabBar } from "@/components/PlanTabBar";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_CONTENT_HEIGHT = 62;
const DEFAULT_CONTENT_PADDING_BOTTOM = 96;

export type ScreenHeaderVariant = "overview" | "plan";

interface ScreenWrapperProps {
  children: ReactNode;
  contentPaddingBottom?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: ScreenHeaderVariant;
  displayName?: string;
  planTabValue?: string;
  onPlanTabChange?: (value: string) => void;
}

/**
 * Wraps a screen with a collapsible header and an Animated.ScrollView.
 * Use header="plan" for the Plan screen (month selector + tabs); otherwise OverviewHeader is used.
 */
export function ScreenWrapper({
  children,
  contentPaddingBottom = DEFAULT_CONTENT_PADDING_BOTTOM,
  contentContainerStyle,
  header = "overview",
  displayName,
  planTabValue = "planned",
  onPlanTabChange,
}: ScreenWrapperProps) {
  const { currentUser } = useCurrentUser();
  const { top } = useSafeAreaInsets();
  const { scrollHandler, headerAnimatedStyle, headerHeight, measuredHeaderHeight } =
    useCollapsibleHeader();
  const headerPaddingTop = top + HEADER_CONTENT_HEIGHT;
  const contentPaddingTop = measuredHeaderHeight > 0 ? measuredHeaderHeight : headerPaddingTop;

  const headerElement =
    header === "plan" ? (
      <PlanHeader
        animatedStyle={headerAnimatedStyle}
        headerHeight={headerHeight}
      >
        <PlanTabBar
          value={planTabValue}
          onValueChange={onPlanTabChange ?? (() => { })}
        />
      </PlanHeader>
    ) : (
      <OverviewHeader
        displayName={displayName ?? currentUser?.first_name ?? "there"}
        animatedStyle={headerAnimatedStyle}
        headerHeight={headerHeight}
      />
    );

  return (
    <View className="flex-1 bg-background px-5">
      {headerElement}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          {
            paddingTop: contentPaddingTop + 16,
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
