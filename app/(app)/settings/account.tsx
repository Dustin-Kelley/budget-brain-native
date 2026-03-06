import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { router } from "expo-router";
import { Alert, ScrollView, View } from "react-native";

export default function AccountScreen() {
  const { user, signOut } = useAuth();

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
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-6">
        <View className="flex-row items-center gap-2">
          <BackButton />
          <Text variant="h3" className="items-center">Account Settings</Text>
        </View>


        <View className="gap-6">
          <View className="gap-1">
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="text-base font-medium text-gray-900">
              {user?.email ?? "\u2014"}
            </Text>
          </View>

          <View className="gap-3">
            <Button variant="destructive" onPress={handleSignOut}>
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
