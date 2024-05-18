"use client";

import { createContext, useContext } from "react";

const PostContext = createContext<
  | {
      viewerId: string | undefined;
    }
  | undefined
>(undefined);

export function PostContextProvider({
  children,
  viewerId,
}: {
  children: React.ReactNode;
  viewerId: string | undefined;
}) {
  return (
    <PostContext.Provider value={{ viewerId }}>{children}</PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostContextProvider");
  }
  return context;
}
