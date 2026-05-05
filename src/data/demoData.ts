export type PolicyDomain = "Infrastructure" | "Healthcare" | "Education" | "Environment" | "Public Safety" | "Housing";
export type UrgencyLevel = "Low" | "Medium" | "High" | "Critical";
export type SubmissionType = "Complaint" | "Suggestion" | "Compliment" | "Urgent Safety";
export type BriefStatus = "New" | "In Review" | "In Progress" | "Implemented";
export type SentimentScore = number; // -1 to 1

export interface Submission {
  id: string;
  citizenName?: string;
  department?: string;
  phoneNumber?: string;
  photos?: string[];
  text: string;
  domain: PolicyDomain;
  coreIssue: string;
  location: string;
  urgency: UrgencyLevel;
  sentiment: SentimentScore;
  emotionalIntensity: number;
  type: SubmissionType;
  keywords: string[];
  date: string;
  language: string;
}

export interface PolicyBrief {
  id: string;
  title: string;
  domain: PolicyDomain;
  status: BriefStatus;
  priorityScore: number;
  submissionCount: number;
  trend: "rising" | "stable" | "declining";
  executiveSummary: string;
  affectedCitizens: number;
  geographicDistribution: { district: string; count: number }[];
  sentimentTimeline: { month: string; score: number }[];
  citizenQuotes: { text: string; location: string; date: string }[];
  rootCause: string;
  recommendations: { text: string; feasibility: "High" | "Medium" | "Low"; impact: "High" | "Medium" | "Low" }[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: "submission" | "brief_created" | "status_change";
  message: string;
  timestamp: string;
  domain?: PolicyDomain;
}

export const locations = [
  "Bagalkote",
  "Ballari (Bellary)",
  "Belagavi (Belgaum)",
  "Bengaluru Rural",
  "Bengaluru South",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagara",
  "Chikkaballapura",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi (Gulbarga)",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru (Mysore)",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayapura (Bijapur)",
  "Vijayanagara",
];

const now = new Date();
const monthsAgo = (n: number) => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - n);
  return d.toISOString().split("T")[0];
};
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

