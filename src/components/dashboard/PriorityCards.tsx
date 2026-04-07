import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PolicyBrief } from "@/data/demoData";

const priorityColors: Record<string, string> = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-warning text-foreground",
  Medium: "bg-info text-accent-foreground",
  Low: "bg-muted text-muted-foreground",
};

function getPriorityLabel(score: number) {
  if (score >= 90) return "Critical";
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

interface Props {
  briefs: PolicyBrief[];
}

export function PriorityCards({ briefs }: Props) {
  const sorted = [...briefs]
    .filter(b => b.status !== "Implemented")
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);

  const TrendIcon = { rising: TrendingUp, stable: Minus, declining: TrendingDown };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Priority Issues</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sorted.map((brief) => {
          const Icon = TrendIcon[brief.trend];
          const label = getPriorityLabel(brief.priorityScore);
          return (
            <Card key={brief.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 p-4">
                <div className="flex items-center justify-between">
                  <Badge className={`text-[10px] ${priorityColors[label]}`}>{label}</Badge>
                  <div className="flex items-center gap-1">
                    <Icon className={`h-3 w-3 ${brief.trend === "rising" ? "text-destructive" : brief.trend === "declining" ? "text-success" : "text-muted-foreground"}`} />
                    <span className="text-[10px] text-muted-foreground capitalize">{brief.trend}</span>
                  </div>
                </div>
                <CardTitle className="text-sm leading-tight mt-2 line-clamp-2">{brief.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{brief.submissionCount} submissions</span>
                  <span className="font-mono font-semibold text-foreground">{brief.priorityScore}</span>
                </div>
                <Badge variant="outline" className="mt-2 text-[10px]">{brief.domain}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
