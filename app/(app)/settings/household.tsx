import { HouseholdMembers } from "@/components/HouseholdMembers";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { ScrollView } from "react-native";

export default function HouseholdScreen() {
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();

  if (!householdId || !currentUser) {
    return (
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <Text className="text-base text-gray-500">
          Join or create a household to manage members.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <HouseholdMembers
        householdId={householdId}
        currentUserId={currentUser.id}
      />
    </ScrollView>
  );
}
