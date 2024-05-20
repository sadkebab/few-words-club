import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";

import { getUrl, transformer } from "./shared";
import { type AppRouter } from "@/modules/server/root";
import { env } from "@/env";

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        (!env.NEXT_PUBLIC_MUTE_TRPC &&
          process.env.NODE_ENV === "development") ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: getUrl(),
      headers() {
        return {
          cookies: document.cookie,
        };
      },
    }),
  ],
});
