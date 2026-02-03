import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { buildApiUrl } from "./api-config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;

    // Try to parse error message from JSON response
    try {
      const json = JSON.parse(text);
      const errorMsg = json.error || json.message || text;
      throw new Error(errorMsg);
    } catch {
      // If parsing fails, use the raw text
      throw new Error(text);
    }
  }
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your internet connection and try again.');
    }
    throw error;
  }
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on validation errors (400, 401, 403, 404, etc.)
      if (error instanceof Error && /^[4]\d{2}:/.test(error.message)) {
        throw error;
      }

      // Only retry on network errors
      const isNetworkError = error instanceof TypeError ||
                            (error instanceof Error &&
                             (error.message.includes('timeout') ||
                              error.message.includes('fetch') ||
                              error.message.includes('Failed to fetch')));

      if (!isNetworkError || i === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff: wait 1s, 2s, 4s, etc.
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Build full URL (handles both web and mobile platforms)
  const fullUrl = buildApiUrl(url);

  return retryWithBackoff(async () => {
    try {
      const res = await fetchWithTimeout(fullUrl, {
        method,
        headers: data ? { "Content-Type": "application/json" } : {},
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      }, 30000); // 30 second timeout

      await throwIfResNotOk(res);
      return res;
    } catch (error) {
      // Handle timeout errors
      if (error instanceof Error && error.message.includes('timeout')) {
        throw new Error("Request timeout. The server is taking too long to respond. Please try again.");
      }

      // Handle network errors (connection refused, DNS failure, etc.)
      if (error instanceof TypeError) {
        const message = error.message.toLowerCase();
        if (message.includes('failed to fetch') || message.includes('network request failed')) {
          throw new Error("Cannot connect to server. Please check your internet connection and try again.");
        }
        throw new Error("Network error. Please check your internet connection.");
      }

      // Re-throw other errors (validation errors, HTTP errors, etc.)
      throw error;
    }
  }, 3, 1000); // 3 retries with 1 second initial delay
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const fullUrl = buildApiUrl(url);

    return retryWithBackoff(async () => {
      try {
        const res = await fetchWithTimeout(fullUrl, {
          credentials: "include",
        }, 30000); // 30 second timeout

        if (unauthorizedBehavior === "returnNull" && res.status === 401) {
          return null;
        }

        await throwIfResNotOk(res);
        return await res.json();
      } catch (error) {
        // Handle timeout errors
        if (error instanceof Error && error.message.includes('timeout')) {
          throw new Error("Request timeout. The server is taking too long to respond. Please try again.");
        }

        // Handle network errors (connection refused, DNS failure, etc.)
        if (error instanceof TypeError) {
          const message = error.message.toLowerCase();
          if (message.includes('failed to fetch') || message.includes('network request failed')) {
            throw new Error("Cannot connect to server. Please check your internet connection and try again.");
          }
          throw new Error("Network error. Please check your internet connection.");
        }

        // Re-throw other errors (validation errors, HTTP errors, etc.)
        throw error;
      }
    }, 3, 1000); // 3 retries with 1 second initial delay
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
