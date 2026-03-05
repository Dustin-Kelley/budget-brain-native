import { AddExpenseForm } from "@/components/AddExpenseForm";
import { AppHeader } from "@/components/AppHeader";
import { PlanCategoryCards } from "@/components/PlanCategoryCards";
import { PlanHeader } from "@/components/PlanHeader";
import { PlanTabBar } from "@/components/PlanTabBar";
import { RemainingSpentCards } from "@/components/RemainingSpentCards";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TransactionsList } from "@/components/TransactionsList";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useMonth } from "@/contexts/month-context";
import { useBudgetPlan } from "@/hooks/useBudgetPlan";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { formatMonthYearForDisplay } from "@/lib/utils";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

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

  const [activeTab, setActiveTab] = useState("planned");

  if (householdLoading || planLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!householdId) {
    return (
      <View className="flex-1 bg-gray-50 p-6">
        <AppHeader />
        <Card className="gap-0 p-6">
          <Text className="text-center text-lg font-semibold text-gray-900">
            No household set up
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Your account isn’t linked to a household yet. Use the web app to
            create or join a household.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScreenWrapper
        customHeader={({ animatedStyle, headerHeight }) => (
          <PlanHeader animatedStyle={animatedStyle} headerHeight={headerHeight}>
            <PlanTabBar value={activeTab} onValueChange={setActiveTab} />
          </PlanHeader>
        )}
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
