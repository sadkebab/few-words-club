"use server";

import { DEFAULT_COVER } from "@/lib/constats";
import {
  SaveUserMediaSchema,
  SaveUserSchema,
  UpdateMediaSchema,
  UpdateUserDataSchema,
} from "./validators";
import { authenticatedAction, safe, userAction } from "@/lib/safe-actions";
import { ActionError } from "@/lib/safe-actions/error";
import { db } from "@/modules/db";

import { UserData } from "@/modules/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { waitUntil } from "@vercel/functions";
import { deleteFile } from "@/lib/s3";
import { first } from "@/lib/drizzle";

export const saveUserDataAction = authenticatedAction(
  SaveUserSchema,
  async ({ username, displayName, country: location, bio }, { user }) => {
    const existing = await first(
      db
        .select({
          id: UserData.id,
        })
        .from(UserData)
        .where(eq(UserData.username, username)),
    );

    if (existing) {
      throw new ActionError("Username already taken");
    }

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

export const updateUserDataAction = userAction(
  UpdateUserDataSchema,
  async ({ displayName, country: location, bio }, { userData }) => {
    const result = await db
      .update(UserData)
      .set({
        displayName,
        location,
        bio,
      })
      .where(eq(UserData.id, userData.id))
      .returning();

    if (result.length === 0) {
      throw new ActionError("Failed to save user data");
    }

    return revalidatePath(`/${userData.username}`);
  },
);

export const skipMediaOnboardingAction = authenticatedAction(
  z.null().optional(),
  async (_, { user }) => {
    const result = await db
      .update(UserData)
      .set({
        onboardingCompleted: true,
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
        onboardingCompleted: true,
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
    const { picture: currentPicture } = userData;

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

    waitUntil(safe(async () => currentPicture && deleteFile(currentPicture)));

    return revalidatePath(`/${userData.username}`);
  },
);

export const updateCoverAction = userAction(
  UpdateMediaSchema,
  async ({ source }, { userData }) => {
    const { cover: currentPicture } = userData;
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

    waitUntil(safe(async () => currentPicture && deleteFile(currentPicture)));

    return revalidatePath(`/${userData.username}`);
  },
);
