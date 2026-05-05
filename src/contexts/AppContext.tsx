import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  Submission, PolicyBrief, ActivityItem, BriefStatus,
  demoSubmissions, demoBriefs, demoActivities,
} from "@/data/demoData";
import { CitizenFeedbackInput, inferSubmissionFromFeedback } from "@/lib/feedbackAnalysis";
import {
  loadPersistedActivities,
  loadPersistedBriefs,
  loadPersistedSubmissions,
  savePersistedActivities,
  savePersistedBriefs,
  savePersistedSubmissions,
} from "@/lib/persistence";
import {
  flushPendingSyncQueue,
  syncActivityToCloud,
  syncBriefStatusToCloud,
  syncBriefToCloud,
  syncSubmissionToCloud,
} from "@/integrations/supabase/dataSync";

interface AppState {
  isAuthenticated: boolean;
  userRole: "Citizen" | "Admin";
  login: (role: "Citizen" | "Admin", password: string) => boolean;
  logout: () => void;
  submissions: Submission[];
  briefs: PolicyBrief[];
  activities: ActivityItem[];
  addSubmission: (s: Submission) => void;
  addCitizenFeedback: (input: CitizenFeedbackInput) => void;
  addSubmissionsFromCsv: (rows: CitizenFeedbackInput[]) => number;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem("govsense:is-authenticated") === "true";
  });
  const [userRole, setUserRoleState] = useState<"Citizen" | "Admin">(() => {
    if (typeof localStorage === "undefined") return "Citizen";
    const stored = localStorage.getItem("govsense:user-role");
    return stored === "Admin" ? "Admin" : "Citizen";
  });
  const [submissions, setSubmissions] = useState<Submission[]>(() => loadPersistedSubmissions(demoSubmissions));
  const [briefs, setBriefs] = useState<PolicyBrief[]>(() => loadPersistedBriefs(demoBriefs));
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadPersistedActivities(demoActivities));

  const login = useCallback((role: "Citizen" | "Admin", password: string) => {
    const expected = role === "Admin" ? "admin@123" : "citizen@123";
    if (password !== expected) return false;

    setUserRoleState(role);
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("govsense:is-authenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("govsense:user-role", userRole);
  }, [userRole]);

  useEffect(() => {
    savePersistedSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    savePersistedBriefs(briefs);
  }, [briefs]);

  useEffect(() => {
    savePersistedActivities(activities);
  }, [activities]);

  useEffect(() => {
    void flushPendingSyncQueue();
  }, []);

  const addSubmission = useCallback((s: Submission) => {
    setSubmissions(prev => [s, ...prev]);
    const activity: ActivityItem = {
      id: `a-${Date.now()}`,
      type: "submission",
      message: `New citizen feedback received: ${s.coreIssue}`,
      timestamp: new Date().toISOString(),
      domain: s.domain,
    };
    setActivities(prev => [activity, ...prev]);
    void syncSubmissionToCloud(s);
    void syncActivityToCloud(activity);
  }, []);

  const addCitizenFeedback = useCallback((input: CitizenFeedbackInput) => {
    const submission = inferSubmissionFromFeedback(input);
    addSubmission(submission);
  }, [addSubmission]);

  const addSubmissionsFromCsv = useCallback((rows: CitizenFeedbackInput[]) => {
    const validRows = rows.filter((row) => row.text.trim());
    if (!validRows.length) return 0;

    const newSubmissions = validRows.map((row) => inferSubmissionFromFeedback(row));
    setSubmissions((prev) => [...newSubmissions, ...prev]);

    const nowIso = new Date().toISOString();
    const batchActivity: ActivityItem = {
      id: `a-${Date.now()}`,
      type: "submission",
      message: `Admin imported ${newSubmissions.length} feedback entries via CSV`,
      timestamp: nowIso,
      domain: undefined,
    };

    setActivities((prev) => [batchActivity, ...prev]);
    void syncActivityToCloud(batchActivity);
    newSubmissions.forEach((submission) => {
      void syncSubmissionToCloud(submission);
    });

    return newSubmissions.length;
  }, []);

  const updateBriefStatus = useCallback((briefId: string, status: BriefStatus) => {
    const updatedAt = new Date().toISOString().split("T")[0];
    setBriefs(prev => prev.map(b => b.id === briefId ? { ...b, status, updatedAt } : b));
    const brief = briefs.find(b => b.id === briefId);
    if (brief) {
      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "status_change",
        message: `Brief '${brief.title}' moved to ${status}`,
        timestamp: new Date().toISOString(),
        domain: brief.domain,
      };
      setActivities(prev => [activity, ...prev]);
      void syncActivityToCloud(activity);
    }
    void syncBriefStatusToCloud(briefId, status, updatedAt);
  }, [briefs]);

  const addBrief = useCallback((b: PolicyBrief) => {
    setBriefs(prev => [b, ...prev]);
    const activity: ActivityItem = {
      id: `a-${Date.now()}`,
      type: "brief_created",
      message: `Policy brief generated: ${b.title}`,
      timestamp: new Date().toISOString(),
      domain: b.domain,
    };
    setActivities(prev => [activity, ...prev]);
    void syncBriefToCloud(b);
    void syncActivityToCloud(activity);
  }, []);

  const addActivity = useCallback((a: ActivityItem) => {
    setActivities(prev => [a, ...prev]);
    void syncActivityToCloud(a);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout,
        submissions,
        briefs,
        activities,
        addSubmission,
        addCitizenFeedback,
        addSubmissionsFromCsv,
        updateBriefStatus,
        addBrief,
        addActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
