import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useAddHouseholdMember } from "@/hooks/useAddHouseholdMember";
import { useRemoveHouseholdMember } from "@/hooks/useRemoveHouseholdMember";
import { getHouseholdMembers } from "@/lib/queries/getHouseholdMembers";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
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
  const addMember = useAddHouseholdMember();
  const removeMember = useRemoveHouseholdMember();
  const [email, setEmail] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["householdMembers", householdId],
    queryFn: async () => {
      const { members, error } = await getHouseholdMembers({ householdId });
      if (error) throw error;
      return { members };
    },
    enabled: !!householdId,
  });

  const members = data?.members ?? [];

  const handleAdd = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Email required", "Please enter an email address.");
      return;
    }

    try {
      await addMember.mutateAsync({
        email: trimmed,
        householdId,
      });
      setEmail("");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
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
            try {
              await removeMember.mutateAsync({ userId });
            } catch (error) {
              Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="gap-4">
      <Text className="text-base font-semibold text-gray-800">
        Household Members
      </Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View className="rounded-2xl overflow-hidden bg-card">
          {members.map((member, index) => (
            <View
              key={member.id}
              className={`flex-row items-center justify-between px-4 py-3.5 ${index < members.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <View className="flex-row items-center gap-3">
                <UserAvatar emoji={member.avatar_emoji} size="sm" />
                <Text className="text-gray-700">
                  {member.email ?? "Unknown"}
                  {member.id === currentUserId ? " (you)" : ""}
                </Text>
              </View>
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
            editable={!addMember.isPending}
          />
          <Button onPress={handleAdd} disabled={addMember.isPending} className="px-4">
            {addMember.isPending ? (
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
