"use client";

import { Fragment, useEffect } from "react";
import { Post, PostSkeleton } from "./post";
import { TriangleAlert } from "lucide-react";
import { api } from "@/modules/trpc/react";
import { useTriggerOnViewportEntrance as useTriggerOnViewportEntrance } from "@/lib/react/viewport";
import { toast } from "../ui/use-toast";
// import { type RouterOutput } from "@/modules/server/api/root";

export function UserPosts({
  userId,
  pageSize,
  // initialData,
}: {
  userId: string;
  pageSize: number;
  // initialData: RouterOutput["posts"]["forUser"];
}) {
  const { data, error, fetchNextPage, hasNextPage, status } =
    api.posts.forUser.useInfiniteQuery(
      {
        userId,
        pageSize,
      },
      {
        // initialData: { pages: [initialData], pageParams: [undefined] },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (status === "error") {
      console.error(error);
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
    <div className="flex justify-center space-y-4 divide-y border-t p-24">
      <TriangleAlert className="size-24 stroke-muted" />
    </div>
  ) : (
    <div className="space-y-4 divide-y border-t">
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.data.map((post) => (
            <Post postData={post} key={post.id} />
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <QueryTrigger fetchNext={() => fetchNextPage()}></QueryTrigger>
      )}
    </div>
  );
}

function QueryTrigger({
  fetchNext,
  children,
  className,
}: {
  fetchNext: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  const { ref } = useTriggerOnViewportEntrance(fetchNext);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
