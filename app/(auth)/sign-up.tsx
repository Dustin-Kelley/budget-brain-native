import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
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

export default function SignUpScreen() {
  const { signUp } = useAuth();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { error } = await signUp(data.email, data.password);

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
                  placeholder="Password (min 8 characters)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="new-password"
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
