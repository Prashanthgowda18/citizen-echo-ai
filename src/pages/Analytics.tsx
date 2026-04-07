import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { sentimentTrendData, volumeTrendData, domainComparisonData, karnatakaGeoData, emergingIssues } from "@/data/demoData";
import { TrendingUp, MapPin } from "lucide-react";

const domainColors: Record<string, string> = {
  Infrastructure: "hsl(174, 60%, 45%)",
  Healthcare: "hsl(0, 84%, 60%)",
  Education: "hsl(38, 92%, 50%)",
  Environment: "hsl(142, 76%, 36%)",
  "Public Safety": "hsl(199, 89%, 48%)",
  Housing: "hsl(270, 50%, 50%)",
};

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive analysis of public feedback patterns</p>
      </div>

      {/* Geographic Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" /> Geographic Distribution — Karnataka
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-muted/30 rounded-lg p-4 min-h-[300px]">
              {/* Simplified map using positioned dots */}
              <div className="relative w-full h-[280px]">
                {karnatakaGeoData.map((d) => {
                  // Normalize lat/lng to position within the container
                  const x = ((d.lng - 74) / (78 - 74)) * 100;
                  const y = ((17.5 - d.lat) / (17.5 - 12)) * 100;
                  const size = Math.max(8, Math.min(32, d.count / 5));
                  return (
                    <div
                      key={d.district}
                      className="absolute group"
                      style={{
                        left: `${Math.min(90, Math.max(5, x))}%`,
                        top: `${Math.min(90, Math.max(5, y))}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        className="rounded-full bg-accent/60 border-2 border-accent animate-pulse"
                        style={{ width: size, height: size }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border rounded-md px-2 py-1 text-[10px] whitespace-nowrap shadow-lg z-10">
                        <p className="font-semibold">{d.district}</p>
                        <p>{d.count} submissions</p>
                        <p className="text-muted-foreground">Top: {d.topIssue}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Hover over dots for details • Dot size = submission volume</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium mb-3">Top Districts by Volume</p>
              {karnatakaGeoData
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((d) => (
                  <div key={d.district} className="flex items-center justify-between text-xs">
                    <span>{d.district}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(d.count / karnatakaGeoData[0].count) * 100}%` }} />
                      </div>
                      <span className="font-medium w-8 text-right">{d.count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sentiment Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[-1, 0]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  {Object.entries(domainColors).map(([key, color]) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Volume Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submission Volume Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="submissions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Comparison - Grouped Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Domain Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainComparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="domain" tick={{ fontSize: 10 }} width={90} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Bar dataKey="volume" fill="hsl(var(--accent))" name="Volume" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="avgSentiment" fill="hsl(var(--destructive))" name="Neg. Sentiment %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emerging Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" /> Top Emerging Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergingIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{issue.issue}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">{issue.domain}</Badge>
                      <span className="text-[10px] text-destructive font-semibold">↑ {issue.growth}%</span>
                      <span className="text-[10px] text-muted-foreground">{issue.submissions} submissions</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
