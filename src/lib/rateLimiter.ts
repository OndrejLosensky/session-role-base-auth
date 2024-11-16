// src/lib/rateLimiter.ts
const rateLimitStore: Record<string, { count: number; lastRequest: number }> = {};
const RATE_LIMIT = 5; // Max requests
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes

export function rateLimiter(ip: string) {
  const now = Date.now();

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, lastRequest: now };
  } else {
    const { lastRequest } = rateLimitStore[ip];

    // Reset count if the time window has passed
    if (now - lastRequest > TIME_WINDOW) {
      rateLimitStore[ip] = { count: 1, lastRequest: now };
    } else {
      rateLimitStore[ip].count += 1;
    }
  }

  return rateLimitStore[ip].count > RATE_LIMIT;
}