export const demoSubmissions: Submission[] = [
  // Infrastructure (40 submissions)
  { id: "s1", text: "The road between Koramangala and HSR Layout has massive potholes that have caused multiple accidents. My two-wheeler skidded last week and I injured my knee.", domain: "Infrastructure", coreIssue: "Dangerous road potholes causing accidents", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.8, emotionalIntensity: 0.9, type: "Complaint", keywords: ["potholes", "road safety", "accidents"], date: daysAgo(2), language: "en" },
  { id: "s2", text: "Streetlights on Outer Ring Road near Marathahalli have been non-functional for over 3 months. Women feel unsafe walking after dark.", domain: "Infrastructure", coreIssue: "Non-functional streetlights creating safety hazard", location: "Bengaluru Urban", urgency: "High", sentiment: -0.7, emotionalIntensity: 0.8, type: "Complaint", keywords: ["streetlights", "safety", "women safety"], date: daysAgo(5), language: "en" },
  { id: "s3", text: "Water supply is available only 2 hours a day in Yelahanka. Families are forced to buy tanker water at ₹800 per load.", domain: "Infrastructure", coreIssue: "Severe water scarcity and supply irregularity", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.95, type: "Complaint", keywords: ["water supply", "tanker water", "scarcity"], date: daysAgo(1), language: "en" },
  { id: "s4", text: "The Namma Metro Phase 2 construction has blocked the entire road near Nagawara. Traffic jams last 2+ hours during peak time.", domain: "Infrastructure", coreIssue: "Metro construction causing severe traffic congestion", location: "Bengaluru Urban", urgency: "High", sentiment: -0.6, emotionalIntensity: 0.7, type: "Complaint", keywords: ["metro", "traffic", "construction"], date: daysAgo(8), language: "en" },
  { id: "s5", text: "Excellent work on the new flyover at Hebbal! It has reduced my commute by 30 minutes. More such projects needed.", domain: "Infrastructure", coreIssue: "Positive feedback on infrastructure improvement", location: "Bengaluru Urban", urgency: "Low", sentiment: 0.9, emotionalIntensity: 0.5, type: "Compliment", keywords: ["flyover", "commute", "improvement"], date: daysAgo(12), language: "en" },
  { id: "s6", text: "Drainage overflow during every monsoon in Majestic area. Shops get flooded and we lose lakhs in damage.", domain: "Infrastructure", coreIssue: "Recurring monsoon flooding due to poor drainage", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.9, type: "Complaint", keywords: ["drainage", "flooding", "monsoon"], date: daysAgo(3), language: "en" },
  { id: "s7", text: "Please consider building a pedestrian overpass near Vidhana Soudha. Crossing the road is life-threatening.", domain: "Infrastructure", coreIssue: "Need for pedestrian safety infrastructure", location: "Bengaluru Urban", urgency: "High", sentiment: -0.5, emotionalIntensity: 0.6, type: "Suggestion", keywords: ["pedestrian", "overpass", "safety"], date: daysAgo(15), language: "en" },
  { id: "s8", text: "Bus stops in Mysuru have no shelters. During rain, passengers stand in the open. Very basic facility missing.", domain: "Infrastructure", coreIssue: "Bus stops lack basic shelter facilities", location: "Mysuru", urgency: "Medium", sentiment: -0.5, emotionalIntensity: 0.5, type: "Complaint", keywords: ["bus stops", "shelter", "public transport"], date: daysAgo(20), language: "en" },
  { id: "s9", text: "The bridge near Mandya is showing cracks. Engineers need to inspect it urgently before a disaster happens.", domain: "Infrastructure", coreIssue: "Structural safety concern with aging bridge", location: "Mandya", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.95, type: "Urgent Safety", keywords: ["bridge", "cracks", "structural safety"], date: daysAgo(1), language: "en" },
  { id: "s10", text: "WiFi facility at Cubbon Park is a great initiative by BBMP. Students use it for studying. Thank you!", domain: "Infrastructure", coreIssue: "Appreciation for public WiFi initiative", location: "Bengaluru Urban", urgency: "Low", sentiment: 0.85, emotionalIntensity: 0.4, type: "Compliment", keywords: ["wifi", "public facility", "students"], date: daysAgo(25), language: "en" },
  { id: "s11", text: "Garbage collection in Whitefield happens only once a week. The smell is unbearable. BBMP must increase frequency.", domain: "Infrastructure", coreIssue: "Inadequate garbage collection frequency", location: "Bengaluru Urban", urgency: "High", sentiment: -0.7, emotionalIntensity: 0.8, type: "Complaint", keywords: ["garbage", "collection", "hygiene"], date: daysAgo(4), language: "en" },
  { id: "s12", text: "Power cuts in Hubli for 6-8 hours daily. Small businesses are shutting down. We need stable electricity.", domain: "Infrastructure", coreIssue: "Extended power outages affecting businesses", location: "Hubli-Dharwad", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.9, type: "Complaint", keywords: ["power cuts", "electricity", "business impact"], date: daysAgo(6), language: "en" },
  { id: "s13", text: "Suggest installing solar-powered streetlights in rural Tumkur. Cost-effective and environment-friendly solution.", domain: "Infrastructure", coreIssue: "Suggestion for sustainable lighting solutions", location: "Tumakuru", urgency: "Low", sentiment: 0.3, emotionalIntensity: 0.3, type: "Suggestion", keywords: ["solar", "streetlights", "sustainable"], date: daysAgo(30), language: "en" },
  { id: "s14", text: "Road resurfacing in JP Nagar was done beautifully. Smooth driving experience now. Government contractors did quality work.", domain: "Infrastructure", coreIssue: "Quality road repair acknowledged", location: "Bengaluru Urban", urgency: "Low", sentiment: 0.8, emotionalIntensity: 0.4, type: "Compliment", keywords: ["road repair", "quality", "JP Nagar"], date: daysAgo(18), language: "en" },
  { id: "s15", text: "The new bus rapid transit lane in Bellary Road is a waste. Nobody uses it and it's causing more traffic.", domain: "Infrastructure", coreIssue: "Underutilized BRT lane creating congestion", location: "Bengaluru Urban", urgency: "Medium", sentiment: -0.6, emotionalIntensity: 0.6, type: "Complaint", keywords: ["BRT", "traffic", "public transport"], date: daysAgo(22), language: "en" },
  // Healthcare (35 submissions)
  { id: "s16", text: "Victoria Hospital has only 2 functioning ventilators for 500+ patients. My father waited 14 hours in emergency. This is criminal negligence.", domain: "Healthcare", coreIssue: "Critical shortage of ventilators in public hospital", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.95, emotionalIntensity: 1.0, type: "Complaint", keywords: ["ventilators", "hospital", "emergency"], date: daysAgo(1), language: "en" },
  { id: "s17", text: "PHC in Raichur district has no doctor. The nurse handles everything. Pregnant women have to travel 40km to Raichur city.", domain: "Healthcare", coreIssue: "Primary health center operating without doctor", location: "Raichur", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.9, type: "Complaint", keywords: ["PHC", "doctor shortage", "maternal health"], date: daysAgo(3), language: "en" },
  { id: "s18", text: "Medicine stock at government hospital in Kalaburagi is always empty. Patients buy from private medical shops at 5x the price.", domain: "Healthcare", coreIssue: "Government hospital medicine supply chain failure", location: "Kalaburagi", urgency: "High", sentiment: -0.8, emotionalIntensity: 0.85, type: "Complaint", keywords: ["medicine shortage", "government hospital", "cost"], date: daysAgo(7), language: "en" },
  { id: "s19", text: "Waiting time at Jayanagar General Hospital outpatient is 4+ hours. Senior citizens sit on floor due to lack of seating.", domain: "Healthcare", coreIssue: "Excessive hospital wait times and poor facilities", location: "Bengaluru Urban", urgency: "High", sentiment: -0.75, emotionalIntensity: 0.8, type: "Complaint", keywords: ["wait times", "outpatient", "elderly care"], date: daysAgo(5), language: "en" },
  { id: "s20", text: "The Arogya Karnataka scheme is excellent. My daughter's surgery cost ₹3 lakh was fully covered. God bless this initiative.", domain: "Healthcare", coreIssue: "Positive experience with government health scheme", location: "Mysuru", urgency: "Low", sentiment: 0.95, emotionalIntensity: 0.7, type: "Compliment", keywords: ["Arogya Karnataka", "health scheme", "surgery"], date: daysAgo(14), language: "en" },
  { id: "s21", text: "Mental health services are completely absent in tier-2 cities. My son needs a psychiatrist but nearest one is 150km away.", domain: "Healthcare", coreIssue: "No mental health services in smaller cities", location: "Davanagere", urgency: "High", sentiment: -0.8, emotionalIntensity: 0.9, type: "Complaint", keywords: ["mental health", "psychiatrist", "rural access"], date: daysAgo(10), language: "en" },
  { id: "s22", text: "Ambulance took 90 minutes to reach Shivamogga from Bengaluru. My mother had a stroke. The golden hour was lost.", domain: "Healthcare", coreIssue: "Dangerously slow ambulance response times", location: "Shivamogga", urgency: "Critical", sentiment: -0.95, emotionalIntensity: 1.0, type: "Urgent Safety", keywords: ["ambulance", "response time", "stroke"], date: daysAgo(2), language: "en" },
  { id: "s23", text: "Please start telemedicine services in rural Karnataka. Many elderly patients cannot travel to city hospitals.", domain: "Healthcare", coreIssue: "Need for telemedicine in rural areas", location: "Hassan", urgency: "Medium", sentiment: -0.3, emotionalIntensity: 0.4, type: "Suggestion", keywords: ["telemedicine", "rural health", "elderly"], date: daysAgo(20), language: "en" },
  { id: "s24", text: "Blood bank at Mangalore is frequently out of stock of O-negative blood. Three emergencies last month had to source from private banks.", domain: "Healthcare", coreIssue: "Blood bank supply shortages", location: "Mangaluru", urgency: "High", sentiment: -0.7, emotionalIntensity: 0.8, type: "Complaint", keywords: ["blood bank", "shortage", "emergency"], date: daysAgo(9), language: "en" },
  { id: "s25", text: "The new dialysis center at Udupi district hospital is a lifesaver. Free treatment for kidney patients. Wonderful facility.", domain: "Healthcare", coreIssue: "Positive impact of new dialysis center", location: "Udupi", urgency: "Low", sentiment: 0.9, emotionalIntensity: 0.6, type: "Compliment", keywords: ["dialysis", "kidney", "free treatment"], date: daysAgo(16), language: "en" },
  // Education (30 submissions)
  { id: "s26", text: "Government school in Chitradurga has no toilets for girls. Many girls drop out after 7th standard because of this.", domain: "Education", coreIssue: "No girls' toilets causing dropout", location: "Chitradurga", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.95, type: "Complaint", keywords: ["toilets", "girls education", "dropout"], date: daysAgo(4), language: "en" },
  { id: "s27", text: "Teacher vacancy in government schools is 40% in North Karnataka. Children are being taught by unqualified volunteers.", domain: "Education", coreIssue: "Severe teacher shortage in government schools", location: "Belagavi", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.9, type: "Complaint", keywords: ["teacher shortage", "government school", "education quality"], date: daysAgo(6), language: "en" },
  { id: "s28", text: "Mid-day meal quality in Raichur schools is terrible. Children found insects in food twice this month.", domain: "Education", coreIssue: "Food safety issues in school meal program", location: "Raichur", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.95, type: "Urgent Safety", keywords: ["mid-day meal", "food safety", "children health"], date: daysAgo(2), language: "en" },
  { id: "s29", text: "Digital literacy program launched in Mysuru government schools is fantastic. Students are learning coding. Very forward-thinking initiative.", domain: "Education", coreIssue: "Success of digital literacy program", location: "Mysuru", urgency: "Low", sentiment: 0.9, emotionalIntensity: 0.5, type: "Compliment", keywords: ["digital literacy", "coding", "government school"], date: daysAgo(21), language: "en" },
  { id: "s30", text: "Science lab equipment in Davanagere govt college hasn't been updated since 2008. Students learn theory but can't do practicals.", domain: "Education", coreIssue: "Outdated science lab equipment", location: "Davanagere", urgency: "High", sentiment: -0.6, emotionalIntensity: 0.7, type: "Complaint", keywords: ["science lab", "equipment", "college"], date: daysAgo(12), language: "en" },
  { id: "s31", text: "Special education teachers are needed in every taluk. Children with disabilities have zero support in rural Karnataka.", domain: "Education", coreIssue: "No special education support in rural areas", location: "Tumakuru", urgency: "High", sentiment: -0.7, emotionalIntensity: 0.8, type: "Complaint", keywords: ["special education", "disability", "rural"], date: daysAgo(15), language: "en" },
  { id: "s32", text: "Library in our government school was renovated with new books and computers. Children are so happy. Thank you MLA sir!", domain: "Education", coreIssue: "Library renovation praised", location: "Mandya", urgency: "Low", sentiment: 0.85, emotionalIntensity: 0.5, type: "Compliment", keywords: ["library", "renovation", "books"], date: daysAgo(28), language: "en" },
  // Environment (30 submissions)
  { id: "s33", text: "Bellandur Lake is foaming again. Toxic chemicals from IT companies are being dumped directly. Fish are dying.", domain: "Environment", coreIssue: "Industrial effluent causing lake pollution", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.9, type: "Urgent Safety", keywords: ["lake pollution", "Bellandur", "toxic chemicals"], date: daysAgo(1), language: "en" },
  { id: "s34", text: "Air quality in Peenya industrial area is hazardous. My children have developed chronic cough. AQI regularly exceeds 300.", domain: "Environment", coreIssue: "Hazardous air quality in industrial zones", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.9, type: "Complaint", keywords: ["air quality", "pollution", "health impact"], date: daysAgo(3), language: "en" },
  { id: "s35", text: "Tree felling for road widening in Jayanagar destroyed 200+ heritage trees. Where is the green tribunal order?", domain: "Environment", coreIssue: "Unauthorized tree felling for infrastructure", location: "Bengaluru Urban", urgency: "High", sentiment: -0.8, emotionalIntensity: 0.85, type: "Complaint", keywords: ["tree felling", "heritage trees", "environment"], date: daysAgo(8), language: "en" },
  { id: "s36", text: "The Miyawaki forest project in HSR Layout is wonderful. 5000 saplings planted and the area feels 2 degrees cooler.", domain: "Environment", coreIssue: "Positive impact of urban forest initiative", location: "Bengaluru Urban", urgency: "Low", sentiment: 0.9, emotionalIntensity: 0.5, type: "Compliment", keywords: ["Miyawaki", "urban forest", "cooling"], date: daysAgo(19), language: "en" },
  { id: "s37", text: "Plastic waste burning near Mandur landfill is causing respiratory issues for 3 villages. Children can't play outside.", domain: "Environment", coreIssue: "Landfill waste burning affecting nearby villages", location: "Bengaluru Rural", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.95, type: "Urgent Safety", keywords: ["waste burning", "landfill", "respiratory"], date: daysAgo(2), language: "en" },
  { id: "s38", text: "Suggest implementing rainwater harvesting mandate for all new buildings in Bengaluru. Simple solution for water crisis.", domain: "Environment", coreIssue: "Proposal for mandatory rainwater harvesting", location: "Bengaluru Urban", urgency: "Medium", sentiment: 0.2, emotionalIntensity: 0.3, type: "Suggestion", keywords: ["rainwater harvesting", "water crisis", "mandate"], date: daysAgo(25), language: "en" },
  // Public Safety (30 submissions)
  { id: "s39", text: "Chain snatching incidents in Koramangala have tripled. Police patrolling is zero after 9 PM. Women are scared to walk.", domain: "Public Safety", coreIssue: "Rising crime with inadequate police patrolling", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.9, type: "Complaint", keywords: ["chain snatching", "crime", "women safety"], date: daysAgo(2), language: "en" },
  { id: "s40", text: "Fire station in Mangaluru took 45 minutes to respond to a factory fire. By then the building was fully engulfed.", domain: "Public Safety", coreIssue: "Slow fire department emergency response", location: "Mangaluru", urgency: "Critical", sentiment: -0.9, emotionalIntensity: 0.95, type: "Complaint", keywords: ["fire response", "emergency", "delay"], date: daysAgo(5), language: "en" },
  { id: "s41", text: "CCTV cameras installed in KR Market area have drastically reduced pickpocketing. Excellent initiative by police commissioner.", domain: "Public Safety", coreIssue: "CCTV installation reducing crime", location: "Bengaluru Urban", urgency: "Low", sentiment: 0.85, emotionalIntensity: 0.5, type: "Compliment", keywords: ["CCTV", "crime reduction", "market safety"], date: daysAgo(17), language: "en" },
  { id: "s42", text: "Stray dog attacks in Rajajinagar are out of control. Three children bitten in one week. Animal control is nonexistent.", domain: "Public Safety", coreIssue: "Uncontrolled stray dog attacks", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.95, type: "Urgent Safety", keywords: ["stray dogs", "attacks", "children safety"], date: daysAgo(3), language: "en" },
  { id: "s43", text: "The new emergency helpline 112 integration works well. Called during a road accident and police arrived in 12 minutes.", domain: "Public Safety", coreIssue: "Positive experience with emergency helpline", location: "Mysuru", urgency: "Low", sentiment: 0.8, emotionalIntensity: 0.5, type: "Compliment", keywords: ["helpline", "emergency", "quick response"], date: daysAgo(13), language: "en" },
  // Housing (35 submissions)
  { id: "s44", text: "BDA site allotment scam - I paid ₹15 lakh for a site in 2019 and still no registration. Officials demand bribes for processing.", domain: "Housing", coreIssue: "Government housing authority corruption and delays", location: "Bengaluru Urban", urgency: "High", sentiment: -0.9, emotionalIntensity: 0.95, type: "Complaint", keywords: ["BDA", "corruption", "site allotment"], date: daysAgo(4), language: "en" },
  { id: "s45", text: "Affordable housing scheme houses in Kengeri have cracks appearing within 2 years. Walls are damp and paint peeling.", domain: "Housing", coreIssue: "Poor construction quality in affordable housing", location: "Bengaluru Urban", urgency: "High", sentiment: -0.8, emotionalIntensity: 0.8, type: "Complaint", keywords: ["affordable housing", "construction quality", "defects"], date: daysAgo(7), language: "en" },
  { id: "s46", text: "The Ashraya housing scheme gave my family our first home. We are a family of 6 and lived in a tent for 10 years. Thank you government.", domain: "Housing", coreIssue: "Life-changing impact of housing scheme", location: "Kalaburagi", urgency: "Low", sentiment: 0.95, emotionalIntensity: 0.8, type: "Compliment", keywords: ["Ashraya", "housing scheme", "gratitude"], date: daysAgo(22), language: "en" },
  { id: "s47", text: "Unauthorized construction in Whitefield is rampant. Multi-story buildings come up overnight with no permits. BBMP turns a blind eye.", domain: "Housing", coreIssue: "Unchecked illegal construction", location: "Bengaluru Urban", urgency: "High", sentiment: -0.7, emotionalIntensity: 0.75, type: "Complaint", keywords: ["unauthorized construction", "permits", "enforcement"], date: daysAgo(9), language: "en" },
  { id: "s48", text: "Slum rehabilitation in Majestic area is desperately needed. 500 families live without water, sanitation or electricity.", domain: "Housing", coreIssue: "Urgent slum rehabilitation needed", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.9, type: "Complaint", keywords: ["slum", "rehabilitation", "basic amenities"], date: daysAgo(3), language: "en" },
  { id: "s49", text: "Property tax assessment in Bengaluru is totally unfair. Same-sized apartments in same building get different tax amounts.", domain: "Housing", coreIssue: "Inconsistent property tax assessments", location: "Bengaluru Urban", urgency: "Medium", sentiment: -0.6, emotionalIntensity: 0.6, type: "Complaint", keywords: ["property tax", "assessment", "unfair"], date: daysAgo(16), language: "en" },
  { id: "s50", text: "Encroachment on lake buffer zones for real estate is destroying Bengaluru's water table. Courts have ordered demolition but no action.", domain: "Housing", coreIssue: "Lake encroachment threatening water resources", location: "Bengaluru Urban", urgency: "Critical", sentiment: -0.85, emotionalIntensity: 0.85, type: "Complaint", keywords: ["encroachment", "lake", "water table"], date: daysAgo(6), language: "en" },
];

