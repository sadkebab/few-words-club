// import { Button } from "@/components/ui/button";
// import { currentUser } from "@clerk/nextjs/server";
// import { Home } from "lucide-react";
// import Link from "next/link";

export async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full bg-yellow-100">
      <div className="w-12 bg-red-100 p-1">asd</div>
      <div className="flex-1 bg-green-300">{children}</div>
    </div>
  );
}

// async function Toolbar() {
//   const user = await currentUser();
//   const isLogged = user !== null;

//   return (
//     <div className="flex flex-col gap-1">
//       <Button asChild>
//         <Link href="/dashboard">
//           <Home /> Feed
//         </Link>
//       </Button>
//       <Button asChild>
//         <Link href="/dashboard">
//           <Home /> Feed
//         </Link>
//       </Button>
//     </div>
//   );
// }
