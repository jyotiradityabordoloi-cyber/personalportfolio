// ─────────────────────────────────────────────────────────────
// Product teardowns. Qualitative analysis only: no company
// figures are quoted, so nothing here needs a source.
// ─────────────────────────────────────────────────────────────

type Priority = "P0" | "P1" | "P2";

export type Teardown = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  color: string; // card accent
  overview: string;
  audience: string;
  personas: { name: string; need: string }[];
  problems: string[];
  valueProp: string;
  businessModel: string[];
  strategy: string;
  journey: { stage: string; note: string; mood: 1 | 2 | 3 | 4 | 5 }[];
  features: { name: string; role: string }[];
  loop: { name: string; steps: string[] };
  monetization: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  improvements: { title: string; detail: string }[];
  roadmap: { item: string; impact: number; effort: number; priority: Priority }[];
  kpis: { name: string; why: string }[];
};

export const teardowns: Teardown[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    tagline: "From chatbot to everyday operating layer",
    category: "AI assistant",
    color: "#10a37f",
    overview:
      "A general-purpose AI assistant that started as a research preview and became a consumer and enterprise product: chat, voice, file analysis, image generation, custom GPTs and agentic tasks.",
    audience: "Knowledge workers, students, developers, creators and teams adopting AI at work.",
    personas: [
      { name: "The student", need: "Understand concepts fast and get unstuck on assignments." },
      { name: "The knowledge worker", need: "Draft, summarise and analyse without switching tools." },
      { name: "The developer", need: "Debug, explain and prototype code quickly." },
    ],
    problems: [
      "Blank-page and research friction",
      "Search gives links, not answers",
      "Hard to trust or verify AI output",
    ],
    valueProp: "Ask anything in natural language and get a useful, conversational answer that can act on your files and tools.",
    businessModel: ["Freemium consumer subscriptions", "Team and enterprise seats", "API usage (separate platform)"],
    strategy:
      "Win the default AI interface: lead on model capability, ship fast across modalities, and move from answering questions to completing tasks.",
    journey: [
      { stage: "Discover", note: "Word of mouth, social sharing of outputs", mood: 4 },
      { stage: "First prompt", note: "Empty box: users unsure what to ask", mood: 3 },
      { stage: "Aha", note: "A genuinely useful answer to a real task", mood: 5 },
      { stage: "Habit", note: "Daily use for writing, coding, learning", mood: 4 },
      { stage: "Limits", note: "Hallucinations, usage caps, lost context", mood: 2 },
    ],
    features: [
      { name: "Chat", role: "Core loop and entry point" },
      { name: "Memory", role: "Personalisation and switching cost" },
      { name: "Custom GPTs", role: "Ecosystem and distribution" },
      { name: "Voice", role: "New contexts of use" },
    ],
    loop: { name: "Content-sharing loop", steps: ["User gets great output", "Shares screenshot / link", "Viewer tries it", "New user prompts"] },
    monetization: ["Tiered subscriptions with model and usage gates", "Per-seat team plans", "Enterprise contracts with admin and security"],
    strengths: ["Category-defining brand", "Fast shipping cadence", "Broad multimodal capability"],
    weaknesses: ["Blank-prompt onboarding", "Trust and verification gaps", "Feature sprawl hurts discoverability"],
    opportunities: ["Workflow templates by profession", "Deeper verification UX", "Team knowledge integration"],
    improvements: [
      { title: "Task-first home", detail: "Suggest starter tasks based on the user's role and recent chats instead of an empty box." },
      { title: "Confidence & source layer", detail: "Inline markers for claims with and without sources, one tap to verify." },
      { title: "Projects as workspaces", detail: "Make shared project spaces the default unit for teams." },
    ],
    roadmap: [
      { item: "Role-based starter tasks", impact: 4, effort: 2, priority: "P0" },
      { item: "Claim-level citations", impact: 5, effort: 4, priority: "P1" },
      { item: "Shared team projects", impact: 4, effort: 3, priority: "P1" },
      { item: "Prompt history search", impact: 2, effort: 1, priority: "P2" },
    ],
    kpis: [
      { name: "Weekly active users", why: "Breadth of habit" },
      { name: "Tasks completed per session", why: "Usefulness, not just chatter" },
      { name: "Free → paid conversion", why: "Monetisation health" },
      { name: "Thumbs-down / regeneration rate", why: "Answer quality proxy" },
    ],
  },
  {
    slug: "spotify",
    name: "Spotify",
    tagline: "Personalisation as the product",
    category: "Audio streaming",
    color: "#1db954",
    overview:
      "An audio streaming platform for music, podcasts and audiobooks, built on personalisation: Discover Weekly, Daylist, DJ and Wrapped.",
    audience: "Music listeners of all ages, podcast fans, artists and creators.",
    personas: [
      { name: "The commuter", need: "The right music with zero effort." },
      { name: "The explorer", need: "New artists that match their taste." },
      { name: "The artist", need: "Reach listeners and understand fans." },
    ],
    problems: ["Choice overload in a huge catalogue", "Building playlists takes effort", "Discovering new music you'll actually like"],
    valueProp: "All the audio you love, personalised to you, on every device.",
    businessModel: ["Ad-supported free tier", "Premium subscriptions (individual, duo, family, student)", "Advertising and podcast monetisation"],
    strategy: "Be the audio platform: use personalisation and the free tier for reach, then convert to Premium and expand into podcasts and audiobooks.",
    journey: [
      { stage: "Sign up", note: "Pick a few artists to seed taste", mood: 4 },
      { stage: "Listen", note: "Home feed of mixes and playlists", mood: 4 },
      { stage: "Discover", note: "Weekly personalised playlists", mood: 5 },
      { stage: "Friction", note: "Ads and skip limits on free tier", mood: 2 },
      { stage: "Share", note: "Wrapped and playlist sharing", mood: 5 },
    ],
    features: [
      { name: "Discover Weekly", role: "Retention via discovery" },
      { name: "Wrapped", role: "Annual viral moment" },
      { name: "Collaborative playlists", role: "Social stickiness" },
      { name: "Spotify Connect", role: "Every-device ubiquity" },
    ],
    loop: { name: "Personalisation loop", steps: ["User listens", "Taste profile improves", "Better recommendations", "More listening"] },
    monetization: ["Premium upsell from free-tier friction", "Family and student plans widen the base", "Targeted audio and podcast ads"],
    strengths: ["Best-in-class personalisation", "Cross-device ubiquity", "Cultural moments like Wrapped"],
    weaknesses: ["Thin margins from licensing costs", "Feed can feel cluttered across formats", "Repetitive recommendations over time"],
    opportunities: ["Live and social listening", "Creator tools for artists", "Better taste-expansion controls"],
    improvements: [
      { title: "Taste dial", detail: "Let listeners choose 'familiar ↔ adventurous' per session." },
      { title: "Format-separated home", detail: "Cleaner tabs for music, podcasts and audiobooks." },
      { title: "Artist-fan moments", detail: "Release-day listening parties with live chat." },
    ],
    roadmap: [
      { item: "Taste dial on mixes", impact: 4, effort: 2, priority: "P0" },
      { item: "Home feed separation", impact: 3, effort: 2, priority: "P1" },
      { item: "Listening parties", impact: 3, effort: 4, priority: "P2" },
      { item: "Wrapped mid-year", impact: 3, effort: 1, priority: "P1" },
    ],
    kpis: [
      { name: "Monthly active users", why: "Reach" },
      { name: "Premium conversion", why: "Revenue engine" },
      { name: "Listening hours per user", why: "Engagement depth" },
      { name: "Saves from recommendations", why: "Personalisation quality" },
    ],
  },
  {
    slug: "whatsapp",
    name: "WhatsApp",
    tagline: "Simplicity at planetary scale",
    category: "Messaging",
    color: "#25d366",
    overview:
      "A free, end-to-end encrypted messaging app for text, voice, video, groups, status and communities, plus a fast-growing business messaging platform.",
    audience: "Billions of people, especially in markets where it replaced SMS, and small and large businesses.",
    personas: [
      { name: "Family organiser", need: "Keep the family group connected." },
      { name: "Small business owner", need: "Talk to customers where they already are." },
      { name: "Low-bandwidth user", need: "Reliable messaging on cheap phones and data." },
    ],
    problems: ["Costly SMS and international calls", "Unreliable networks", "Businesses can't reach customers personally"],
    valueProp: "Simple, reliable, private messaging that works for everyone, everywhere.",
    businessModel: ["Free for consumers", "WhatsApp Business Platform (paid conversations)", "Click-to-WhatsApp ads via Meta"],
    strategy: "Stay radically simple for consumers while building commerce and business messaging on top of the same network.",
    journey: [
      { stage: "Install", note: "Phone number is the account", mood: 5 },
      { stage: "Contacts", note: "Friends already there instantly", mood: 5 },
      { stage: "Groups", note: "Family and community groups", mood: 4 },
      { stage: "Overload", note: "Noisy groups, forwarded spam", mood: 2 },
      { stage: "Business chat", note: "Order updates, support", mood: 4 },
    ],
    features: [
      { name: "Phone-number identity", role: "Zero-friction onboarding" },
      { name: "Groups & Communities", role: "Network density" },
      { name: "E2E encryption", role: "Trust" },
      { name: "Business API", role: "Monetisation" },
    ],
    loop: { name: "Network-effect loop", steps: ["User joins", "Invites contacts", "Groups form", "Everyone must be on it"] },
    monetization: ["Per-conversation pricing for businesses", "Ads that open WhatsApp chats", "Payments in select markets"],
    strengths: ["Massive network effects", "Simple, fast, reliable", "Trust from encryption"],
    weaknesses: ["Group overload and misinformation", "Limited monetisation from consumers", "Weak desktop and multi-device history"],
    opportunities: ["Commerce inside chats", "Smart group summaries", "Business discovery directory"],
    improvements: [
      { title: "Group digest", detail: "On-device summaries of busy groups you've muted." },
      { title: "In-chat catalogues + checkout", detail: "Browse and pay a small business without leaving the chat." },
      { title: "Forward friction", detail: "Context labels on highly forwarded messages with a one-tap check." },
    ],
    roadmap: [
      { item: "Group digest", impact: 4, effort: 3, priority: "P1" },
      { item: "In-chat checkout", impact: 5, effort: 4, priority: "P0" },
      { item: "Forward context labels", impact: 3, effort: 2, priority: "P1" },
      { item: "Business directory", impact: 3, effort: 3, priority: "P2" },
    ],
    kpis: [
      { name: "Daily active users", why: "Core habit" },
      { name: "Messages per user per day", why: "Engagement" },
      { name: "Business conversations", why: "Monetisation" },
      { name: "Report / block rate", why: "Health and safety" },
    ],
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    tagline: "Trust as the core product",
    category: "Travel marketplace",
    color: "#ff5a5f",
    overview:
      "A two-sided marketplace connecting guests with hosts for stays and experiences. Its main product is trust between strangers.",
    audience: "Leisure travellers, families, remote workers, and hosts from individuals to professional managers.",
    personas: [
      { name: "Family traveller", need: "Space, kitchen and a safe neighbourhood." },
      { name: "Remote worker", need: "Reliable Wi-Fi and longer stays." },
      { name: "Host", need: "Steady bookings with low hassle and risk." },
    ],
    problems: ["Hotels lack space and local feel", "Hard to trust a stranger's home", "Hosts struggle with pricing and operations"],
    valueProp: "Belong anywhere: unique places to stay, with trust built in.",
    businessModel: ["Guest service fees", "Host service fees", "Experiences commission"],
    strategy: "Strengthen trust and quality, simplify pricing transparency, and expand use cases (long stays, groups, experiences).",
    journey: [
      { stage: "Inspire", note: "Categories and wishlists", mood: 5 },
      { stage: "Search", note: "Map + filters, many options", mood: 4 },
      { stage: "Price shock", note: "Fees and cleaning costs at checkout", mood: 2 },
      { stage: "Stay", note: "Check-in instructions, host messages", mood: 4 },
      { stage: "Review", note: "Two-sided reviews", mood: 4 },
    ],
    features: [
      { name: "Two-sided reviews", role: "Trust engine" },
      { name: "Wishlists", role: "Planning + social sharing" },
      { name: "Smart pricing", role: "Host supply health" },
      { name: "AirCover", role: "Risk reduction" },
    ],
    loop: { name: "Marketplace loop", steps: ["More hosts", "More choice", "More guests", "More host earnings"] },
    monetization: ["Split fee model on each booking", "Higher take on experiences", "Optional services for hosts"],
    strengths: ["Strong brand and trust systems", "Unique inventory", "Powerful network effects"],
    weaknesses: ["Fee transparency complaints", "Inconsistent listing quality", "Regulatory pressure in cities"],
    opportunities: ["Long-stay and remote-work bundles", "Group trip planning", "Host professional tools"],
    improvements: [
      { title: "Total price everywhere", detail: "Show all-in price on every card by default, including cleaning fees." },
      { title: "Group trip mode", detail: "Shared wishlist with voting and split payments." },
      { title: "Verified work-ready badge", detail: "Tested Wi-Fi speed and desk setup for remote workers." },
    ],
    roadmap: [
      { item: "All-in pricing default", impact: 4, effort: 1, priority: "P0" },
      { item: "Group voting", impact: 4, effort: 3, priority: "P1" },
      { item: "Work-ready badge", impact: 3, effort: 2, priority: "P1" },
      { item: "Host ops dashboard", impact: 3, effort: 4, priority: "P2" },
    ],
    kpis: [
      { name: "Nights booked", why: "Core marketplace volume" },
      { name: "Search-to-book conversion", why: "Demand-side efficiency" },
      { name: "Host retention", why: "Supply health" },
      { name: "Average review rating", why: "Quality and trust" },
    ],
  },
  {
    slug: "stripe",
    name: "Stripe",
    tagline: "Developer experience as a moat",
    category: "Payments infrastructure",
    color: "#635bff",
    overview:
      "Financial infrastructure for the internet: payments, billing, tax, fraud prevention, issuing and more, delivered through clean APIs and dashboards.",
    audience: "Developers, startups, platforms and large enterprises selling online.",
    personas: [
      { name: "Startup developer", need: "Accept payments in an afternoon." },
      { name: "Finance lead", need: "Reconcile revenue and handle tax correctly." },
      { name: "Platform builder", need: "Pay out to many sellers compliantly." },
    ],
    problems: ["Payments were painful to integrate", "Global compliance is complex", "Fraud and failed payments leak revenue"],
    valueProp: "Increase the GDP of the internet: one integration for global payments and money movement.",
    businessModel: ["Per-transaction fees", "Usage-based fees on add-on products", "Custom enterprise pricing"],
    strategy: "Land with developers through superb DX, then expand within each account across the full financial stack.",
    journey: [
      { stage: "Docs", note: "Clear docs, test keys instantly", mood: 5 },
      { stage: "Integrate", note: "Copy-paste examples work", mood: 5 },
      { stage: "Go live", note: "Business verification steps", mood: 3 },
      { stage: "Scale", note: "Adds Billing, Tax, Radar", mood: 4 },
      { stage: "Complexity", note: "Dashboard depth overwhelms non-devs", mood: 2 },
    ],
    features: [
      { name: "Payments API", role: "Land" },
      { name: "Checkout", role: "Conversion" },
      { name: "Billing", role: "Expand: subscriptions" },
      { name: "Radar", role: "Expand: fraud" },
    ],
    loop: { name: "Land-and-expand loop", steps: ["Dev integrates payments", "Business grows", "Adopts more products", "Higher revenue per account"] },
    monetization: ["Take rate on payment volume", "Add-on product fees", "Volume discounts for enterprise"],
    strengths: ["Best-in-class developer experience", "Breadth of product suite", "Brand trust among builders"],
    weaknesses: ["Complex for non-technical users", "Pricing can be high at scale", "Account holds frustrate small merchants"],
    opportunities: ["No-code setups for small businesses", "Clearer risk-review communication", "AI-assisted revenue insights"],
    improvements: [
      { title: "Guided setup by business type", detail: "Templates for SaaS, marketplace and e-commerce that configure products together." },
      { title: "Transparent risk reviews", detail: "Status timeline and required actions when a payout is held." },
      { title: "Revenue copilot", detail: "Ask questions about MRR, churn and failed payments in plain language." },
    ],
    roadmap: [
      { item: "Risk review timeline", impact: 4, effort: 2, priority: "P0" },
      { item: "Business-type templates", impact: 4, effort: 3, priority: "P1" },
      { item: "Revenue copilot", impact: 3, effort: 4, priority: "P2" },
      { item: "Fee simulator", impact: 2, effort: 1, priority: "P2" },
    ],
    kpis: [
      { name: "Total payment volume", why: "Core business scale" },
      { name: "Time to first transaction", why: "Developer experience" },
      { name: "Products per account", why: "Expansion" },
      { name: "Authorisation rate", why: "Merchant value delivered" },
    ],
  },
  {
    slug: "shopify",
    name: "Shopify",
    tagline: "Arming the rebels",
    category: "Commerce platform",
    color: "#95bf47",
    overview:
      "A commerce operating system that lets anyone start, run and grow a business across online stores, social channels, marketplaces and physical retail.",
    audience: "First-time entrepreneurs, growing DTC brands and enterprise merchants.",
    personas: [
      { name: "First-time founder", need: "Launch a store without coding." },
      { name: "Growing DTC brand", need: "Sell across channels from one place." },
      { name: "App developer", need: "Build and sell tools to merchants." },
    ],
    problems: ["Building e-commerce is technically hard", "Selling across channels is fragmented", "Payments, shipping and tax are complex"],
    valueProp: "Everything you need to sell anywhere, in one platform.",
    businessModel: ["Subscription plans", "Merchant solutions (payments, shipping, capital)", "App and theme ecosystem"],
    strategy: "Grow with merchants: low barrier to start, then capture more value as they scale through merchant solutions.",
    journey: [
      { stage: "Start trial", note: "Store live in minutes", mood: 5 },
      { stage: "Design", note: "Themes + editor", mood: 4 },
      { stage: "First sale", note: "Big emotional moment", mood: 5 },
      { stage: "App overload", note: "Too many apps and monthly costs", mood: 2 },
      { stage: "Scale", note: "Multi-channel, POS, wholesale", mood: 4 },
    ],
    features: [
      { name: "Online store + themes", role: "Easy start" },
      { name: "Shopify Payments", role: "Revenue share" },
      { name: "App Store", role: "Ecosystem" },
      { name: "Shop app", role: "Buyer network" },
    ],
    loop: { name: "Merchant success loop", steps: ["Merchant grows", "Uses more solutions", "Shopify earns more", "Invests in tools"] },
    monetization: ["Subscription tiers", "Payment processing take rate", "Revenue share on apps and themes"],
    strengths: ["Aligned incentives with merchants", "Huge ecosystem", "Strong checkout"],
    weaknesses: ["App sprawl and hidden costs", "Customisation limits on lower tiers", "Merchants own little of the buyer relationship"],
    opportunities: ["AI store setup and copywriting", "Native features replacing popular apps", "Buyer network via Shop app"],
    improvements: [
      { title: "App cost dashboard", detail: "Show total monthly spend on apps and suggest native alternatives." },
      { title: "AI launch assistant", detail: "Generate store, product copy and first campaign from a product photo." },
      { title: "First-sale playbook", detail: "Guided checklist focused on getting the first 10 orders." },
    ],
    roadmap: [
      { item: "First-sale playbook", impact: 5, effort: 2, priority: "P0" },
      { item: "App cost dashboard", impact: 3, effort: 2, priority: "P1" },
      { item: "AI launch assistant", impact: 4, effort: 4, priority: "P1" },
      { item: "Native reviews", impact: 3, effort: 3, priority: "P2" },
    ],
    kpis: [
      { name: "Gross merchandise volume", why: "Merchant success" },
      { name: "Trial → paid conversion", why: "Acquisition efficiency" },
      { name: "Time to first sale", why: "Activation" },
      { name: "Merchant churn", why: "Retention" },
    ],
  },
  {
    slug: "strava",
    name: "Strava",
    tagline: "The social network for athletes",
    category: "Fitness & social",
    color: "#fc4c02",
    overview:
      "A fitness tracking and social platform where runners, cyclists and other athletes log activities, compete on segments and follow each other.",
    audience: "Runners, cyclists, triathletes and fitness enthusiasts at every level.",
    personas: [
      { name: "Weekend runner", need: "Track progress and stay motivated." },
      { name: "Competitive cyclist", need: "Compete on segments, analyse performance." },
      { name: "Club organiser", need: "Bring a community together." },
    ],
    problems: ["Training alone is hard to sustain", "Progress is hard to see", "Finding routes and people to train with"],
    valueProp: "If it's not on Strava, it didn't happen: track, share and be motivated by your community.",
    businessModel: ["Freemium subscription", "Brand partnerships and sponsored challenges"],
    strategy: "Own the social layer of fitness; let devices own sensors while Strava owns community and motivation.",
    journey: [
      { stage: "Record", note: "Phone or watch sync", mood: 4 },
      { stage: "Upload", note: "Map, stats, photos", mood: 5 },
      { stage: "Kudos", note: "Friends react", mood: 5 },
      { stage: "Paywall", note: "Key analytics locked", mood: 2 },
      { stage: "Challenge", note: "Monthly goals, clubs", mood: 4 },
    ],
    features: [
      { name: "Segments", role: "Competition" },
      { name: "Kudos & comments", role: "Social reward" },
      { name: "Clubs & challenges", role: "Community" },
      { name: "Routes", role: "Planning value" },
    ],
    loop: { name: "Social motivation loop", steps: ["Athlete uploads", "Friends give kudos", "Motivation rises", "More uploads"] },
    monetization: ["Subscription for analytics, routes, safety", "Sponsored challenges for brands"],
    strengths: ["Strong community and identity", "Device-agnostic integrations", "Engaged core users"],
    weaknesses: ["Intimidating for beginners", "Value of paid tier unclear to casual users", "Privacy concerns with maps"],
    opportunities: ["Beginner-friendly programmes", "Local group-run discovery", "AI training insights"],
    improvements: [
      { title: "Beginner mode", detail: "Hide leaderboards, focus on streaks and personal progress." },
      { title: "Group-run finder", detail: "Discover local clubs and runs at your pace." },
      { title: "Weekly AI recap", detail: "Plain-language training summary that previews paid features." },
    ],
    roadmap: [
      { item: "Beginner mode", impact: 4, effort: 2, priority: "P0" },
      { item: "AI weekly recap", impact: 4, effort: 3, priority: "P1" },
      { item: "Group-run finder", impact: 3, effort: 3, priority: "P1" },
      { item: "Privacy zones v2", impact: 2, effort: 2, priority: "P2" },
    ],
    kpis: [
      { name: "Weekly uploading athletes", why: "Core habit" },
      { name: "Kudos per activity", why: "Social engagement" },
      { name: "Subscription conversion", why: "Revenue" },
      { name: "Week-8 retention of new users", why: "Beginner success" },
    ],
  },
  {
    slug: "uber",
    name: "Uber",
    tagline: "Push a button, get a ride, and much more",
    category: "Mobility marketplace",
    color: "#9ca3af",
    overview:
      "A platform for rides, food and grocery delivery and freight, matching riders and eaters with drivers and couriers in real time.",
    audience: "Urban commuters, travellers, restaurants, drivers and couriers.",
    personas: [
      { name: "Commuter", need: "Reliable, predictable rides." },
      { name: "Driver", need: "Flexible, fair earnings." },
      { name: "Restaurant", need: "Reach more customers with delivery." },
    ],
    problems: ["Unreliable taxis and opaque pricing", "Drivers need flexible income", "Restaurants lack delivery logistics"],
    valueProp: "Reliable transportation and delivery at the push of a button.",
    businessModel: ["Commission on rides and deliveries", "Uber One membership", "Advertising in the Eats app"],
    strategy: "Build a cross-sold platform: one account, one membership, many services; raise frequency and lifetime value.",
    journey: [
      { stage: "Open app", note: "Location auto-detected", mood: 5 },
      { stage: "Price", note: "Upfront fare, surge surprises", mood: 3 },
      { stage: "Wait", note: "Live car tracking", mood: 4 },
      { stage: "Ride", note: "Safety tools, share trip", mood: 4 },
      { stage: "Cross-sell", note: "Eats and grocery offers", mood: 3 },
    ],
    features: [
      { name: "Real-time matching", role: "Core marketplace" },
      { name: "Upfront pricing", role: "Trust" },
      { name: "Uber One", role: "Cross-service retention" },
      { name: "Safety toolkit", role: "Trust and safety" },
    ],
    loop: { name: "Liquidity loop", steps: ["More riders", "More driver earnings", "More drivers", "Shorter wait times"] },
    monetization: ["Take rate per trip and order", "Membership fees", "Ads from merchants and brands"],
    strengths: ["Global liquidity", "Multi-service platform", "Strong operational data"],
    weaknesses: ["Surge pricing frustration", "Driver satisfaction and churn", "Thin margins in some segments"],
    opportunities: ["Commute subscriptions", "Better driver tooling", "Bundled travel flows"],
    improvements: [
      { title: "Price lock for regular trips", detail: "Subscribe to a fixed fare for your daily commute." },
      { title: "Driver earnings planner", detail: "Forecast earnings by area and time to plan shifts." },
      { title: "Airport bundle", detail: "Ride + meal + return ride booked as one trip." },
    ],
    roadmap: [
      { item: "Commute price lock", impact: 5, effort: 3, priority: "P0" },
      { item: "Driver earnings planner", impact: 4, effort: 3, priority: "P1" },
      { item: "Airport bundle", impact: 3, effort: 3, priority: "P2" },
      { item: "Surge explainer", impact: 3, effort: 1, priority: "P1" },
    ],
    kpis: [
      { name: "Gross bookings", why: "Platform scale" },
      { name: "Trips per active user", why: "Frequency" },
      { name: "ETA and completion rate", why: "Marketplace reliability" },
      { name: "Cross-service users", why: "Platform strategy" },
    ],
  },
];

export const getTeardown = (slug: string) => teardowns.find((t) => t.slug === slug);
