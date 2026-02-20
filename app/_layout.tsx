import { AuthProvider } from "@/contexts/auth-context";
import { MonthProvider } from "@/contexts/month-context";
import { UserProvider } from "@/contexts/user-context";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <MonthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </MonthProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
