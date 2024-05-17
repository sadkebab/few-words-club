import { currentUser } from "@clerk/nextjs/server";
import { DEFAULT_SERVER_ERROR, createSafeActionClient } from "next-safe-action";
import { ActionError } from "./error";

export const action = createSafeActionClient({
  handleReturnedServerError: (error) => {
    if (error instanceof ActionError) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR;
  },
});

export const authenticatedAction = createSafeActionClient({
  middleware: async () => {
    const user = await currentUser();

    if (!user) {
      throw new ActionError("User not found");
    }

    return { user };
  },
  handleReturnedServerError: (error) => {
    if (error instanceof ActionError) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR;
  },
});
