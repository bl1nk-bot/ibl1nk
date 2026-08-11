/**
 * Filter out falsey values and flatten nested arrays
 */
export function buildArray<T>(
  ...items: (
    | T
    | null
    | undefined
    | false
    | 0
    | ""
    | (T | null | undefined | false | 0 | "")[]
  )[]
): T[] {
  const result: T[] = [];
  for (const item of items) {
    if (Array.isArray(item)) {
      result.push(...(item.filter(Boolean) as T[]));
    } else if (item) {
      result.push(item as T);
    }
  }
  return result;
}
