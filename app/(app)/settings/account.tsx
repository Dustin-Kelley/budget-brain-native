import { BackButton } from "@/components/BackButton";
import { UserAvatar } from "@/components/UserAvatar";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { user, signOut, deleteAccount } = useAuth();
  const { currentUser } = useCurrentUser();
  const { updateUserProfile, isUpdatingUserProfile } = useUpdateUserProfile();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, formState } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: currentUser?.first_name ?? "",
      lastName: currentUser?.last_name ?? "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    if (!user?.id) return;
    updateUserProfile({
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const fullName = [currentUser?.first_name, currentUser?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <View
      className="flex-1 justify-between bg-background"
      style={{
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 49 + 20,
        paddingTop: insets.top + 16,
      }}
    >
      <View className="gap-4">
        <View className="flex-row items-center gap-3">
          <BackButton />
          <Text className="text-lg font-semibold">Account</Text>
        </View>

        <View className="items-center gap-1">
          <UserAvatar emoji={currentUser?.avatar_emoji} size="lg" />
          {fullName ? (
            <Text className="text-lg font-semibold text-gray-800">
              {fullName}
            </Text>
          ) : null}
          <Text className="text-sm text-gray-500">
            {user?.email ?? "\u2014"}
          </Text>
        </View>

        <View className="bg-card rounded-2xl px-5 py-4 gap-4">
          <FormField
            control={control}
            name="firstName"
            label="First Name"
            placeholder="First name"
            autoCapitalize="words"
          />
          <FormField
            control={control}
            name="lastName"
            label="Last Name"
            placeholder="Last name"
            autoCapitalize="words"
          />
          <View>
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="mt-1 text-base font-medium text-gray-800">
              {user?.email ?? "\u2014"}
            </Text>
          </View>
        </View>

      </View>

      <View className="gap-3">
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={!formState.isDirty || !formState.isValid || isUpdatingUserProfile}
        >
          <Text>{isUpdatingUserProfile ? "Saving..." : "Save Changes"}</Text>
        </Button>
        <Button variant="destructive" onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </Button>
        <Button variant="ghost" onPress={handleDeleteAccount}>
          <Text className="text-destructive">Delete Account</Text>
        </Button>
      </View>
    </View>
  );
}
