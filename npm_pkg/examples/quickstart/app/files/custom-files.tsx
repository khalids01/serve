"use client";

import {
  AdvancedImage,
  type FileAsset,
  FileUploader,
  useFiles,
  useStorageLocations,
} from "@skycanvasstudio/serve-react";

// Render inside FileServerProvider, just like MediaLibrary.
export function CustomFiles({ page = 1 }: { page?: number }) {
  const files = useFiles({ page, limit: 24, kind: "image" });
  const destinations = useStorageLocations();
  if (files.loading || destinations.loading) return <p>Loading…</p>;
  if (files.error || destinations.error)
    return <p role="alert">Unable to load files.</p>;
  const onUploaded = (_asset: FileAsset) => files.refetch();
  return (
    <section>
      <FileUploader
        storageLocationId={destinations.defaultStorageLocationId}
        onUploadComplete={onUploaded}
      />
      <p>
        Page {files.pagination?.page} of {files.pagination?.pages}. Pass a new
        page prop to paginate.
      </p>
      {files.data.map((asset) => (
        <AdvancedImage
          key={asset.id}
          asset={asset}
          alt={asset.originalName}
          width={640}
          height={480}
          responsiveWidths={[320, 640, 960]}
          sizes="(max-width: 640px) 100vw, 640px"
          quality={80}
          format="webp"
          fit="contain"
          loading="lazy"
          fallback={<span>Image unavailable</span>}
        />
      ))}
    </section>
  );
}
