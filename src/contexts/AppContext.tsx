import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Submission, PolicyBrief, ActivityItem, BriefStatus,
  demoSubmissions, demoBriefs, demoActivities,
} from "@/data/demoData";

interface AppState {
  submissions: Submission[];
  briefs: PolicyBrief[];
  activities: ActivityItem[];
  addSubmission: (s: Submission) => void;
  updateBriefStatus: (briefId: string, status: BriefStatus) => void;
  addBrief: (b: PolicyBrief) => void;
  addActivity: (a: ActivityItem) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(demoSubmissions);
  const [briefs, setBriefs] = useState<PolicyBrief[]>(demoBriefs);
  const [activities, setActivities] = useState<ActivityItem[]>(demoActivities);

  const addSubmission = useCallback((s: Submission) => {
    setSubmissions(prev => [s, ...prev]);
    setActivities(prev => [{
      id: `a-${Date.now()}`,
      type: "submission",
      message: `New citizen feedback received: ${s.coreIssue}`,
      timestamp: new Date().toISOString(),
      domain: s.domain,
    }, ...prev]);
  }, []);

  const updateBriefStatus = useCallback((briefId: string, status: BriefStatus) => {
    setBriefs(prev => prev.map(b => b.id === briefId ? { ...b, status, updatedAt: new Date().toISOString().split("T")[0] } : b));
    const brief = briefs.find(b => b.id === briefId);
    if (brief) {
      setActivities(prev => [{
        id: `a-${Date.now()}`,
        type: "status_change",
        message: `Brief '${brief.title}' moved to ${status}`,
        timestamp: new Date().toISOString(),
        domain: brief.domain,
      }, ...prev]);
    }
  }, [briefs]);

  const addBrief = useCallback((b: PolicyBrief) => {
    setBriefs(prev => [b, ...prev]);
    setActivities(prev => [{
      id: `a-${Date.now()}`,
      type: "brief_created",
      message: `Policy brief generated: ${b.title}`,
      timestamp: new Date().toISOString(),
      domain: b.domain,
    }, ...prev]);
  }, []);

  const addActivity = useCallback((a: ActivityItem) => {
    setActivities(prev => [a, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{ submissions, briefs, activities, addSubmission, updateBriefStatus, addBrief, addActivity }}>
      {children}
    </AppContext.Provider>
  );
}
