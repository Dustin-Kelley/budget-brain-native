import { useAuth } from "@/contexts/auth-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect } from "expo-router";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

const isIOS = Platform.OS === "ios";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Overview</Label>
        {isIOS ? (
          <Icon sf="house.fill" />
        ) : (
          <Icon src={<VectorIcon family={Ionicons} name="home" />} />
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="plan">
        <Label>Plan</Label>
        {isIOS ? (
          <Icon sf="doc.text.fill" />
        ) : (
          <Icon src={<VectorIcon family={Ionicons} name="document-text" />} />
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        {isIOS ? (
          <Icon sf="gear" />
        ) : (
          <Icon src={<VectorIcon family={Ionicons} name="settings" />} />
        )}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
