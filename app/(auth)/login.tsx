import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text as RNText,
  View,
} from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);

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
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View>
                <Input
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!form.formState.isSubmitting}
                  className={error ? "border-destructive" : ""}
                />
                {error?.message && (
                  <RNText className="mt-1 text-sm text-destructive">{error.message}</RNText>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View>
                <Input
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="password"
                  editable={!form.formState.isSubmitting}
                  className={error ? "border-destructive" : ""}
                />
                {error?.message && (
                  <RNText className="mt-1 text-sm text-destructive">{error.message}</RNText>
                )}
              </View>
            )}
          />

          <Button variant="secondary" onPress={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="mt-2">
            {form.formState.isSubmitting ? (
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
