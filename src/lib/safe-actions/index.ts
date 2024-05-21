import { currentUser } from "@clerk/nextjs/server";
import { DEFAULT_SERVER_ERROR, createSafeActionClient } from "next-safe-action";
import { ActionError } from "./error";
import { db } from "@/modules/db";

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

export const userAction = createSafeActionClient({
  middleware: async () => {
    const user = await currentUser();

    if (!user) {
      throw new ActionError("User not found");
    }

    const userData = await db.query.UserData.findFirst({
      where: (data, cmp) => cmp.eq(data.clerkId, user.id),
    });

    if (!userData) {
      throw new ActionError("User data not found");
    }

    return { userData };
  },
  handleReturnedServerError: (error) => {
    if (error instanceof ActionError) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR;
  },
});

export async function safe<T>(resolver: () => Promise<T>) {
  try {
    return await resolver();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ [safe interception] ${error.message}`);
    }
    return undefined;
  }
}
