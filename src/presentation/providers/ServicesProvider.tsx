import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createServices, type Services } from "@/di/container";

const ServicesContext = createContext<Services | null>(null);

interface ServicesProviderProps {
  children: ReactNode;
  /** Optional override — inject fakes/mocks in tests. */
  services?: Services;
}

export function ServicesProvider({ children, services }: ServicesProviderProps) {
  const value = useMemo(() => services ?? createServices(), [services]);
  return (
    <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
  );
}

/** Access the wired use cases from any component. */
export function useServices(): Services {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return ctx;
}
