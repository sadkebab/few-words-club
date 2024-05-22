"use client";

import { type NotificationData } from "@/modules/server/notifications/data";
import { Skeleton } from "../ui/skeleton";
import { Heart, UserPlus2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { clearNotificationAction } from "@/modules/server/notifications/actions";
import { useState } from "react";
import { notificationCounterStore } from "@/modules/stores/counters";
import { UserAvatar } from "../user-avatar";

export function NotificationCard({
  notification,
}: {
  notification: NotificationData;
}) {
  const [fetching, setFetching] = useState(false);
  const { decrease, increase } = notificationCounterStore((state) => state);
  const [optimisticSeen, setOptimisticSeen] = useState(notification.seen);

  const { execute: clear } = useAction(clearNotificationAction, {
    onExecute: () => {
      setFetching(true);
      setOptimisticSeen(true);
      decrease();
    },
    onError: () => {
      increase();
    },
    onSettled: () => {
      setFetching(false);
    },
  });

  const handleClear = async () => {
    if (fetching || notification.seen) return;
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
        <UserAvatar userData={notification.origin} className="size-8" />
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
      <Skeleton className="size-6 w-full sm:w-96" />
    </div>
  );
}
