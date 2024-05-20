import { env } from "@/env";

export function mediaUrl(key: string) {
  key = key.replace(/^\/+/, "");
  return `${env.NEXT_PUBLIC_OS_URL}/${key}`;
}
