import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import type { User } from "@shared/models/auth";
import { buildApiUrl } from "@/lib/api-config";
import {
  onAuthChange,
  signOut as firebaseSignOut,
  getIdToken,
  type FirebaseUser,
  checkAppleSignInRedirect,
  isFirebaseAvailable,
} from "@/lib/firebase";

/**
 * Sync Firebase user with our backend database
 * This creates or updates the user record in our PostgreSQL database
 */
async function syncFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
  const idToken = await firebaseUser.getIdToken();

  const response = await fetch(buildApiUrl("/api/auth/firebase/sync"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync user: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch user data from our database by Firebase UID
 */
async function fetchUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
  const idToken = await getIdToken();
  if (!idToken) return null;

  const response = await fetch(buildApiUrl(`/api/auth/firebase/user/${firebaseUid}`), {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    credentials: "include",
  });

  if (response.status === 401 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch current session user from backend (session-based auth)
 */
async function fetchSessionUser(): Promise<User | null> {
  try {
    const response = await fetch(buildApiUrl("/api/auth/user"), {
      credentials: "include",
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch session user:", error);
    return null;
  }
}

/**
 * Logout from both Firebase and session
 */
async function logout(): Promise<void> {
  // Logout from session
  try {
    await fetch(buildApiUrl("/api/logout"), {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Session logout failed:", error);
  }

  // Logout from Firebase if available
  if (isFirebaseAvailable()) {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Firebase logout failed:", error);
    }
  }

  window.location.href = "/";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Listen to Firebase auth state changes (if Firebase is available)
  useEffect(() => {
    // If Firebase is not available, skip Firebase auth initialization
    if (!isFirebaseAvailable()) {
      console.warn("Firebase not configured - using session-based auth only");
      setFirebaseLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthChange(async (user) => {
        setFirebaseUser(user);
        setFirebaseLoading(false);

        // If user just signed in, sync with our database
        if (user) {
          try {
            const dbUser = await syncFirebaseUser(user);
            queryClient.setQueryData(["/api/auth/user", user.uid], dbUser);
          } catch (error) {
            console.error("Failed to sync Firebase user:", error);
          }
        } else {
          // User signed out via Firebase, but check if session auth is still valid
          // Don't clear session data here - let the session query handle it
        }
      });

      // Check for Apple Sign In redirect result on iOS
      checkAppleSignInRedirect().catch((error) => {
        if (error.message !== 'REDIRECT_IN_PROGRESS') {
          console.error("Apple Sign In redirect failed:", error);
        }
      });
    } catch (error) {
      console.error("Failed to initialize Firebase auth:", error);
      setFirebaseLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  // Fetch user from session-based auth (works with or without Firebase)
  const { data: sessionUser, isLoading: isSessionLoading, refetch: refetchSession } = useQuery<User | null>({
    queryKey: ["/api/auth/session-user"],
    queryFn: fetchSessionUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !firebaseLoading, // Wait for Firebase check to complete
  });

  // Mark session as checked once we have a result
  useEffect(() => {
    if (!isSessionLoading) {
      setSessionChecked(true);
    }
  }, [isSessionLoading]);

  // Fetch user data from our database via Firebase (if Firebase user exists)
  const { data: firebaseDbUser, isLoading: isFirebaseDbLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user", firebaseUser?.uid],
    queryFn: () => (firebaseUser ? fetchUserByFirebaseUid(firebaseUser.uid) : Promise.resolve(null)),
    enabled: !!firebaseUser && !firebaseLoading,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  // Determine the active user - prefer Firebase auth, fall back to session auth
  const user = firebaseDbUser || sessionUser || null;

  // Loading state: wait for Firebase check AND session check
  const isLoading = firebaseLoading || (isSessionLoading && !sessionChecked) ||
    (firebaseUser && isFirebaseDbLoading);

  // User is authenticated if we have user data from either source
  const isAuthenticated = !!user;

  return {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refetchSession, // Allow manual session refresh after login
  };
}
