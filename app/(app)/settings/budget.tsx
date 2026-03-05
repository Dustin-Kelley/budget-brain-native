import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { resetBudget } from "@/lib/mutations/resetBudget";
import { rolloverBudget } from "@/lib/mutations/rolloverBudget";
import {
  formatMonthYearForDisplay,
  getMonthAndYearNumberFromDate,
  getMonthYearString,
} from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, ScrollView, View } from "react-native";

export default function BudgetScreen() {
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();
  const { monthKey } = useMonth();
  const queryClient = useQueryClient();

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
            const { error } = await resetBudget({ householdId, monthKey });
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
            queryClient.invalidateQueries();
            Alert.alert("Done", `Budget for ${display} has been reset.`);
          },
        },
      ]
    );
  };

  const handleRolloverBudget = () => {
    if (!householdId || !currentUser) return;
    const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);
    const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;
    const nextYear = monthNumber === 12 ? yearNumber + 1 : yearNumber;
    const toMonthKey = getMonthYearString(nextMonth, nextYear);
    const fromDisplay = formatMonthYearForDisplay(monthKey);
    const toDisplay = formatMonthYearForDisplay(toMonthKey);

    Alert.alert(
      "Rollover Budget",
      `Copy all categories, budget items, and income from ${fromDisplay} to ${toDisplay}? This will replace any existing data in ${toDisplay}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rollover",
          onPress: async () => {
            const { error } = await rolloverBudget({
              householdId,
              fromMonthKey: monthKey,
              toMonthKey,
              userId: currentUser.id,
            });
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
            queryClient.invalidateQueries();
            Alert.alert("Done", `Budget rolled over to ${toDisplay}.`);
          },
        },
      ]
    );
  };

  if (!householdId) {
    return (
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <Text className="text-base text-gray-500">
          Join or create a household to manage budgets.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-3">
        <Text className="text-base font-semibold text-gray-900">
          Budget for {formatMonthYearForDisplay(monthKey)}
        </Text>
        <Button variant="outline" onPress={handleResetBudget}>
          <Text>Reset Budget</Text>
        </Button>
        <Button variant="outline" onPress={handleRolloverBudget}>
          <Text>Rollover to Next Month</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
