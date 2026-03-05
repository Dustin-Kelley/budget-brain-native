import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { HouseholdMembers } from "@/components/HouseholdMembers";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { useMonth } from "@/contexts/month-context";
import { useTheme } from "@/contexts/theme-context";
import { headerThemes } from "@/lib/themes";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHousehold } from "@/hooks/useHousehold";
import { resetBudget } from "@/lib/mutations/resetBudget";
import { rolloverBudget } from "@/lib/mutations/rolloverBudget";
import {
  formatMonthYearForDisplay,
  getMonthAndYearNumberFromDate,
  getMonthYearString,
} from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, View } from "react-native";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();
  const { monthKey } = useMonth();
  const { isDark, toggleTheme, headerTheme, setHeaderTheme } = useTheme();
  const queryClient = useQueryClient();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleResetBudget = () => {
    if (!householdId) return;
    const display = formatMonthYearForDisplay(monthKey);
    Alert.alert(
      "Reset Budget",
      `This will delete all categories, budget items, and income for ${display}. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            const { error } = await resetBudget({ householdId, monthKey });
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
            queryClient.invalidateQueries();
            Alert.alert("Done", `Budget for ${display} has been reset.`);
          },
        },
      ]
    );
  };

  const handleRolloverBudget = () => {
    if (!householdId || !currentUser) return;
    const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(monthKey);
    const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;
    const nextYear = monthNumber === 12 ? yearNumber + 1 : yearNumber;
    const toMonthKey = getMonthYearString(nextMonth, nextYear);
    const fromDisplay = formatMonthYearForDisplay(monthKey);
    const toDisplay = formatMonthYearForDisplay(toMonthKey);

    Alert.alert(
      "Rollover Budget",
      `Copy all categories, budget items, and income from ${fromDisplay} to ${toDisplay}? This will replace any existing data in ${toDisplay}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rollover",
          onPress: async () => {
            const { error } = await rolloverBudget({
              householdId,
              fromMonthKey: monthKey,
              toMonthKey,
              userId: currentUser.id,
            });
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
            queryClient.invalidateQueries();
            Alert.alert("Done", `Budget rolled over to ${toDisplay}.`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-6">
        {/* Account Section */}
        <View className="gap-1">
          <Text className="text-sm text-gray-500">Email</Text>
          <Text className="text-base font-medium text-gray-900">
            {user?.email ?? "—"}
          </Text>
        </View>

        {/* Dark Mode */}
        <View className="flex-row items-center justify-between">
          <Text className="text-base text-gray-900">Dark Mode</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        {/* Header Theme */}
        <View className="gap-2">
          <Text className="text-base text-gray-900">Header Theme</Text>
          <View className="flex-row flex-wrap gap-3">
            {headerThemes.map((theme) => (
              <Pressable
                key={theme.id}
                onPress={() => setHeaderTheme(theme.id)}
              >
                <LinearGradient
                  colors={theme.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    borderWidth: headerTheme === theme.id ? 3 : 0,
                    borderColor: isDark ? "#fff" : "#111",
                  }}
                />
                <Text className="mt-1 text-center text-xs text-gray-500">
                  {theme.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Budget Operations */}
        {householdId && (
          <View className="gap-3">
            <Text className="text-base font-semibold text-gray-900">
              Budget for {formatMonthYearForDisplay(monthKey)}
            </Text>
            <Button variant="outline" onPress={handleResetBudget}>
              <Text>Reset Budget</Text>
            </Button>
            <Button variant="outline" onPress={handleRolloverBudget}>
              <Text>Rollover to Next Month</Text>
            </Button>
          </View>
        )}

        {/* Household Members */}
        {householdId && currentUser && (
          <HouseholdMembers
            householdId={householdId}
            currentUserId={currentUser.id}
          />
        )}

        {/* Account Actions */}
        <View className="gap-3">
          <Button variant="outline" onPress={() => setShowChangePassword(true)}>
            <Text>Change Password</Text>
          </Button>

          <Button
            variant="destructive"
            onPress={handleSignOut}
          >
            <Text>Sign Out</Text>
          </Button>
        </View>
      </View>

      <ChangePasswordForm
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </ScrollView>
  );
}
