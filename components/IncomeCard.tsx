import { Text } from "@/components/ui/text";
import { View } from "react-native";

type IncomeCardProps = {
  income: { id: string; name: string | null; amount: number }[];
  totalIncome: number;
  totalPlanned: number;
  monthLabel: string;
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

export function IncomeCard({
  income,
  totalIncome,
  totalPlanned,
  monthLabel,
  error,
}: IncomeCardProps) {
  if (error) {
    return (
      <View className="rounded-xl border border-gray-200 bg-white p-4">
        <Text className="font-semibold text-gray-900">Income</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading income</Text>
      </View>
    );
  }

  const remaining = totalIncome - totalPlanned;

  return (
    <View className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <View className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        <Text className="text-sm font-medium text-gray-500">
          Total Income for: {monthLabel}
        </Text>
        <Text className="mt-1 text-2xl font-bold text-gray-900">
          {formatCurrency(totalIncome)}
        </Text>
      </View>
      {income.length > 0 && (
        <View className="border-b border-gray-100 px-4 py-3">
          {income.map((entry) => (
            <View
              key={entry.id}
              className="flex-row justify-between py-2"
            >
              <Text className="text-gray-700" numberOfLines={1}>
                {entry.name ?? "Income"}
              </Text>
              <Text className="font-medium text-gray-900">
                {formatCurrency(entry.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View className="px-4 py-3">
        <Text
          className={`text-sm font-medium ${remaining < 0 ? "text-red-600" : "text-green-600"}`}
        >
          {remaining < 0 ? "-" : ""}
          {formatCurrency(Math.abs(remaining))}{" "}
          {remaining < 0 ? "over budget" : "left to budget"}
        </Text>
      </View>
    </View>
  );
}