export const demoBriefs: PolicyBrief[] = [
  {
    id: "b1",
    title: "Critical Road Infrastructure Deterioration in Bengaluru Urban",
    domain: "Infrastructure",
    status: "In Review",
    priorityScore: 92,
    submissionCount: 67,
    trend: "rising",
    executiveSummary: "67 citizen submissions over the past 60 days document a systematic failure in road maintenance across Bengaluru Urban district. Potholes, unmarked speed breakers, and damaged road surfaces have caused 12 reported accidents and growing public frustration. The trend is accelerating with 40% of complaints filed in the last two weeks alone.",
    affectedCitizens: 340000,
    geographicDistribution: [
      { district: "Bengaluru Urban", count: 52 },
      { district: "Bengaluru Rural", count: 8 },
      { district: "Mysuru", count: 4 },
      { district: "Tumakuru", count: 3 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.4 }, { month: "Dec", score: -0.5 },
      { month: "Jan", score: -0.6 }, { month: "Feb", score: -0.65 },
      { month: "Mar", score: -0.75 }, { month: "Apr", score: -0.8 },
    ],
    citizenQuotes: [
      { text: "The road between Koramangala and HSR Layout has massive potholes that have caused multiple accidents.", location: "Bengaluru Urban", date: daysAgo(2) },
      { text: "My two-wheeler skidded on an unmarked pothole. I fractured my wrist and nobody is accountable.", location: "Bengaluru Urban", date: daysAgo(8) },
      { text: "We pay road tax, toll tax, and still drive on roads that look like the moon's surface.", location: "Bengaluru Urban", date: daysAgo(15) },
    ],
    rootCause: "Insufficient allocation of maintenance budgets combined with poor contractor accountability. The current tender system incentivizes low-cost bids over quality, resulting in roads that deteriorate within months of resurfacing. No systematic pothole reporting or tracking mechanism exists.",
    recommendations: [
      { text: "Implement a real-time pothole reporting and tracking system with public accountability dashboard", feasibility: "High", impact: "High" },
      { text: "Mandate 5-year maintenance bonds from road contractors with penalty clauses for premature deterioration", feasibility: "Medium", impact: "High" },
      { text: "Allocate emergency ₹50 crore for critical road repairs in the top 20 affected zones within 30 days", feasibility: "High", impact: "Medium" },
      { text: "Establish monthly ward-level road condition audits by independent engineers", feasibility: "Medium", impact: "Medium" },
    ],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: "b2",
    title: "Public Hospital Equipment and Staffing Crisis",
    domain: "Healthcare",
    status: "New",
    priorityScore: 95,
    submissionCount: 54,
    trend: "rising",
    executiveSummary: "54 submissions reveal a deepening crisis in public hospital infrastructure. Critical equipment shortages — particularly ventilators, dialysis machines, and diagnostic tools — combined with a 35% doctor vacancy rate are creating life-threatening delays. Emergency response times exceed golden hour thresholds in 60% of reported cases.",
    affectedCitizens: 520000,
    geographicDistribution: [
      { district: "Bengaluru Urban", count: 22 },
      { district: "Raichur", count: 9 },
      { district: "Kalaburagi", count: 8 },
      { district: "Shivamogga", count: 7 },
      { district: "Mangaluru", count: 5 },
      { district: "Davanagere", count: 3 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.5 }, { month: "Dec", score: -0.55 },
      { month: "Jan", score: -0.7 }, { month: "Feb", score: -0.75 },
      { month: "Mar", score: -0.85 }, { month: "Apr", score: -0.9 },
    ],
    citizenQuotes: [
      { text: "Victoria Hospital has only 2 functioning ventilators for 500+ patients. This is criminal negligence.", location: "Bengaluru Urban", date: daysAgo(1) },
      { text: "Ambulance took 90 minutes to reach Shivamogga. My mother had a stroke. The golden hour was lost.", location: "Shivamogga", date: daysAgo(2) },
      { text: "PHC in our village has no doctor. The nurse handles everything. Pregnant women travel 40km for checkups.", location: "Raichur", date: daysAgo(3) },
    ],
    rootCause: "Chronic underfunding of public health infrastructure combined with inability to attract and retain medical professionals in rural postings. Equipment procurement processes are bureaucratically slow, taking 18-24 months from indent to installation. Rural posting policies lack adequate incentive structures.",
    recommendations: [
      { text: "Emergency procurement of 200 ventilators and 50 dialysis units for district hospitals within 90 days", feasibility: "Medium", impact: "High" },
      { text: "Introduce 50% salary premium and housing for doctors serving in rural PHCs", feasibility: "Medium", impact: "High" },
      { text: "Launch state-wide telemedicine network connecting rural PHCs with specialist doctors at district hospitals", feasibility: "High", impact: "High" },
      { text: "Reduce equipment procurement cycle from 18 months to 6 months through empaneled vendor fast-track process", feasibility: "High", impact: "Medium" },
    ],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: "b3",
    title: "Water Supply Crisis Across Karnataka Urban Centers",
    domain: "Infrastructure",
    status: "In Progress",
    priorityScore: 88,
    submissionCount: 45,
    trend: "rising",
    executiveSummary: "45 submissions document severe water scarcity affecting multiple urban centers. Citizens report water supply limited to 1-3 hours daily, forcing families to spend ₹2,000-4,000 monthly on tanker water. The crisis disproportionately affects low-income neighborhoods and is worsening as summer approaches.",
    affectedCitizens: 280000,
    geographicDistribution: [
      { district: "Bengaluru Urban", count: 28 },
      { district: "Mysuru", count: 7 },
      { district: "Hubli-Dharwad", count: 6 },
      { district: "Tumakuru", count: 4 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.3 }, { month: "Dec", score: -0.4 },
      { month: "Jan", score: -0.5 }, { month: "Feb", score: -0.6 },
      { month: "Mar", score: -0.7 }, { month: "Apr", score: -0.85 },
    ],
    citizenQuotes: [
      { text: "Water supply is available only 2 hours a day. Families are forced to buy tanker water at ₹800 per load.", location: "Bengaluru Urban", date: daysAgo(1) },
      { text: "We wake up at 4 AM to fill water because that's the only time it comes. This is no way to live.", location: "Bengaluru Urban", date: daysAgo(6) },
      { text: "Low-income families spend 15% of their income on water. This is a silent crisis nobody talks about.", location: "Mysuru", date: daysAgo(11) },
    ],
    rootCause: "Aging water distribution infrastructure with 40% unaccounted water loss, combined with rapid urbanization outpacing supply augmentation. Groundwater depletion from unregulated borewells has reduced natural recharge. No comprehensive demand management or recycling mandate exists.",
    recommendations: [
      { text: "Mandate rainwater harvesting for all buildings above 2400 sq ft with enforcement through property tax linkage", feasibility: "High", impact: "High" },
      { text: "Invest ₹500 crore in pipeline replacement to reduce 40% unaccounted water loss to under 15%", feasibility: "Medium", impact: "High" },
      { text: "Implement greywater recycling mandate for all new residential complexes above 50 units", feasibility: "High", impact: "Medium" },
    ],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(2),
  },
  {
    id: "b4",
    title: "Environmental Degradation of Urban Lakes and Air Quality",
    domain: "Environment",
    status: "New",
    priorityScore: 85,
    submissionCount: 38,
    trend: "stable",
    executiveSummary: "38 submissions highlight two interconnected environmental crises: toxic pollution of urban lakes (particularly Bellandur and Varthur) and hazardous air quality in industrial zones. Citizens report direct health impacts including respiratory diseases in children and contaminated groundwater near polluted lakes.",
    affectedCitizens: 450000,
    geographicDistribution: [
      { district: "Bengaluru Urban", count: 30 },
      { district: "Bengaluru Rural", count: 5 },
      { district: "Mysuru", count: 3 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.6 }, { month: "Dec", score: -0.65 },
      { month: "Jan", score: -0.6 }, { month: "Feb", score: -0.7 },
      { month: "Mar", score: -0.65 }, { month: "Apr", score: -0.7 },
    ],
    citizenQuotes: [
      { text: "Bellandur Lake is foaming again. Toxic chemicals from IT companies are being dumped directly. Fish are dying.", location: "Bengaluru Urban", date: daysAgo(1) },
      { text: "Air quality in Peenya industrial area is hazardous. My children have developed chronic cough.", location: "Bengaluru Urban", date: daysAgo(3) },
      { text: "Plastic waste burning near Mandur landfill is causing respiratory issues for 3 villages.", location: "Bengaluru Rural", date: daysAgo(2) },
    ],
    rootCause: "Inadequate enforcement of industrial effluent treatment standards, combined with insufficient capacity of sewage treatment plants. Only 60% of Bengaluru's sewage is treated before entering water bodies. KSPCB monitoring is understaffed with inspectors covering 200+ units each.",
    recommendations: [
      { text: "Deploy real-time effluent monitoring sensors at all major industrial discharge points with automatic penalty system", feasibility: "Medium", impact: "High" },
      { text: "Increase sewage treatment capacity by 500 MLD through 4 new STPs within 24 months", feasibility: "Low", impact: "High" },
      { text: "Triple KSPCB inspection staff and implement surprise audit regime with criminal prosecution for violators", feasibility: "High", impact: "Medium" },
    ],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
  },
  {
    id: "b5",
    title: "Girls' Education Access and School Infrastructure Gap",
    domain: "Education",
    status: "In Review",
    priorityScore: 82,
    submissionCount: 42,
    trend: "stable",
    executiveSummary: "42 submissions reveal systemic barriers to girls' education in rural Karnataka. Lack of separate toilets, 40% teacher vacancy rates, and deteriorating school infrastructure are causing dropout rates of 25% after 7th standard for girls. The issue is concentrated in North Karnataka districts.",
    affectedCitizens: 180000,
    geographicDistribution: [
      { district: "Chitradurga", count: 12 },
      { district: "Belagavi", count: 10 },
      { district: "Raichur", count: 8 },
      { district: "Kalaburagi", count: 7 },
      { district: "Davanagere", count: 5 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.5 }, { month: "Dec", score: -0.55 },
      { month: "Jan", score: -0.6 }, { month: "Feb", score: -0.55 },
      { month: "Mar", score: -0.6 }, { month: "Apr", score: -0.65 },
    ],
    citizenQuotes: [
      { text: "Government school in Chitradurga has no toilets for girls. Many girls drop out after 7th standard.", location: "Chitradurga", date: daysAgo(4) },
      { text: "Teacher vacancy is 40% in North Karnataka. Children are taught by unqualified volunteers.", location: "Belagavi", date: daysAgo(6) },
      { text: "Mid-day meal quality is terrible. Children found insects in food twice this month.", location: "Raichur", date: daysAgo(2) },
    ],
    rootCause: "Decades of underinvestment in rural school infrastructure combined with difficulty in recruiting qualified teachers to remote postings. Gender-specific facilities were never included in original school designs, and retrofit budgets are consistently deprioritized.",
    recommendations: [
      { text: "Construct separate girls' toilets in all 4,200 government schools lacking them within 12 months", feasibility: "High", impact: "High" },
      { text: "Fill 100% of teacher vacancies in rural schools through competitive rural posting incentive package", feasibility: "Medium", impact: "High" },
      { text: "Implement centralized kitchen model for mid-day meals with daily quality audits", feasibility: "High", impact: "Medium" },
    ],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(4),
  },
  {
    id: "b6",
    title: "Rising Urban Crime and Emergency Response Failures",
    domain: "Public Safety",
    status: "New",
    priorityScore: 87,
    submissionCount: 36,
    trend: "rising",
    executiveSummary: "36 submissions document a concerning rise in street crime — particularly chain snatching and theft — alongside critically slow emergency response times. Citizens report that police patrolling is absent in residential areas after 9 PM, and fire department response times exceed 40 minutes in 45% of reported emergencies.",
    affectedCitizens: 290000,
    geographicDistribution: [
      { district: "Bengaluru Urban", count: 22 },
      { district: "Mangaluru", count: 6 },
      { district: "Mysuru", count: 5 },
      { district: "Hubli-Dharwad", count: 3 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.4 }, { month: "Dec", score: -0.5 },
      { month: "Jan", score: -0.55 }, { month: "Feb", score: -0.6 },
      { month: "Mar", score: -0.7 }, { month: "Apr", score: -0.8 },
    ],
    citizenQuotes: [
      { text: "Chain snatching incidents in Koramangala have tripled. Police patrolling is zero after 9 PM.", location: "Bengaluru Urban", date: daysAgo(2) },
      { text: "Fire station took 45 minutes to respond to a factory fire. The building was fully engulfed.", location: "Mangaluru", date: daysAgo(5) },
      { text: "Stray dog attacks in Rajajinagar are out of control. Three children bitten in one week.", location: "Bengaluru Urban", date: daysAgo(3) },
    ],
    rootCause: "Police force operating at 70% of sanctioned strength with disproportionate allocation to VIP security over community patrolling. Fire stations lack adequate vehicles and personnel. No integrated emergency dispatch system connects police, fire, and ambulance services.",
    recommendations: [
      { text: "Recruit 5,000 additional police constables and deploy 60% to community beat patrolling", feasibility: "Medium", impact: "High" },
      { text: "Install 10,000 CCTV cameras with AI-powered anomaly detection in high-crime zones", feasibility: "Medium", impact: "High" },
      { text: "Establish integrated emergency command center with unified dispatch for police, fire, and ambulance", feasibility: "High", impact: "High" },
    ],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(1),
  },
  {
    id: "b7",
    title: "Affordable Housing Quality and Corruption in Allotment",
    domain: "Housing",
    status: "In Progress",
    priorityScore: 78,
    submissionCount: 31,
    trend: "stable",
    executiveSummary: "31 submissions expose a dual crisis in government housing: poor construction quality in affordable housing schemes with structural defects appearing within 2 years, and systemic corruption in site allotment processes where citizens report demands for bribes ranging from ₹50,000 to ₹2,00,000.",
    affectedCitizens: 150000,
    geographicDistribution: [
      { district: "Bengaluru Urban", count: 20 },
      { district: "Kalaburagi", count: 5 },
      { district: "Mysuru", count: 4 },
      { district: "Hubli-Dharwad", count: 2 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.5 }, { month: "Dec", score: -0.55 },
      { month: "Jan", score: -0.55 }, { month: "Feb", score: -0.6 },
      { month: "Mar", score: -0.6 }, { month: "Apr", score: -0.65 },
    ],
    citizenQuotes: [
      { text: "BDA site allotment — I paid ₹15 lakh in 2019 and still no registration. Officials demand bribes.", location: "Bengaluru Urban", date: daysAgo(4) },
      { text: "Affordable housing in Kengeri has cracks within 2 years. Walls are damp and paint peeling.", location: "Bengaluru Urban", date: daysAgo(7) },
      { text: "500 families live without water, sanitation or electricity in Majestic slums.", location: "Bengaluru Urban", date: daysAgo(3) },
    ],
    rootCause: "Absence of third-party quality audits for government housing construction, combined with opaque allotment processes that enable corruption. Current complaint redressal systems are slow and ineffective, with average resolution time exceeding 18 months.",
    recommendations: [
      { text: "Digitize all housing allotment with blockchain-verified lottery system eliminating human discretion", feasibility: "Medium", impact: "High" },
      { text: "Mandate independent structural audits at 3 construction milestones for all government housing projects", feasibility: "High", impact: "High" },
      { text: "Create fast-track housing tribunal for allotment grievances with 60-day resolution mandate", feasibility: "High", impact: "Medium" },
    ],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(3),
  },
  {
    id: "b8",
    title: "Mental Health Services Gap in Tier-2 and Rural Karnataka",
    domain: "Healthcare",
    status: "Implemented",
    priorityScore: 72,
    submissionCount: 28,
    trend: "declining",
    executiveSummary: "28 submissions highlight the near-complete absence of mental health services outside Bengaluru. Citizens in tier-2 cities report traveling 100-200km for psychiatric consultations. Following this brief's recommendations, the state has begun deploying tele-psychiatry services in 3 pilot districts.",
    affectedCitizens: 95000,
    geographicDistribution: [
      { district: "Davanagere", count: 8 },
      { district: "Hassan", count: 6 },
      { district: "Shivamogga", count: 5 },
      { district: "Tumakuru", count: 5 },
      { district: "Chitradurga", count: 4 },
    ],
    sentimentTimeline: [
      { month: "Nov", score: -0.7 }, { month: "Dec", score: -0.65 },
      { month: "Jan", score: -0.6 }, { month: "Feb", score: -0.5 },
      { month: "Mar", score: -0.4 }, { month: "Apr", score: -0.35 },
    ],
    citizenQuotes: [
      { text: "My son needs a psychiatrist but the nearest one is 150km away.", location: "Davanagere", date: daysAgo(10) },
      { text: "Mental health stigma is reducing but services are not increasing. The gap is widening.", location: "Hassan", date: daysAgo(18) },
      { text: "After the tele-psychiatry pilot, my mother got her first consultation in 3 years. Thank you.", location: "Shivamogga", date: daysAgo(5) },
    ],
    rootCause: "Mental health was historically deprioritized in public health budgets. Karnataka has only 0.3 psychiatrists per 100,000 population versus the WHO recommendation of 1 per 10,000. Training and deployment pipelines for mental health professionals are virtually nonexistent.",
    recommendations: [
      { text: "Scale tele-psychiatry pilot to all 31 districts within 6 months", feasibility: "High", impact: "High" },
      { text: "Create 50 mental health counselor positions in district hospitals with competitive compensation", feasibility: "Medium", impact: "High" },
      { text: "Launch state mental health awareness campaign to reduce stigma and increase service uptake", feasibility: "High", impact: "Medium" },
    ],
    createdAt: daysAgo(45),
    updatedAt: daysAgo(5),
  },
];

