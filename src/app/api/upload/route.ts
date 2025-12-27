export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { handleUpload } from './service'
import { getCurrentUser } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  // ✅ Extract session / auth info FIRST
  const headers = request.headers;
  const userAgent = headers.get("user-agent");
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    undefined;

  // If getCurrentUser needs cookies/headers, do it NOW
  const sessionUser = await getCurrentUser(headers);

  // ✅ NOW read the body (ONE TIME)
  const formData = await request.formData();

  // ✅ Pass ONLY plain data forward
  return handleUpload({
    formData,
    sessionUser,
    headers: {
      userAgent,
      ip,
      applicationId: headers.get("x-application-id"),
      userId: headers.get("x-user-id"),
      apiKey:
        headers.get("x-api-key") ??
        headers.get("authorization")?.replace("Bearer ", ""),
    },
  });
}
