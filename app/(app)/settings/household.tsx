import { HouseholdMembers } from "@/components/HouseholdMembers";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HouseholdScreen() {
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();
  const insets = useSafeAreaInsets();

  if (!householdId || !currentUser) {
    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: insets.top + 56,
        }}
      >
        <View className="gap-8">
          <Text className="text-base text-gray-500">
            Join or create a household to manage members.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: insets.top + 56,
      }}
    >
      <View className="gap-8">
        <HouseholdMembers
          householdId={householdId}
          currentUserId={currentUser.id}
        />
      </View>
    </ScrollView>
  );
}
