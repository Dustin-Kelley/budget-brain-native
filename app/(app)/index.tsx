import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function OverviewScreen() {
  return (

    <View className="flex-1 items-center justify-center bg-white h-full">
      <Text className="text-xl font-bold text-red-500">
        Welcome
      </Text>
      <Button>
        <Text variant="large">Click me hello</Text>
      </Button>
      <Text variant="h1">Click me hello</Text>
    </View>

  );
}


