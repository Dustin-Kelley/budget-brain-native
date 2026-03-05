import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmed);
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert(
      "Check your email",
      "If an account exists with that email, you'll receive a password reset link."
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-background px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full max-w-[400px] self-center">
        <Text className="text-center text-3xl font-bold">Reset Password</Text>
        <Text className="mb-8 text-center text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
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

          <Button onPress={handleSubmit} disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Send Reset Link</Text>
            )}
          </Button>
        </View>

        <View className="mt-6 items-center">
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-sm font-semibold">Back to Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
