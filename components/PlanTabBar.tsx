import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View } from "react-native";
import { Pressable } from "react-native";

const PLAN_TABS = [
  { value: "planned" as const, label: "Planned" },
  { value: "remaining" as const, label: "Remaining" },
  { value: "transactions" as const, label: "Transactions" },
] as const;

interface PlanTabBarProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

/**
 * Tab bar for the Plan screen. State-driven (no Tabs context) so it can live
 * in the header while content is rendered by the screen.
 */
export function PlanTabBar({
  value,
  onValueChange,
  className,
}: PlanTabBarProps) {
  return (
    <View
      className={cn(
        "mt-1 w-full flex-row rounded-lg bg-muted p-[3px]",
        className
      )}
    >
      {PLAN_TABS.map((tab) => {
        const isActive = value === tab.value;
        return (
          <Pressable
            key={tab.value}
            className={cn(
              "flex-1 items-center justify-center rounded-md py-1.5",
              isActive && "bg-background dark:border-foreground/10 dark:bg-input/30"
            )}
            onPress={() => onValueChange(tab.value)}
          >
            <Text
              className={cn(
                "text-sm font-medium",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground dark:text-muted-foreground"
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
