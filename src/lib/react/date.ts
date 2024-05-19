export function humanDateDiff(from: Date, to: Date): string {
  const diff = to.getTime() - from.getTime();
  const isLessThanMinute = diff < 1000 * 60;
  if (isLessThanMinute) {
    const seconds = Math.floor(diff / 1000);

    if (seconds < 5) {
      return "Just now";
    }

    return seconds + "s";
  }

  const islessThanHour = diff < 1000 * 60 * 60;
  if (islessThanHour) {
    return Math.floor(diff / (1000 * 60)) + "m";
  }

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
