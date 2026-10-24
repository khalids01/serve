"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageName: string;
  linkedApplications?: Array<{ id: string; name: string }>;
  onSave: (croppedBlob: Blob, saveMode: "new" | "replace") => Promise<void>;
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageUrl,
  imageName,
  onSave,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset crop when dialog opens/closes
  useEffect(() => {
    if (open && imageUrl) {
      setCrop({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25,
      });
      setCompletedCrop(null);
    }
  }, [open, imageUrl]);

  const onImageLoad = useCallback(() => {
    setCrop({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
  }, []);

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, pixelCrop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          0.95,
        );
      });
    },
    [],
  );

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    setIsSaving(true);
    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      await onSave(croppedBlob, "new");
      onOpenChange(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-full !max-w-[1000px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area and save it as a new image. The original stays
            unchanged.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto flex items-center justify-center bg-muted/30 rounded-md">
          {imageUrl ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
            >
              {/* biome-ignore lint/performance/noImgElement: Canvas cropping needs a native image element. */}
              <img
                ref={imgRef}
                src={imageUrl}
                alt={imageName}
                onLoad={onImageLoad}
                style={{ maxHeight: "calc(90vh - 250px)", maxWidth: "100%" }}
              />
            </ReactCrop>
          ) : (
            <div className="text-muted-foreground">Loading...</div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!completedCrop || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Cropped Image"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
