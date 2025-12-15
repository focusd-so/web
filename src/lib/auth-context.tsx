import { createContext, useContext, ReactNode } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null | undefined;
  sessionId: string | null | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const { userId, sessionId, isLoaded: authLoaded } = useClerkAuth();

  const isLoading = !userLoaded || !authLoaded;
  const isAuthenticated = !!isSignedIn;

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    userId,
    sessionId,
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
