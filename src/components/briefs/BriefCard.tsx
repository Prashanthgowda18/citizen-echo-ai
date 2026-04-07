import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PolicyBrief } from "@/data/demoData";

const statusColors: Record<string, string> = {
  New: "bg-info text-accent-foreground",
  "In Review": "bg-warning text-foreground",
  "In Progress": "bg-accent text-accent-foreground",
  Implemented: "bg-success text-accent-foreground",
};

interface Props {
  brief: PolicyBrief;
  onClick: () => void;
}

export function BriefCard({ brief, onClick }: Props) {
  const TrendIcon = { rising: TrendingUp, stable: Minus, declining: TrendingDown }[brief.trend];

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`text-[10px] ${statusColors[brief.status]}`}>{brief.status}</Badge>
          <Badge variant="outline" className="text-[10px]">{brief.domain}</Badge>
          <div className="flex items-center gap-1 ml-auto">
            <TrendIcon className={`h-3 w-3 ${brief.trend === "rising" ? "text-destructive" : brief.trend === "declining" ? "text-success" : "text-muted-foreground"}`} />
            <span className="text-[10px] text-muted-foreground capitalize">{brief.trend}</span>
          </div>
        </div>
        <h3 className="text-sm font-semibold leading-tight mt-2">{brief.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2">{brief.executiveSummary}</p>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>{brief.submissionCount} submissions</span>
          <span className="font-mono font-bold text-foreground text-sm">{brief.priorityScore}</span>
        </div>
      </CardContent>
    </Card>
  );
}
