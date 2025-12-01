"use client";

import { createContext, useContext, ReactNode } from "react";
import { getUser } from "@/lib/auth";
import { usePlan, PlanConfig } from "@/lib/plan-utils";
import { useState, useEffect } from "react";

interface PlanContextType {
  plan: PlanConfig;
  user: any;
  loading: boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to load user for plan detection", error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const plan = usePlan(user);

  return (
    <PlanContext.Provider value={{ plan, user, loading }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlanContext must be used within PlanProvider");
  }
  return context;
}

