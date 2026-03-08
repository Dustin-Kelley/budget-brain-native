import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useHousehold } from "@/hooks/useHousehold";
import { useResetBudget } from "@/hooks/useResetBudget";
import {
  formatMonthYearForDisplay
} from "@/lib/utils";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BudgetScreen() {
  const { householdId } = useHousehold();
  const { monthKey } = useMonth();
  const resetBudget = useResetBudget();
  const insets = useSafeAreaInsets();

  const handleResetBudget = () => {
    if (!householdId) return;
    const display = formatMonthYearForDisplay(monthKey);
    Alert.alert(
      "Reset Budget",
      `This will delete all categories, budget items, and income for ${display}. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetBudget.mutateAsync({ householdId, monthKey });
              Alert.alert("Done", `Budget for ${display} has been reset.`);
            } catch (error) {
              Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
            }
          },
        },
      ]
    );
  };

  return (
    <View
      className="flex-1 justify-between bg-background"
      style={{
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 49 + 20,
        paddingTop: insets.top + 16,
      }}
    >
      <View className="gap-4">
        <View className="flex-row items-center gap-3">
          <BackButton />
          <Text className="text-lg font-semibold">Budget</Text>
        </View>

        <Text className="text-base font-semibold text-gray-800">
          Budget for {formatMonthYearForDisplay(monthKey)}
        </Text>
      </View>

      <Button variant="outline" onPress={handleResetBudget}>
        <Text>Reset Budget</Text>
      </Button>
    </View>
  );
}
