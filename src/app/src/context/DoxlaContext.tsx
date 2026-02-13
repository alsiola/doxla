import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type Theme = "light" | "dark";

interface DoxlaContextValue {
  theme: Theme;
}

const DoxlaContext = createContext<DoxlaContextValue | null>(null);

export function DoxlaProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <DoxlaContext.Provider value={{ theme }}>{children}</DoxlaContext.Provider>;
}

export function useDoxla(): DoxlaContextValue {
  const ctx = useContext(DoxlaContext);
  if (!ctx) throw new Error("useDoxla must be used within a DoxlaProvider");
  return ctx;
}
