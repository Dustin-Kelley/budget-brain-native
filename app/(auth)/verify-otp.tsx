import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOtp, sendOtp } = useAuth();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    const trimmed = code.trim();
    if (trimmed.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit code");
      return;
    }

    setIsSubmitting(true);
    const { error } = await verifyOtp(email!, trimmed);
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Verification failed", "Invalid or expired code. Please try again.");
      return;
    }

    router.replace("/");
  };

  const handleResend = async () => {
    setIsResending(true);
    const { error } = await sendOtp(email!);
    setIsResending(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Code sent", "A new code has been sent to your email.");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-background px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full max-w-[400px] self-center items-center">
        <View
          className="mb-4 items-center justify-center rounded-full bg-muted"
          style={{ width: 80, height: 80 }}
        >
          <Ionicons name="mail-outline" size={40} color="#6b7280" />
        </View>

        <Text className="text-center text-2xl font-bold">Check your email</Text>
        <Text className="mt-2 mb-8 text-center text-muted-foreground">
          We sent a code to {email}
        </Text>

        <View className="w-full gap-4">
          <Input
            placeholder="Enter 6-digit code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            className="text-center text-xl tracking-widest"
          />

          <Button variant="secondary" onPress={handleVerify} disabled={isSubmitting || code.trim().length !== 6}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Verify</Text>
            )}
          </Button>
        </View>

        <Pressable onPress={handleResend} disabled={isResending} className="mt-6">
          <Text className="text-sm font-semibold text-muted-foreground">
            {isResending ? "Sending..." : "Didn't get a code? Resend"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
