import { ThemeProvider } from "@/components/theme-provider";
import { Fonts } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            {children}
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
