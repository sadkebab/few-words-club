"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { type ComponentProps, useMemo } from "react";

export default function Page() {
  const { theme } = useTheme();

  const appearance = useMemo(() => {
    let result: ComponentProps<typeof SignIn>["appearance"];
    if (theme === "dark") {
      result = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        baseTheme: dark,
      };
    }
    return result;
  }, [theme]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-2">
      <SignIn appearance={appearance} />
    </main>
  );
}
