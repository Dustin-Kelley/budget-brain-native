import { BackButton } from "@/components/BackButton";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useCancelInvitation } from "@/hooks/useCancelInvitation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { useHouseholdInvitations } from "@/hooks/useHouseholdInvitations";
import { useRemoveHouseholdMember } from "@/hooks/useRemoveHouseholdMember";
import { useSendInvitation } from "@/hooks/useSendInvitation";
import { getHouseholdMembers } from "@/lib/queries/getHouseholdMembers";
import { updateHouseholdName } from "@/lib/mutations/updateHouseholdName";
import { householdSchema, type HouseholdFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HouseholdScreen() {
  const { currentUser } = useCurrentUser();
  const { householdId, household } = useHousehold();

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ["householdMembers", householdId],
    queryFn: async () => {
      const { members, error } = await getHouseholdMembers({ householdId: householdId! });
      if (error) throw error;
      return { members };
    },
    enabled: !!householdId,
  });

  const { invitations, isLoading: invitationsLoading } = useHouseholdInvitations(householdId);
  const removeMember = useRemoveHouseholdMember();
  const cancelInvitation = useCancelInvitation();
  const sendInvitation = useSendInvitation();
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState } = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    values: { name: household?.name ?? "" },
  });

  const updateName = useMutation({
    mutationFn: async (data: HouseholdFormData) => {
      const { error } = await updateHouseholdName({
        householdId: householdId!,
        name: data.name,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household"] });
    },
    onError: (error) => {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    },
  });

  const members = membersData?.members ?? [];

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

  const handleCancelInvitation = (invitationId: string, inviteeEmail: string) => {
    Alert.alert(
      "Cancel invitation?",
      `Cancel the invitation to ${inviteeEmail}?`,
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Cancel Invite",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelInvitation.mutateAsync({ invitationId });
            } catch (error) {
              Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
            }
          },
        },
      ]
    );
  };

  const handleSendInvite = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Email required", "Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (members.some((m) => m.email === trimmed)) {
      Alert.alert("Already a member", "This person is already in your household.");
      return;
    }

    if (invitations.some((inv) => inv.email === trimmed)) {
      Alert.alert("Already invited", "An invitation has already been sent to this email.");
      return;
    }

    try {
      await sendInvitation.mutateAsync({
        householdId: householdId!,
        invitedBy: currentUser!.id,
        email: trimmed,
        householdName: household?.name ?? null,
        inviterName: currentUser?.first_name ?? null,
      });
      setEmail("");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5" edges={["top"]}>
      <View className="gap-4">
        <View className="flex-row items-center gap-3">
          <BackButton />
          <Text className="text-lg font-semibold">Household</Text>
        </View>

        {!householdId || !currentUser ? (
          <Text className="text-base text-gray-500">
            Join or create a household to manage members.
          </Text>
        ) : (
          <View className="gap-6">
            {/* Household Name */}
            <View className="gap-2">
              <Label>Household Name</Label>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View className="gap-2">
                    <View className="flex-row gap-2">
                      <Input
                        className="flex-1 rounded-lg px-4 py-3"
                        placeholder="Household name"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        editable={!updateName.isPending}
                      />
                      <Button
                        onPress={handleSubmit((data) => updateName.mutate(data))}
                        disabled={!formState.isDirty || !formState.isValid || updateName.isPending}
                        className="px-4"
                      >
                        {updateName.isPending ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text>Save</Text>
                        )}
                      </Button>
                    </View>
                    {error?.message && (
                      <Text className="text-sm text-destructive">{error.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Members */}
            <View className="gap-2">
              <Text className="text-base font-semibold text-gray-800">Members</Text>
              {membersLoading ? (
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
                        <View>
                          <Text className="text-gray-700">
                            {member.email ?? "Unknown"}
                            {member.id === currentUser.id ? " (you)" : ""}
                          </Text>
                        </View>
                      </View>
                      {member.id !== currentUser.id && (
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
            </View>

            {/* Pending Invitations */}
            {(invitationsLoading || invitations.length > 0) && (
              <View className="gap-2">
                <Text className="text-base font-semibold text-gray-800">Pending Invitations</Text>
                {invitationsLoading ? (
                  <ActivityIndicator />
                ) : (
                  <View className="rounded-2xl overflow-hidden bg-card">
                    {invitations.map((inv, index) => (
                      <View
                        key={inv.id}
                        className={`flex-row items-center justify-between px-4 py-3.5 ${index < invitations.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        <View className="flex-row items-center gap-3">
                          <View className="h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                            <Ionicons name="mail-outline" size={16} color="#f59e0b" />
                          </View>
                          <View>
                            <Text className="text-gray-700">{inv.email}</Text>
                            <Text className="text-xs text-amber-600">Pending</Text>
                          </View>
                        </View>
                        <Pressable
                          onPress={() => handleCancelInvitation(inv.id, inv.email)}
                          hitSlop={12}
                        >
                          <Ionicons name="close-circle" size={20} color="#ef4444" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Invite Form */}
            <View className="gap-2">
              <Label>Invite by email</Label>
              <View className="flex-row gap-2">
                <Input
                  className="flex-1 rounded-lg px-4 py-3"
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!sendInvitation.isPending}
                />
                <Button onPress={handleSendInvite} disabled={sendInvitation.isPending} className="px-4">
                  {sendInvitation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text>Invite</Text>
                  )}
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
