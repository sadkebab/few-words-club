"use client";

import { Fragment, useEffect } from "react";
import { Post, PostSkeleton } from "../post/post";
import { Ghost } from "lucide-react";
import { api } from "@/modules/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { QueryTrigger } from "../post/trigger";
import { IssuePlaceholder } from "../post/issue-placeholder";

const SKELETON_COUNT = 4;

export function FollowedFeed({
  pageSize,
  userId,
}: {
  pageSize: number;
  userId: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.posts.followedFeed.useInfiniteQuery(
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
          <PostSkeleton key={i} />
        ))}
      </div>
    </div>
  ) : status === "error" ? (
    <IssuePlaceholder />
  ) : (
    <div className="flex w-full">
      {!hasNextPage && data.pages[0]?.data.length === 0 ? (
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-between">
            <Ghost className="size-[2.5rem] animate-bounce stroke-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              Your feed is empty.
            </p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
