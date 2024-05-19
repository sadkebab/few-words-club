export function humanDateDiff(from: Date, to: Date): string {
  const diff = to.getTime() - from.getTime();
  const isLessThanDay = diff < 1000 * 60 * 60 * 24;
  if (isLessThanDay) {
    return Math.floor(diff / (1000 * 60 * 60)) + "h";
  }

  const isLessThanAMonth = diff < 1000 * 60 * 60 * 24 * 30;
  if (isLessThanAMonth) {
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + "d";
  }

  const isSameYear = from.getFullYear() === to.getFullYear();
  if (isSameYear) {
    return from.toLocaleString("default", { month: "short", day: "numeric" });
  }

  return from.toLocaleString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
