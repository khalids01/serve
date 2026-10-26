import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { StorageLocationError } from "@/lib/storage/locations";
import { StorageSecretError } from "@/lib/storage/secrets";
import { UploadValidationError } from "@/lib/v1-upload";
export async function requireSession(request: Request) {
  const user = await getCurrentUser(request.headers);
  if (!user) throw new StorageLocationError("Sign in to continue.", 401);
  return user;
}
export async function requireOwnedApplication(
  request: Request,
  applicationId: string,
) {
  const user = await requireSession(request);
  const app = await prisma.application.findFirst({
    where: { id: applicationId, ownerId: user.id },
  });
  if (!app) throw new StorageLocationError("Application not found.", 404);
  return { user, app };
}
export function sessionApi(handler: () => Promise<Response>) {
  return handler().catch((cause) => {
    const code =
      cause && typeof cause === "object"
        ? (cause.code ?? cause.name)
        : undefined;
    const conflict = [
      "EEXIST",
      "ENOTEMPTY",
      "PreconditionFailed",
      "ConditionalRequestConflict",
    ].includes(String(code));
    const status = conflict
      ? 409
      : cause instanceof StorageLocationError ||
          cause instanceof UploadValidationError
        ? cause.status
        : cause instanceof StorageSecretError
          ? 503
          : cause instanceof ZodError || cause instanceof SyntaxError
            ? 400
            : 500;
    const message = conflict
      ? "An item already exists or the folder changed. Refresh and choose another name."
      : status === 500
        ? "The operation could not be completed. Check the connection and try again."
        : cause instanceof ZodError
          ? (cause.issues[0]?.message ?? "Invalid input.")
          : cause.message;
    return NextResponse.json(
      { error: message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  });
}
