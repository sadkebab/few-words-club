export async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed -left-1/2 -top-1/2 h-[200vh] w-[200vw] animate-spin-slow bg-confetti bg-cover bg-center bg-no-repeat opacity-70"></div>
      {children}
    </>
  );
}
