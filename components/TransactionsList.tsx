import { EditTransactionForm } from "@/components/EditTransactionForm";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { CategoryWithLineItems } from "@/types";
import { useState } from "react";
import { Pressable, View } from "react-native";

type TransactionItem = {
  id?: string;
  amount: number | null;
  date: string | null;
  description: string | null;
  line_item_id?: string | null;
  line_items?: { name?: string | null } | null;
};

type TransactionsListProps = {
  groupedTransactions: Record<string, TransactionItem[]>;
  sortedDates: string[];
  categories: CategoryWithLineItems[] | null;
  householdId?: string;
  userId?: string;
  monthKey?: string;
  onRefetch?: () => void;
  error?: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateStr: string): string {
  if (dateStr === "Unknown Date") return "Unknown Date";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function TransactionsList({
  groupedTransactions,
  sortedDates,
  categories,
  householdId,
  userId,
  monthKey,
  onRefetch,
  error,
}: TransactionsListProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionItem | null>(null);
  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-900">Transactions</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading transactions</Text>
      </Card>
    );
  }

  if (sortedDates.length === 0) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-900">Recent Transactions</Text>
        <Text className="mt-2 text-sm text-gray-500">No transactions found.</Text>
      </Card>
    );
  }

  return (
    <View className="gap-4">
      <Text className="font-semibold text-gray-900">Recent Transactions</Text>
      <Text className="-mt-2 text-sm text-gray-500">
        Your latest spending activities
      </Text>
      {sortedDates.map((dateKey) => (
        <Card
          key={dateKey}
          className="gap-0 overflow-hidden py-0"
        >
          <View className="border-b border-gray-100 bg-gray-50 px-4 py-2">
            <Text className="text-sm font-medium text-gray-600">
              {formatDate(dateKey)}
            </Text>
          </View>
          {(groupedTransactions[dateKey] ?? []).map((tx) => (
            <Pressable
              key={tx.id ?? `${dateKey}-${tx.date}-${tx.amount}`}
              onPress={() =>
                householdId &&
                userId &&
                monthKey &&
                onRefetch &&
                setEditingTransaction(tx)
              }
              className="flex-row items-center justify-between border-b border-gray-50 px-4 py-3 last:border-b-0 active:bg-gray-50"
            >
              <View className="flex-1">
                <Text className="font-medium text-gray-900" numberOfLines={1}>
                  {tx.line_items?.name ?? "Uncategorized"}
                </Text>
                {tx.description && (
                  <Text
                    className="mt-0.5 text-sm text-gray-500"
                    numberOfLines={1}
                  >
                    {tx.description}
                  </Text>
                )}
              </View>
              <Text className="ml-2 font-medium text-gray-900">
                {formatCurrency(tx.amount ?? 0)}
              </Text>
            </Pressable>
          ))}
        </Card>
      ))}
      {editingTransaction &&
        householdId &&
        userId &&
        monthKey &&
        onRefetch && (
          <EditTransactionForm
            transaction={editingTransaction}
            categories={categories}
            householdId={householdId}
            userId={userId}
            monthKey={monthKey}
            visible
            onClose={() => setEditingTransaction(null)}
            onSuccess={() => {
              onRefetch();
              setEditingTransaction(null);
            }}
          />
        )}
    </View>
  );
}
