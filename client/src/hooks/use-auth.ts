import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { User } from "@shared/models/auth";
import { buildApiUrl } from "@/lib/api-config";
import {
  onAuthChange,
  signOut as firebaseSignOut,
  getIdToken,
  type FirebaseUser,
  checkAppleSignInRedirect,
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

async function logout(): Promise<void> {
  await firebaseSignOut();
  window.location.href = "/";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
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
        // User signed out, clear all user queries
        queryClient.setQueryData(["/api/auth/user"], null);
      }
    });

    // Check for Apple Sign In redirect result on iOS
    checkAppleSignInRedirect().catch((error) => {
      if (error.message !== 'REDIRECT_IN_PROGRESS') {
        console.error("Apple Sign In redirect failed:", error);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  // Fetch user data from our database (includes profile, subscription, etc.)
  const { data: user, isLoading: isDbLoading } = useQuery<User | null>({
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

  const isLoading = firebaseLoading || isDbLoading;

  return {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: !!user && !!firebaseUser,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
