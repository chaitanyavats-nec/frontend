"use client";

import { useAuthModalStore } from "@/stores/useAuthModalStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserCirclePlus } from "phosphor-react";

export function AuthModal() {
  const { isOpen, close } = useAuthModalStore();
  const router = useRouter();

  const handleSignIn = () => {
    close();
    router.push("/welcome");
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-md bg-paper border-paper-dark shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="w-16 h-16 bg-teal/10 text-teal rounded-full flex items-center justify-center mb-2">
            <UserCirclePlus size={32} weight="fill" />
          </div>
          <DialogTitle className="font-editorial text-3xl text-ink tracking-tight">
            Account Required
          </DialogTitle>
          <DialogDescription className="text-slate text-sm max-w-[280px] leading-relaxed">
            Agora is a platform for verified contributions. You need an account to post, reply, or interact with other members.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-col gap-3 pb-4">
          <Button
            onClick={handleSignIn}
            className="w-full bg-ink text-paper h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-teal transition-all duration-300 shadow-md shadow-ink/10"
          >
            Sign In or Create Account
          </Button>
          <Button
            variant="ghost"
            onClick={close}
            className="w-full text-slate hover:text-ink hover:bg-paper-dark/20 h-10 font-bold uppercase tracking-widest text-[10px]"
          >
            Stay as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
