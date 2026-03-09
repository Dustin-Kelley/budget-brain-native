import { AddIncomeTransactionForm } from "@/components/AddIncomeTransactionForm";
import { AnimatedProgressBar } from "@/components/AnimatedProgressBar";
import { EditIncomeTransactionForm } from "@/components/EditIncomeTransactionForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatCurrency } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Separator } from "./ui/separator";

type IncomeTrackingCardProps = {
  income: { id: string; name: string | null; amount: number }[];
  totalIncome: number;
  totalReceived: number;
  receivedByIncomeId: Record<string, number>;
  incomeTransactions: {
    id: string;
    income_id: string;
    amount: number;
    date: string | null;
    description: string | null;
  }[];
  error?: string | null;
  householdId?: string;
  userId?: string;
  monthKey?: string;
  onRefetch?: () => void;
};

export function IncomeTrackingCard({
  income,
  totalIncome,
  totalReceived,
  receivedByIncomeId,
  incomeTransactions,
  error,
  householdId,
  userId,
  monthKey,
  onRefetch,
}: IncomeTrackingCardProps) {
  const [trackingIncomeId, setTrackingIncomeId] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    amount: number;
    date: string | null;
    description: string | null;
  } | null>(null);
  const [expandedIncomeId, setExpandedIncomeId] = useState<string | null>(null);

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-800">Income Tracking</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading data</Text>
      </Card>
    );
  }

  if (income.length === 0) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-800">Income Tracking</Text>
        <Text className="mt-2 text-sm text-gray-500">
          No income sources planned. Add income on the Planned tab first.
        </Text>
      </Card>
    );
  }

  const overallPercent = totalIncome > 0 ? Math.min(Math.round((totalReceived / totalIncome) * 100), 100) : 0;
  const isFullyReceived = totalReceived >= totalIncome;

  return (
    <View className="gap-4">

      <Card className="gap-0 py-3">
        <CardHeader className="border-b border-gray-100 px-6 py-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-800">Total Income</Text>
            <Text
              className={`text-base font-medium ${isFullyReceived ? "text-green-600" : "text-gray-800"}`}
            >
              {formatCurrency(totalReceived, { fractionDigits: 2 })} / {formatCurrency(totalIncome, { fractionDigits: 2 })}
            </Text>
          </View>
          {totalIncome > 0 && (
            <AnimatedProgressBar
              percent={overallPercent}
              height={8}
              color={isFullyReceived ? "#16a34a" : "#3b82f6"}
              className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100"
            />
          )}
          <Text className="text-sm text-gray-500">
            {overallPercent}% received
          </Text>
        </CardHeader>

        <CardContent className="gap-0">
          {income.map((entry) => {
            const received = receivedByIncomeId[entry.id] ?? 0;
            const entryPercent = entry.amount > 0 ? Math.min(Math.round((received / entry.amount) * 100), 100) : 0;
            const entryFullyReceived = received >= entry.amount;
            const isExpanded = expandedIncomeId === entry.id;
            const entryTransactions = incomeTransactions.filter(
              (tx) => tx.income_id === entry.id
            );

            return (
              <View key={entry.id} className="border-t border-gray-50">
                <Pressable
                  onPress={() => setExpandedIncomeId(isExpanded ? null : entry.id)}
                  className="gap-2 py-3 active:bg-gray-50"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-2">
                      <Ionicons
                        name={isExpanded ? "chevron-down" : "chevron-forward"}
                        size={16}
                        color="#9ca3af"
                      />
                      <Text className="text-lg text-gray-700" numberOfLines={1}>
                        {entry.name ?? "Income"}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-base font-medium ${entryFullyReceived ? "text-green-600" : "text-gray-500"}`}
                      >
                        {formatCurrency(received, { fractionDigits: 2 })} / {formatCurrency(entry.amount, { fractionDigits: 2 })}
                      </Text>
                      {householdId && userId && monthKey && onRefetch && (
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            setTrackingIncomeId({ id: entry.id, name: entry.name ?? "Income" });
                          }}
                          hitSlop={4}
                          className="h-8 w-8 items-center justify-center rounded-full bg-green-50 active:bg-green-100"
                        >
                          <Ionicons name="add" size={18} color="#16a34a" />
                        </Pressable>
                      )}
                    </View>
                  </View>
                  {entry.amount > 0 && (
                    <AnimatedProgressBar
                      percent={entryPercent}
                      height={6}
                      color={entryFullyReceived ? "#16a34a" : "#3b82f6"}
                      className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                    />
                  )}
                </Pressable>

                {isExpanded && (
                  <View className="mb-2 ml-6 rounded-lg bg-gray-50 px-3 py-1">
                    {entryTransactions.length === 0 ? (
                      <Text className="py-2 text-sm text-gray-400">No payments recorded yet</Text>
                    ) : (
                      entryTransactions.map((tx) => (
                        <View key={tx.id}>
                          <Pressable
                            onPress={() => setEditingTransaction(tx)}
                            className="flex-row items-center justify-between py-2 active:opacity-70"
                          >
                            <View className="flex-1">
                              <Text className="text-sm text-gray-700" numberOfLines={1}>
                                {tx.description || "Payment"}
                              </Text>
                              {tx.date && (
                                <Text className="text-xs text-gray-400">
                                  {new Date(tx.date).toLocaleDateString()}
                                </Text>
                              )}
                            </View>
                            <Text className="text-sm font-medium text-green-600">
                              {formatCurrency(tx.amount, { fractionDigits: 2 })}
                            </Text>
                          </Pressable>
                          <Separator />
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </CardContent>
      </Card>

      {trackingIncomeId && householdId && userId && monthKey && onRefetch && (
        <AddIncomeTransactionForm
          incomeId={trackingIncomeId.id}
          incomeName={trackingIncomeId.name}
          householdId={householdId}
          userId={userId}
          monthKey={monthKey}
          visible
          onClose={() => setTrackingIncomeId(null)}
          onSuccess={() => {
            onRefetch();
            setTrackingIncomeId(null);
          }}
        />
      )}

      {editingTransaction && (
        <EditIncomeTransactionForm
          transaction={editingTransaction}
          visible
          onClose={() => setEditingTransaction(null)}
          onSuccess={() => {
            onRefetch?.();
            setEditingTransaction(null);
          }}
        />
      )}
    </View>
  );
}
