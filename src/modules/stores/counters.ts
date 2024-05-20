"use client";

import { create } from "zustand";

export const notificationCounterStore = create<{
  count: number;
  decrease: () => void;
  refresh: (count: number) => number;
}>((set) => ({
  count: 0,
  decrease: () => set((state) => ({ count: state.count + 1 })),
  refresh: (count: number) => {
    set({ count });
    return count;
  },
}));
