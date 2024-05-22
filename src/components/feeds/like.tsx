"use client";

import { Fragment, useEffect } from "react";
import { PostCard, PostSkeleton } from "../post/post-card";
import { api } from "@/modules/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { QueryTrigger } from "../post/trigger";
import { IssuePlaceholder } from "../post/issue-placeholder";
import { GhostPlaceholder } from "../ghost-placeholder";

const SKELETON_COUNT = 1;

export function LikeFeed({
  pageSize,
  userId,
}: {
  pageSize: number;
  userId: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.posts.likeFeed.useInfiniteQuery(
      {
        userId,
        pageSize,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: 1000 * 60 * 1,
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
          <PostSkeleton key={i} />
        ))}
      </div>
    </div>
  ) : status === "error" ? (
    <IssuePlaceholder />
  ) : (
    <div className="flex w-full">
      {!hasNextPage && data.pages[0]?.data.length === 0 ? (
        <GhostPlaceholder>This user does not like anything.</GhostPlaceholder>
      ) : (
        <>
          <div className="w-full border-t">
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data.map((post) => (
                  <PostCard post={post} key={post.id} />
                ))}
              </Fragment>
            ))}
            <div>
              {hasNextPage && (
                <QueryTrigger fetchNext={() => fetchNextPage()}></QueryTrigger>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
