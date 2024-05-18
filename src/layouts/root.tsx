import { ThemeProvider } from "@/components/theme-provider";
import { Fonts } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/modules/trpc/react";

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies().toString();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={Fonts.Inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClerkProvider
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            signInForceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
          >
            <TRPCReactProvider cookies={cookie}>{children}</TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