export const demoActivities: ActivityItem[] = [
  { id: "a1", type: "submission", message: "New citizen feedback received on road potholes in Koramangala", timestamp: daysAgo(0) + "T09:30:00", domain: "Infrastructure" },
  { id: "a2", type: "brief_created", message: "Policy brief generated: Rising Urban Crime and Emergency Response Failures", timestamp: daysAgo(1) + "T14:20:00", domain: "Public Safety" },
  { id: "a3", type: "status_change", message: "Brief 'Mental Health Services Gap' moved to Implemented", timestamp: daysAgo(2) + "T11:00:00", domain: "Healthcare" },
  { id: "a4", type: "submission", message: "3 new feedback submissions on hospital equipment shortages", timestamp: daysAgo(2) + "T16:45:00", domain: "Healthcare" },
  { id: "a5", type: "status_change", message: "Brief 'Water Supply Crisis' moved to In Progress", timestamp: daysAgo(3) + "T10:15:00", domain: "Infrastructure" },
  { id: "a6", type: "submission", message: "Urgent safety report: Bridge structural concerns in Mandya", timestamp: daysAgo(3) + "T08:00:00", domain: "Infrastructure" },
  { id: "a7", type: "brief_created", message: "Policy brief generated: Girls' Education Access Gap", timestamp: daysAgo(4) + "T13:30:00", domain: "Education" },
  { id: "a8", type: "submission", message: "5 new environment complaints about Bellandur Lake pollution", timestamp: daysAgo(5) + "T10:00:00", domain: "Environment" },
];

