import { BudgetProgressCard } from "@/components/BudgetProgressCard";
import { BudgetSummaryCards } from "@/components/BudgetSummaryCards";
import { CategorySpendingList } from "@/components/CategorySpendingList";
import { MonthSelector } from "@/components/MonthSelector";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useBudgetOverview } from "@/hooks/useBudgetOverview";
import { useHousehold } from "@/hooks/useHousehold";
import { Link } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function OverviewScreen() {
  const { householdId, isLoading: userLoading } = useHousehold();
  const {
    totalPlanned,
    spentAmount,
    remaining,
    percentSpent,
    categorySpent,
    isLoading: budgetLoading,
    error,
    refetch,
  } = useBudgetOverview();

  if (userLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!householdId) {
    return (
      <View className="flex-1 bg-gray-50 p-6">
        <MonthSelector />
        <View className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <Text className="text-center text-lg font-semibold text-gray-900">
            No household set up
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Your account isn’t linked to a household yet. Use the web app to
            create or join a household, then open Budget Brain again.
          </Text>
          <Button
            variant="outline"
            className="mt-4"
            onPress={() => refetch()}
          >
            <Text>Retry</Text>
          </Button>
        </View>
      </View>
    );
  }

  if (budgetLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View className="px-4 pt-2">
        <MonthSelector />
      </View>

      <View className="mt-4 gap-6 px-4">
        <BudgetProgressCard
          totalPlanned={totalPlanned}
          spentAmount={spentAmount}
          percentSpent={percentSpent}
          error={error?.message}
        />

        <BudgetSummaryCards
          totalPlanned={totalPlanned}
          spentAmount={spentAmount}
          remaining={remaining}
          percentSpent={percentSpent}
          error={error?.message}
        />

        <CategorySpendingList
          categorySpent={categorySpent}
          error={error?.message}
        />

        {totalPlanned === 0 && !error && (
          <View className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Text className="font-semibold text-amber-900">
              Plan your budget
            </Text>
            <Text className="mt-1 text-sm text-amber-800">
              You haven’t set a budget for this month. Open the Plan tab to add
              income and categories.
            </Text>
            <Link href="/(app)/plan" asChild>
              <Button variant="outline" className="mt-3">
                <Text>Go to Plan</Text>
              </Button>
            </Link>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
