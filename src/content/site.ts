// ─────────────────────────────────────────────────────────────
// Personal details. Edit this file to update the whole site.
// Anything in [square brackets] is a placeholder to replace.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Jyotiraditya Bordoloi",
  shortName: "Jyotiraditya",
  initials: "JB",
  role: "Product Builder",
  status: "Open to APM / PM roles",
  location: "India",
  headline: "I turn complex problems into meaningful product experiences.",
  intro:
    "I work where user research, data and engineering meet: framing the right problem, testing it with numbers, and shipping with the team that builds it. Currently focused on AI, SaaS, FinTech and consumer tech.",
  // Transition video for page two (made with Claude Motion). Put the MP4 in
  // public/videos/ and set the path here, e.g. "/videos/about-transition.mp4".
  aboutVideo: null as string | null,
  // Short note on the landing page
  passion:
    "I'm passionate about building AI products people actually trust, and about the data that shows whether they work.",
  education: {
    degree: "B.Tech, Electronics & Communication Engineering",
    school: "VIT Vellore",
    year: "2025",
  },
  email: "jyotiraditybordoloi@gmail.com",
  links: {
    github: "https://github.com/jyotiradityabordoloi-cyber",
    linkedin: "https://www.linkedin.com/in/jyotiraditya-bordoloi-721879237/",
    resume: "/Jyotiraditya_Bordoloi_Resume.pdf",
  },
  interests: ["AI products", "SaaS", "FinTech", "Consumer tech", "Product strategy"],
};

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "teardowns", label: "Teardowns" },
  { id: "analytics", label: "Analytics" },
  { id: "contact", label: "Contact" },
] as const;

// The toolkit: the one place (with projects) that shows colour.
// logo = a real full-colour mark in /public/icons; glyph = a practice with no brand.
export type Skill = {
  name: string;
  logo?: string;
  ink?: boolean; // a black mark: shown in white on the dark tile
  glyph?: "file" | "users" | "chart" | "repeat" | "layout";
};
export type SkillGroup = {
  group: string;
  icon: "layers" | "chart" | "bolt" | "sparkles";
  blurb: string;
  tags: string;
  href: string;
  items: Skill[];
};

export const skills: SkillGroup[] = [
  {
    group: "Product",
    icon: "layers",
    blurb: "Find problems, shape solutions and drive product decisions.",
    tags: "Product Strategy, Discovery, PRD, UX",
    href: "#projects",
    items: [
      { name: "Notion", logo: "/icons/notion.svg" },
      { name: "Figma", logo: "/icons/figma.svg" },
      { name: "Miro", logo: "/icons/miro.svg" },
      { name: "Wireframing", glyph: "layout" },
      { name: "PRD", glyph: "file" },
      { name: "User Research", glyph: "users" },
      { name: "A/B Testing", glyph: "chart" },
    ],
  },
  {
    group: "Data & Analytics",
    icon: "chart",
    blurb: "Turn user, product and business data into actionable insights.",
    tags: "Analysis, Dashboards, Metrics, Experimentation",
    href: "#analytics",
    items: [
      { name: "Excel", logo: "/icons/xlsx.svg" },
      { name: "SQL", logo: "/icons/db.svg" },
      { name: "Python", logo: "/icons/python.svg" },
      { name: "Power BI", logo: "/icons/power-bi.svg" },
      { name: "Mixpanel", logo: "/icons/si-mixpanel.svg" },
      { name: "GA4", logo: "/icons/google-analytics.svg" },
      { name: "Sheets", logo: "/icons/google-sheets.svg" },
    ],
  },
  {
    group: "Delivery",
    icon: "bolt",
    blurb: "Plan, prioritise and ship with engineering teams.",
    tags: "Roadmap, Sprints, Collaboration, Execution",
    href: "#experience",
    items: [
      { name: "Jira", logo: "/icons/jira.svg" },
      { name: "Azure DevOps", logo: "/icons/azure.svg" },
      { name: "GitHub", logo: "/icons/github.svg", ink: true },
      { name: "Slack", logo: "/icons/slack.svg" },
      { name: "Confluence", logo: "/icons/confluence.svg" },
      { name: "Agile", glyph: "repeat" },
    ],
  },
  {
    group: "AI & Automation",
    icon: "sparkles",
    blurb: "Leverage AI and automation to move faster and build smarter.",
    tags: "LLMs, RAG, Workflows, Prototyping",
    href: "#projects",
    items: [
      { name: "ChatGPT", logo: "/icons/openai.svg", ink: true },
      { name: "Groq", logo: "/icons/groq.svg" },
      { name: "Ollama", logo: "/icons/ollama.svg", ink: true },
      { name: "n8n", logo: "/icons/n8n.svg" },
      { name: "Zapier", logo: "/icons/si-zapier.svg" },
      { name: "Lovable", logo: "/icons/lovable.svg" },
      { name: "VS Code", logo: "/icons/visual-studio-code.svg" },
    ],
  },
];

// The About screen (the end of page two)
export const about = {
  // the words in ** are set bright
  headline: "A curious builder at the intersection of **technology**, **product** and **people**.",
  body:
    "I turn ambiguous problems into clear product bets: talking to users, reading the numbers, and working shoulder to shoulder with engineers until it ships. Right now I'm most excited about AI products people actually trust.",
  tags: [
    "Product Thinking",
    "User-Centric Approach",
    "Data-Driven Decisions",
    "AI Products",
    "Experimentation",
    "Agile Delivery",
    "Stakeholder Alignment",
    "Systems Thinking",
  ],
};

