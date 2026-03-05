import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email, password);
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Sign up failed", error.message);
      return;
    }

    router.replace("/(auth)/check-email");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-background px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full max-w-[400px] self-center">
        <Logo />
        <Text className="mt-4 text-center text-3xl font-bold">Budget Brain</Text>
        <Text className="mb-2 text-center text-lg text-muted-foreground">
          Create an account
        </Text>
        <Text className="mb-6 text-center text-sm text-muted-foreground">
          Enter your email below to create an account
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

          <Input
            placeholder="Password (min 8 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            editable={!isSubmitting}
          />

          <Button variant="secondary" onPress={handleSubmit} disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Create Account</Text>
            )}
          </Button>
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-muted-foreground">
            Already have an account?{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-sm font-semibold">Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
