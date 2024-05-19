"use server";
import { DEFAULT_BANNER, DEFAULT_THUMBNAIL } from "@/lib/constats";
import { SaveUserSchema } from "../validators/onboarding";
import { authenticatedAction } from "@/lib/safe-actions";
import { ActionError } from "@/lib/safe-actions/error";
import { db } from "@/modules/db";

import { UserData } from "@/modules/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

export const saveUserDataAction = authenticatedAction(
  SaveUserSchema,
  async ({ username, displayName, country: location, bio }, { user }) => {
    const id = nanoid();
    console.log("location", location);
    const result = await db
      .insert(UserData)
      .values({
        id,
        username,
        clerkId: user.id,
        displayName,
        location,
        bio,
      })
      .returning();

    if (result.length === 0) {
      throw new ActionError("Failed to save user data");
    }

    return { created: result[0]!.id };
  },
);

export const skipMediaOnboardingAction = authenticatedAction(
  z.null().optional(),
  async (_, { user }) => {
    const result = await db
      .update(UserData)
      .set({ picture: DEFAULT_THUMBNAIL, banner: DEFAULT_BANNER })
      .where(eq(UserData.clerkId, user.id))
      .returning();

    if (result.length == 0) {
      throw new ActionError("User not found");
    }

    return { skipped: result[0]!.id };
  },
);

//TODO image upload
