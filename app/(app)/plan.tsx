import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BudgetSetupWizard } from "@/components/BudgetSetupWizard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PlanCategoryCards } from "@/components/PlanCategoryCards";
import { RemainingSpentCards } from "@/components/RemainingSpentCards";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TransactionsList } from "@/components/TransactionsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useRolloverBudget } from "@/hooks/useAutoRollover";
import { useBudgetPlan } from "@/hooks/useBudgetPlan";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { formatMonthYearForDisplay } from "@/lib/utils";
import { useState } from "react";
import { View } from "react-native";

export default function PlanScreen() {
  const { householdId, isLoading: householdLoading } = useHousehold();
  const { monthKey } = useMonth();
  const monthLabel = formatMonthYearForDisplay(monthKey);

  const { currentUser } = useCurrentUser();
  const {
    categories,
    income,
    totalIncome,
    totalPlanned,
    spentByLineItem,
    groupedTransactions,
    sortedDates,
    isLoading: planLoading,
    error,
    refetch,
  } = useBudgetPlan();

  const { rollover, isRollingOver } = useRolloverBudget();
  const [activeTab, setActiveTab] = useState("planned");
  const [wizardDismissed, setWizardDismissed] = useState(false);
  const [rolloverError, setRolloverError] = useState<string | null>(null);

  const hasBudgetThisMonth = totalPlanned > 0;
  const showEmptyState = !hasBudgetThisMonth && !wizardDismissed;

  async function handleRollover() {
    setRolloverError(null);
    const result = await rollover();
    if (!result.success) {
      setRolloverError(
        result.reason === "no-source"
          ? "No previous budget found to roll over."
          : "Something went wrong. Please try again."
      );
    }
  }

  if (householdLoading || planLoading || isRollingOver) {
    return <LoadingSpinner />;
  }

  if (showEmptyState && householdId && currentUser?.id) {
    return (
      <View className="flex-1">
        <ScreenWrapper header="plan">
          <View className="gap-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">No budget yet</CardTitle>
                <Text className="text-sm text-muted-foreground">
                  Looks like you don't have a budget for {monthLabel}. Roll over
                  your previous budget or start fresh.
                </Text>
              </CardHeader>
              <CardContent className="gap-3">
                {rolloverError && (
                  <Text className="text-sm text-destructive">
                    {rolloverError}
                  </Text>
                )}
                <Button onPress={handleRollover}>
                  <Text>Roll Over Previous Budget</Text>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => setWizardDismissed(true)}
                >
                  <Text>Start From Scratch</Text>
                </Button>
              </CardContent>
            </Card>
          </View>
        </ScreenWrapper>
      </View>
    );
  }

  if (!hasBudgetThisMonth && wizardDismissed && householdId && currentUser?.id) {
    return (
      <BudgetSetupWizard
        householdId={householdId}
        userId={currentUser.id}
        monthKey={monthKey}
        income={income}
        totalIncome={totalIncome}
        categories={categories}
        totalPlanned={totalPlanned}
        monthLabel={monthLabel}
        refetch={refetch}
        onComplete={() => setWizardDismissed(false)}
      />
    );
  }

  return (
    <View className="flex-1">
      <ScreenWrapper
        header="plan"
        planTabValue={activeTab}
        onPlanTabChange={setActiveTab}
      >
        <View className="gap-6">
          {activeTab === "planned" && (
            <PlanCategoryCards
              categories={categories}
              totalIncome={totalIncome}
              totalPlanned={totalPlanned}
              income={income}
              monthLabel={monthLabel}
              error={error?.message}
              householdId={householdId ?? undefined}
              userId={currentUser?.id}
              monthKey={monthKey}
              onRefetch={refetch}
            />
          )}
          {activeTab === "remaining" && (
            <RemainingSpentCards
              categories={categories}
              spentByLineItem={spentByLineItem}
              error={error?.message}
              householdId={householdId ?? undefined}
              userId={currentUser?.id}
              monthKey={monthKey}
              onSuccess={refetch}
            />
          )}
          {activeTab === "transactions" && (
            <TransactionsList
              groupedTransactions={groupedTransactions}
              sortedDates={sortedDates}
              categories={categories}
              householdId={householdId ?? undefined}
              userId={currentUser?.id}
              monthKey={monthKey}
              onRefetch={refetch}
              error={error?.message}
            />
          )}
        </View>
      </ScreenWrapper>
      {householdId && currentUser?.id && (
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
