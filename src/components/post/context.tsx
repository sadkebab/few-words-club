"use client";

import { createContext, useContext } from "react";

const PostContext = createContext<
  | {
      viewerId: string | undefined;
      cursorDate: Date;
    }
  | undefined
>(undefined);

export function PostContextProvider({
  children,
  viewerId,
  cursorDate,
}: {
  children: React.ReactNode;
  viewerId: string | undefined;
  cursorDate: Date;
}) {
  return (
    <PostContext.Provider value={{ viewerId, cursorDate }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostContextProvider");
  }
  return context;
}
