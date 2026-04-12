/** Simulates network latency so components handle loading states correctly. */
export const delay = () => new Promise<void>((r) => setTimeout(r, 300));
