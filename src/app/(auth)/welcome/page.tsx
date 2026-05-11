"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Envelope, Lock, ArrowRight, Eye, EyeSlash } from "phosphor-react";
import Link from "next/link";

export default function WelcomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuestEntry = () => {
    document.cookie = "agora_guest=true; path=/; max-age=86400"; // 24 hours
    window.location.href = "/home";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 dark:bg-[#0c0c0b] p-6 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-300/10 dark:bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-magenta-300/10 dark:bg-magenta-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Agora Premium Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Logo Mark (Presswork Signature - Upscaled for Welcome Screen) */}
          <div className="relative flex items-center justify-center w-24 h-24 shrink-0 select-none mb-1">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-4 w-14 h-14 bg-cyan-300/80 dark:bg-cyan-400/50 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[1px]" />
              <div className="absolute bottom-2 left-0 w-14 h-14 bg-magenta-300/80 dark:bg-magenta-400/50 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[1px]" />
              <div className="absolute bottom-2 right-0 w-14 h-14 bg-yellow-300/80 dark:bg-yellow-400/50 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[1px]" />
            </div>
            <span className="relative font-serif text-[42px] font-black text-neutral-900 dark:text-neutral-50 leading-none tracking-tight">A</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight uppercase">Agora</h1>
            <p className="text-neutral-500 dark:text-neutral-400 font-mono font-bold uppercase tracking-[0.22em] text-[10px]">
              Decentralised Public Sphere
            </p>
          </div>
        </div>

        {/* Auth Box */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white dark:bg-[#141312] p-8 sm:p-10 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] shadow-2xl dark:shadow-none space-y-6"
        >
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block px-1">
                Email Address
              </label>
              <div className="relative">
                <Envelope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#0c0c0b] border border-neutral-200/80 dark:border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm focus:border-[#2ec4bb]/50 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-[#2ec4bb]/5 transition-all outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
                  placeholder="editor@agora.org"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">
                  Password
                </label>
                <a href="#" className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ec4bb] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#0c0c0b] border border-neutral-200/80 dark:border-white/[0.08] rounded-xl pl-11 pr-11 py-3 text-sm focus:border-[#2ec4bb]/50 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-[#2ec4bb]/5 transition-all outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {loginError && (
            <p className="text-danger text-xs font-semibold text-center mt-2">
              {(loginError as Error).message || "Invalid credentials."}
            </p>
          )}

          {/* Primary Submit Actions */}
          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-neutral-900 dark:bg-[#EAE9E7] hover:bg-neutral-800 dark:hover:bg-[#dcdbd9] text-white dark:text-neutral-900 h-12 rounded-xl font-mono font-bold uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>{isLoggingIn ? "Authenticating..." : "Enter Agora"}</span>
              {!isLoggingIn && <ArrowRight size={14} weight="bold" />}
            </Button>

            <Button
              type="button"
              onClick={handleGuestEntry}
              variant="outline"
              className="w-full h-12 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] bg-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-300"
            >
              Browse as Guest
            </Button>
          </div>

          {/* Onboarding signup footer */}
          <div className="flex flex-col items-center pt-4 border-t border-neutral-100 dark:border-white/[0.04] text-center">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium mb-1.5">New to the platform?</span>
            <Link 
              href="/onboard" 
              className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2ec4bb] hover:underline transition-colors"
            >
              Request credentials (Sign Up)
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
