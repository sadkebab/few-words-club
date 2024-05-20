/**
 * @description
 * Drizzle ORM queries resolve to a list and there is
 * no utility in the package to get the first element of the list.
 * This is a basic utility that will await any promise
 * that returns a generic list and unwrap the first element.
 */
export async function first<T>(query: Promise<T[]>) {
  return (await query)[0];
}
