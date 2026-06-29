"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) { setError("Username is required."); return; }
    if (username.includes(" ")) { setError("Username cannot contain spaces."); return; }
    if (username.length < 3) { setError("Username must be at least 3 characters."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);

    // Check if username already taken
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (existing) {
      setError("Username already taken. Try another.");
      setLoading(false);
      return;
    }

    // Sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { user_name: username.toLowerCase() }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Update profile with chosen username
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ username: username.toLowerCase() })
        .eq("id", data.user.id);
    }

    router.push("/");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4" style={{ color: "var(--primary-light)" }}>
            <Sparkles size={28} />
            <span className="text-2xl font-bold">StickerVerse</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Join the community and start sharing stickers.</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Username</label>
              <div className="flex items-center px-4 py-3 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <span className="mr-1 text-sm" style={{ color: "var(--muted)" }}>@</span>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
                  placeholder="yourname"
                  required
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--text)" }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Lowercase letters, numbers and underscores only.</p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="flex items-center px-4 py-3 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--text)" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: "var(--muted)" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: "var(--primary)" }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* OAuth */}
          <div className="flex gap-3">
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition hover:opacity-90"
              style={{ background: "#fff", color: "#000" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${window.location.origin}/auth/callback` } });
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition hover:opacity-90"
              style={{ background: "#24292e", color: "#fff" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm mt-5" style={{ color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium hover:opacity-80" style={{ color: "var(--primary-light)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
