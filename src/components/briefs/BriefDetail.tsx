import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, MapPin, Quote, AlertCircle, Lightbulb, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { PolicyBrief, BriefStatus } from "@/data/demoData";

const statusOptions: BriefStatus[] = ["New", "In Review", "In Progress", "Implemented"];

interface Props {
  brief: PolicyBrief;
  onBack: () => void;
  onStatusChange: (status: BriefStatus) => void;
}

export function BriefDetail({ brief, onBack, onStatusChange }: Props) {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Briefs
      </Button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Badge variant="outline" className="mb-2">{brief.domain}</Badge>
          <h1 className="text-2xl font-bold">{brief.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generated {new Date(brief.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} • 
            Updated {new Date(brief.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-3xl font-bold">{brief.priorityScore}</p>
            <p className="text-[10px] text-muted-foreground">Priority Score</p>
          </div>
          <Select value={brief.status} onValueChange={(v) => onStatusChange(v as BriefStatus)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" /> Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{brief.executiveSummary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Affected Citizens & Geography */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" /> Affected Citizens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{brief.affectedCitizens.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground mb-3">estimated affected population</p>
            <div className="space-y-2">
              <p className="text-xs font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> Geographic Distribution</p>
              {brief.geographicDistribution.map(g => (
                <div key={g.district} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{g.district}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${(g.count / brief.submissionCount) * 100}%` }} />
                    </div>
                    <span className="font-medium w-6 text-right">{g.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sentiment Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={brief.sentimentTimeline}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[-1, 0]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Citizen Quotes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Quote className="h-4 w-4 text-accent" /> Citizen Voices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brief.citizenQuotes.map((q, i) => (
              <div key={i} className="border-l-2 border-accent pl-4 py-1">
                <p className="text-sm italic">"{q.text}"</p>
                <p className="text-[10px] text-muted-foreground mt-1">{q.location} • {new Date(q.date).toLocaleDateString("en-IN")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Root Cause */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" /> Root Cause Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{brief.rootCause}</p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" /> Policy Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brief.recommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm">{r.text}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px]">Feasibility: {r.feasibility}</Badge>
                    <Badge variant="outline" className="text-[10px]">Impact: {r.impact}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
