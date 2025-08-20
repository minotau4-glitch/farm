"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.replace("/");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      router.replace("/");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-lg border border-black/10 p-6 bg-white">
        <h1 className="text-lg font-semibold mb-4">Sign in</h1>
        {error ? (
          <div className="mb-3 text-sm text-red-600">{error}</div>
        ) : null}
        <form onSubmit={handleEmailPassword} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black text-white py-2 text-sm disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="my-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs text-black/60">or</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogle}
          className="w-full rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}


