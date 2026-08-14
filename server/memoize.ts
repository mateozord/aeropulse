/** Wraps an async fetcher with a simple time-based cache, shared by the dev proxy and the production function. */
export function memoize<T>(fetcher: () => Promise<T>, ttlMs: number) {
  let cache: { value: T; fetchedAt: number } | null = null;

  return async (): Promise<T> => {
    if (cache && Date.now() - cache.fetchedAt < ttlMs) return cache.value;
    const value = await fetcher();
    cache = { value, fetchedAt: Date.now() };
    return value;
  };
}
