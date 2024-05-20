"use client";

import { api } from "@/modules/trpc/react";
import { Fragment, useEffect } from "react";
import { toast } from "../ui/use-toast";
import { IssuePlaceholder } from "../post/issue-placeholder";
import { QueryTrigger } from "../post/trigger";
import { NotificationCard, NotificationCardSkeleton } from "./notification";
import { GhostPlaceholder } from "../ghost-placeholder";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const SKELETON_SIZE = 10;

export function NotificationList({ pageSize }: { pageSize: number }) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.notifications.userNotificationsPaginated.useInfiniteQuery(
      {
        pageSize,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (status === "error") {
      toast({
        title: "Failed to load posts",
        description: error.message,
      });
    }
  }, [status, error]);

  return status === "loading" ? (
    <div className="w-full">
      <div className="border-b p-2">
        <Button variant={"outline"}>
          <Skeleton className="h-4 w-[110px] rounded-sm" />
        </Button>
      </div>
      <div className="w-full border-t">
        {[...Array.from({ length: SKELETON_SIZE })].map((_, i) => (
          <NotificationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  ) : status === "error" ? (
    <IssuePlaceholder className="p-8" />
  ) : (
    <div className="flex w-full">
      {!hasNextPage && data.pages[0]?.data.length === 0 ? (
        <GhostPlaceholder>No notification yet.</GhostPlaceholder>
      ) : (
        <div className="w-full">
          <div className="border-b p-2">
            <Button variant={"outline"}>Mark all as seen</Button>
          </div>
          {data.pages.map((group, i) => (
            <Fragment key={i}>
              {group.data.map((notification) => (
                <NotificationCard
                  notificationData={notification}
                  key={notification.id}
                />
              ))}
            </Fragment>
          ))}
          <div>
            {hasNextPage && (
              <QueryTrigger fetchNext={() => fetchNextPage()}></QueryTrigger>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
