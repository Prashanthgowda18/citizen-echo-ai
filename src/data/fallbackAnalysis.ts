export const fallbackAnalysisResult = {
  domain: "Infrastructure" as const,
  coreIssue: "Road maintenance and infrastructure deterioration affecting daily commute",
  urgency: "High" as const,
  sentiment: -0.65,
  emotionalIntensity: 0.7,
  type: "Complaint" as const,
  keywords: ["infrastructure", "road quality", "maintenance"],
  language: "en",
};

export const fallbackBriefResult = {
  title: "Citizen Feedback Analysis: Community Infrastructure Concerns",
  executiveSummary: "Multiple citizen submissions highlight growing concerns about infrastructure maintenance and service delivery in urban areas. The pattern indicates systemic under-investment in preventive maintenance, leading to escalating repair costs and citizen frustration.",
  affectedCitizens: 25000,
  rootCause: "Insufficient preventive maintenance budgets combined with reactive rather than proactive infrastructure management approaches. Current contractor accountability mechanisms lack teeth for enforcing quality standards.",
  recommendations: [
    { text: "Establish a dedicated preventive maintenance fund with quarterly allocation reviews", feasibility: "High" as const, impact: "High" as const },
    { text: "Implement citizen-facing issue tracking dashboard for transparency", feasibility: "High" as const, impact: "Medium" as const },
    { text: "Mandate quality audits at key construction milestones", feasibility: "Medium" as const, impact: "High" as const },
  ],
  priorityScore: 75,
};
