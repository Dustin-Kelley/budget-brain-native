import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
      <Stack.Screen name="appearance" options={{ title: "Appearance" }} />
      <Stack.Screen name="budget" options={{ title: "Budget" }} />
      <Stack.Screen name="household" options={{ title: "Household" }} />
    </Stack>
  );
}
