import { ProfileSectionButton } from "@/components/client-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safe } from "@/lib/safe-actions";
import { db } from "@/modules/db";
import {
  currentUserData,
  userDataWithStats,
} from "@/modules/server/data/users";
import { Suspense } from "react";
import { FollowButton } from "@/components/post/profile/follow-unfollow";
import { DummyFollow } from "@/components/post/profile/dummy-follow";
import Link from "next/link";
import { Ghost } from "lucide-react";

export default async function Layout({
  children,
  params: { username },
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const [target, viewer] = await Promise.all([
    safe(async () => userDataWithStats(username)),
    safe(currentUserData),
  ]);

  if (target === undefined) {
    //FIX ME not-found.tsx not working???
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-between">
          <Ghost className="size-[2.5rem] animate-bounce stroke-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            Page not found.
          </p>
        </div>
      </div>
    );
  }

  const { userData, followers, follows } = target;

  const isProfile = target.userData.id === viewer?.id;

  const backgroundImage = `url('${userData.banner ?? "/default_banner.png"}')`;
  return (
    <div className="flex-1t flex w-full flex-col">
      <div className="w-full bg-cover bg-center" style={{ backgroundImage }}>
        <div className="h-48"></div>
      </div>
      <div className="flex w-full flex-1 flex-col bg-gradient-to-b from-background to-transparent">
        <div className="flex w-full flex-col items-center">
          <Avatar className="-mt-[4.5rem] size-36 border-4 border-background">
            <AvatarImage src={userData.picture ?? "/default_thumb.png"} />
            <AvatarFallback>{userData.displayName?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="mt-2 flex flex-col items-center gap-2 pb-4">
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-lg font-medium">{userData.displayName}</h1>
              <h2 className="font-light">{`(@${userData.username})`}</h2>
            </div>
            {!isProfile && (
              <Suspense fallback={<DummyFollow />}>
                <FollowOrUnfollow
                  targetId={target.userData.id}
                  userId={viewer?.id}
                />
              </Suspense>
            )}
            <div className="mt-4 flex flex-col items-center">
              <p className="text-xs font-medium">Location</p>
              <h3 className="text-sm">{userData.location ?? "Unknown"}</h3>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs font-medium">Bio</p>
              <h4 className="text-sm">{userData.bio ?? "No bio."}</h4>
            </div>
          </div>
        </div>
        <div className="mt-2 flex w-full justify-center">
          <div className="flex gap-1 rounded-md bg-muted p-px">
            <ProfileSectionButton href={`/${username}`}>
              Posts
            </ProfileSectionButton>
            <ProfileSectionButton href={`/${username}/likes`}>
              Likes
            </ProfileSectionButton>
            <ProfileSectionButton href={`/${username}/followers`}>
              {followers} Followers
            </ProfileSectionButton>
            <ProfileSectionButton href={`/${username}/following`}>
              {follows} Following
            </ProfileSectionButton>
          </div>
        </div>
      </div>
      <div className="mt-8 flex-1">{children}</div>
    </div>
  );
}

async function FollowOrUnfollow({
  targetId,
  userId,
}: {
  targetId: string;
  userId?: string;
}) {
  if (!userId)
    return (
      <Link href={"sign-in"}>
        <DummyFollow />
      </Link>
    );

  const follow = await db.query.Follows.findFirst({
    where: (follow, cmp) =>
      cmp.and(cmp.eq(follow.target, targetId), cmp.eq(follow.origin, userId)),
  });

  return <FollowButton target={targetId} value={follow != undefined} />;
}
