"use server";

import { signedUploadUrl } from "@/lib/s3";
import { userAction } from "@/lib/safe-actions";
import { nanoid } from "nanoid";
import { z } from "zod";

export const fileUploadUrlAction = userAction(
  z.object({
    key: z.string(),
    contentType: z.string(),
    type: z.enum(["thumb", "cover", "media"]),
  }),

  async ({ key, type, contentType }, { userData }) => {
    const id = nanoid();
    const compoundKey = `${userData.id}/${type}/${id}.${extension(key)}`;
    const presignedUrl = await signedUploadUrl(compoundKey, contentType);
    return {
      url: presignedUrl,
      key: compoundKey,
    };
  },
);

function extension(s: string) {
  const parts = s.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}
