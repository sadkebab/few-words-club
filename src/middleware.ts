import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { db } from "./modules/db";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/messages(.*)",
  "/notifications(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/onboarding(.*)",
]);

const isOnboarding = createRouteMatcher(["/onboarding"]);
const isOnboardingMedia = createRouteMatcher(["/onboarding/media"]);

const isHome = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  if (isHome(req) && auth().userId) {
    return NextResponse.redirect(
      `${req.nextUrl.protocol}${req.nextUrl.host}/dashboard`,
    );
  }

  if (isProtectedRoute(req)) {
    auth().protect();
    const userId = auth().userId;

    if (userId) {
      const userData = await db.query.UserData.findFirst({
        where: (UserData, { eq }) => eq(UserData.clerkId, userId),
      });

      // console.log("userData", userData, userId);

      if (!userData && !isOnboarding(req)) {
        return NextResponse.redirect(
          `${req.nextUrl.protocol}${req.nextUrl.host}/onboarding`,
        );
      }

      if (userData && isOnboarding(req)) {
        return NextResponse.redirect(
          `${req.nextUrl.protocol}${req.nextUrl.host}/dashboard`,
        );
      }

      if (userData && !userData.picture && !isOnboardingMedia(req)) {
        return NextResponse.redirect(
          `${req.nextUrl.protocol}${req.nextUrl.host}/onboarding/media`,
        );
      }
    }
  }
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
