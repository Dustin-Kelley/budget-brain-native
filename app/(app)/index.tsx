import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BudgetProgressCard } from "@/components/BudgetProgressCard";
import { BudgetSummaryCards } from "@/components/BudgetSummaryCards";
import { CategorySpendingList } from "@/components/CategorySpendingList";
import { MonthSelector } from "@/components/MonthSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useBudgetOverview } from "@/hooks/useBudgetOverview";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { useMonth } from "@/contexts/month-context";
import { Link } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function OverviewScreen() {
  const { householdId, isLoading: userLoading } = useHousehold();
  const { currentUser } = useCurrentUser();
  const { monthKey } = useMonth();
  const {
    categories,
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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!householdId) {
    return (
      <View className="flex-1  p-6">
        <MonthSelector />
        <Card className="gap-0 p-6">
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
        </Card>
      </View>
    );
  }

  if (budgetLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 96 }}
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
          <Card className="border-amber-200 bg-amber-50 gap-0 p-4">
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
          </Card>
        )}
        </View>
      </ScrollView>

      {householdId && currentUser && (
        <AddExpenseForm
          categories={categories}
          householdId={householdId}
          userId={currentUser.id}
          monthKey={monthKey}
          onSuccess={refetch}
        />
      )}
    </View>
  );
}
