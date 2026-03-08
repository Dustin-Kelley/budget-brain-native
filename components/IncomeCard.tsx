import { AddIncomeForm } from "@/components/AddIncomeForm";
import { EditIncomeForm } from "@/components/EditIncomeForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Separator } from "./ui/separator";

type IncomeCardProps = {
  income: { id: string; name: string | null; amount: number }[];
  totalIncome: number;
  totalPlanned: number;
  monthLabel: string;
  error?: string | null;
  householdId?: string;
  userId?: string;
  monthKey?: string;
  onRefetch?: () => void;
};

export function IncomeCard({
  income,
  totalIncome,
  totalPlanned,
  monthLabel,
  error,
  householdId,
  userId,
  monthKey,
  onRefetch,
}: IncomeCardProps) {
  const [editingIncome, setEditingIncome] = useState<{
    id: string;
    name: string | null;
    amount: number;
  } | null>(null);

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <CardHeader className="px-4">
          <CardTitle className="text-lg text-gray-800">Income</CardTitle>
          <CardDescription className="text-red-600">Error loading income</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const remaining = totalIncome - totalPlanned;

  return (
    <Card className="gap-0 py-4">
      <CardHeader className="border-b border-gray-100 px-4 py-2">
        <CardDescription>Total Income for: {monthLabel}</CardDescription>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {formatCurrency(totalIncome, { fractionDigits: 2 })}
        </CardTitle>
      </CardHeader>
      {income.length > 0 && (
        <CardContent className="border-b border-gray-100 px-4 py-0">
          {income.map((entry) => (
            <View key={entry.id}>
              <Pressable
                onPress={() => onRefetch && setEditingIncome(entry)}
                className="flex-row items-center justify-between border-b border-gray-50 py-2.5 last:border-b-0 active:bg-gray-50"
              >
                <Text className="text-lg text-gray-700" numberOfLines={1}>
                  {entry.name ?? "Income"}
                </Text>
                <View className="rounded-md bg-gray-100 px-2.5 py-1">
                  <Text className="font-medium text-gray-800">
                    {formatCurrency(entry.amount, { fractionDigits: 2 })}
                  </Text>
                </View>
              </Pressable>
              <Separator />
            </View>
          ))}
        </CardContent>
      )}
      {householdId && userId && monthKey && onRefetch && (
        <CardContent className="border-b border-gray-100 px-4 py-4">
          <AddIncomeForm
            householdId={householdId}
            userId={userId}
            monthKey={monthKey}
            onSuccess={onRefetch}
          />
        </CardContent>
      )}
      <CardContent className="px-4 py-2">
        <Text
          className={`text-md mt-2 font-medium ${remaining < 0 ? "text-red-600" : "text-green-600"}`}
        >
          {remaining < 0 ? "-" : ""}
          {formatCurrency(Math.abs(remaining), { fractionDigits: 2 })}{" "}
          {remaining < 0 ? "over budget" : "left to budget"}
        </Text>
      </CardContent>
      {editingIncome && onRefetch && (
        <EditIncomeForm
          income={editingIncome}
          visible
          onClose={() => setEditingIncome(null)}
          onSuccess={() => {
            onRefetch();
            setEditingIncome(null);
          }}
        />
      )}
    </Card>
  );
}
