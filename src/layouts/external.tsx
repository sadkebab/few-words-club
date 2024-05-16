import { Button } from "@/components/button";
import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { userOptions } from "@/modules/cookies/server";
// import { currentUser } from "@clerk/nextjs";
// import SignOutButton from "../_components/sign-out";

export async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <div
        className="fixed -left-1/2 -top-1/2 h-[200vh] w-[200vw] bg-confetti bg-cover bg-center bg-no-repeat opacity-70"
      ></div>
      {children}
      <div className="fixed bottom-3 left-1/2 flex -translate-x-1/2 flex-row gap-2 p-1">
        <Button href="/">
          Home
        </Button>
        
        
      </div>
    </>
  );
}
