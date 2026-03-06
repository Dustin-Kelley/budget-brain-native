import * as Sentry from '@sentry/react-native';
import { useCallback } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export type LogErrorContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

/**
 * Report an error. In dev: console.error only. In prod: send to Sentry.
 * Use this outside React (e.g. in callbacks or lib code) when you don't need automatic user context.
 */
export function logError(error: unknown, context?: LogErrorContext) {
  if (__DEV__) {
    console.error("[logError]", error, context ?? {});
    return;
  }
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) =>
        scope.setTag(key, value)
      );
    }
    if (context?.extra) {
      scope.setExtras(context.extra);
    }
    Sentry.captureException(error);
  });
}

/**
 * Hook that returns logError with current user attached to Sentry events.
 * Use in components when you want errors to be associated with the logged-in user.
 */
export function useLogError() {
  const { currentUser } = useCurrentUser();

  const logErrorWithUser = useCallback(
    (error: unknown, context?: LogErrorContext) => {
      if (__DEV__) {
        console.error("[logError]", error, { user: currentUser?.id, ...context });
        return;
      }
      Sentry.withScope((scope) => {
        if (currentUser?.id) {
          scope.setUser({ id: currentUser.id });
        }
        if (context?.tags) {
          Object.entries(context.tags).forEach(([key, value]) =>
            scope.setTag(key, value)
          );
        }
        if (context?.extra) {
          scope.setExtras(context.extra);
        }
        Sentry.captureException(error);
      });
    },
    [currentUser?.id]
  );

  return { logError: logErrorWithUser };
}
