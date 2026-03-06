import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, View } from "react-native";
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
        <Pressable className="items-center gap-2" onPress={() => router.push("/(app)/settings/avatar")}>
          <UserAvatar emoji={currentUser?.avatar_emoji} size="lg" />
          <Text className="text-sm text-gray-500">Tap to change avatar</Text>
        </Pressable>

        <View className="bg-card rounded-2xl px-5 py-4">
          <Text className="text-sm text-gray-500">Email</Text>
          <Text className="mt-1 text-base font-medium text-gray-800">
            {user?.email ?? "\u2014"}
          </Text>
        </View>

        <Button variant="destructive" onPress={handleSignOut} className="mt-2">
          <Text>Sign Out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
