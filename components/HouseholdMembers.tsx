import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { addHouseholdMember } from "@/lib/mutations/addHouseholdMember";
import { removeHouseholdMember } from "@/lib/mutations/removeHouseholdMember";
import { getHouseholdMembers } from "@/lib/queries/getHouseholdMembers";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";

type HouseholdMembersProps = {
  householdId: string;
  currentUserId: string;
};

export function HouseholdMembers({
  householdId,
  currentUserId,
}: HouseholdMembersProps) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["householdMembers", householdId],
    queryFn: () => getHouseholdMembers({ householdId }),
    enabled: !!householdId,
  });

  const members = data?.members ?? [];

  const handleAdd = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Email required", "Please enter an email address.");
      return;
    }

    setIsAdding(true);
    const { error } = await addHouseholdMember({
      email: trimmed,
      householdId,
    });
    setIsAdding(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    setEmail("");
    queryClient.invalidateQueries({ queryKey: ["householdMembers"] });
  };

  const handleRemove = (userId: string, memberEmail: string | null) => {
    Alert.alert(
      "Remove member?",
      `Remove ${memberEmail ?? "this member"} from your household?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const { error } = await removeHouseholdMember({ userId });
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
            queryClient.invalidateQueries({ queryKey: ["householdMembers"] });
          },
        },
      ]
    );
  };

  return (
    <View className="gap-4">
      <Text className="text-base font-semibold text-gray-900">
        Household Members
      </Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View className="gap-2">
          {members.map((member) => (
            <View
              key={member.id}
              className="flex-row items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
            >
              <Text className="text-gray-700">
                {member.email ?? "Unknown"}
                {member.id === currentUserId ? " (you)" : ""}
              </Text>
              {member.id !== currentUserId && (
                <Pressable
                  onPress={() => handleRemove(member.id, member.email)}
                  hitSlop={12}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      <View className="gap-2">
        <Label>Add member by email</Label>
        <View className="flex-row gap-2">
          <Input
            className="flex-1 rounded-lg px-4 py-3"
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isAdding}
          />
          <Button onPress={handleAdd} disabled={isAdding} className="px-4">
            {isAdding ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Add</Text>
            )}
          </Button>
        </View>
      </View>
    </View>
  );
}
