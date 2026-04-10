"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";

function checkIsAdmin(u: { email?: string | null } | null): boolean {
  if (!u) return false;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = u.email?.trim().toLowerCase();
  return !!adminEmail && !!userEmail && userEmail === adminEmail;
}

const VISUALS = {
  signin: {
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80",
    headline: "Welcome back.",
    sub: "Your style is waiting.",
  },
  signup: {
    img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80",
    headline: "Join VOXE.",
    sub: "Fashion without boundaries.",
  },
};

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  // Redirect already-logged-in users
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user && !signingIn) {
      router.replace(checkIsAdmin(user) ? "/admin" : "/shop");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, signingIn]);

  if (loading || (user && !signingIn)) return null;

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      if (tab === "signup") {
        if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
        if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (err) {
          if (err.message.toLowerCase().includes("already registered") || err.message.toLowerCase().includes("already exists") || err.message.toLowerCase().includes("user already")) {
            setError("An account with this email already exists. Please sign in instead.");
          } else {
            setError(err.message);
          }
          return;
        }
        setEmailSent(true);
      } else {
        setSigningIn(true);
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (err) { setError(err.message); setSigningIn(false); return; }

        // Check admin by email directly — most reliable
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
        const userEmail = data.user.email?.trim().toLowerCase();
        const isAdmin = userEmail === adminEmail;

        // Also check profiles table as fallback
        if (!isAdmin) {
          const { data: profile } = await supabase
            .from("profiles").select("role").eq("id", data.user.id).single();
          if (profile?.role === "admin") {
            router.push("/admin");
            return;
          }
        }

        router.push(isAdmin ? "/admin" : "/shop");
        router.refresh();
      }
    } finally {
      setFormLoading(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  const visual = VISUALS[tab];

  return (
    <main className="min-h-screen bg-obsidian flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div className="lg:w-[52%] relative overflow-hidden flex-col flex min-h-[40vh] lg:min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0">
            <Image src={visual.img} alt="VOXE" fill priority sizes="52vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/20 via-obsidian/10 to-obsidian/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/30" />
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="font-dm text-3xl font-bold text-amber-tan" style={{ letterSpacing: "-1px" }}>VOXE</Link>
          <div className="mt-auto hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-3">VOXE — SS 2025</p>
                <h2 className="font-dm text-5xl text-linen-cream leading-tight mb-3">{visual.headline}</h2>
                <p className="font-dm text-linen-cream/45 text-base">{visual.sub}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 w-12 h-px bg-amber-tan/50" />
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 overflow-y-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-tan/4 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-sm mx-auto">
          <div className="lg:hidden mb-8">
            <Link href="/" className="font-dm text-2xl font-bold text-amber-tan" style={{ letterSpacing: "-1px" }}>VOXE</Link>
          </div>

          <Link href="/" className="inline-flex items-center gap-1.5 font-dm text-xs text-linen-cream/25 hover:text-amber-tan transition-colors mb-10 group">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to store
          </Link>

          <AnimatePresence mode="wait">
            {emailSent ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="w-12 h-12 rounded-full bg-amber-tan/15 border border-amber-tan/30 flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <motion.path d="M5 13l4 4L19 7" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                  </svg>
                </div>
                <h1 className="font-dm text-4xl text-linen-cream mb-2">Check your email.</h1>
                <p className="font-dm text-linen-cream/40 text-sm mb-8 leading-relaxed">
                  We sent a confirmation link to <span className="text-amber-tan">{form.email}</span>. Click it to activate your account.
                </p>
                <button onClick={() => { setEmailSent(false); setTab("signin"); }}
                  className="font-dm text-sm text-amber-tan hover:underline">
                  Back to sign in
                </button>
              </motion.div>
            ) : (
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                <h1 className="font-dm text-4xl text-linen-cream mb-1">
                  {tab === "signin" ? "Sign in" : "Create account"}
                </h1>
                <p className="font-dm text-sm text-linen-cream/35 mb-8">
                  {tab === "signin" ? (
                    <>No account?{" "}
                      <button onClick={() => setTab("signup")} className="text-amber-tan hover:underline">Sign up free</button>
                    </>
                  ) : (
                    <>Already have one?{" "}
                      <button onClick={() => setTab("signin")} className="text-amber-tan hover:underline">Sign in</button>
                    </>
                  )}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {tab === "signup" && (
                    <div>
                      <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em] block mb-2">Full Name</label>
                      <input value={form.name} onChange={(e) => set("name", e.target.value)} required
                        placeholder="Ada Okonkwo" className="input-gold w-full px-4 py-3.5 rounded-lg font-dm text-sm" />
                    </div>
                  )}

                  <div>
                    <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em] block mb-2">Email</label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required
                      placeholder="you@example.com" className="input-gold w-full px-4 py-3.5 rounded-lg font-dm text-sm" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em]">Password</label>
                      {tab === "signin" && (
                        <button type="button" onClick={() => router.push("/auth/reset")}
                          className="font-dm text-[11px] text-amber-tan/60 hover:text-amber-tan transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={form.password}
                        onChange={(e) => set("password", e.target.value)} required placeholder="••••••••"
                        className="input-gold w-full px-4 py-3.5 pr-12 rounded-lg font-dm text-sm" />
                      <button type="button" onClick={() => setShowPass((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-linen-cream/25 hover:text-amber-tan transition-colors">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {tab === "signup" && (
                    <div>
                      <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em] block mb-2">Confirm Password</label>
                      <div className="relative">
                        <input type={showConfirm ? "text" : "password"} value={form.confirm}
                          onChange={(e) => set("confirm", e.target.value)} required placeholder="••••••••"
                          className="input-gold w-full px-4 py-3.5 pr-12 rounded-lg font-dm text-sm" />
                        <button type="button" onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-linen-cream/25 hover:text-amber-tan transition-colors">
                          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="font-dm text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={formLoading}
                    className="btn-amber sheen w-full py-4 text-obsidian font-dm font-semibold text-[11px] tracking-[0.25em] uppercase rounded-lg mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    {formLoading ? "Please wait…" : tab === "signin" ? "Sign In" : "Create Account"}
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-amber-tan/10" />
                    <span className="font-dm text-[10px] text-linen-cream/20 uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-amber-tan/10" />
                  </div>

                  <button type="button" onClick={handleGoogle}
                    className="w-full py-3.5 rounded-lg border border-linen-cream/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-linen-cream/15 text-linen-cream/55 hover:text-linen-cream font-dm text-sm transition-all duration-200 flex items-center justify-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                </form>

                <p className="font-dm text-[11px] text-linen-cream/20 mt-8 leading-relaxed">
                  By continuing you agree to VOXE&apos;s{" "}
                  <Link href="#" className="text-amber-tan/50 hover:text-amber-tan transition-colors">Terms</Link>
                  {" "}&amp;{" "}
                  <Link href="#" className="text-amber-tan/50 hover:text-amber-tan transition-colors">Privacy Policy</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
