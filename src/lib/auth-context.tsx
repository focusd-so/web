import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { StytchUIClient } from "@stytch/vanilla-js";

interface AuthContextType {
  stytch: StytchUIClient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const publicToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN as string | undefined;
  
  const stytch = useMemo(() => {
    if (!publicToken) return null;
    try {
      return new StytchUIClient(publicToken);
    } catch {
      return null;
    }
  }, [publicToken]);

  // Use TanStack Query for session checking
  const { data: session, isLoading } = useQuery({
    queryKey: ["stytch-session", publicToken],
    queryFn: async () => {
      if (!stytch) return null;
      
      try {
        // Try to get the current session from Stytch
        const existingSession = stytch.session.getSync();
        return existingSession || null;
      } catch (error) {
        console.error("Error checking session:", error);
        return null;
      }
    },
    enabled: !!stytch,
    staleTime: 5 * 60 * 1000, // Consider session data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const isAuthenticated = !!session;

  const contextValue: AuthContextType = {
    stytch,
    isAuthenticated,
    isLoading,
    session,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

