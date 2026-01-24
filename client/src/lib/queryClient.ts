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

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Build full URL (handles both web and mobile platforms)
  const fullUrl = buildApiUrl(url);

  try {
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Handle network errors (connection refused, DNS failure, timeout, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Cannot connect to server. Please check your internet connection and try again.");
    }

    // Handle CORS errors or other network failures
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your internet connection.");
    }

    // Re-throw other errors (validation errors, HTTP errors, etc.)
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const fullUrl = buildApiUrl(url);

    try {
      const res = await fetch(fullUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Handle network errors (connection refused, DNS failure, timeout, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Cannot connect to server. Please check your internet connection and try again.");
      }

      // Handle CORS errors or other network failures
      if (error instanceof TypeError) {
        throw new Error("Network error. Please check your internet connection.");
      }

      // Re-throw other errors (validation errors, HTTP errors, etc.)
      throw error;
    }
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
