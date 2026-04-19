"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6 font-sans">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-editorial font-bold text-6xl tracking-tight text-ink uppercase">Agora</h1>
          <p className="text-slate font-medium uppercase tracking-[0.2em] text-xs">Decentralised Public Sphere</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-paper p-10 rounded-2xl border border-paper-dark shadow-xl shadow-ink/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate px-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border-b-2 border-paper-dark px-4 py-3 focus:outline-none focus:border-teal transition-colors font-mono text-sm"
                placeholder="editor@agora.org"
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

          {loginError && (
            <p className="text-terracotta text-xs font-medium text-center">
              {(loginError as any).message || "Invalid credentials."}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-ink text-paper h-14 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-teal transition-all duration-300 shadow-lg shadow-ink/10"
          >
            {isLoggingIn ? "Authenticating..." : "Enter Agora"}
          </Button>

          <div className="text-center pt-2">
            <Link href="/onboard" className="text-[10px] font-bold uppercase tracking-widest text-slate hover:text-teal transition-colors">
              Request credentials (Sign Up)
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
