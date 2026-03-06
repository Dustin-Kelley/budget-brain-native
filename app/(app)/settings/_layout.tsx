import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ title: "Account", headerShown: false }} />
      <Stack.Screen name="appearance" options={{ title: "Appearance", headerShown: false }} />
      <Stack.Screen name="budget" options={{ title: "Budget", headerShown: false }} />
      <Stack.Screen name="household" options={{ title: "Household", headerShown: false }} />
    </Stack>
  );
}
