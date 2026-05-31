import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crop, ExternalLink, Copy } from "lucide-react";
import { ImageFileDTO } from "./types";
import { PdfViewer } from "../pdf-viewer";
import { useState } from "react";
import {
  isPlaceholderLabel,
  toImageServeUrl,
  variantToServeUrl,
} from "@/lib/image-urls";

// Helper functions
const isPdf = (contentType: string) => contentType === "application/pdf";
const isSvg = (contentType: string) => contentType === "image/svg+xml";

interface Props {
  previewImage: ImageFileDTO | null;
  onClose: () => void;
  onCrop: (img: ImageFileDTO) => void;
  copyToClipboard: (text: string) => void;
}

export function ImagePreviewDialog({ previewImage, onClose, onCrop, copyToClipboard }: Props) {
  const [activeVariant, setActiveVariant] = useState<string | null>(null);

  if (!previewImage) return null;

  const activeItem = activeVariant
      ? previewImage.variants.find((v) => v.id === activeVariant) || previewImage
      : previewImage;

  const previewServeUrl = activeVariant && "label" in activeItem
    ? variantToServeUrl(activeItem, previewImage.filename)
    : toImageServeUrl(previewImage.filename, {
        width: isSvg(previewImage.contentType) ? undefined : 1280,
      });

  const previewAbsoluteUrl = typeof window !== "undefined"
      ? new URL(previewServeUrl, window.location.origin).toString()
      : previewServeUrl;

  const isImage = previewImage.contentType.startsWith("image/");
  
  // For non-transformable formats, we might not have variants or they might not work as expected with ?w= params
  // So we just show original for them usually.
  
  const handleVariantClick = (id: string | null) => {
    setActiveVariant(id);
  }

  return (
    <Dialog
      open={!!previewImage}
      onOpenChange={(o) => {
        if (!o) {
          setActiveVariant(null);
          onClose();
        }
      }}
    >
      <DialogContent className="!w-full !max-w-[900px] h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate">
             {activeItem && "originalName" in activeItem ? activeItem.originalName : activeItem?.label ? `${previewImage?.originalName} (${activeItem.label})` : previewImage?.originalName}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {!activeVariant && isImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCrop(previewImage)}
              >
                <Crop className="h-4 w-4 mr-2" />
                Crop
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(previewAbsoluteUrl)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href={previewAbsoluteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/5 rounded-md mb-4 dark:bg-white/5">
            {isPdf(previewImage.contentType) && !activeVariant ? (
               <div className="w-full h-full">
                  <PdfViewer url={`/api/img/${activeItem.filename}`} />
               </div>
            ) : isImage ? (
              <img
                src={previewServeUrl}
                alt={previewImage.originalName}
                className="max-h-full max-w-full object-contain shadow-sm"
              />
            ) : (
               <div className="text-center">
                 <p className="mb-4 text-muted-foreground">Preview not available for this file type.</p>
                 <Button asChild>
                   <a href={`/api/img/${activeItem.filename}`} download>Download File</a>
                 </Button>
               </div>
            )}
          </div>

          {/* Variants Gallery */}
          {isImage && (
              <div className="h-auto py-2 overflow-x-auto min-h-[120px]">
                <p className="text-xs font-medium text-muted-foreground mb-2">Versions</p>
                <div className="flex gap-2 pb-2">
                  {/* Main Image */}
                  <button
                    className={`relative w-24 h-24 border-2 rounded-md overflow-hidden flex-shrink-0 transition-all ${!activeVariant ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                    onClick={() => handleVariantClick(null)}
                  >
                     <img
                       src={toImageServeUrl(previewImage.filename, { width: 160 })}
                       className="w-full h-full object-cover"
                       alt="Main"
                     />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate text-center">
                      Original
                    </span>
                  </button>

                  {/* Generated Variants */}
                  {previewImage.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`relative w-24 h-24 border-2 rounded-md overflow-hidden flex-shrink-0 transition-all ${activeVariant === v.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                      onClick={() => handleVariantClick(v.id)}
                      title={`View ${v.label}`}
                    >
                      <img
                        src={
                          isPlaceholderLabel(v.label)
                            ? variantToServeUrl(v, previewImage.filename)
                            : toImageServeUrl(v.filename, { width: 160 })
                        }
                        className="w-full h-full object-cover"
                        alt={v.label}
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate text-center">
                        {v.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
