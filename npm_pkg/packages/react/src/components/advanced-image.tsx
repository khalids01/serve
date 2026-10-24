"use client";
import { forwardRef, useEffect, useMemo, useState } from "react";
import type { FileAsset, ImageTransform } from "../contracts";
import { imageUrl } from "../contracts";
import { cn } from "../lib/cn";

export type AdvancedImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> & {
  alt: string;
  asset: Pick<FileAsset, "urls" | "width" | "height" | "contentType">;
  width?: number;
  height?: number;
  sizes?: string;
  responsiveWidths?: number[];
  format?: ImageTransform["format"];
  quality?: number;
  fit?: React.CSSProperties["objectFit"];
  fallback?: React.ReactNode;
  onLoadingComplete?: (image: HTMLImageElement) => void;
  wrapperClassName?: string;
};

export const AdvancedImage = forwardRef<HTMLImageElement, AdvancedImageProps>(
  function AdvancedImage(
    {
      asset,
      alt,
      width,
      height,
      sizes,
      responsiveWidths,
      format = "webp",
      quality,
      fit = "cover",
      fallback,
      onLoad,
      onError,
      onLoadingComplete,
      className,
      wrapperClassName,
      loading = "lazy",
      decoding = "async",
      style,
      ...props
    },
    ref,
  ) {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const isSvg = asset.contentType === "image/svg+xml";
    const source = useMemo(
      () =>
        isSvg
          ? (asset.urls.image ?? asset.urls.content)
          : imageUrl(asset, { width, height, format, quality }),
      [asset, format, height, isSvg, quality, width],
    );
    useEffect(() => {
      setLoaded(false);
      setFailed(false);
    }, [source]);
    const srcSet = useMemo(() => {
      if (isSvg || !responsiveWidths?.length) return undefined;
      return [
        ...new Set(
          responsiveWidths.filter(
            (value) => Number.isInteger(value) && value > 0,
          ),
        ),
      ]
        .sort((a, b) => a - b)
        .map(
          (value) =>
            `${imageUrl(asset, { width: value, format, quality })} ${value}w`,
        )
        .join(", ");
    }, [asset, format, isSvg, quality, responsiveWidths]);
    if (failed)
      return fallback ? (
        fallback
      ) : (
        <div
          className={cn("fs-image-fallback", wrapperClassName)}
          role="img"
          aria-label={alt || "Image unavailable"}
        >
          Image unavailable
        </div>
      );
    return (
      <span
        className={cn("fs-image", wrapperClassName)}
        style={{
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        }}
      >
        {asset.urls.placeholder && !loaded && (
          <img
            src={asset.urls.placeholder}
            alt=""
            aria-hidden="true"
            className="fs-image__placeholder"
          />
        )}
        <img
          {...props}
          ref={ref}
          src={source}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width ?? asset.width ?? undefined}
          height={height ?? asset.height ?? undefined}
          loading={loading}
          decoding={decoding}
          className={cn(
            "fs-image__main",
            loaded && "fs-image__main--loaded",
            className,
          )}
          style={{ objectFit: fit, ...style }}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
            onLoadingComplete?.(event.currentTarget);
          }}
          onError={(event) => {
            setFailed(true);
            onError?.(event);
          }}
        />
      </span>
    );
  },
);
