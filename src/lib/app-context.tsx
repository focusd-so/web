import { createContext, useContext, ReactNode } from "react";
import { Client, createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { APIService } from "@/gen/proto/api/v1/service_pb";

const transport = createConnectTransport({
  baseUrl: "https://api.focusd.so",
});

const apiService = createClient(APIService, transport);

interface AppContextType {
  apiService: Client<typeof APIService>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children, ...props }: AppProviderProps) {
  const contextValue: AppContextType = {
    apiService: apiService,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp(): AppContextType {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
