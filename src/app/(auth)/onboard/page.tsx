"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OnboardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { signUp, isSigningUp, signUpError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({ email, password, displayName });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6 font-sans">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-editorial font-bold text-6xl tracking-tight text-ink uppercase">Join</h1>
          <p className="text-slate font-medium uppercase tracking-[0.2em] text-xs">Register your contribution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-paper p-10 rounded-2xl border border-paper-dark shadow-xl shadow-ink/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate px-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-surface border-b-2 border-paper-dark px-4 py-3 focus:outline-none focus:border-teal transition-colors font-mono text-sm"
                placeholder="Dr. Elena Rossi"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate px-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border-b-2 border-paper-dark px-4 py-3 focus:outline-none focus:border-teal transition-colors font-mono text-sm"
                placeholder="elena@agora.org"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate px-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border-b-2 border-paper-dark px-4 py-3 focus:outline-none focus:border-teal transition-colors font-mono text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {signUpError && (
            <p className="text-terracotta text-xs font-medium text-center">
              {(signUpError as any).message || "Registration failed."}
            </p>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-ink text-paper h-14 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-teal transition-all duration-300 shadow-lg shadow-ink/10"
            >
              {isSigningUp ? "Registering..." : "Initialise DID"}
            </Button>
            <p className="text-[9px] text-slate text-center uppercase tracking-wider leading-relaxed px-4">
              By joining, you agree to stake your reputation on the accuracy of your claims and the transparency of your affiliations.
            </p>
          </div>

          <div className="text-center pt-2">
            <Link href="/welcome" className="text-[10px] font-bold uppercase tracking-widest text-slate hover:text-teal transition-colors">
              Already registered? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
