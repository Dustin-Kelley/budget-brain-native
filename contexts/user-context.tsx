import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UserRow } from "@/types";
import { getCurrentUser } from "@/lib/queries/getCurrentUser";
import { useAuth } from "@/contexts/auth-context";

type UserContextValue = {
  currentUser: UserRow | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!authUser?.id) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { currentUser: profile, error } = await getCurrentUser(authUser.id);
    setCurrentUser(profile);
    setIsLoading(false);
  }, [authUser?.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value: UserContextValue = {
    currentUser,
    isLoading,
    refetch: fetchUser,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within UserProvider");
  }
  return context;
}
