import Pusher from "pusher";
import { env } from "@/env";
import { type PusherPayload, type PusherChannel } from "./common";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

export async function dispatch<T extends PusherChannel>(
  channel: T,
  event: string,
  data: PusherPayload<T>,
) {
  await pusher.trigger(channel, event, data);
}
