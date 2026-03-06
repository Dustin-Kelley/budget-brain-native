import { AddExpenseForm } from "@/components/AddExpenseForm";
import { AppHeader } from "@/components/AppHeader";
import { BudgetProgressCard } from "@/components/BudgetProgressCard";
import { BudgetSummaryCards } from "@/components/BudgetSummaryCards";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { CategorySpendingList } from "@/components/CategorySpendingList";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useAutoRollover } from "@/hooks/useAutoRollover";
import { useBudgetOverview } from "@/hooks/useBudgetOverview";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHasBudgetThisMonth } from "@/hooks/useHasBudgetThisMonth";
import { Link } from "expo-router";
import { View } from "react-native";

export default function OverviewScreen() {
  const { currentUser, isCurrentUserLoading } = useCurrentUser();
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
  const { hasBudgetThisMonth } = useHasBudgetThisMonth();
  const { isRollingOver } = useAutoRollover();

  const householdId = currentUser?.household_id;

  if (isCurrentUserLoading || isRollingOver) {
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

  if (!hasBudgetThisMonth) {
    return (
      <View className="flex-1">
        <ScreenWrapper>
          <Card className="p-8">
            <Text className="text-center text-xl font-semibold text-gray-900">
              Hey — looks like you don&apos;t have a budget set up yet!
            </Text>
            <Text className="text-center text-gray-600">
              Don't worry its easy! Head to the Budget tab to start. We'll guide you through the rest there.
            </Text>
            <Link href="/(app)/plan" asChild>
              <Button className="mt-1">
                <Text>Get Started</Text>
              </Button>
            </Link>
          </Card>
        </ScreenWrapper>
      </View>
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
