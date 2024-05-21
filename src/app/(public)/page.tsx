import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Fonts } from "@/lib/fonts";
import { Origami } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <>
      {/* <div className="fixed -left-1/2 -top-1/2 h-[200vh] w-[200vw] animate-spin-slow bg-confetti bg-cover bg-center bg-no-repeat opacity-70"></div> */}
      <main className="z-10 flex min-h-svh flex-row items-center justify-center p-8">
        <Card backdrop>
          <CardHeader>
            <h1
              className="flex items-center gap-1 text-3xl"
              style={Fonts.Syne_Mono.style}
            >
              <Origami className="size-12" /> Few Words Club
            </h1>
          </CardHeader>
          <CardContent>
            <p style={Fonts.Syne_Mono.style}>
              A place where you can share what you want in few words
            </p>
          </CardContent>
          <CardFooter className="justify-between gap-1">
            <div className="flex gap-1">
              <Button variant={"outline"} size={"icon"} asChild>
                <Link href="/about">
                  <Origami />
                </Link>
              </Button>
              <ThemeToggle />
            </div>

            <div className="flex gap-1">
              <Button variant={"outline"} asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
