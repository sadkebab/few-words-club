"use client";

import { type PostData } from "@/modules/server/posts/data";
import { PostCard } from "@/components/post/post";
import { PostContextProvider } from "@/components/post/context";
import { api } from "@/modules/trpc/react";
import { Fragment, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { QUERY_PAGE_SIZE } from "@/lib/constats";
import { IssuePlaceholder } from "@/components/post/issue-placeholder";
import { QueryTrigger } from "@/components/post/trigger";
import { LikeCard, LikeCardSkeleton } from "@/components/post/like-card";

export function PostView({
  postData,
  viewerId,
}: {
  postData: PostData;
  viewerId: string;
}) {
  return (
    <PostContextProvider viewerId={viewerId} cursorDate={new Date()}>
      <PostCard postData={postData} />
      <PostLikes
        postId={postData.id}
        pageSize={QUERY_PAGE_SIZE}
        postLikes={postData.likeCount}
      />
    </PostContextProvider>
  );
}

function PostLikes({
  postId,
  pageSize,
  postLikes,
}: {
  postId: string;
  pageSize: number;
  postLikes: number;
}) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.likes.postLikesPaginated.useInfiniteQuery(
      {
        postId,
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
      <div className="w-full divide-y border-t">
        {[...Array.from({ length: postLikes < 10 ? postLikes : 10 })].map(
          (_, i) => (
            <LikeCardSkeleton key={i} />
          ),
        )}
      </div>
    </div>
  ) : status === "error" ? (
    <IssuePlaceholder className="p-8" />
  ) : (
    <div className="flex w-full">
      {!hasNextPage && data.pages[0]?.data.length === 0 ? (
        <div className="flex w-full flex-1 items-center justify-center">
          <p className="p-2 text-muted-foreground">No likes yet.</p>
        </div>
      ) : (
        <div className="w-full">
          {data.pages.map((group, i) => (
            <Fragment key={i}>
              {group.data.map((like) => (
                <LikeCard likeData={like} key={like.id} />
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
