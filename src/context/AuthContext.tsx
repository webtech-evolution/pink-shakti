import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  account,
  isAppwriteConfigured,
  ID,
  OAuthProvider,
  persistSession,
  clearPersistedSession,
} from "@/lib/appwrite";
import { getMerchantByUserId } from "@/lib/memberships-api";
import { getMemberByUserId } from "@/lib/content-api";
import type { Models } from "appwrite";
import type { Member, Merchant } from "@/lib/types";

type Role = "admin" | "merchant" | "user" | "guest";

interface AuthContextValue {
  user: Models.User<Models.Preferences> | null;
  merchant: Merchant | null;
  member: Member | null;
  role: Role;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (destination?: string) => Promise<void>;
  completeOAuthLogin: (userId: string, secret: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshMerchant: () => Promise<void>;
  refreshMember: () => Promise<void>;
  configured: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_EMAIL = "admin@pinkshakti.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMerchant = useCallback(async () => {
    if (!user) {
      setMerchant(null);
      return;
    }
    try {
      const m = await getMerchantByUserId(user.$id);
      setMerchant(m);
    } catch {
      setMerchant(null);
    }
  }, [user]);

  const refreshMember = useCallback(async () => {
    if (!user) {
      setMember(null);
      return;
    }
    try {
      setMember(await getMemberByUserId(user.$id));
    } catch {
      setMember(null);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    if (!isAppwriteConfigured) {
      setUser(null);
      setMerchant(null);
      setMember(null);
      setLoading(false);
      return;
    }
    try {
      const me = await account.get();
      setUser(me);
      try {
        const m = await getMerchantByUserId(me.$id);
        setMerchant(m);
      } catch {
        setMerchant(null);
      }
      try {
        setMember(await getMemberByUserId(me.$id));
      } catch {
        setMember(null);
      }
    } catch {
      // Stale or rejected session — drop it so the next sign-in starts clean.
      clearPersistedSession();
      setUser(null);
      setMerchant(null);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const session = await account.createEmailPasswordSession(email, password);
    persistSession((session as unknown as { secret?: string }).secret);
    await refresh();
  };

  const loginWithGoogle = async (destination = "/profile") => {
    if (!isAppwriteConfigured) throw new Error("Appwrite is not configured.");
    // Token flow (not the session flow) so the session never depends on
    // third-party cookies, which privacy browsers/adblockers block.
    const success = `${window.location.origin}/login?from=${encodeURIComponent(destination)}`;
    const failure = `${window.location.origin}/login?oauth=failed`;
    account.createOAuth2Token(OAuthProvider.Google, success, failure);
  };

  const completeOAuthLogin = async (userId: string, secret: string) => {
    const session = await account.createSession(userId, secret);
    // The OAuth token itself is valid for this session even when a privacy
    // browser blocks Appwrite's third-party Set-Cookie response.
    persistSession(session.secret || secret);
    await refresh();
  };

  const register = async (email: string, password: string, name: string) => {
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    persistSession((session as unknown as { secret?: string }).secret);
    await refresh();
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
    } catch {
      /* session may already be gone */
    } finally {
      clearPersistedSession();
      setUser(null);
      setMerchant(null);
      setMember(null);
    }
  };

  const isAdmin = Boolean(user && user.email.toLowerCase() === ADMIN_EMAIL);

  const role: Role = !user ? "guest" : isAdmin ? "admin" : merchant ? "merchant" : "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        merchant,
        member,
        role,
        isAdmin,
        loading,
        login,
        loginWithGoogle,
        completeOAuthLogin,
        register,
        logout,
        refresh,
        refreshMerchant,
        refreshMember,
        configured: isAppwriteConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
