import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-6">
      <Card className="flex h-fit w-[456px] flex-col" backdrop>
        <CardHeader className="">
          <CardTitle>about fewwordsclub.com...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2 text-sm font-light">
          <p>
            This is not an actual social media platform, this is just a
            side-project of{" "}
            <a href="https://sadkebab.dev/" target="_blank">
              @sadkebab
            </a>{" "}
            made to showcase skills in full-stack web development
          </p>
          <p>
            It was made with Next.js 14 and the app router with libraries like
            Tailwind, tRPC, zustand, Drizzle ORM, shadcn/ui, next-safe-action
            and react-hook-form
          </p>
          <p>
            It also integrates several SaaS platforms for features like
            authentication (clerk.com), database managment (neon.tech) and
            real-time events (pusher.cm)
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <ThemeToggle />
          <Button variant={"secondary"} asChild>
            <Link href={"/"}>Back</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
