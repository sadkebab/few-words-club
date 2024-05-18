import { ProfileSectionButton } from "@/components/client-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userDataWithStats } from "@/modules/server/data/user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, followers, follows } = await userDataWithStats();

  const backgroundImage = `url('${userData.banner ?? "/default_banner.png"}')`;
  return (
    <div className="flex w-full flex-col">
      <div className="w-full bg-cover bg-center" style={{ backgroundImage }}>
        <div className="h-48"></div>
      </div>
      <div className="flex w-full flex-1 flex-col bg-background">
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

            <div className="flex flex-col items-center">
              <p className="text-xs font-medium">Location</p>
              <h3 className="text-sm">{userData.location ?? "Unknown"}</h3>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs font-medium">Bio</p>
              <h4 className="text-sm">{userData.bio ?? "No bio."}</h4>
            </div>
          </div>
        </div>
        <div className="sticky mt-2 flex w-full justify-center">
          <div className="flex gap-1 rounded-md bg-muted p-px">
            <ProfileSectionButton href="/profile">Posts</ProfileSectionButton>
            <ProfileSectionButton href="/profile/likes">
              Likes
            </ProfileSectionButton>
            <ProfileSectionButton href="/profile/followers">
              {followers} Followers
            </ProfileSectionButton>
            <ProfileSectionButton href="/profile/following">
              {follows} Following
            </ProfileSectionButton>
          </div>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
