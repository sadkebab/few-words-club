import { env } from "@/env";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DEFAULT_COVER, DEFAULT_THUMBNAIL } from "./constats";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.OS_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.OS_ACCESS_KEY_ID,
    secretAccessKey: env.OS_SECRET_ACCESS_KEY,
  },
});

const preventList = [DEFAULT_COVER, DEFAULT_THUMBNAIL];

export async function signedUploadUrl(key: string, type: string) {
  if (preventList.includes(key)) {
    throw new Error(
      `The key ${key} is reserved, you can't upload or update to this path`,
    );
  }

  return await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: env.OS_BUCKET_NAME,
      Key: key,
      ContentType: type,
    }),
    { expiresIn: 3600 },
  );
}

export async function signedDownloadUrl(key: string) {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: env.OS_BUCKET_NAME, Key: key }),
    { expiresIn: 3600 },
  );
}

export async function deleteFile(key: string) {
  if (preventList.includes(key)) {
    throw new Error(`Cannot delete ${key} file`);
  }

  await s3.send(
    new DeleteObjectCommand({ Bucket: env.OS_BUCKET_NAME, Key: key }),
  );
}
