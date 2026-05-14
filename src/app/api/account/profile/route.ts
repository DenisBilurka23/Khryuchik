import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import { deleteUserAvatarObject, uploadUserAvatarFile } from "@/server/storage/r2-assets.service";
import { isR2Configured } from "@/server/storage/r2";
import { updateAccountUserProfile } from "@/server/users/services/users.service";
import { UserOperationErrorReason } from "@/types/users";
import { EMAIL_PATTERN } from "@/utils/validation";

const isUploadedFile = (value: FormDataEntryValue | null): value is File =>
  value instanceof File && value.size > 0;

const getTrimmedFormValue = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};

export async function PATCH(request: Request) {
  let uploadedAvatar: Awaited<ReturnType<typeof uploadUserAvatarFile>> | undefined;

  const cleanupUploadedAvatar = async () => {
    if (!uploadedAvatar?.objectKey) {
      return;
    }

    await deleteUserAvatarObject(uploadedAvatar.objectKey).catch(() => undefined);
  };

  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    const isJsonRequest = contentType.includes("application/json");

    const body = isJsonRequest ? await request.json() : null;
    const formData = isJsonRequest ? null : await request.formData();
    const name = isJsonRequest
      ? typeof body?.name === "string"
        ? body.name.trim()
        : ""
      : getTrimmedFormValue(formData!, "name");
    const email = isJsonRequest
      ? typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : ""
      : getTrimmedFormValue(formData!, "email").toLowerCase();
    const phone = isJsonRequest
      ? typeof body?.phone === "string"
        ? body.phone.trim()
        : ""
      : getTrimmedFormValue(formData!, "phone");
    const rawRemoveAvatar = isJsonRequest ? body?.removeAvatar : formData?.get("removeAvatar");
    const removeAvatar = rawRemoveAvatar === true || rawRemoveAvatar === "1" || rawRemoveAvatar === "true";
    const rawAvatar = formData?.get("avatar") ?? null;
    const avatarFile = isUploadedFile(rawAvatar) ? rawAvatar : null;

    if (!name || !email) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    if (avatarFile && !isR2Configured) {
      return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
    }

    if (avatarFile) {
      uploadedAvatar = await uploadUserAvatarFile({ userId: session.user.id, file: avatarFile });

      if (!uploadedAvatar.url) {
        await cleanupUploadedAvatar();
        return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
      }
    }

    const result = await updateAccountUserProfile(session.user.id, {
      name,
      email,
      phone,
      ...(uploadedAvatar
        ? {
            image: uploadedAvatar.url,
            avatarObjectKey: uploadedAvatar.objectKey,
          }
        : removeAvatar
          ? {
              image: null,
              avatarObjectKey: null,
            }
          : {}),
    });

    if (!result.ok) {
      await cleanupUploadedAvatar();

      const status =
        result.reason === UserOperationErrorReason.EmailTaken
          ? 409
          : result.reason === UserOperationErrorReason.EmailManagedByGoogle
            ? 403
            : result.reason === UserOperationErrorReason.NotFound
              ? 404
              : 400;

      return NextResponse.json({ error: result.reason }, { status });
    }

    if (
      result.previousAvatarObjectKey &&
      result.previousAvatarObjectKey !== result.nextAvatarObjectKey
    ) {
      await deleteUserAvatarObject(result.previousAvatarObjectKey).catch(() => undefined);
    }

    return NextResponse.json({ ok: true, user: result.user });
  } catch {
    await cleanupUploadedAvatar();
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}