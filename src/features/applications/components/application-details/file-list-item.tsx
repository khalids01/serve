import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Download, Eye, Trash2 } from "lucide-react";
import { ImageFileDTO } from "./types";
import { PdfViewer } from "../pdf-viewer";
import { ProgressiveImage } from "@/components/progressive-image";
import { toImageServeUrl, toPlaceholderUrl } from "@/lib/image-urls";
import { LinkedAppBadges } from "./linked-app-badges";

// Helper functions (could be moved to utils)
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

export function FileListItem({ img, selected, onToggleSelection, onPreview, onDelete, copyToClipboard, applicationName, showSelection = true }: Props) {
  const url = toImageServeUrl(img.filename);
  const isImage = img.contentType.startsWith("image/");
  const thumbnailSrc = toImageServeUrl(img.filename, {
    width: isSvg(img.contentType) ? undefined : 80,
  });
  const placeholderSrc = toPlaceholderUrl(img.filename, { variants: img.variants });

  return (
    <div
      className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${selected ? 'bg-muted/50 border-primary' : ''}`}
    >
      {showSelection && (
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelection(img.id)}
          className="flex-shrink-0"
        />
      )}

      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-muted rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center border relative">
          {isPdf(img.contentType) ? (
            <span className="text-[10px] font-bold text-muted-foreground">PDF</span>
          ) : isImage ? (
            <ProgressiveImage
              src={thumbnailSrc}
              placeholderSrc={placeholderSrc}
              alt={img.originalName}
              className="w-full h-full object-cover"
            />
          ) : (
             <span className="text-[10px] font-bold text-muted-foreground uppercase">{img.filename.split('.').pop()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate text-sm">
            {img.originalName}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {formatFileSize(img.sizeBytes)} • {img.contentType}
            {(applicationName ?? img.applicationName) && !img.linkedApplications?.length && (
              <> • {applicationName ?? img.applicationName}</>
            )}
          </p>
          <LinkedAppBadges applications={img.linkedApplications} className="mt-1" />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => copyToClipboard(window.location.origin + url)}
          title="Copy URL"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
          title="Download"
        >
          <a href={url} download>
            <Download className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPreview(img)}
          title="Preview"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(img)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
