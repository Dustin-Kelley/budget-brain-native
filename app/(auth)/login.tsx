import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

export default function LoginScreen() {
  const { sendOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    const { error } = await sendOtp(trimmed);
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.push({ pathname: "/(auth)/verify-otp", params: { email: trimmed } });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-background px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full max-w-[400px] self-center">
        <Logo />
        <Text className="mt-4 text-center text-3xl font-bold">Budget Brain</Text>
        <Text className="mb-8 text-center text-lg text-muted-foreground">
          Enter your email to get started
        </Text>

        <View className="gap-4">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!isSubmitting}
          />

          <Button variant="secondary" onPress={handleSubmit} disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Continue</Text>
            )}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
