import { Button } from "@/components/ui/button";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";

export async function InternalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    >
      <div className="fixed -left-1/2 -top-1/2 h-[200vh] w-[200vw] bg-confetti bg-cover bg-center bg-no-repeat opacity-70"></div>
      {children}
      <div className="fixed bottom-3 left-1/2 flex -translate-x-1/2 flex-row gap-2 p-1">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </ClerkProvider>
  );
}
