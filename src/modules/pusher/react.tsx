"use client";

import useNotificationListener from "@/modules/pusher/client";
import { useRouter } from "next/navigation";
import { type PusherPayload, type PusherChannel } from "./common";

// you can use useEvent directly, this is just a wrapper for ergonomics
export function EffectListener<T extends PusherChannel>({
  channel,
  event,
  effect,
}: {
  channel: T;
  event: string;
  effect: (data: PusherPayload<T>) => void;
}) {
  useNotificationListener(channel, event, effect);
  return <></>;
}

// This is meant for triggering a refresh of Server Components
export function RefreshListener<T extends PusherChannel>({
  channel,
  event,
}: {
  channel: T;
  event: string;
}) {
  const router = useRouter();
  useNotificationListener(channel, event, (_: PusherPayload<T>) =>
    router.refresh(),
  );
  return <></>;
}
