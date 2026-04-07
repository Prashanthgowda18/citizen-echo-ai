import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, ArrowRightLeft } from "lucide-react";
import type { ActivityItem } from "@/data/demoData";

const typeIcons = {
  submission: MessageSquare,
  brief_created: FileText,
  status_change: ArrowRightLeft,
};

interface Props {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: Props) {
  const recent = activities.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recent.map((a) => {
            const Icon = typeIcons[a.type];
            return (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{a.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {a.domain && <Badge variant="outline" className="text-[10px]">{a.domain}</Badge>}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(a.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
