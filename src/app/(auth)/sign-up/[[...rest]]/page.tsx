"use client";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { type ComponentProps, useMemo } from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const { theme } = useTheme();

  const appearance = useMemo(() => {
    let result: ComponentProps<typeof SignUp>["appearance"];
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
      <SignUp appearance={appearance} />
    </main>
  );
}
