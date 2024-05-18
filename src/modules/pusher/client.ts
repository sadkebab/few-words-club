"use client";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { env } from "@/env";
import { type PusherChannel, type PusherPayload } from "./common";

const clientPusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

export default function useNotificationListener<T extends PusherChannel>(
  channelName: T,
  event: string,
  effect: (data: PusherPayload<T>) => void,
) {
  useEffect(() => {
    const channel = clientPusher.subscribe(channelName);
    channel.bind(event, effect);

    return () => {
      channel.unbind(event, effect);
      clientPusher.unsubscribe(channelName);
    };
  });
}
