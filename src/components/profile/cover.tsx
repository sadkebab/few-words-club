export function Cover({ image }: { image: string }) {
  return (
    <div
      className="w-full bg-cover bg-center"
      style={{ backgroundImage: image }}
    >
      <div className="h-48"></div>
    </div>
  );
}
