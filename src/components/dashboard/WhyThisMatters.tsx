import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function WhyThisMatters() {
  return (
    <Card className="max-w-xs border-accent/30 bg-accent/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground">Why This Matters</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              India receives over <span className="font-semibold text-foreground">2 crore public grievances</span> annually. 
              Less than 40% receive a structured response.
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">Source: DARPG Annual Report 2023-24</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
