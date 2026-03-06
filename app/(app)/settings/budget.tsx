import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useHousehold } from "@/hooks/useHousehold";
import { useResetBudget } from "@/hooks/useResetBudget";
import {
  formatMonthYearForDisplay
} from "@/lib/utils";
import { Alert, ScrollView, View } from "react-native";
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
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: insets.top + 56,
      }}
    >
      <View className="gap-8">
        <View className="gap-3">
          <Text className="text-base font-semibold text-gray-800">
            Budget for {formatMonthYearForDisplay(monthKey)}
          </Text>
          <Button variant="outline" onPress={handleResetBudget}>
            <Text>Reset Budget</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
