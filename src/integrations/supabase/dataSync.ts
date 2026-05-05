import { supabase } from "@/integrations/supabase/client";
import type { Submission, PolicyBrief, ActivityItem, BriefStatus } from "@/data/demoData";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { AdminEmailNotification } from "@/lib/feedbackAnalysis";

type SyncEvent =
  | { type: "submission"; payload: Submission }
  | { type: "brief"; payload: PolicyBrief }
  | { type: "brief_status"; payload: { briefId: string; status: BriefStatus; updatedAt: string } }
  | { type: "activity"; payload: ActivityItem };

const PENDING_SYNC_KEY = "govsense:pending-sync";

function toSubmissionInsert(submission: Submission): TablesInsert<"submissions"> {
  return {
    id: submission.id,
    text: submission.text,
    domain: submission.domain,
    coreIssue: submission.coreIssue,
    location: submission.location,
    urgency: submission.urgency,
    sentiment: submission.sentiment,
    emotionalIntensity: submission.emotionalIntensity,
    type: submission.type,
    photos: submission.photos ?? [],
    keywords: submission.keywords,
    date: submission.date,
    language: submission.language,
  };
}

export async function uploadFeedbackPhotosToCloud(photos: string[]): Promise<string[]> {
  if (!photos.length) return [];

  const uploadedUrls: string[] = [];

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];

    // If already a URL, keep as-is.
    if (!photo.startsWith("data:")) {
      uploadedUrls.push(photo);
      continue;
    }

    const blob = await fetch(photo).then((response) => response.blob());
    const ext = blob.type.split("/")[1] || "jpg";
    const filePath = `feedback/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${i}-${Math.random().toString(16).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("submission-photos")
      .upload(filePath, blob, { contentType: blob.type, upsert: false });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("submission-photos").getPublicUrl(filePath);
    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}

function toPolicyBriefInsert(brief: PolicyBrief): TablesInsert<"policy_briefs"> {
  return {
    ...brief,
    geographicDistribution: brief.geographicDistribution,
    sentimentTimeline: brief.sentimentTimeline,
    citizenQuotes: brief.citizenQuotes,
    recommendations: brief.recommendations,
  };
}

function toActivityInsert(activity: ActivityItem): TablesInsert<"activities"> {
  return {
    ...activity,
    domain: activity.domain ?? null,
  };
}

function readPendingQueue(): SyncEvent[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SyncEvent[];
  } catch {
    return [];
  }
}

function writePendingQueue(events: SyncEvent[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(events));
  } catch {
    // Ignore storage write errors to avoid blocking user flow.
  }
}

function enqueue(event: SyncEvent): void {
  const queue = readPendingQueue();
  queue.push(event);
  writePendingQueue(queue);
}

async function sendEvent(event: SyncEvent): Promise<void> {
  if (event.type === "submission") {
    const { error } = await supabase.from("submissions").upsert(toSubmissionInsert(event.payload), { onConflict: "id" });
    if (error) throw error;
    return;
  }

  if (event.type === "brief") {
    const { error } = await supabase.from("policy_briefs").upsert(toPolicyBriefInsert(event.payload), { onConflict: "id" });
    if (error) throw error;
    return;
  }

  if (event.type === "brief_status") {
    const updatePayload: TablesUpdate<"policy_briefs"> = {
      status: event.payload.status,
      updatedAt: event.payload.updatedAt,
    };
    const { error } = await supabase
      .from("policy_briefs")
      .update(updatePayload)
      .eq("id", event.payload.briefId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("activities").upsert(toActivityInsert(event.payload), { onConflict: "id" });
  if (error) throw error;
}

export async function flushPendingSyncQueue(): Promise<void> {
  const queue = readPendingQueue();
  if (!queue.length) return;

  const failed: SyncEvent[] = [];
  for (const event of queue) {
    try {
      await sendEvent(event);
    } catch {
      failed.push(event);
    }
  }

  writePendingQueue(failed);
}

export async function syncSubmissionToCloud(submission: Submission): Promise<void> {
  const event: SyncEvent = { type: "submission", payload: submission };
  try {
    await sendEvent(event);
  } catch {
    enqueue(event);
  }
}

export async function syncBriefToCloud(brief: PolicyBrief): Promise<void> {
  const event: SyncEvent = { type: "brief", payload: brief };
  try {
    await sendEvent(event);
  } catch {
    enqueue(event);
  }
}

export async function syncBriefStatusToCloud(briefId: string, status: BriefStatus, updatedAt: string): Promise<void> {
  const event: SyncEvent = {
    type: "brief_status",
    payload: { briefId, status, updatedAt },
  };
  try {
    await sendEvent(event);
  } catch {
    enqueue(event);
  }
}

export async function syncActivityToCloud(activity: ActivityItem): Promise<void> {
  const event: SyncEvent = { type: "activity", payload: activity };
  try {
    await sendEvent(event);
  } catch {
    enqueue(event);
  }
}

export async function sendDepartmentEmailsToCloud(emails: AdminEmailNotification[], location: string): Promise<{ sent: number; failed: number; results?: Array<{ recipient: string; ok: boolean; id?: string; error?: string }>; error?: string }> {
  const { data, error } = await supabase.functions.invoke("send-department-emails", {
    body: { emails, location },
  });

  if (error) {
    return { sent: 0, failed: emails.length, error: error.message };
  }

  return data as { sent: number; failed: number; results?: Array<{ recipient: string; ok: boolean; id?: string; error?: string }>; error?: string };
}
