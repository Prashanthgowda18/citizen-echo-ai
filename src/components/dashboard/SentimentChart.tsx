import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { sentimentTrendData } from "@/data/demoData";

const domainColors: Record<string, string> = {
  Infrastructure: "hsl(174, 60%, 45%)",
  Healthcare: "hsl(0, 84%, 60%)",
  Education: "hsl(38, 92%, 50%)",
  Environment: "hsl(142, 76%, 36%)",
  "Public Safety": "hsl(199, 89%, 48%)",
  Housing: "hsl(270, 50%, 50%)",
};

export function SentimentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sentiment Trends by Domain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[-1, 0]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {Object.entries(domainColors).map(([key, color]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
