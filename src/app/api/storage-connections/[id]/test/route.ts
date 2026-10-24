import { NextResponse } from "next/server";
import { requireSession, sessionApi } from "@/lib/session-api";
import { ownedConnection, testConnection } from "@/lib/storage/connections";
import { decryptStorageCredentials } from "@/lib/storage/secrets";
export function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const user = await requireSession(request),
      { id } = await context.params,
      row = await ownedConnection(id, user.id);
    await testConnection(
      {
        ...row,
        provider: row.provider as "s3",
        ...decryptStorageCredentials(row.encryptedCredentials, user.id, id),
      },
      id,
    );
    return NextResponse.json({ success: true });
  });
}
