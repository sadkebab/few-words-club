"use client";

import { Fragment, useEffect } from "react";
import { Post, PostSkeleton } from "../post/post";
import { api } from "@/modules/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { QueryTrigger } from "../post/trigger";
import { IssuePlaceholder } from "../post/issue-placeholder";
import { GhostPlaceholder } from "../ghost-placeholder";

const SKELETON_COUNT = 4;

export function SavedFeed({ pageSize }: { pageSize: number }) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.posts.savedFeed.useInfiniteQuery(
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
        <GhostPlaceholder>No saved posts yet.</GhostPlaceholder>
      ) : (
        <>
          <div className="w-full">
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data.map((post) => (
                  <Post postData={post} key={post.id} />
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
