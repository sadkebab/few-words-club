"use client";

import { create } from "zustand";

type CounterStore = {
  count: number;
  increase: (by?: number) => void;
  decrease: (by?: number) => void;
  refresh: (count: number) => number;
};

export const notificationCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increase: (by?: number) =>
    set((state) => ({ count: state.count + (by ? by : 1) })),
  decrease: (by) => set((state) => ({ count: state.count - (by ? by : 1) })),
  refresh: (count: number) => {
    set({ count });
    return count;
  },
}));

export const messagesCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increase: (by?: number) =>
    set((state) => ({ count: state.count + (by ? by : 1) })),
  decrease: (by) => set((state) => ({ count: state.count - (by ? by : 1) })),
  refresh: (count: number) => {
    set({ count });
    return count;
  },
}));
