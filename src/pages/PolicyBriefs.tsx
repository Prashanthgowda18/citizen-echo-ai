import { useState } from "react";
import { useAppState } from "@/contexts/AppContext";
import { BriefCard } from "@/components/briefs/BriefCard";
import { BriefDetail } from "@/components/briefs/BriefDetail";
import type { PolicyBrief } from "@/data/demoData";

export default function PolicyBriefs() {
  const { briefs, updateBriefStatus } = useAppState();
  const [selectedBrief, setSelectedBrief] = useState<PolicyBrief | null>(null);

  if (selectedBrief) {
    const current = briefs.find(b => b.id === selectedBrief.id) || selectedBrief;
    return (
      <BriefDetail
        brief={current}
        onBack={() => setSelectedBrief(null)}
        onStatusChange={(status) => updateBriefStatus(current.id, status)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Policy Briefs</h1>
        <p className="text-muted-foreground mt-1">AI-generated policy recommendations from citizen feedback</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {briefs
          .sort((a, b) => b.priorityScore - a.priorityScore)
          .map((brief) => (
            <BriefCard key={brief.id} brief={brief} onClick={() => setSelectedBrief(brief)} />
          ))}
      </div>
    </div>
  );
}
