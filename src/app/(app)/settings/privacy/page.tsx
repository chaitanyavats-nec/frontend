"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toast, ToastDescription, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { mockProfiles, mockPosts } from "@/lib/mockData";

export default function PrivacySettingsPage() {
  const router = useRouter();
  
  // Dialog flow state: 0 = closed, 1 = initial confirmation, 2 = after download, 3 = final deletion
  const [dialogStep, setDialogStep] = useState<0 | 1 | 2 | 3>(0);
  const [deleteInput, setDeleteInput] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleDownloadData = () => {
    // Simulate export
    const currentUser = mockProfiles[0];
    const userPosts = mockPosts.filter((p) => p.authorDid === currentUser.did);
    const exportData = {
      profile: currentUser,
      posts: userPosts,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agora-data-export-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Move to next step
    setDialogStep(2);
  };

  const handleDeleteAccount = () => {
    setDialogStep(0);
    setShowToast(true);
    
    setTimeout(() => {
      router.push("/welcome");
    }, 2000);
  };

  return (
    <ToastProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display text-ink mb-2">Privacy Settings</h1>
          <p className="text-slate text-sm">Manage your data, visibility, and account lifecycle.</p>
        </div>

        {/* Placeholder for other settings if there were any */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-4 border-b border-paper-dark">
            <div>
              <p className="font-medium text-ink">Public Profile</p>
              <p className="text-sm text-slate">Allow your profile to be discovered via search.</p>
            </div>
            {/* Toggle placeholder */}
            <div className="w-10 h-6 bg-sage rounded-full opacity-50 cursor-not-allowed"></div>
          </div>
        </div>

        <hr className="border-paper-dark my-8" />

        <section className="space-y-4">
          <h2 className="text-lg font-display text-terracotta">Leave Agora</h2>
          <p className="text-slate text-sm">
            Permanently remove your account and all associated data from this node. 
            This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => setDialogStep(1)}>
            Export and delete account
          </Button>
        </section>

        <Dialog open={dialogStep > 0} onOpenChange={(open) => {
          if (!open) { setDialogStep(0); setDeleteInput(""); }
        }}>
          <DialogContent>
            {dialogStep === 1 && (
              <>
                <DialogHeader>
                  <DialogTitle>Before you go</DialogTitle>
                  <DialogDescription>
                    You can download everything Agora holds about you before deleting your account. 
                    This includes your posts, your affiliation declarations, your reputation history, 
                    and your governance participation record.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                  <Button variant="destructive" onClick={() => setDialogStep(3)}>
                    Skip and delete account
                  </Button>
                  <Button variant="default" onClick={handleDownloadData}>
                    Download my data
                  </Button>
                </DialogFooter>
              </>
            )}

            {dialogStep === 2 && (
              <>
                <DialogHeader>
                  <DialogTitle>Before you go</DialogTitle>
                  <DialogDescription>
                    Your data has been downloaded. Ready to delete your account?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="destructive" onClick={() => setDialogStep(3)}>
                    Delete my account permanently
                  </Button>
                </DialogFooter>
              </>
            )}

            {dialogStep === 3 && (
              <>
                <DialogHeader>
                  <DialogTitle>Final Confirmation</DialogTitle>
                  <DialogDescription>
                    Type DELETE to confirm your account deletion.
                  </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                  <label htmlFor="delete-confirm" className="mb-2 block text-sm font-medium text-slate">
                    Type DELETE to confirm
                  </label>
                  <input
                    id="delete-confirm"
                    type="text"
                    className="w-full rounded-md border border-paper-dark bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                    placeholder="DELETE"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button 
                    variant="destructive" 
                    disabled={deleteInput !== "DELETE"} 
                    onClick={handleDeleteAccount}
                  >
                    Confirm deletion
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Toast open={showToast} onOpenChange={setShowToast} className="bg-surface border-paper-dark">
          <ToastDescription className="text-ink text-sm">
            Account deleted. Your data has been removed.
          </ToastDescription>
        </Toast>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