export const aboutPoints = [
  {
    title: "Technical depth",
    body: "I read architecture diagrams, ask the right API questions and talk trade-offs in the engineers' language.",
  },
  {
    title: "Teams that ship",
    body: "Sprints, stand-ups and stakeholder updates: I keep cross-functional teams aligned and moving.",
  },
  {
    title: "AI & SaaS",
    body: "Turning model capability into workflows people trust is the problem I want to work on.",
  },
  {
    title: "Evidence over opinion",
    body: "Funnels, cohorts and experiments decide what ships next, not the loudest voice in the room.",
  },
];

// ─── Journey: Experience section (college first, newest last) ───
// Highlights follow Google's XYZ formula: accomplished X, measured by Y, by doing Z.
export type JourneyStep = {
  id: string;
  step: string;
  phase: string;
  title: string;
  org: string;
  location: string;
  period: string;
  icon: "cap" | "factory" | "layers" | "link";
  current?: boolean;
  story: string;
  highlights: string[];
  links?: { label: string; href: string }[];
  tags: string[];
};

export const journey: JourneyStep[] = [
  {
    id: "vit",
    step: "01",
    phase: "College",
    title: "B.Tech (ECE)",
    org: "VIT Vellore",
    location: "Vellore, Tamil Nadu",
    period: "Sep 2021 – May 2025",
    icon: "cap",
    story:
      "Where I learned to break a problem down into circuits, signals and code, and to prove an idea works with measurements, not opinions.",
    highlights: [
      "Published a peer-reviewed IEEE paper as first author (IC3TES 2024) by designing and testing a microcontroller-based pressure-monitoring system that uses single-mode optical fibre as the sensor.",
      "Measured applied load through light attenuation and pulse width, avoiding the electromagnetic interference and corrosion that degrade electrical sensors, by building the rig with a He–Ne laser, an LDR-driven 555 timer and an ATmega32.",
    ],
    links: [{ label: "Read the IEEE paper", href: "https://ieeexplore.ieee.org/document/10877459" }],
    tags: ["Electronics", "IoT", "Embedded systems", "Research", "Optical sensing", "Signals"],
  },
  {
    id: "ongc",
    step: "02",
    phase: "First Industry Exposure",
    title: "Summer Intern",
    org: "ONGC",
    location: "Jorhat, Assam",
    period: "Aug 2023 – Oct 2023",
    icon: "factory",
    story: "My first look at technology running a real operation, where reliability and safety matter more than novelty.",
    highlights: [
      "Learned how real-time telemetry supports operational decisions in oil and gas by working hands-on with SCADA systems at an operating ONGC asset.",
      "Practised project coordination and communication management by working alongside an energy-sector team on site.",
      "Deepened my understanding of how technology is applied in the energy sector, where uptime and safety shape every decision.",
    ],
    tags: ["SCADA", "Communication management", "Project coordination"],
  },
  {
    id: "75f",
    step: "03",
    phase: "Product & Tech Exposure",
    title: "Product Consultant",
    org: "75F APAC",
    location: "Bengaluru, Karnataka",
    period: "Mar 2025 – Apr 2026",
    icon: "layers",
    story: "Where I learned how products break, and how to catch it before customers do.",
    highlights: [
      "Made alarm and alert workflows behave correctly end to end, from threshold configuration and triggers to notification delivery and acknowledge/clear, by validating REST APIs (payloads, status codes, auth, error handling).",
      "Isolated root causes of bugs faster by analysing logs and running A/B comparisons against expected behaviour.",
      "Gave developers, QA and product a shared view of sprint progress and bug trends by building Azure DevOps dashboards and facilitating Agile ceremonies.",
      "Verified HVAC control behaviour (setpoints, schedules and equipment response) before release by contributing to control-system testing.",
    ],
    tags: [
      "Sprint delivery",
      "Azure DevOps",
      "PRD",
      "Feature breakdown",
      "Scrum",
      "Retros",
      "SDLC",
      "PDLC",
      "API testing",
      "IoT / HVAC",
    ],
  },
  {
    id: "propvr",
    step: "04",
    phase: "Building Products at Scale",
    title: "Junior Project Manager",
    org: "PropVR (Square Yards)",
    location: "Bengaluru, Karnataka",
    period: "May 2026 – Present",
    icon: "link",
    current: true,
    story: "Owning delivery of immersive PropTech products for enterprise real-estate clients, from the first requirement to launch.",
    highlights: [
      "Drove 0-to-1 delivery across a 2.8M portfolio of immersive PropTech solutions for enterprise real-estate clients by owning the path from requirement gathering to launch.",
      "Turned stakeholder and client feedback into a prioritised, actionable backlog by leading product planning and owning sprint planning, backlog tracking and release coordination in Azure DevOps.",
      "Kept launches on track across Product, Engineering, Design, QA and Client Success by flagging delivery risks early, resolving cross-team dependencies and running feature validation and UAT.",
      "Improved project visibility, collaboration and delivery efficiency by introducing process improvements to how the team plans, tracks and reports work.",
    ],
    tags: [
      "Leadership",
      "Ownership",
      "Sprint management",
      "Resource allocation",
      "AI automation",
      "Stakeholder management",
      "Product execution",
    ],
  },
];

export const journeyStats = [
  { value: "2 yrs", label: "Industry experience" },
  { value: "3", label: "Roles" },
  { value: "B.Tech", label: "ECE, VIT Vellore" },
  { value: "IEEE", label: "Published author" },
];
