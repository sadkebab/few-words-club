"use server";

import { DEFAULT_COVER, DEFAULT_THUMBNAIL } from "@/lib/constats";
import {
  SaveUserMediaSchema,
  SaveUserSchema,
  UpdateMediaSchema,
} from "./validators";
import { authenticatedAction, userAction } from "@/lib/safe-actions";
import { ActionError } from "@/lib/safe-actions/error";
import { db } from "@/modules/db";

import { UserData } from "@/modules/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const saveUserDataAction = authenticatedAction(
  SaveUserSchema,
  async ({ username, displayName, country: location, bio }, { user }) => {
    const id = nanoid();

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
    console.log("skipMediaOnboardingAction", user.id);
    const result = await db
      .update(UserData)
      .set({
        picture: DEFAULT_THUMBNAIL,
        cover: DEFAULT_COVER,
      })
      .where(eq(UserData.clerkId, user.id))
      .returning();

    if (result.length == 0) {
      throw new ActionError("User not found");
    }

    return { skipped: result[0]!.id };
  },
);

export const saveUserMediaAction = userAction(
  SaveUserMediaSchema,
  async ({ cover, picture }, { userData }) => {
    const result = await db
      .update(UserData)
      .set({
        cover: cover ?? DEFAULT_COVER,
        picture,
      })
      .where(eq(UserData.id, userData.id))
      .returning();

    if (result.length === 0) {
      throw new ActionError("Failed to save user media");
    }

    return { updated: result[0]!.id };
  },
);

export const updateProfilePrictureAction = userAction(
  UpdateMediaSchema,
  async ({ source }, { userData }) => {
    const result = await db
      .update(UserData)
      .set({
        picture: source,
      })
      .where(eq(UserData.id, userData.id))
      .returning();

    if (result.length === 0) {
      throw new ActionError("Failed to update profile picture");
    }

    return revalidatePath(`/${userData.username}`);
  },
);

export const updateCoverPrictureAction = userAction(
  UpdateMediaSchema,
  async ({ source }, { userData }) => {
    const result = await db
      .update(UserData)
      .set({
        cover: source,
      })
      .where(eq(UserData.id, userData.id))
      .returning();

    if (result.length === 0) {
      throw new ActionError("Failed to update profile picture");
    }

    return revalidatePath(`/${userData.username}`);
  },
);
