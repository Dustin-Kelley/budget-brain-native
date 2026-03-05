import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { View } from "react-native";

export default function CheckEmailScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="w-full max-w-[400px] items-center gap-4">
        <View className="mb-2 items-center justify-center rounded-full bg-muted" style={{ width: 80, height: 80 }}>
          <Ionicons name="mail-outline" size={40} color="#6b7280" />
        </View>

        <Text className="text-center text-2xl font-bold">Check your email</Text>
        <Text className="text-center text-muted-foreground">
          We sent you a confirmation link. Verify your email to continue.
        </Text>

        <Button
          variant="secondary"
          onPress={() => router.replace("/(auth)/login")}
          className="mt-4 w-full"
        >
          <Text>Back to Login</Text>
        </Button>
      </View>
    </View>
  );
}
