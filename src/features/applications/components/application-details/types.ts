export interface ApplicationDTO {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    storageDir: string;
    _count: { images: number; apiKeys: number };
}

export interface ImageFileDTO {
    id: string;
    filename: string;
    originalName: string;
    contentType: string;
    sizeBytes: number;
    width?: number;
    height?: number;
    createdAt: string;
    variants: Array<{
        id: string;
        label: string;
        filename: string;
        width?: number;
        height?: number;
        sizeBytes: number;
    }>;
}

export interface AuditLogItemDTO {
    id: string;
    userId?: string | null;
    applicationId?: string | null;
    action: string;
    targetId?: string | null;
    ip?: string | null;
    userAgent?: string | null;
    metadata?: any;
    createdAt: string;
}

export interface CacheItem {
    name: string;
    sizeBytes: number;
    mtimeMs?: number;
}
export interface CacheResponse {
    items: CacheItem[];
    totalBytes: number;
}
