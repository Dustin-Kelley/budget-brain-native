import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  sendOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_EMAIL = process.env.EXPO_PUBLIC_DEMO_EMAIL?.toLowerCase();
const DEMO_PASSWORD = process.env.EXPO_PUBLIC_DEMO_PASSWORD;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOtp = useCallback(async (email: string) => {
    if (DEMO_EMAIL && email.toLowerCase() === DEMO_EMAIL) {
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error: error as Error | null };
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    if (DEMO_EMAIL && DEMO_PASSWORD && email.toLowerCase() === DEMO_EMAIL) {
      const { error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      return { error: error as Error | null };
    }
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    return { error: error as Error | null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const deleteAccount = useCallback(async () => {
    await supabase.rpc("delete_user");
    await supabase.auth.signOut();
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    isLoading,
    sendOtp,
    verifyOtp,
    signOut,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
