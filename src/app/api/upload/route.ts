export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server'
import { handleUpload } from './service'
import { protect } from '@/features/auth/guard';

export async function POST(request: NextRequest) {
  const auth = await protect(request);
  if (auth instanceof NextResponse) return auth;

  const { user, application } = auth;
  const headers = request.headers;

  const userAgent = headers.get("user-agent");
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    undefined;

  // ✅ NOW read the body (ONE TIME)
  const formData = await request.formData();

  const _headers = {
    userAgent,
    ip,
    applicationId: application?.id ?? headers.get("x-application-id"),
    userId: user.id,
    apiKey:
      headers.get("x-api-key") ??
      headers.get("authorization")?.replace("Bearer ", ""),
  }

  // ✅ Pass ONLY plain data forward
  return handleUpload({
    formData,
    sessionUser: user,
    headers: _headers,
  });
}
