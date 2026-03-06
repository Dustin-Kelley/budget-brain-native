import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useHousehold } from "@/hooks/useHousehold";
import { resetBudget } from "@/lib/mutations/resetBudget";
import {
  formatMonthYearForDisplay
} from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BudgetScreen() {
  const { householdId } = useHousehold();
  const { monthKey } = useMonth();
  const queryClient = useQueryClient();
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



  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        padding: 24,
        paddingTop: 24 + insets.top,
      }}
    >
      <View className="gap-6">
        <View className="flex-row items-center gap-2">
          <BackButton />
          <Text variant="h3" className="items-center">Budget</Text>
        </View>
        <View className="gap-3">
          <Text className="text-base font-semibold text-gray-900">
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
