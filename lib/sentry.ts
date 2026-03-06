import * as Sentry from "@sentry/react-native";
import type { ComponentType } from "react";

/**
 * Initialize Sentry. Call once at app startup.
 * See: https://docs.sentry.io/platforms/react-native/manual-setup/expo/
 */
Sentry.init({
  dsn: "https://51edd1dba19cc8368f65d2f9780af064@o4510999365812224.ingest.us.sentry.io/4510999369220097",
  enabled: !__DEV__,
  environment: __DEV__ ? "development" : "production",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  enableLogs: true,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

/**
 * Wrap the root layout so unhandled errors are reported to Sentry.
 * Use as: export default wrapRootLayout(RootLayout);
 */
export function wrapRootLayout<T extends ComponentType<object>>(
  RootComponent: T
): T {
  return Sentry.wrap(
    RootComponent as ComponentType<Record<string, unknown>>
  ) as T;
}
