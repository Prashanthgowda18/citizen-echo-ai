import { useAppState } from "@/contexts/AppContext";
import { WhyThisMatters } from "@/components/dashboard/WhyThisMatters";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PriorityCards } from "@/components/dashboard/PriorityCards";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { DomainDonut } from "@/components/dashboard/DomainDonut";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default function Dashboard() {
  const { submissions, briefs, activities } = useAppState();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time policy intelligence overview</p>
        </div>
        <WhyThisMatters />
      </div>

      <QuickStats submissions={submissions} briefs={briefs} />

      <PriorityCards briefs={briefs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SentimentChart />
        </div>
        <DomainDonut />
      </div>

      <ActivityFeed activities={activities} />
    </div>
  );
}
