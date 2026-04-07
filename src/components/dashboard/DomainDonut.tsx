import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { domainDistribution } from "@/data/demoData";

export function DomainDonut() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Feedback by Domain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={domainDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
              >
                {domainDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [`${value} submissions`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {domainDistribution.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
              <span className="text-muted-foreground truncate">{d.name}</span>
              <span className="font-medium ml-auto">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
