"use client";
import useRealTimeEvent from "@/modules/pusher/client";
import { api } from "@/modules/trpc/react";
import { Badge } from "./ui/badge";
import { notificationCounterStore } from "@/modules/stores/counters";
import { useEffect } from "react";

export function NotificationCounter({
  count,
  userId,
  children,
}: {
  count: number;
  userId: string;
  children: React.ReactNode;
}) {
  const { count: optimisticCount, refresh } = notificationCounterStore(
    (state) => state,
  );

  useEffect(() => {
    refresh(count);
  }, [count, refresh]);

  const { refetch } = api.notifications.unclearedCount.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => {
      return { count };
    },
    onSuccess: (data) => {
      refresh(data.count);
    },
  });

  const utils = api.useUtils();

  useRealTimeEvent({
    channel: "notification",
    event: userId,
    onEvent: async () => {
      await utils.notifications.unclearedCount.cancel();
      await refetch();
    },
  });

  if (optimisticCount === 0) {
    return <>{children}</>;
  }

  return (
    <div className="flex gap-2">
      {children}
      <Badge>{optimisticCount}</Badge>
    </div>
  );
}
