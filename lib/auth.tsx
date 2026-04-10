"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthCtx {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, isAdmin: false, loading: true, logout: () => {} });

function checkAdminByEmail(u: User | null): boolean {
  if (!u) return false;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  return !!adminEmail && u.email?.trim().toLowerCase() === adminEmail;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function resolveAdmin(u: User | null) {
    if (!u) { setIsAdmin(false); return; }

    // Fast check by email first
    if (checkAdminByEmail(u)) { setIsAdmin(true); return; }

    // Then check profiles table
    try {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .single();
      setIsAdmin(data?.role === "admin");
    } catch {
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      await resolveAdmin(u);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") return;
      const u = session?.user ?? null;
      setUser(u);
      await resolveAdmin(u);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
    supabase.auth.signOut();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Ctx.Provider value={{ user, isAdmin, loading, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
