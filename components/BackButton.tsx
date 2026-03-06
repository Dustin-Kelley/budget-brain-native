import { Button } from "@/components/ui/button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { type ComponentProps } from "react";

type BackButtonProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size" | "children"
> & {
  onPress?: () => void;
};

export function BackButton({ onPress, className, ...buttonProps }: BackButtonProps) {
  return (
    <Button
      onPress={onPress ?? (() => router.back())}
      variant="outline"
      size="icon"
      className={`h-8 w-8 ${className ?? ""}`}
      {...buttonProps}
    >
      <Ionicons name="arrow-back" size={16} className="text-foreground" />
    </Button>
  );
}
