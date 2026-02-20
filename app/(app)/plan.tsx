import { IncomeCard } from "@/components/IncomeCard";
import { MonthSelector } from "@/components/MonthSelector";
import { PlanCategoryCards } from "@/components/PlanCategoryCards";
import { RemainingSpentCards } from "@/components/RemainingSpentCards";
import { TransactionsList } from "@/components/TransactionsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useBudgetPlan } from "@/hooks/useBudgetPlan";
import { useHousehold } from "@/hooks/useHousehold";
import { formatMonthYearForDisplay } from "@/lib/utils";
import { useMonth } from "@/contexts/month-context";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useState } from "react";

export default function PlanScreen() {
  const { householdId, isLoading: householdLoading } = useHousehold();
  const { monthKey } = useMonth();
  const monthLabel = formatMonthYearForDisplay(monthKey);

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
        <MonthSelector />
        <View className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <Text className="text-center text-lg font-semibold text-gray-900">
            No household set up
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Your account isn’t linked to a household yet. Use the web app to
            create or join a household.
          </Text>
        </View>
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
        <IncomeCard
          income={income}
          totalIncome={totalIncome}
          totalPlanned={totalPlanned}
          monthLabel={monthLabel}
          error={error?.message}
        />

        <View>
          <Text className="mb-2 text-base font-semibold text-gray-900">
            Budget Details
          </Text>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="planned" className="flex-1">
                <Text>Planned</Text>
              </TabsTrigger>
              <TabsTrigger value="remaining" className="flex-1">
                <Text>Remaining</Text>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex-1">
                <Text>Transactions</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="planned">
              <PlanCategoryCards
                categories={categories}
                totalIncome={totalIncome}
                error={error?.message}
              />
            </TabsContent>
            <TabsContent value="remaining">
              <RemainingSpentCards
                categories={categories}
                spentByLineItem={spentByLineItem}
                error={error?.message}
              />
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionsList
                groupedTransactions={groupedTransactions}
                sortedDates={sortedDates}
                error={error?.message}
              />
            </TabsContent>
          </Tabs>
        </View>
      </View>
    </ScrollView>
  );
}
