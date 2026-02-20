import { Image } from "expo-image";
import type { ImageStyle } from "react-native";

const logoDarkSource = require("../assets/images/logo-dark.png");
const logoLightSource = require("../assets/images/logo-white.png");

type LogoVariant = "dark" | "light";

type LogoProps = {
  size?: number;
  style?: ImageStyle;
  variant?: LogoVariant;
};

const variantSources: Record<LogoVariant, number> = {
  dark: logoDarkSource,
  light: logoLightSource,
};

export function Logo({ size = 88, style, variant = "dark" }: LogoProps) {
  return (
    <Image
      source={variantSources[variant]}
      style={[{ width: size, height: size, alignSelf: "center" }, style]}
      contentFit="contain"
    />
  );
}
