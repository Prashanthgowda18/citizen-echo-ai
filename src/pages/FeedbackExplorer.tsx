import { useState, useMemo, type ChangeEvent } from "react";
import { useAppState } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { CitizenFeedbackInput } from "@/lib/feedbackAnalysis";
import type { Submission, PolicyDomain } from "@/data/demoData";

const domains: PolicyDomain[] = ["Infrastructure", "Healthcare", "Education", "Environment", "Public Safety", "Housing"];

const urgencyColors: Record<string, string> = {
  Critical: "text-destructive font-bold",
  High: "text-warning font-semibold",
  Medium: "text-info",
  Low: "text-muted-foreground",
};

export default function FeedbackExplorer() {
  const { submissions, addSubmissionsFromCsv } = useAppState();
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [uploading, setUploading] = useState(false);

  const parseCsv = (csvText: string): CitizenFeedbackInput[] => {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) return [];

    const parseLine = (line: string): string[] => {
      const tokens: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
          continue;
        }
        if (char === "," && !inQuotes) {
          tokens.push(current.trim());
          current = "";
          continue;
        }
        current += char;
      }

      tokens.push(current.trim());
      return tokens;
    };

    const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
    const get = (row: string[], keys: string[]) => {
      for (const key of keys) {
        const index = headers.indexOf(key);
        if (index >= 0) return row[index] ?? "";
      }
      return "";
    };

    return lines.slice(1).map((line) => {
      const row = parseLine(line);
      return {
        citizenName: get(row, ["name", "citizen_name", "citizen"]),
        text: get(row, ["feedback", "feedback_text", "text", "message"]),
        department: get(row, ["department", "dept"]),
        phoneNumber: get(row, ["phone", "phone_number", "mobile", "contact"]),
        location: get(row, ["location", "district", "city"]),
        date: get(row, ["date", "submitted_date"]) || new Date().toISOString().split("T")[0],
      };
    }).filter((row) => row.text.trim());
  };

  const handleCsvUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      const imported = addSubmissionsFromCsv(rows);
      if (!imported) {
        toast({ title: "No valid rows", description: "CSV did not contain feedback rows to import.", variant: "destructive" });
      } else {
        toast({ title: "CSV uploaded", description: `${imported} feedback entries imported for admin analysis.` });
      }
    } catch {
      toast({ title: "Upload failed", description: "Could not parse the CSV file.", variant: "destructive" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admin CSV Import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Upload a CSV with columns such as name, feedback, department, location, and date.</p>
          <div className="flex items-center gap-3">
            <Input type="file" accept=".csv,text/csv" onChange={handleCsvUpload} disabled={uploading} className="max-w-md" />
            <Button variant="outline" disabled>{uploading ? "Importing..." : "Ready"}</Button>
          </div>
        </CardContent>
      </Card>

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
                  <div><span className="text-muted-foreground">Name:</span> <span className="ml-1">{selected.citizenName || "Anonymous"}</span></div>
                  <div><span className="text-muted-foreground">Department:</span> <span className="ml-1">{selected.department || "Not specified"}</span></div>
                  <div><span className="text-muted-foreground">Phone:</span> <span className="ml-1">{selected.phoneNumber || "Not specified"}</span></div>
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
                {selected.photos && selected.photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Attached Photos</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selected.photos.map((photo, index) => (
                        <a
                          key={`${photo}-${index}`}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border overflow-hidden"
                        >
                          <img
                            src={photo}
                            alt={`Submission evidence ${index + 1}`}
                            className="h-28 w-full object-cover"
                            loading="lazy"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
