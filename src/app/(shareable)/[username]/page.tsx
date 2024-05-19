import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (user) return notFound();

  return redirect("/");
}
