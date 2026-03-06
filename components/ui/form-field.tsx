import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Text, View, type TextInputProps } from "react-native";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
} & Pick<
  TextInputProps,
  "placeholder" | "keyboardType" | "secureTextEntry" | "autoCapitalize" | "editable"
>;

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  ...inputProps
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-2">
          <Label>{label}</Label>
          <Input
            className={cn(
              "rounded-lg px-4 py-3",
              error && "border-destructive"
            )}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...inputProps}
          />
          {error?.message && (
            <Text className="text-sm text-destructive">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
