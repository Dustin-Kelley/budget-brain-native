import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: true,
          headerBlurEffect: "systemMaterial",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="appearance"
        options={{
          title: "Appearance",
          headerShown: true,
          headerBlurEffect: "systemMaterial",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="budget"
        options={{
          title: "Budget",
          headerShown: true,
          headerBlurEffect: "systemMaterial",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="household"
        options={{
          title: "Household",
          headerShown: true,
          headerBlurEffect: "systemMaterial",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="avatar"
        options={{
          title: "Avatar",
          headerShown: true,
          headerBlurEffect: "systemMaterial",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
