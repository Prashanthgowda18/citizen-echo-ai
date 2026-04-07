import { useState, useMemo } from "react";
import { useAppState } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import type { Submission, PolicyDomain } from "@/data/demoData";

const domains: PolicyDomain[] = ["Infrastructure", "Healthcare", "Education", "Environment", "Public Safety", "Housing"];

const urgencyColors: Record<string, string> = {
  Critical: "text-destructive font-bold",
  High: "text-warning font-semibold",
  Medium: "text-info",
  Low: "text-muted-foreground",
};

export default function FeedbackExplorer() {
  const { submissions } = useAppState();
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      const matchSearch = !search || s.text.toLowerCase().includes(search.toLowerCase()) || s.coreIssue.toLowerCase().includes(search.toLowerCase());
      const matchDomain = domainFilter === "all" || s.domain === domainFilter;
      return matchSearch && matchDomain;
    });
  }, [submissions, search, domainFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback Explorer</h1>
        <p className="text-muted-foreground mt-1">Browse and search all citizen submissions</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={domainFilter} onValueChange={setDomainFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} submissions found</p>

      <div className="space-y-2">
        {filtered.map((s) => (
          <Card key={s.id} className="cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setSelected(s)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1">{s.text}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{s.domain}</Badge>
                    <span className={`text-[10px] ${urgencyColors[s.urgency]}`}>{s.urgency}</span>
                    <span className="text-[10px] text-muted-foreground">{s.location}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono">{s.sentiment.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Submission Detail</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">{selected.text}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Domain:</span> <Badge variant="outline" className="ml-1 text-[10px]">{selected.domain}</Badge></div>
                  <div><span className="text-muted-foreground">Core Issue:</span> <span className="ml-1">{selected.coreIssue}</span></div>
                  <div><span className="text-muted-foreground">Urgency:</span> <span className={`ml-1 ${urgencyColors[selected.urgency]}`}>{selected.urgency}</span></div>
                  <div><span className="text-muted-foreground">Sentiment:</span> <span className="ml-1 font-mono">{selected.sentiment.toFixed(2)}</span></div>
                  <div><span className="text-muted-foreground">Location:</span> <span className="ml-1">{selected.location}</span></div>
                  <div><span className="text-muted-foreground">Type:</span> <span className="ml-1">{selected.type}</span></div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {selected.keywords.map(k => <Badge key={k} className="text-[10px]">{k}</Badge>)}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
