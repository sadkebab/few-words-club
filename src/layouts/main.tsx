import {
  currentUserData,
  unreadCounter,
} from "@/modules/server/user-data/data";
import { safe } from "@/lib/safe-actions";
import { Toolbar } from "@/components/layout/toolbar";
import { MobileToolbar } from "@/components/layout/mobile-toolbar";

export async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await safe(currentUserData);
  const unread = userData?.id
    ? await unreadCounter(userData.id)
    : { messages: 0, notifications: 0 };

  return (
    <>
      <div className="fixed -left-1/2 -top-1/2 h-[200vh] w-[200vw] animate-spin-slow bg-confetti bg-cover bg-center bg-no-repeat opacity-50" />
      <main className="flex min-h-screen w-full">
        <div className="flex w-full flex-1 flex-col gap-2 p-2 2xl:container sm:gap-4 sm:p-4">
          <div className="flex w-full flex-1 gap-2 sm:gap-4">
            <div className="z-10 hidden w-[244px] sm:flex lg:w-[458px]">
              <div className="flex flex-1 rounded-xl border backdrop-blur-md">
                <Toolbar userData={userData} unread={unread} />
              </div>
            </div>
            <div className="flex flex-1 bg-background">
              <div className="flex max-h-[calc(100vh-5rem)] flex-1 flex-nowrap overflow-y-scroll rounded-xl border backdrop-blur-md sm:max-h-[calc(100vh-2rem)]">
                {children}
              </div>
            </div>
          </div>
          <div className="flex h-14 w-full rounded-xl border backdrop-blur-md sm:hidden">
            <MobileToolbar userData={userData} unread={unread} />
          </div>
        </div>
      </main>
    </>
  );
}
