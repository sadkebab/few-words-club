"use client";

import { Fragment, useEffect } from "react";

import { Ghost } from "lucide-react";
import { api } from "@/modules/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { QueryTrigger } from "../../post/trigger";
import { IssuePlaceholder } from "../../post/issue-placeholder";
import { Follower, FollowerSkeleton } from "../follower";

const SKELETON_COUNT = 1;

export function FollowerList({
  pageSize,
  userId,
}: {
  pageSize: number;
  userId: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.follows.followersPaginated.useInfiniteQuery(
      {
        userId,
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
    <div className="flex w-full">
      <div className="w-full space-y-4 divide-y border-t">
        {[...Array.from({ length: SKELETON_COUNT })].map((_, i) => (
          <FollowerSkeleton key={i} />
        ))}
      </div>
    </div>
  ) : status === "error" ? (
    <IssuePlaceholder />
  ) : (
    <div className="flex w-full">
      {!hasNextPage && data.pages[0]?.data.length === 0 ? (
        <div className="flex w-full items-center justify-center border-t p-16">
          <div className="flex flex-col items-center justify-between">
            <Ghost className="size-[2.5rem] animate-bounce stroke-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              This list is empty.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full border-t">
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data.map((post) => (
                  <Follower followerData={post} key={post.id} />
                ))}
              </Fragment>
            ))}
            {!hasNextPage && data.pages[0]?.data.length === 1 && (
              <div className="p-8" />
            )}
            <div>
              {hasNextPage && (
                <QueryTrigger fetchNext={() => fetchNextPage()}>
                  bottom
                </QueryTrigger>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
