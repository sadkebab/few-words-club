"use client";

import { type NotificationData } from "@/modules/server/notifications/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Heart, UserPlus2 } from "lucide-react";
import Link from "next/link";
import { DEFAULT_THUMBNAIL } from "@/lib/constats";
import { cn } from "@/lib/utils";
import { api } from "@/modules/trpc/react";
import { useAction } from "next-safe-action/hooks";
import { clearNotificationAction } from "@/modules/server/notifications/actions";
import { useState } from "react";
import { notificationCounterStore } from "@/modules/client-state/counters";

export function NotificationCard({
  notificationData,
}: {
  notificationData: NotificationData;
}) {
  const [optimisticSeen, setOptimisticSeen] = useState(notificationData.seen);
  const [fetching, setFetching] = useState(false);
  const { decrease } = notificationCounterStore((state) => state);
  const { data: notification, refetch } = api.notifications.single.useQuery(
    {
      notificationId: notificationData.id,
    },
    {
      initialData: notificationData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const { execute: clear } = useAction(clearNotificationAction, {
    onExecute: () => {
      setFetching(true);
      setOptimisticSeen(true);
    },
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      setFetching(false);
    },
    onSettled: () => {
      setFetching(false);
    },
  });

  const handleClear = async () => {
    if (fetching || notification.seen) return;
    decrease();
    clear({ notificationId: notification.id });
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between border-b p-6",
        !optimisticSeen && "bg-muted/60",
      )}
      onClick={handleClear}
    >
      <div className="flex flex-row items-center gap-4">
        <Link href={`/${notification.origin.username}`}>
          <Avatar className="size-8">
            <AvatarFallback>
              {notification.origin.displayName?.slice(0, 2)}
            </AvatarFallback>
            <AvatarImage
              src={notification.origin.picture ?? DEFAULT_THUMBNAIL}
            />
          </Avatar>
        </Link>
        <div className="flex items-center gap-2">
          <p className="leading-none">
            <Link href={`/${notification.origin.username}`}>
              <span className="font-medium">
                {notification.origin.displayName}
              </span>{" "}
              <span className="text-sm">(@{notification.origin.username})</span>{" "}
            </Link>
            {notification.type === "like" ? (
              <Link href={notification.link}>liked your post</Link>
            ) : notification.type === "follow" ? (
              <Link href={notification.link}>followed you</Link>
            ) : null}
          </p>
        </div>
      </div>

      {notification.type === "like" ? (
        <Heart className="fill-red-500 stroke-red-500" />
      ) : (
        <UserPlus2 />
      )}
    </div>
  );
}
export function NotificationCardSkeleton() {
  return (
    <div className="flex flex-row items-center gap-2 border-b p-6">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="size-6 w-96" />
    </div>
  );
}
