import { MonthSelector } from "@/components/MonthSelector";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function PlanScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-2">
        <MonthSelector />
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-xl font-semibold text-gray-900">Plan</Text>
        <Text className="mt-2 text-center text-gray-500">
          Budget planning (income, categories, transactions) will go here.
        </Text>
      </View>
    </View>
  );
}
