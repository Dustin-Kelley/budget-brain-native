import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BudgetAllocationChart } from "@/components/BudgetAllocationChart";
import { BudgetSetupWizard } from "@/components/BudgetSetupWizard";
import { IncomeTrackingCard } from "@/components/IncomeTrackingCard";
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
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
    incomeTransactions,
    totalReceived,
    receivedByIncomeId,
    isLoading: planLoading,
    error,
    refetch,
  } = useBudgetPlan();

  const { rollover, isRollingOver, isError } = useRolloverBudget();
  const [activeTab, setActiveTab] = useState("planned");
  const [wizardDismissed, setWizardDismissed] = useState(false);

  const hasBudgetThisMonth = totalPlanned > 0;
  const showEmptyState = !hasBudgetThisMonth && !wizardDismissed;



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
                  Looks like you don&apos;t have a budget for {monthLabel}. Roll over
                  your previous budget or start fresh.
                </Text>
                {isError && (
                  <Text className="text-sm text-destructive">
                    {"Something went wrong. Please refresh and try again."}
                  </Text>
                )}
              </CardHeader>
              <CardContent className="gap-3">
                <Button onPress={() => rollover()}>
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
            <Animated.View key="planned" entering={FadeIn.duration(200)} exiting={FadeOut.duration(100)} className="gap-6">
              <Text className="text-lg font-semibold text-gray-800">Plan your budget</Text>

              <BudgetAllocationChart
                categories={categories}
                totalIncome={totalIncome}
              />
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
            </Animated.View>
          )}
          {activeTab === "remaining" && (
            <Animated.View key="remaining" entering={FadeIn.duration(200)} exiting={FadeOut.duration(100)} className="gap-6">
              <Text className="text-lg font-semibold text-gray-800">Track your spending</Text>
              <IncomeTrackingCard
                income={income}
                totalIncome={totalIncome}
                totalReceived={totalReceived}
                receivedByIncomeId={receivedByIncomeId}
                incomeTransactions={incomeTransactions}
                error={error?.message}
                householdId={householdId ?? undefined}
                userId={currentUser?.id}
                monthKey={monthKey}
                onRefetch={refetch}
              />
              <RemainingSpentCards
                categories={categories}
                spentByLineItem={spentByLineItem}
                error={error?.message}
                householdId={householdId ?? undefined}
                userId={currentUser?.id}
                monthKey={monthKey}
                onSuccess={refetch}
              />
            </Animated.View>
          )}
          {activeTab === "transactions" && (
            <Animated.View key="transactions" entering={FadeIn.duration(200)} exiting={FadeOut.duration(100)}>
              <Text className="text-lg font-semibold text-gray-800">Transaction history</Text>
              <Text className="mb-4 text-sm text-gray-500">
                Your latest spending activities
              </Text>
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
            </Animated.View>
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
