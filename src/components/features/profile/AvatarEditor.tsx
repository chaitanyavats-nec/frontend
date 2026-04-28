"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/cropImage";
import { createClient } from "@/utils/supabase/client";
import { updateProfile } from "@/lib/queries/users";
import { Loader2 } from "lucide-react";

interface AvatarEditorProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUrl: string) => void;
  initialImage?: string | null;
}

export function AvatarEditor({ userId, isOpen, onClose, onSuccess, initialImage }: AvatarEditorProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!image || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      const supabase = createClient();
      
      const fileName = `${userId}-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      await updateProfile(userId, { avatar_url: data.publicUrl });
      
      onSuccess(data.publicUrl);
      onClose();
    } catch (error) {
      console.error("Error saving avatar:", error);
      alert("Failed to save avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-surface border-paper-dark">
        <DialogHeader>
          <DialogTitle className="text-ink font-sans font-bold">Edit Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {!image ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-paper-dark rounded-xl bg-paper/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer px-6 py-3 bg-ink text-white font-bold rounded-lg hover:bg-teal transition-colors"
              >
                Select Image
              </label>
              <p className="mt-4 text-xs text-slate font-medium">Recommended: Square image, max 5MB</p>
            </div>
          ) : (
            <>
              <div className="relative h-[300px] w-full rounded-lg overflow-hidden bg-black">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-paper-dark rounded-lg appearance-none cursor-pointer accent-teal"
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setImage(null)}
                  className="text-xs font-bold uppercase tracking-widest"
                >
                  Change Image
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isUploading} className="font-bold">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!image || isUploading}
            className="bg-teal hover:bg-teal-dark text-white font-bold"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Avatar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
