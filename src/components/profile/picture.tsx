import Image from "next/image";

export function Picture({ image }: { image: string }) {
  return (
    <div className="relative -mt-[4.5rem] size-36 rounded-full border-4 border-background bg-muted">
      <Image
        src={image}
        width={144}
        height={144}
        className="rounded-full"
        objectFit="cover"
        alt={"thumbnail"}
      />
    </div>
  );
}