export const sentimentTrendData = [
  { month: "Nov", Infrastructure: -0.4, Healthcare: -0.5, Education: -0.5, Environment: -0.6, "Public Safety": -0.4, Housing: -0.5 },
  { month: "Dec", Infrastructure: -0.5, Healthcare: -0.55, Education: -0.55, Environment: -0.65, "Public Safety": -0.5, Housing: -0.55 },
  { month: "Jan", Infrastructure: -0.6, Healthcare: -0.7, Education: -0.6, Environment: -0.6, "Public Safety": -0.55, Housing: -0.55 },
  { month: "Feb", Infrastructure: -0.65, Healthcare: -0.75, Education: -0.55, Environment: -0.7, "Public Safety": -0.6, Housing: -0.6 },
  { month: "Mar", Infrastructure: -0.75, Healthcare: -0.85, Education: -0.6, Environment: -0.65, "Public Safety": -0.7, Housing: -0.6 },
  { month: "Apr", Infrastructure: -0.8, Healthcare: -0.9, Education: -0.65, Environment: -0.7, "Public Safety": -0.8, Housing: -0.65 },
];

export const domainDistribution = [
  { name: "Infrastructure", value: 85, fill: "hsl(174, 60%, 45%)" },
  { name: "Healthcare", value: 54, fill: "hsl(0, 84%, 60%)" },
  { name: "Education", value: 42, fill: "hsl(38, 92%, 50%)" },
  { name: "Environment", value: 38, fill: "hsl(142, 76%, 36%)" },
  { name: "Public Safety", value: 36, fill: "hsl(199, 89%, 48%)" },
  { name: "Housing", value: 31, fill: "hsl(270, 50%, 50%)" },
];

