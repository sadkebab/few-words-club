"use client";
import { useTriggerOnViewportEntrance } from "@/lib/react/viewport";
export function QueryTrigger({
  fetchNext,
  children,
  className,
}: {
  fetchNext: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  const { ref } = useTriggerOnViewportEntrance(fetchNext);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
