import { AddExpenseForm } from "@/components/AddExpenseForm";
import { BudgetSetupWizard } from "@/components/BudgetSetupWizard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PlanCategoryCards } from "@/components/PlanCategoryCards";
import { RemainingSpentCards } from "@/components/RemainingSpentCards";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TransactionsList } from "@/components/TransactionsList";
import { useMonth } from "@/contexts/month-context";
import { useAutoRollover } from "@/hooks/useAutoRollover";
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

  const { isRollingOver } = useAutoRollover();
  const [activeTab, setActiveTab] = useState("planned");
  const [wizardDismissed, setWizardDismissed] = useState(false);

  const hasBudgetThisMonth = totalPlanned > 0;
  const showWizard = !hasBudgetThisMonth && !wizardDismissed;

  if (householdLoading || planLoading || isRollingOver) {
    return (
      <LoadingSpinner />
    );
  }


  if (showWizard && householdId && currentUser?.id) {
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
        onComplete={() => setWizardDismissed(true)}
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
