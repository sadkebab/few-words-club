type PusherMapping = {
  notification: null; //userId
  message: null; //userId
};

export type PusherChannel = keyof PusherMapping;
export type PusherPayload<T extends PusherChannel> = PusherMapping[T];
