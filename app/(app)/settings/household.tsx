import { BackButton } from "@/components/BackButton";
import { HouseholdMembers } from "@/components/HouseholdMembers";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { ScrollView, View } from "react-native";

export default function HouseholdScreen() {
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();

  const header = (
    <View className="flex-row items-center gap-2">
      <BackButton />
      <Text variant="h3" className="items-center">Household</Text>
    </View>
  );

  if (!householdId || !currentUser) {
    return (
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <View className="gap-6">
          {header}
          <Text className="text-base text-gray-500">
            Join or create a household to manage members.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-6">
        {header}
      <HouseholdMembers
        householdId={householdId}
        currentUserId={currentUser.id}
      />
      </View>
    </ScrollView>
  );
}
