export interface FileVariant {
  label: string;
  filename: string;
  width?: number;
  height?: number;
  sizeBytes: number;
}

export interface FileUploadResult {
  id: string;
  filename: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  hash?: string;
  variants: FileVariant[];
}
