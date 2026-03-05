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

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Login failed", "Invalid credentials. Please try again.");
      return;
    }

    router.replace("/");
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
          Welcome back
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            editable={!isSubmitting}
          />

          <Button variant="secondary" onPress={handleSubmit} disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Login</Text>
            )}
          </Button>
        </View>

        <View className="mt-4 items-center">
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <Text className="text-sm font-semibold">Forgot Password?</Text>
            </Pressable>
          </Link>
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
          </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text className="text-sm font-semibold">Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
