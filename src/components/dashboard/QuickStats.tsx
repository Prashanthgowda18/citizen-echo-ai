import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import type { Submission, PolicyBrief } from "@/data/demoData";

interface Props {
  submissions: Submission[];
  briefs: PolicyBrief[];
}

export function QuickStats({ submissions, briefs }: Props) {
  const activeBriefs = briefs.filter(b => b.status !== "Implemented").length;
  const criticalCount = submissions.filter(s => s.urgency === "Critical").length;
  const avgSentiment = submissions.reduce((sum, s) => sum + s.sentiment, 0) / submissions.length;

  const stats = [
    { label: "Total Submissions", value: submissions.length, icon: MessageSquare, color: "text-accent" },
    { label: "Active Briefs", value: activeBriefs, icon: FileText, color: "text-info" },
    { label: "Critical Issues", value: criticalCount, icon: AlertTriangle, color: "text-destructive" },
    { label: "Avg Sentiment", value: avgSentiment.toFixed(2), icon: TrendingUp, color: avgSentiment < -0.5 ? "text-destructive" : "text-warning" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
