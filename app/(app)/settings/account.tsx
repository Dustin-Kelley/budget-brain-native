import { BackButton } from "@/components/BackButton";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { router } from "expo-router";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const { currentUser } = useCurrentUser();
  const insets = useSafeAreaInsets();

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

  const fullName = [currentUser?.first_name, currentUser?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <View
      className="flex-1 justify-between"
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
          <View>
            <Text className="text-sm text-gray-500">First Name</Text>
            <Text className="mt-1 text-base font-medium text-gray-800">
              {currentUser?.first_name ?? "\u2014"}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Last Name</Text>
            <Text className="mt-1 text-base font-medium text-gray-800">
              {currentUser?.last_name ?? "\u2014"}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="mt-1 text-base font-medium text-gray-800">
              {user?.email ?? "\u2014"}
            </Text>
          </View>
        </View>
      </View>

      <Button variant="destructive" onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
