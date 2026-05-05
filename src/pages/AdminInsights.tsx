import { useMemo, useState } from "react";
import { useAppState } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildAdminAnalysis } from "@/lib/feedbackAnalysis";
import { locations } from "@/data/demoData";
import { Copy, Mail, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendDepartmentEmailsToCloud } from "@/integrations/supabase/dataSync";

export default function AdminInsights() {
  const { submissions, userRole } = useAppState();
  const [selectedLocation, setSelectedLocation] = useState<string>("All locations");
  const [sendingEmails, setSendingEmails] = useState(false);

  const locationOptions = useMemo(() => {
    const fromSubmissions = submissions
      .map((s) => s.location?.split(",")[0]?.trim())
      .filter((value): value is string => Boolean(value));

    return [
      "All locations",
      ...new Set([...locations, ...fromSubmissions]),
    ];
  }, [submissions]);

  const summary = useMemo(() => buildAdminAnalysis(submissions, selectedLocation), [submissions, selectedLocation]);

  const handleCopyEmail = async (subject: string, body: string) => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      toast({ title: "Email copied", description: "The email draft was copied to your clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Unable to copy the email draft.", variant: "destructive" });
    }
  };

  const handleBulkCopy = async () => {
    const bundle = summary.emailNotifications
      .map((email) => [
        `To: ${email.recipient}`,
        `Cc: ${email.cc.join(", ")}`,
        `Subject: ${email.subject}`,
        "",
        email.body,
        "",
        "---",
      ].join("\n"))
      .join("\n");

    try {
      await navigator.clipboard.writeText(bundle);
      toast({ title: "All email drafts copied", description: "The department email bundle is ready to paste into your mail client." });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy the full email bundle.", variant: "destructive" });
    }
  };

  const handleExportBundle = () => {
    const bundle = summary.emailNotifications
      .map((email) => [
        `To: ${email.recipient}`,
        `Cc: ${email.cc.join(", ")}`,
        `Priority: ${email.priority}`,
        `Subject: ${email.subject}`,
        "",
        email.body,
        "",
        "============================================================",
      ].join("\n"))
      .join("\n");

    const blob = new Blob([bundle], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `govsense-email-bundle-${selectedLocation.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "all-locations"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast({ title: "Email bundle exported", description: "Download the generated text file and share it with the department team." });
  };

  const handleSendAllEmails = async () => {
    if (!summary.emailNotifications.length) {
      toast({ title: "No emails to send", description: "No department notifications are available for this selection.", variant: "destructive" });
      return;
    }

    setSendingEmails(true);
    try {
      const result = await sendDepartmentEmailsToCloud(summary.emailNotifications, summary.selectedLocation);
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Emails sent",
        description: `${result.sent} department notifications were sent for ${summary.selectedLocation}.`,
      });
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Could not send emails right now.",
        variant: "destructive",
      });
    } finally {
      setSendingEmails(false);
    }
  };

  const handleOpenInMail = (email: (typeof summary.emailNotifications)[number]) => {
    // Some clients fail with very long mailto payloads; keep body concise for reliable launch.
    const compactBody = email.body
      .split("\n")
      .filter((line) => !line.startsWith("To:") && !line.startsWith("Subject:"))
      .join("\n")
      .slice(0, 1800);

    const href = `mailto:${email.recipient}?cc=${encodeURIComponent(email.cc.join(","))}&subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(compactBody)}`;

    try {
      window.location.href = href;
    } catch {
      toast({
        title: "Unable to open mail app",
        description: "Please use Copy Draft and paste into your email client.",
        variant: "destructive",
      });
    }
  };

  const toCompactBody = (email: (typeof summary.emailNotifications)[number]) => {
    return email.body
      .split("\n")
      .filter((line) => !line.startsWith("To:") && !line.startsWith("Subject:"))
      .join("\n")
      .slice(0, 1800);
  };

  const handleOpenInGmail = (email: (typeof summary.emailNotifications)[number]) => {
    const body = toCompactBody(email);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.recipient)}&cc=${encodeURIComponent(email.cc.join(","))}&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenInOutlookWeb = (email: (typeof summary.emailNotifications)[number]) => {
    const body = toCompactBody(email);
    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email.recipient)}&cc=${encodeURIComponent(email.cc.join(","))}&subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(body)}`;
    window.open(outlookUrl, "_blank", "noopener,noreferrer");
  };

  if (userRole !== "Admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Only Admin users can analyze public feedback and generate policy recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Analysis & Policy Recommendations</h1>
        <p className="text-muted-foreground mt-1">Structured insights for government decision-making from citizen feedback data.</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Location Filter (Admin)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <label htmlFor="location-filter" className="text-xs text-muted-foreground">Select location to analyze</label>
          <select
            id="location-filter"
            className="w-full md:w-[360px] rounded-md border bg-background px-3 py-2 text-sm"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locationOptions.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Analysis scope: <span className="font-medium text-foreground">{summary.selectedLocation}</span> ({summary.analyzedFeedback} of {summary.totalFeedback} total feedback entries)
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Filtered Feedback</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{summary.analyzedFeedback}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Negative Sentiment</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{summary.sentiment.negative}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">High/Critical Urgency</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{summary.urgency.High + summary.urgency.Critical}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Priority Topics</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(summary.topics)
                .filter(([topic]) => topic !== "other")
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map(([topic]) => <Badge key={topic}>{topic}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">1) Summary of Major Issues in Selected Location</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {summary.majorIssueSummary.length > 0 ? summary.majorIssueSummary.map((line) => (
            <p key={line} className="p-2 rounded bg-muted/40">{line}</p>
          )) : <p className="text-muted-foreground">No feedback found for this location yet.</p>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Key Issues Identified</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {summary.keyIssues.map((issue) => (
              <div key={issue.issue} className="flex items-start justify-between gap-3 p-2 rounded bg-muted/40">
                <p className="text-sm">{issue.issue}</p>
                <Badge variant="outline">{issue.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Topic Categorization</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(summary.topics)
              .filter(([topic]) => topic !== "other")
              .map(([topic, count]) => (
                <div key={topic} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{topic}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Sentiment Analysis</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Positive</span><span className="font-semibold">{summary.sentiment.positive}</span></div>
            <div className="flex justify-between"><span>Neutral</span><span className="font-semibold">{summary.sentiment.neutral}</span></div>
            <div className="flex justify-between"><span>Negative</span><span className="font-semibold">{summary.sentiment.negative}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Urgency Levels</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Critical</span><span className="font-semibold">{summary.urgency.Critical}</span></div>
            <div className="flex justify-between"><span>High</span><span className="font-semibold">{summary.urgency.High}</span></div>
            <div className="flex justify-between"><span>Medium</span><span className="font-semibold">{summary.urgency.Medium}</span></div>
            <div className="flex justify-between"><span>Low</span><span className="font-semibold">{summary.urgency.Low}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Policy Recommendations</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <section>
            <p className="font-semibold mb-2">2) Top Priority Problems</p>
            <ul className="list-disc pl-5 space-y-1">
              {summary.recommendations.topPriorityProblems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section>
            <p className="font-semibold mb-2">3) Department-wise Recommendations</p>
            <div className="space-y-3">
              {summary.recommendations.departmentWiseRecommendations.map((item) => (
                <div key={item.department} className="rounded border p-3">
                  <p className="font-medium mb-1">{item.department}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {item.actions.map((action) => <li key={action}>{action}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="font-semibold mb-2">4) Short-term Actions</p>
            <ul className="list-disc pl-5 space-y-1">
              {summary.recommendations.shortTermActions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section>
            <p className="font-semibold mb-2">5) Long-term Strategies</p>
            <ul className="list-disc pl-5 space-y-1">
              {summary.recommendations.longTermStrategies.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">6) Email Notifications Ready to Send</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
              <Button type="button" className="gap-2" onClick={handleSendAllEmails} disabled={sendingEmails || !summary.emailNotifications.length}>
                <Mail className="h-4 w-4" /> {sendingEmails ? "Sending..." : "Send All Emails"}
              </Button>
            <Button type="button" variant="outline" className="gap-2" onClick={handleBulkCopy}>
              <Copy className="h-4 w-4" /> Copy All Drafts
            </Button>
            <Button type="button" variant="outline" className="gap-2" onClick={handleExportBundle}>
              <Mail className="h-4 w-4" /> Export Email Bundle
            </Button>
          </div>
          {summary.emailNotifications.map((email) => (
            <div key={`${email.department}-${email.recipient}`} className="rounded-lg border p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{email.department}</p>
                  <p className="text-xs text-muted-foreground">To: {email.recipient}</p>
                  <p className="text-xs text-muted-foreground">Cc: {email.cc.join(", ")}</p>
                </div>
                <Badge variant="outline">{email.priority} Priority</Badge>
              </div>
              <div className="space-y-1 text-xs">
                <p><span className="font-semibold">Subject:</span> {email.subject}</p>
                <pre className="whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-[11px] leading-5 overflow-x-auto">{email.body}</pre>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleCopyEmail(email.subject, email.body)}
                >
                  <Copy className="h-4 w-4" /> Copy Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleOpenInMail(email)}
                >
                  <Mail className="h-4 w-4" /> Open Local Mail App
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleOpenInGmail(email)}
                >
                  <Send className="h-4 w-4" /> Open Gmail
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleOpenInOutlookWeb(email)}
                >
                  <Send className="h-4 w-4" /> Open Outlook Web
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
