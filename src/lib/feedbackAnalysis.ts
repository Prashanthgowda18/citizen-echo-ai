import type { PolicyDomain, Submission, SubmissionType, UrgencyLevel } from "@/data/demoData";

export type CivicTopic = "water" | "roads" | "healthcare" | "sanitation" | "transport" | "other";

export interface CitizenFeedbackInput {
  citizenName: string;
  text: string;
  department: string;
  phoneNumber: string;
  photos?: string[];
  location: string;
  date: string;
}

const topicKeywords: Record<CivicTopic, string[]> = {
  water: ["water", "drain", "pipeline", "sewage", "lake", "borewell", "supply"],
  roads: ["road", "pothole", "streetlight", "bridge", "highway", "flyover", "resurfacing"],
  healthcare: ["hospital", "clinic", "doctor", "ambulance", "medicine", "health", "phc"],
  sanitation: ["garbage", "waste", "toilet", "clean", "septic", "hygiene", "sanitation"],
  transport: ["traffic", "bus", "metro", "train", "commute", "transit", "congestion", "route"],
  other: [],
};

const positiveWords = ["good", "great", "excellent", "helpful", "fast", "clean", "improved", "safe", "thank"];
const negativeWords = ["bad", "delay", "broken", "unsafe", "dirty", "corruption", "slow", "flood", "crisis", "danger"];
const urgentWords = ["urgent", "critical", "immediately", "emergency", "unsafe", "accident", "death", "severe", "danger"];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function scoreTopic(text: string, department: string): CivicTopic {
  const source = `${normalize(text)} ${normalize(department)}`;
  let bestTopic: CivicTopic = "other";
  let bestScore = 0;

  (Object.keys(topicKeywords) as CivicTopic[]).forEach((topic) => {
    const score = topicKeywords[topic].reduce((acc, token) => acc + (source.includes(token) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  });

  return bestTopic;
}

function scoreSentiment(text: string): number {
  const source = normalize(text);
  let score = 0;
  for (const word of positiveWords) {
    if (source.includes(word)) score += 0.18;
  }
  for (const word of negativeWords) {
    if (source.includes(word)) score -= 0.2;
  }
  return Math.max(-1, Math.min(1, Number(score.toFixed(2))));
}

function scoreUrgency(text: string, sentiment: number): UrgencyLevel {
  const source = normalize(text);
  const urgentHits = urgentWords.reduce((acc, word) => acc + (source.includes(word) ? 1 : 0), 0);
  if (urgentHits >= 2) return "Critical";
  if (urgentHits === 1 || sentiment <= -0.5) return "High";
  if (sentiment <= -0.2) return "Medium";
  return "Low";
}

function mapDomain(topic: CivicTopic, department: string): PolicyDomain {
  const dept = normalize(department);
  if (topic === "healthcare" || dept.includes("health")) return "Healthcare";
  if (topic === "roads" || topic === "water") return "Infrastructure";
  if (topic === "sanitation") return "Environment";
  return "Public Safety";
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(["the", "and", "for", "with", "this", "that", "from", "have", "there", "about", "your", "were", "been"]);
  const tokens = normalize(text)
    .split(/\s+/)
    .filter((token) => token.length > 3 && !stopWords.has(token));

  const unique: string[] = [];
  for (const token of tokens) {
    if (!unique.includes(token)) unique.push(token);
    if (unique.length === 6) break;
  }

  return unique.length ? unique : ["feedback"];
}

function inferType(sentiment: number, urgency: UrgencyLevel): SubmissionType {
  if (urgency === "Critical") return "Urgent Safety";
  if (sentiment >= 0.3) return "Compliment";
  if (sentiment <= -0.2) return "Complaint";
  return "Suggestion";
}

function summarizeIssue(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= 96) return clean;
  return `${clean.slice(0, 93)}...`;
}

export function inferSubmissionFromFeedback(input: CitizenFeedbackInput): Submission {
  const sentiment = scoreSentiment(input.text);
  const urgency = scoreUrgency(input.text, sentiment);
  const topic = scoreTopic(input.text, input.department);

  return {
    id: `s-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    citizenName: input.citizenName.trim(),
    department: input.department.trim(),
    phoneNumber: input.phoneNumber.trim(),
    photos: input.photos,
    text: input.text.trim(),
    domain: mapDomain(topic, input.department),
    coreIssue: summarizeIssue(input.text),
    location: input.location.trim() || "Not specified",
    urgency,
    sentiment,
    emotionalIntensity: Math.min(1, Math.abs(sentiment) + (urgency === "Critical" ? 0.35 : 0.15)),
    type: inferType(sentiment, urgency),
    keywords: extractKeywords(input.text),
    date: input.date,
    language: "en",
  };
}

export interface AdminAnalysisSummary {
  selectedLocation: string;
  totalFeedback: number;
  analyzedFeedback: number;
  keyIssues: { issue: string; count: number }[];
  topics: Record<CivicTopic, number>;
  sentiment: { positive: number; neutral: number; negative: number };
  urgency: Record<UrgencyLevel, number>;
  majorIssueSummary: string[];
  recommendations: {
    topPriorityProblems: string[];
    departmentWiseRecommendations: { department: string; actions: string[] }[];
    shortTermActions: string[];
    longTermStrategies: string[];
  };
  emailNotifications: AdminEmailNotification[];
}

export interface AdminEmailNotification {
  department: string;
  recipient: string;
  cc: string[];
  priority: "Critical" | "High" | "Medium";
  subject: string;
  body: string;
}

function classifySentimentBucket(score: number): "positive" | "neutral" | "negative" {
  if (score >= 0.2) return "positive";
  if (score <= -0.2) return "negative";
  return "neutral";
}

function normalizeLocationValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

const locationAliases: Record<string, string> = {
  bangalore: "bengaluru urban",
  bengaluru: "bengaluru urban",
  "bangalore urban": "bengaluru urban",
};

function locationMatches(submissionLocation: string, selectedLocation: string): boolean {
  if (selectedLocation === "All locations") return true;

  const normalizedSubmission = normalizeLocationValue(submissionLocation);
  const normalizedSelectedRaw = normalizeLocationValue(selectedLocation);
  const normalizedSelected = locationAliases[normalizedSelectedRaw] ?? normalizedSelectedRaw;

  return normalizedSubmission.includes(normalizedSelected) || normalizedSelected.includes(normalizedSubmission);
}

function getTopicLabel(topic: CivicTopic): string {
  if (topic === "water") return "water";
  if (topic === "roads") return "roads";
  if (topic === "healthcare") return "healthcare";
  if (topic === "sanitation") return "sanitation";
  if (topic === "transport") return "transport";
  return "other civic services";
}

function formatIssueList(items: { issue: string; count: number }[]): string {
  if (!items.length) return "No high-confidence issues were detected in the selected location.";
  return items.map((item) => `- ${item.issue} (${item.count})`).join("\n");
}

function formatActionList(items: string[]): string {
  if (!items.length) return "- Review citizen feedback and schedule a field inspection.";
  return items.map((item) => `- ${item}`).join("\n");
}

function inferDepartmentPriority(department: string, topics: Record<CivicTopic, number>, urgency: Record<UrgencyLevel, number>): "Critical" | "High" | "Medium" {
  const baseUrgent = urgency.Critical + urgency.High;
  const normalized = department.toLowerCase();

  if (normalized.includes("bbmp") || normalized.includes("sanitation") || normalized.includes("roads") || normalized.includes("transport")) {
    if ((topics.roads + topics.sanitation + topics.transport) > 6 || baseUrgent >= 5) return "Critical";
    if ((topics.roads + topics.sanitation + topics.transport) > 2 || baseUrgent >= 2) return "High";
    return "Medium";
  }

  if (normalized.includes("bwssb") || normalized.includes("water")) {
    if (topics.water > 4 || baseUrgent >= 4) return "Critical";
    if (topics.water > 1 || baseUrgent >= 2) return "High";
    return "Medium";
  }

  if (normalized.includes("bescom") || normalized.includes("electricity") || normalized.includes("power")) {
    if (baseUrgent >= 4) return "Critical";
    if (baseUrgent >= 2) return "High";
    return "Medium";
  }

  if (normalized.includes("health")) {
    if (topics.healthcare > 2 || baseUrgent >= 4) return "Critical";
    if (topics.healthcare > 0 || baseUrgent >= 1) return "High";
    return "Medium";
  }

  if (baseUrgent >= 4) return "Critical";
  if (baseUrgent >= 2) return "High";
  return "Medium";
}

function buildDepartmentEmail(
  department: string,
  recipient: string,
  location: string,
  topics: Record<CivicTopic, number>,
  urgency: Record<UrgencyLevel, number>,
  keyIssues: { issue: string; count: number }[],
  topPriorityProblems: string[],
  shortTermActions: string[],
  cc: string[] = ["district.admin@gov.in"],
): AdminEmailNotification {
  const priority = inferDepartmentPriority(department, topics, urgency);
  const issueSummary = formatIssueList(keyIssues.slice(0, 4));
  const actionSummary = formatActionList(shortTermActions.slice(0, 4));
  const priorityHighlights = topPriorityProblems.length
    ? topPriorityProblems.map((item) => `- ${item}`).join("\n")
    : "- No priority themes identified yet.";

  return {
    department,
    recipient,
    cc,
    priority,
    subject: `[${priority} PRIORITY] Citizen feedback action required for ${location}`,
    body: [
      `To: ${recipient}`,
      `Subject: [${priority} PRIORITY] Citizen feedback action required for ${location}`,
      "",
      `Dear ${department} Team,`,
      "",
      `This is an automated summary of citizen feedback analyzed for ${location}. The feedback indicates recurring service failures and urgency signals that require departmental review and action.`,
      "",
      "Summary of detected issues:",
      issueSummary,
      "",
      "Top priority problems:",
      priorityHighlights,
      "",
      "Recommended immediate actions:",
      actionSummary,
      "",
      `Urgency level: ${priority}`,
      "",
      "Please acknowledge receipt, assign a responsible officer, and share an action timeline with the district administration.",
      "",
      "Regards,",
      "GovSense Citizen Portal",
    ].join("\n"),
  };
}

export function buildAdminAnalysis(submissions: Submission[], selectedLocation = "All locations"): AdminAnalysisSummary {
  const filtered = submissions.filter((submission) => locationMatches(submission.location, selectedLocation));
  const topics: Record<CivicTopic, number> = { water: 0, roads: 0, healthcare: 0, sanitation: 0, transport: 0, other: 0 };
  const sentiment = { positive: 0, neutral: 0, negative: 0 };
  const urgency: Record<UrgencyLevel, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  const issueCounter = new Map<string, number>();
  const topicCriticalHigh: Record<CivicTopic, number> = { water: 0, roads: 0, healthcare: 0, sanitation: 0, transport: 0, other: 0 };
  const topicNegative: Record<CivicTopic, number> = { water: 0, roads: 0, healthcare: 0, sanitation: 0, transport: 0, other: 0 };
  let powerIssueCount = 0;

  for (const submission of filtered) {
    const topic = scoreTopic(submission.text, submission.department ?? submission.domain);
    topics[topic] += 1;
    const sentimentBucket = classifySentimentBucket(submission.sentiment);
    sentiment[sentimentBucket] += 1;
    urgency[submission.urgency] += 1;
    if (submission.urgency === "Critical" || submission.urgency === "High") topicCriticalHigh[topic] += 1;
    if (sentimentBucket === "negative") topicNegative[topic] += 1;
    if (/\b(power|electricity|transformer|voltage|outage|blackout)\b/i.test(submission.text)) {
      powerIssueCount += 1;
    }
    const issue = summarizeIssue(submission.coreIssue || submission.text);
    issueCounter.set(issue, (issueCounter.get(issue) ?? 0) + 1);
  }

  const keyIssues = [...issueCounter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([issue, count]) => ({ issue, count }));

  const rankedTopics = Object.entries(topics)
    .filter(([topic, count]) => topic !== "other" && count > 0)
    .sort((a, b) => {
      const topicA = a[0] as CivicTopic;
      const topicB = b[0] as CivicTopic;
      const scoreA = a[1] + topicCriticalHigh[topicA] * 1.5 + topicNegative[topicA] * 0.75;
      const scoreB = b[1] + topicCriticalHigh[topicB] * 1.5 + topicNegative[topicB] * 0.75;
      return scoreB - scoreA;
    })
    .map(([topic]) => topic as CivicTopic);

  const topPriorityProblems = rankedTopics.slice(0, 3).map((topic) => {
    const count = topics[topic];
    const severity = topicCriticalHigh[topic];
    return `${getTopicLabel(topic)}: ${count} complaints, ${severity} marked high/critical urgency`;
  });

  const majorIssueSummary = rankedTopics.slice(0, 4).map((topic) => {
    return `${getTopicLabel(topic)} accounts for ${topics[topic]} reports with ${topicNegative[topic]} negative sentiment signals in ${selectedLocation}.`;
  });

  const departmentWiseRecommendations: { department: string; actions: string[] }[] = [
    {
      department: "PWD",
      actions: [
        "Execute a 14-day pothole and carriageway audit on top complaint corridors and publish ward-wise closure dates.",
        "Issue performance-linked work orders for resurfacing and drainage restoration before monsoon onset.",
      ],
    },
    {
      department: "BBMP",
      actions: [
        "Increase waste lifting frequency in repeated complaint pockets and enforce zone-level sanitation SLAs.",
        "Run a joint ward control room for roads, streetlights, and garbage to reduce duplicate grievance cycles.",
      ],
    },
    {
      department: "BWSSB",
      actions: [
        "Deploy pressure and leak detection teams in low-supply wards and stabilize daily water supply windows.",
        "Prioritize pipeline rehabilitation in the top two water-stressed clusters identified from feedback hotspots.",
      ],
    },
  ];

  if (powerIssueCount > 0) {
    departmentWiseRecommendations.push({
      department: "BESCOM",
      actions: [
        "Rectify feeder-level outage hotspots and publish planned outage schedules for public visibility.",
        "Fast-track transformer maintenance in high-complaint sections to reduce repeated blackout incidents.",
      ],
    });
  }

  if (topics.healthcare > 0) {
    departmentWiseRecommendations.push({
      department: "Health Department",
      actions: [
        "Deploy additional emergency staff and queue triage support at overloaded facilities in the selected location.",
        "Create referral pathways with real-time bed and ambulance visibility for critical cases.",
      ],
    });
  }

  const shortTermActions = [
    `Launch a 30-day rapid grievance closure drive in ${selectedLocation} for high and critical urgency cases.`,
    "Constitute a weekly district war-room chaired by the local administrator with PWD, BBMP, BWSSB, and utility nodal officers.",
    "Publish a public tracker of top complaints with promised closure dates and responsible officers.",
  ];

  const longTermStrategies = [
    `Adopt location-level outcome budgeting in ${selectedLocation} tied to recurring complaint themes and service reliability metrics.`,
    "Institutionalize inter-department planning for water-sanitation-transport dependencies before annual budget finalization.",
    "Build a quarterly policy review cycle that links citizen sentiment and urgency signals to project reprioritization.",
  ];

  const emailNotifications: AdminEmailNotification[] = [
    buildDepartmentEmail(
      "BBMP",
      "bbmp@gov.in",
      selectedLocation,
      topics,
      urgency,
      keyIssues,
      topPriorityProblems,
      shortTermActions,
      ["district.admin@gov.in", "commissioner@gov.in"],
    ),
    buildDepartmentEmail(
      "BWSSB",
      "bwssb@gov.in",
      selectedLocation,
      topics,
      urgency,
      keyIssues,
      topPriorityProblems,
      shortTermActions,
      ["district.admin@gov.in", "water.resources@gov.in"],
    ),
  ];

  if (topics.roads > 0 || topics.transport > 0) {
    emailNotifications.push(
      buildDepartmentEmail(
        "PWD",
        "pwd@gov.in",
        selectedLocation,
        topics,
        urgency,
        keyIssues,
        topPriorityProblems,
        shortTermActions,
        ["district.admin@gov.in", "pwd.secretariat@gov.in"],
      ),
    );
  }

  if (powerIssueCount > 0) {
    emailNotifications.push(
      buildDepartmentEmail(
        "BESCOM",
        "bescom@gov.in",
        selectedLocation,
        topics,
        urgency,
        keyIssues,
        topPriorityProblems,
        shortTermActions,
        ["district.admin@gov.in", "energy.gov@gov.in"],
      ),
    );
  }

  if (topics.healthcare > 0) {
    emailNotifications.push(
      buildDepartmentEmail(
        "Health Department",
        "health@gov.in",
        selectedLocation,
        topics,
        urgency,
        keyIssues,
        topPriorityProblems,
        shortTermActions,
        ["district.admin@gov.in", "health.secretariat@gov.in"],
      ),
    );
  }

  return {
    selectedLocation,
    totalFeedback: submissions.length,
    analyzedFeedback: filtered.length,
    keyIssues,
    topics,
    sentiment,
    urgency,
    majorIssueSummary,
    recommendations: {
      topPriorityProblems,
      departmentWiseRecommendations,
      shortTermActions,
      longTermStrategies,
    },
    emailNotifications,
  };
}
