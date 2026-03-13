import { EditTransactionForm } from "@/components/EditTransactionForm";
import { UserAvatar } from "@/components/UserAvatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { CATEGORY_COLORS } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { CategoryWithLineItems } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

type TransactionItem = {
  id?: string;
  amount: number | null;
  date: string | null;
  description: string | null;
  note?: string | null;
  line_item_id?: string | null;
  line_items?: { name?: string | null } | null;
  users?: { avatar_emoji?: string | null; first_name?: string | null } | null;
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
  const [searchQuery, setSearchQuery] = useState("");

  const lineItemColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!categories) return map;
    categories.forEach((cat, catIndex) => {
      const color = cat.color ?? CATEGORY_COLORS[catIndex % CATEGORY_COLORS.length];
      for (const item of cat.line_items ?? []) {
        map[item.id] = color;
      }
    });
    return map;
  }, [categories]);

  const { filteredDates, filteredGrouped } = useMemo(() => {
    if (!searchQuery.trim()) {
      return { filteredDates: sortedDates, filteredGrouped: groupedTransactions };
    }
    const query = searchQuery.trim().toLowerCase();
    const filteredGrouped: Record<string, TransactionItem[]> = {};
    const filteredDates: string[] = [];
    for (const date of sortedDates) {
      const matches = (groupedTransactions[date] ?? []).filter((tx) =>
        (tx.line_items?.name ?? "Uncategorized").toLowerCase().includes(query)
      );
      if (matches.length > 0) {
        filteredGrouped[date] = matches;
        filteredDates.push(date);
      }
    }
    return { filteredDates, filteredGrouped };
  }, [searchQuery, sortedDates, groupedTransactions]);

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-800">Transactions</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading transactions</Text>
      </Card>
    );
  }

  if (sortedDates.length === 0) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-800">Recent Transactions</Text>
        <Text className="mt-2 text-sm text-gray-500">No transactions found.</Text>
      </Card>
    );
  }

  return (
    <View className="gap-4">
      <View className="relative">
        <View className="absolute left-4 top-0 bottom-0 z-10 justify-center">
          <Ionicons name="search" size={18} color="#9CA3AF" />
        </View>
        <Input
          className="rounded-full pl-12"
          placeholder="Search by line item..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery("")}
            className="absolute right-4 top-0 bottom-0 justify-center"
          >
            <Text className="text-lg text-gray-400">✕</Text>
          </Pressable>
        )}
      </View>
      {filteredDates.length === 0 && searchQuery.trim().length > 0 && (
        <Card className="gap-0 p-4">
          <Text className="text-sm text-gray-500">No matching transactions found.</Text>
        </Card>
      )}
      {filteredDates.map((dateKey) => (
        <Card key={dateKey} className="gap-0">
          <CardHeader className="border-b border-gray-100 py-4">
            <Text className="text-xs font-bold uppercase tracking-wide text-gray-800">
              {formatDate(dateKey)}
            </Text>
          </CardHeader>
          <CardContent className="py-0">
            {(filteredGrouped[dateKey] ?? []).map((tx, index, arr) => (
              <Pressable
                key={tx.id ?? `${dateKey}-${tx.date}-${tx.amount}`}
                onPress={() =>
                  householdId &&
                  userId &&
                  monthKey &&
                  onRefetch &&
                  setEditingTransaction(tx)
                }
                className={cn(
                  "flex-row items-center justify-between py-3.5 active:bg-gray-50",
                  index < arr.length - 1 && "border-b border-gray-50"
                )}
              >
                <View className="mr-3">
                  <UserAvatar emoji={tx.users?.avatar_emoji} size="sm" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: tx.line_item_id
                          ? lineItemColorMap[tx.line_item_id] ?? "#9CA3AF"
                          : "#9CA3AF",
                      }}
                    />
                    <Text className="font-medium text-gray-800" numberOfLines={1}>
                      {tx.line_items?.name ?? "Uncategorized"}
                    </Text>
                  </View>
                  {tx.description && (
                    <Text
                      className="mt-0.5 text-sm text-gray-500"
                      numberOfLines={1}
                    >
                      {tx.description}
                    </Text>
                  )}
                  {tx.note && (
                    <Text className="mt-0.5 text-xs text-gray-400 italic" numberOfLines={1}>
                      {tx.note}
                    </Text>
                  )}
                </View>
                <Text className="ml-2 font-medium text-gray-800">
                  {formatCurrency(tx.amount ?? 0, { fractionDigits: 2 })}
                </Text>
              </Pressable>
            ))}
          </CardContent>
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
