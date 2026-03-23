"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toast, ToastDescription, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function ContributionModal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(30);
  const [showToast, setShowToast] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const seen = localStorage.getItem("agora_contribution_seen");
    if (!seen) {
      setOpen(true);
    }
  }, []);

  if (!isMounted) return null;

  const handleProceed = () => {
    localStorage.setItem("agora_contribution_seen", "true");

    if (value > 0) {
      setShowToast(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000); // give toast time to be seen before modal unmounts
    } else {
      setOpen(false);
    }
  };

  return (
    <ToastProvider>
      <Dialog open={open} onOpenChange={(v) => { if (!v) return; setOpen(v); }}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-md border-paper-dark [&>button]:hidden"
        >
          <DialogHeader>
            <DialogTitle>Keep Agora running</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <p className="text-sm text-slate leading-relaxed">
              Agora has no advertisers. No investors. No data to sell.
              It runs on direct contributions from the people who use it —
              covering infrastructure, moderation, and development costs.
            </p>
            <p className="text-sm text-slate leading-relaxed">
              Choose what you can contribute each month. There is no minimum.
            </p>
          </div>

          <div className="py-6 pt-8 space-y-6">
            <div className="text-center">
              <span className={cn(
                "font-display text-3xl",
                value === 0 ? "text-slate" : "text-ink"
              )}>
                ₹{value} / month
              </span>
            </div>

            <div className="relative px-2">
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="w-full h-2 bg-paper-dark rounded-lg appearance-none cursor-pointer accent-sage"
                style={{ accentColor: "var(--sage)" }}
              />

              <div className="flex justify-between mt-3 text-xs text-slate px-1">
                <div className="relative flex flex-col items-center">
                  {value === 0 && (
                    <span className="text-terracotta absolute -top-4 text-[10px]">▲</span>
                  )}
                  <span>₹0</span>
                </div>
                <span className="translate-x-1.5">₹100</span>
                <span>₹200</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-4">
            <Button
              className="w-full"
              variant={value > 0 ? "default" : "outline"}
              onClick={handleProceed}
            >
              {value > 0 ? `Contribute ₹${value} and enter Agora` : "Enter Agora for free"}
            </Button>
            <p className="text-[10px] text-slate text-center">
              You can update your contribution at any time in Settings.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Toast open={showToast} onOpenChange={setShowToast} className="bg-surface border-paper-dark flex justify-center w-auto mx-auto translate-y-24">
        <ToastDescription className="text-ink">
          Thank you — your contribution keeps Agora independent.
        </ToastDescription>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
