import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Download, Eye, ExternalLink, Trash2 } from "lucide-react";
import { ImageFileDTO } from "./types";
import { ProgressiveImage } from "@/components/progressive-image";
import { toImageServeUrl, toPlaceholderUrl } from "@/lib/image-urls";
import { LinkedAppBadges } from "./linked-app-badges";

const isPdf = (contentType: string) => contentType === "application/pdf";
const isSvg = (contentType: string) => contentType === "image/svg+xml";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface Props {
  img: ImageFileDTO;
  selected: boolean;
  onToggleSelection: (id: string) => void;
  onPreview: (img: ImageFileDTO) => void;
  onDelete: (img: ImageFileDTO) => void;
  copyToClipboard: (text: string) => void;
  applicationName?: string;
  showSelection?: boolean;
}

export function FileGridItem({ img, selected, onToggleSelection, onPreview, onDelete, copyToClipboard, applicationName, showSelection = true }: Props) {
  const url = toImageServeUrl(img.filename);
  const isImage = img.contentType.startsWith("image/");
  const thumbnailSrc = toImageServeUrl(img.filename, {
    width: isSvg(img.contentType) ? undefined : 640,
  });
  const placeholderSrc = toPlaceholderUrl(img.filename, { variants: img.variants });

  return (
    <div
      className={`border rounded-lg overflow-hidden group relative ${selected ? 'ring-2 ring-primary border-primary' : ''}`}
    >
      <div className="absolute top-2 left-2 z-10">
        {showSelection && (
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelection(img.id)}
            className="bg-white/90 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground backdrop-blur-sm border-2"
          />
        )}
      </div>
      <div className="aspect-video bg-muted relative">
        {isPdf(img.contentType) ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
            <span className="text-sm font-medium">PDF</span>
          </div>
        ) : isImage ? (
          <ProgressiveImage
            src={thumbnailSrc}
            placeholderSrc={placeholderSrc}
            alt={img.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
             <span className="text-sm font-medium uppercase">{img.filename.split('.').pop()}</span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onPreview(img)}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => copyToClipboard(window.location.origin + url)}
            title="Copy URL"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            asChild
            title="Open in New Tab"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            asChild
            title="Download"
          >
            <a href={url} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">
            {img.originalName}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {formatFileSize(img.sizeBytes)} •{" "}
            {img.contentType}
            {img.width && img.height && (
              <>
                {" "}
                • {img.width}×{img.height}
              </>
            )}
          </div>
          {(applicationName ?? img.applicationName) && !img.linkedApplications?.length && (
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {applicationName ?? img.applicationName}
            </div>
          )}
          <LinkedAppBadges
            applications={img.linkedApplications}
            className="mt-1"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(img)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