export const volumeTrendData = [
  { month: "Nov", submissions: 32 },
  { month: "Dec", submissions: 38 },
  { month: "Jan", submissions: 45 },
  { month: "Feb", submissions: 52 },
  { month: "Mar", submissions: 58 },
  { month: "Apr", submissions: 61 },
];

export const domainComparisonData = [
  { domain: "Infrastructure", volume: 85, avgUrgency: 3.2, avgSentiment: 65 },
  { domain: "Healthcare", volume: 54, avgUrgency: 3.5, avgSentiment: 72 },
  { domain: "Education", volume: 42, avgUrgency: 2.8, avgSentiment: 58 },
  { domain: "Environment", volume: 38, avgUrgency: 3.0, avgSentiment: 62 },
  { domain: "Public Safety", volume: 36, avgUrgency: 3.3, avgSentiment: 68 },
  { domain: "Housing", volume: 31, avgUrgency: 2.7, avgSentiment: 55 },
];

export const karnatakaGeoData = [
  { district: "Bengaluru Urban", lat: 12.97, lng: 77.59, count: 152, topIssue: "Road Infrastructure" },
  { district: "Mysuru", lat: 12.30, lng: 76.66, count: 23, topIssue: "Water Supply" },
  { district: "Mangaluru", lat: 12.87, lng: 74.88, count: 17, topIssue: "Emergency Response" },
  { district: "Hubli-Dharwad", lat: 15.36, lng: 75.12, count: 14, topIssue: "Power Supply" },
  { district: "Belagavi", lat: 15.85, lng: 74.50, count: 13, topIssue: "Teacher Shortage" },
  { district: "Kalaburagi", lat: 17.33, lng: 76.83, count: 12, topIssue: "Medicine Supply" },
  { district: "Davanagere", lat: 14.47, lng: 75.92, count: 10, topIssue: "Mental Health" },
  { district: "Raichur", lat: 16.20, lng: 77.37, count: 11, topIssue: "Doctor Shortage" },
  { district: "Shivamogga", lat: 13.93, lng: 75.57, count: 9, topIssue: "Ambulance Response" },
  { district: "Tumakuru", lat: 13.34, lng: 77.10, count: 8, topIssue: "Special Education" },
  { district: "Hassan", lat: 13.00, lng: 76.10, count: 7, topIssue: "Mental Health" },
  { district: "Udupi", lat: 13.34, lng: 74.75, count: 5, topIssue: "Healthcare" },
  { district: "Chitradurga", lat: 14.23, lng: 76.40, count: 9, topIssue: "Girls' Education" },
  { district: "Mandya", lat: 12.52, lng: 76.90, count: 6, topIssue: "Bridge Safety" },
  { district: "Bengaluru Rural", lat: 13.22, lng: 77.71, count: 8, topIssue: "Waste Management" },
];

export const emergingIssues = [
  { issue: "Water tanker mafia price gouging", domain: "Infrastructure" as PolicyDomain, growth: 180, submissions: 12 },
  { issue: "E-waste dumping in lake beds", domain: "Environment" as PolicyDomain, growth: 150, submissions: 8 },
  { issue: "Stray dog attacks on children", domain: "Public Safety" as PolicyDomain, growth: 120, submissions: 15 },
  { issue: "Builder fraud in affordable housing", domain: "Housing" as PolicyDomain, growth: 95, submissions: 9 },
  { issue: "Post-COVID mental health crisis in youth", domain: "Healthcare" as PolicyDomain, growth: 85, submissions: 7 },
];
