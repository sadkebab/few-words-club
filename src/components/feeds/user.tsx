"use client";

import { Fragment, useEffect } from "react";
import { Post, PostSkeleton } from "../post/post";
import { api } from "@/modules/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { QueryTrigger } from "../post/trigger";
import { IssuePlaceholder } from "../post/issue-placeholder";
import { GhostPlaceholder } from "../ghost-placeholder";

export function UserFeed({
  userId,
  pageSize,
}: {
  userId: string;
  pageSize: number;
}) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.posts.forUser.useInfiniteQuery(
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
    <div className="space-y-4 divide-y border-t">
      <PostSkeleton />
    </div>
  ) : status === "error" ? (
    <IssuePlaceholder />
  ) : (
    <div className="flex w-full">
      {!hasNextPage && data.pages[0]?.data.length === 0 ? (
        <GhostPlaceholder>No post yet.</GhostPlaceholder>
      ) : (
        <div className="w-full border-t">
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
      )}
    </div>
  );
}