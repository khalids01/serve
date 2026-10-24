"use client";
import { useState } from "react";
import type { FileAsset } from "../contracts";
import { AdvancedImage } from "./advanced-image";
import { Dialog } from "./dialog";
import { FileUploader } from "./file-uploader";
import { MediaLibrary } from "./media-library";

type Common = {
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  canBrowse?: boolean;
  onCrop?: (asset: FileAsset) => FileAsset | Promise<FileAsset>;
};
export type ImagePickerProps = Common &
  (
    | {
        multiple?: false;
        value?: FileAsset | null;
        onChange: (asset: FileAsset | null) => void;
      }
    | {
        multiple: true;
        value?: FileAsset[];
        onChange: (assets: FileAsset[]) => void;
      }
  );
export function ImagePicker(props: ImagePickerProps) {
  const [browse, setBrowse] = useState(false);
  const [error, setError] = useState<string>();
  const [cropping, setCropping] = useState(false);
  const values = props.multiple
    ? (props.value ?? [])
    : props.value
      ? [props.value]
      : [];
  const change = (next: FileAsset[]) => {
    if (props.multiple) props.onChange(next);
    else props.onChange(next[0] ?? null);
  };
  const choose = (asset: FileAsset) => {
    if (asset.kind !== "image") {
      setError("Select an image file.");
      return;
    }
    change(
      props.multiple
        ? [...values.filter((item) => item.id !== asset.id), asset].slice(
            0,
            props.maxFiles ?? Infinity,
          )
        : [asset],
    );
  };
  const crop = async (asset: FileAsset) => {
    if (!props.onCrop) return;
    setCropping(true);
    setError(undefined);
    try {
      const cropped = await props.onCrop(asset);
      if (cropped.kind !== "image")
        throw new Error("The crop callback must return an image.");
      change(values.map((value) => (value.id === asset.id ? cropped : value)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Crop failed.");
    } finally {
      setCropping(false);
    }
  };
  return (
    <div
      className={["fs-image-picker", props.className].filter(Boolean).join(" ")}
    >
      {values.map((asset) => (
        <div key={asset.id}>
          <AdvancedImage
            asset={asset}
            alt={asset.originalName}
            width={160}
            height={120}
          />
          <button
            type="button"
            disabled={props.disabled || cropping}
            onClick={() =>
              change(values.filter((item) => item.id !== asset.id))
            }
          >
            Remove image
          </button>
          {props.onCrop && (
            <button
              type="button"
              disabled={props.disabled || cropping}
              onClick={() => {
                void crop(asset);
              }}
            >
              Crop image
            </button>
          )}
        </div>
      ))}
      <FileUploader
        accept="image/*"
        multiple={props.multiple}
        maxFiles={props.maxFiles}
        maxSizeBytes={props.maxSizeBytes}
        disabled={props.disabled || cropping}
        onUploadComplete={choose}
      >
        Choose image
      </FileUploader>
      {props.canBrowse !== false && (
        <button
          type="button"
          disabled={props.disabled || cropping}
          onClick={() => setBrowse(true)}
        >
          Browse images
        </button>
      )}
      {error && <p role="alert">{error}</p>}
      {browse && (
        <Dialog label="Choose existing images" onClose={() => setBrowse(false)}>
          <MediaLibrary
            initialKind="image"
            showKindFilter={false}
            multiple={props.multiple}
            canUpload={false}
            canDelete={false}
            value={values}
            onChange={(selected) => {
              change(
                selected
                  .filter((asset) => asset.kind === "image")
                  .slice(0, props.multiple ? (props.maxFiles ?? Infinity) : 1),
              );
              if (!props.multiple) setBrowse(false);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
