"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database } from "phosphor-react";
import { runSeed } from "@/lib/seed";

export function SeedUtility() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState("");

  const handleWipeAndSeed = async () => {
    setIsSeeding(true);
    setStatus("Wiping & seeding Agora network...");
    try {
      await runSeed();
      setStatus("Agora network seeded! Refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end">
      {status && (
        <div className="bg-neutral-900 text-white text-[10px] px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2 font-mono border border-neutral-800 shadow-xl">
          {status}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          onClick={handleWipeAndSeed}
          disabled={isSeeding}
          title="Wipe and Re-Seed Agora Database"
          className="bg-[#121212] hover:bg-neutral-900 border border-neutral-800 text-[#10b981] dark:text-[#2ec4bb] shadow-2xl rounded-full p-3 h-12 w-12 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Database size={20} />
        </Button>
      </div>
    </div>
  );
}
