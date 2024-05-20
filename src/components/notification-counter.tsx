"use client";
import useRealTimeEvent from "@/modules/pusher/client";
import { api } from "@/modules/trpc/react";
import { Badge } from "./ui/badge";

export function NotificationCounter({
  count,
  userId,
  children,
}: {
  count: number;
  userId: string;
  children: React.ReactNode;
}) {
  const { data, refetch } = api.notifications.unclearedCount.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: {
        count,
      },
    },
  );

  const utils = api.useUtils();

  useRealTimeEvent({
    channel: "notification",
    event: userId,
    effect: async () => {
      await utils.notifications.unclearedCount.cancel();
      await refetch();
    },
  });

  if (data.count === 0) {
    return <>{children}</>;
  }

  return (
    <div className="flex gap-2">
      {children}
      <Badge>{data.count}</Badge>
    </div>
  );
}
