"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, always redirect to /home (app shell)
    // In production: check auth state → /home if authed, /welcome if not
    router.replace("/home");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="text-center">
        <h1 className="font-display text-5xl text-ink tracking-tight">AGORA</h1>
        <p className="font-mono text-xs text-sage mt-2">Loading…</p>
      </div>
    </div>
  );
}
