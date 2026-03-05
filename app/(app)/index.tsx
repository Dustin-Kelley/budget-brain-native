import { AddExpenseForm } from "@/components/AddExpenseForm";
import { AppHeader } from "@/components/AppHeader";
import { BudgetProgressCard } from "@/components/BudgetProgressCard";
import { BudgetSummaryCards } from "@/components/BudgetSummaryCards";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { CategorySpendingList } from "@/components/CategorySpendingList";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useBudgetOverview } from "@/hooks/useBudgetOverview";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { Link } from "expo-router";
import { View } from "react-native";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
      <LoadingSpinner />
    );
  }

  if (!householdId) {
    return (
      <View className="flex-1 p-6">
        <AppHeader />
        <View className="flex-1 items-center justify-center">
          <Card className="gap-0 p-6">
            <Text className="text-center text-lg font-semibold text-gray-900">
              No household set up
            </Text>
            <Text className="mt-2 text-center text-sm text-gray-500">
              Your account isn&apos;t linked to a household yet. Use the web app to
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
      </View>
    );
  }

  if (budgetLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <View className="flex-1">
      <ScreenWrapper>
        <View className="gap-6">
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

          <CategoryPieChart categorySpent={categorySpent} />

          <CategorySpendingList
            categorySpent={categorySpent}
            error={error?.message}
          />
          <CategorySpendingList
            categorySpent={categorySpent}
            error={error?.message}
          />
          <CategorySpendingList
            categorySpent={categorySpent}
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
                You haven&apos;t set a budget for this month. Open the Plan tab to
                add income and categories.
              </Text>
              <Link href="/(app)/plan" asChild>
                <Button variant="outline" className="mt-3">
                  <Text>Go to Plan</Text>
                </Button>
              </Link>
            </Card>
          )}
        </View>
      </ScreenWrapper>
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
