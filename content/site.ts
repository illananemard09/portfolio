// All editable copy lives here. Components only read from this file.

export const person = {
  name: "Illana Nemard",
  firstName: "Illana",
  initials: "IN",
  role: "Marketing, Communications & Event Manager",
  location: "Melbourne, Australia",
  origin: "France",
  email: "illananemard09@icloud.com",
  linkedin: "https://www.linkedin.com/in/illana-nemard",
  linkedinHandle: "in/illana-nemard",
  availability: "Open to new projects · Melbourne & remote",
  visa: "Working Holiday Visa (417) · open to sponsorship",
  languages: [
    { name: "French", level: "Native", value: 5 },
    { name: "English", level: "Fluent · C1", value: 4 },
    { name: "Spanish", level: "Conversational · A2–B1", value: 2 },
  ],
};

export type NavItem = { label: string; id?: string; href?: string };

/** Home: Illana's world → café. */
export const homeNav: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "cafe", label: "The café" },
  { href: "/portfolio/", label: "Portfolio" },
];

/** The detailed editorial portfolio page. */
export const portfolioNav: NavItem[] = [
  { href: "/", label: "Illana's world" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "events", label: "Events" },
  { id: "marketing", label: "Marketing" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const keywords = [
  {
    word: "Events",
    line: "Conferences, launches and activations delivered from the first sketch to the last guest out.",
  },
  {
    word: "Marketing",
    line: "Campaigns built on audience insight, not guesswork — then measured honestly.",
  },
  {
    word: "Communication",
    line: "Internal, external, bilingual. The right message, to the right people, at the right moment.",
  },
  {
    word: "Content",
    line: "Newsletters, articles, social and visual content that carries a brand's voice.",
  },
  {
    word: "Branding",
    line: "Consistency across every touchpoint, from an invitation to a lanyard.",
  },
  {
    word: "Digital",
    line: "Social platforms, email, WordPress and HTML/CSS — comfortable where audiences live.",
  },
  {
    word: "Experiences",
    line: "The part people remember. Everything else is there to make it possible.",
  },
];

export const milestones = [
  { year: "2016", title: "Digital foundations", text: "Baccalauréat in Technology & Digital Information Systems — ORT Strasbourg." },
  { year: "2020", title: "First events", text: "Event assistant at Strass Events, then marketing at Spiero. First taste of the backstage." },
  { year: "2021", title: "Owning digital", text: "Digital Communications Manager for L'atelier du Relieur — brand, content, website." },
  { year: "2022", title: "360° communication", text: "Pulsalys, Lyon: events, content strategy, newsletters, cross-team projects." },
  { year: "2024", title: "Events at scale", text: "LexisNexis France: 10+ corporate events, conferences and launches. Master's degree, INSEEC." },
  { year: "2025", title: "Melbourne", text: "A new continent, Australian hospitality, and a sharper instinct for guest experience." },
];

export type CaseStep = { label: string; text: string };
export type Project = {
  slug: string;
  index: string;
  client: string;
  title: string;
  kicker: string;
  year: string;
  place: string;
  tags: string[];
  palette: [string, string, string];
  /** Optional photo in /public (e.g. "/images/lexisnexis.jpg"). Falls back to an art-directed plate. */
  image?: string;
  motif: "rings" | "grid" | "waves" | "arches" | "dots";
  stats: { value: number; suffix?: string; prefix?: string; label: string }[];
  steps: CaseStep[];
};

export const projects: Project[] = [
  {
    slug: "lexisnexis-events",
    index: "01",
    client: "LexisNexis France",
    title: "A season of rooms full of professionals",
    kicker: "Corporate event programme",
    year: "2024",
    place: "Paris",
    tags: ["Conferences", "Product launches", "Multi-channel campaigns"],
    palette: ["#1b1a18", "#e0482c", "#e9e3d9"],
    motif: "rings",
    stats: [
      { value: 10, suffix: "+", label: "events delivered end-to-end" },
      { value: 3, label: "teams aligned — Marketing, Sales, Product" },
      { value: 9, label: "months, one continuous programme" },
    ],
    steps: [
      {
        label: "The challenge",
        text: "Legal and accounting professionals are busy, sceptical and hard to move. Each event had to earn its place in their calendar — and serve business objectives for Marketing, Sales and Product at the same time.",
      },
      {
        label: "The strategy",
        text: "Treat the programme as a single brand experience rather than a list of dates: one visual line, one editorial voice, and campaigns that start well before the doors open and continue after they close.",
      },
      {
        label: "The idea",
        text: "Every event is a piece of content. Invitations, agendas, speaker features and post-event recaps were planned together, so each touchpoint fed the next one.",
      },
      {
        label: "The execution",
        text: "Budgets, timelines, suppliers, venues and on-site coordination managed end-to-end. Multi-channel promotion across social, email and digital content. Process improvements and onboarding for new team members along the way.",
      },
      {
        label: "The result",
        text: "More than ten conferences, corporate events and product launches delivered for professional audiences, with event strategy aligned to business objectives across three internal teams.",
      },
    ],
  },
  {
    slug: "pulsalys-360",
    index: "02",
    client: "Pulsalys",
    title: "Making innovation feel human",
    kicker: "360° communication & events",
    year: "2022 — 2023",
    place: "Lyon",
    tags: ["Internal events", "Content strategy", "Newsletters"],
    palette: ["#e9e3d9", "#1b1a18", "#e0482c"],
    motif: "grid",
    stats: [
      { value: 12, label: "months of 360° communication" },
      { value: 4, label: "channels — events, social, web, newsletter" },
      { value: 2, label: "audiences — internal & external" },
    ],
    steps: [
      {
        label: "The challenge",
        text: "An innovation and technology-transfer organisation with complex stories to tell — to researchers, start-ups, partners and its own teams.",
      },
      {
        label: "The strategy",
        text: "Bring people into the room. Use internal and external events as the heartbeat of the communication plan, and let content extend each one.",
      },
      {
        label: "The idea",
        text: "Translate research into people: faces, projects and moments rather than jargon.",
      },
      {
        label: "The execution",
        text: "Coordinated internal and external events, built content strategies across social media and digital platforms, and produced newsletters, articles and website content with several departments.",
      },
      {
        label: "The result",
        text: "Consistent brand messaging across every channel, and events that became the backbone of the organisation's storytelling.",
      },
    ],
  },
  {
    slug: "atelier-du-relieur",
    index: "03",
    client: "L'atelier du Relieur",
    title: "A craft brand, finally online",
    kicker: "Digital brand & content",
    year: "2021 — 2022",
    place: "Strasbourg",
    tags: ["Brand identity", "WordPress", "Social content"],
    palette: ["#2a2622", "#e9e3d9", "#c9a27a"],
    motif: "arches",
    stats: [
      { value: 1, label: "owner of the entire digital presence" },
      { value: 3, label: "channels — website, social, campaigns" },
      { value: 9, label: "months to rebuild the brand online" },
    ],
    steps: [
      {
        label: "The challenge",
        text: "A bookbinding workshop with beautiful, slow craftsmanship — and a digital presence that didn't reflect it.",
      },
      {
        label: "The strategy",
        text: "Let the craft lead. Show hands, materials and process; write the way the workshop speaks.",
      },
      {
        label: "The idea",
        text: "The website as a showroom, social media as the workshop window.",
      },
      {
        label: "The execution",
        text: "Managed the website and social media, created visual and editorial content aligned with the brand identity, ran targeted digital campaigns, and maintained and optimised the WordPress site.",
      },
      {
        label: "The result",
        text: "A coherent online identity and campaigns designed to bring customers closer to the craft.",
      },
    ],
  },
];

export const journey = [
  {
    key: "concept",
    label: "Concept",
    creative: "Moodboards, a big idea, a name, a feeling guests should leave with.",
    operational: "Objectives, audience, KPIs and a first budget envelope.",
    items: ["Concept development", "Audience & objectives", "Creative direction"],
  },
  {
    key: "strategy",
    label: "Strategy",
    creative: "The story arc of the day — what people see, hear and share.",
    operational: "Format, date, capacity, channels and a realistic budget.",
    items: ["Communication plan", "Budget framing", "Stakeholder alignment"],
  },
  {
    key: "planning",
    label: "Planning",
    creative: "Run-of-show, speakers, content calendar, invitation design.",
    operational: "Timelines, venues, contracts, registrations and risk.",
    items: ["Event planning", "Logistics", "Retroplanning"],
  },
  {
    key: "production",
    label: "Production",
    creative: "Signage, staging, visuals, the details photographed later.",
    operational: "Suppliers, catering, AV, transport, briefing every team.",
    items: ["Supplier coordination", "Team coordination", "Promotion campaign"],
  },
  {
    key: "experience",
    label: "Experience",
    creative: "Arrivals, atmosphere, the moment the room goes quiet.",
    operational: "Check-in, timings, problem-solving before anyone notices.",
    items: ["Guest experience", "On-site execution", "Live communication"],
  },
  {
    key: "results",
    label: "Results",
    creative: "Recap content, photos, stories that keep the event alive.",
    operational: "Attendance, feedback, costs, learnings for next time.",
    items: ["Post-event analysis", "Reporting", "Follow-up content"],
  },
];

export const marketingCapabilities = [
  "Marketing strategy",
  "Brand communication",
  "Social media",
  "Content creation",
  "Digital campaigns",
  "Brand storytelling",
  "Audience engagement",
  "Creator marketing",
  "Partnerships",
  "Campaign strategy",
];

export const marketingStats = [
  { value: 5, suffix: "+", label: "years in marketing & communications" },
  { value: 8, label: "organisations, from craft workshops to global publishers" },
  { value: 3, label: "working languages" },
  { value: 9, label: "creative & digital tools used daily" },
];

export const campaigns = [
  {
    client: "LexisNexis France",
    title: "Event campaigns that fill rooms",
    channel: "Social · Email · Digital content",
    brief: "Drive attendance to conferences and launches for legal and accounting professionals.",
    idea: "Campaigns that tell the story of the event, not just its date.",
    strategy: "Multi-channel sequences: teaser, invitation, speakers, reminders, recap.",
    execution: "Content and promotional material produced in-house, aligned with Sales and Product.",
    impact: "Greater visibility, engagement and attendance across the programme.",
  },
  {
    client: "Pimms Mediation",
    title: "A clearer voice, everywhere",
    channel: "Email marketing · Social",
    brief: "Strengthen brand visibility and engagement for a social-mediation network.",
    idea: "One message, adapted — never repeated.",
    strategy: "Optimise every digital material and unify tone across channels.",
    execution: "Email campaigns, social content and refreshed digital communication materials.",
    impact: "Consistent brand messaging across all digital channels.",
  },
  {
    client: "Pulsalys",
    title: "Research, told through people",
    channel: "Newsletter · Articles · Web",
    brief: "Make an innovation organisation's work readable and shareable.",
    idea: "Every project has a face and a story.",
    strategy: "Editorial calendar linking events, articles, newsletters and social.",
    execution: "Newsletters, articles and website content across departments.",
    impact: "A steady content rhythm built around live moments.",
  },
  {
    client: "Spiero",
    title: "From research to campaign",
    channel: "Digital · Print",
    brief: "Support marketing campaigns across digital and print channels.",
    idea: "Know the market before talking to it.",
    strategy: "Market research and competitor analysis to guide messaging.",
    execution: "Content for social media, newsletters and promotional materials.",
    impact: "Campaign materials grounded in audience and competitor insight.",
  },
];

export type Role = {
  /** File name shown on the laptop desktop. */
  file: string;
  /** Slug of a related case study, if any. */
  caseStudy?: string;
  company: string;
  position: string;
  period: string;
  place: string;
  sector: string;
  responsibilities: string[];
  highlight: string;
};

export const roles: Role[] = [
  {
    file: "2025_Hospitality_Australia.pdf",
    company: "Australian Hospitality Venues",
    position: "Bartender / All-rounder",
    period: "2025 — Now",
    place: "Queensland & Victoria",
    sector: "Hospitality",
    responsibilities: [
      "High-volume bar and hospitality service",
      "Guest interactions with a focus on experience and service standards",
      "Cocktails, food and floor support",
      "POS, stock management and venue preparation",
    ],
    highlight: "Guest experience, lived from the other side of the bar.",
  },
  {
    file: "2024_LexisNexis_France.pdf",
    caseStudy: "lexisnexis-events",
    company: "LexisNexis France",
    position: "External Communications & Events Manager",
    period: "2024",
    place: "Paris",
    sector: "Publishing · Legal tech",
    responsibilities: [
      "End-to-end delivery of 10+ corporate events, conferences and launches",
      "Logistics, budgets, timelines, suppliers and on-site coordination",
      "Multi-channel event campaigns — social, email, digital content",
      "Alignment with Marketing, Sales and Product; team onboarding",
    ],
    highlight: "10+ events for legal & accounting audiences.",
  },
  {
    file: "2023_Pimms_Mediation.pdf",
    company: "Pimms Mediation",
    position: "Digital Communications Assistant",
    period: "2023",
    place: "Lyon",
    sector: "Social mediation",
    responsibilities: [
      "Digital communication materials for visibility and engagement",
      "Email marketing campaigns and social content",
      "Consistent brand messaging across channels",
    ],
    highlight: "One voice across every digital channel.",
  },
  {
    file: "2022_Pulsalys.pdf",
    caseStudy: "pulsalys-360",
    company: "Pulsalys",
    position: "360° Communication Assistant",
    period: "2022 — 2023",
    place: "Lyon",
    sector: "Innovation",
    responsibilities: [
      "Internal and external event coordination",
      "Content strategy across social and digital platforms",
      "Newsletters, articles and website content",
      "Cross-department project management",
    ],
    highlight: "Events as the heartbeat of communication.",
  },
  {
    file: "2021_Atelier_du_Relieur.pdf",
    caseStudy: "atelier-du-relieur",
    company: "L'atelier du Relieur",
    position: "Digital Communications Manager",
    period: "2021 — 2022",
    place: "Strasbourg",
    sector: "Craft · Retail",
    responsibilities: [
      "Owned the website and social media presence",
      "Visual and editorial content aligned with brand identity",
      "Targeted digital campaigns",
      "WordPress maintenance and optimisation",
    ],
    highlight: "A craft brand, rebuilt online.",
  },
  {
    file: "2020_Ocordo_Travaux.pdf",
    company: "Ocordo Travaux",
    position: "Communication & Sales Assistant",
    period: "2020 — 2021",
    place: "Strasbourg",
    sector: "Construction",
    responsibilities: [
      "Client and partner communications",
      "Local marketing and advertising campaigns",
      "Field prospecting for business development",
    ],
    highlight: "Learning that every message has a customer.",
  },
  {
    file: "2020_Spiero.pdf",
    company: "Spiero",
    position: "Marketing Assistant",
    period: "2020",
    place: "Hoerdt",
    sector: "Marketing",
    responsibilities: [
      "Digital and print campaigns",
      "Social, newsletter and promotional content",
      "Market research and competitor analysis",
    ],
    highlight: "Research first, campaign second.",
  },
  {
    file: "2020_Strass_Events.pdf",
    company: "Strass Events",
    position: "Event Assistant",
    period: "2020",
    place: "Hoenheim",
    sector: "Events",
    responsibilities: [
      "Coordination and logistics of corporate and promotional events",
      "Set-up and breakdown",
      "Vendor liaison, guest check-in and on-site operations",
    ],
    highlight: "Where it started: backstage, with a walkie-talkie.",
  },
];

export const education = [
  { title: "Master — Communication, Advertising & Digital Strategy", school: "INSEEC, Lyon", period: "2022 — 2024" },
  { title: "Bachelor — Multimedia Communications Manager", school: "ESTUDIA, Strasbourg", period: "2021 — 2022" },
  { title: "Diploma of Communications", school: "IESA, Strasbourg", period: "2020 — 2021" },
  { title: "Baccalauréat — Technology & Digital Information Systems", school: "ORT, Strasbourg", period: "2016 — 2018" },
];

export const toolkit = [
  { key: "events", label: "Events", skills: ["Event planning & execution", "Run-of-show", "Venue sourcing", "On-site operations", "Guest check-in", "Risk & contingency"] },
  { key: "strategy", label: "Strategy", skills: ["Objectives & KPIs", "Audience insight", "Market research", "Competitor analysis", "Budget framing", "Business alignment"] },
  { key: "marketing", label: "Marketing", skills: ["Campaign strategy", "Multi-channel campaigns", "Email marketing", "Partnerships", "Local advertising", "Lead generation"] },
  { key: "communication", label: "Communication", skills: ["Internal comms", "External comms", "Brand messaging", "Press & partners", "Bilingual FR / EN", "Stakeholder updates"] },
  { key: "content", label: "Content", skills: ["Newsletters", "Articles", "Website content", "Storytelling", "Copywriting", "Recap content"] },
  { key: "social", label: "Social", skills: ["Meta Business Suite", "Hootsuite", "LinkedIn", "Instagram", "Content calendars", "Community engagement"] },
  { key: "creative", label: "Creative", skills: ["Canva", "Photoshop", "Illustrator", "InDesign", "Premiere Pro", "WordPress · HTML/CSS"] },
  { key: "pm", label: "Project Management", skills: ["Timelines", "Budgets", "Supplier management", "Cross-team coordination", "Process improvement", "Onboarding"] },
];

export const process = [
  { n: "01", title: "Discover", text: "Understand the audience, objectives and context." },
  { n: "02", title: "Strategise", text: "Build the strategic direction." },
  { n: "03", title: "Create", text: "Develop concepts, content and experiences." },
  { n: "04", title: "Execute", text: "Coordinate people, logistics, communication and production." },
  { n: "05", title: "Deliver", text: "Create something memorable and measurable." },
];

export const beyond = [
  { title: "Culture", place: "Strasbourg → Lyon → Paris", text: "Strasbourg, Lyon, Paris — three cities that taught me details are never just details." },
  { title: "Travel", place: "France → Australia", text: "Moved across the world to see how other people gather, celebrate and host." },
  { title: "Hospitality", place: "QLD & VIC", text: "Behind the bar, every guest is a tiny event with a beginning, middle and end." },
  { title: "Storytelling", place: "Everywhere", text: "A good event, a good campaign and a good dinner all follow the same arc." },
  { title: "Digital creativity", place: "Online", text: "From WordPress to HTML/CSS — happiest when ideas become something you can click." },
];

export const notebookPages = [
  {
    title: "Ideas — Sept.",
    lines: [
      "→ a launch where guests write the agenda",
      "→ silent-disco keynote? (headphones = translations FR/EN!)",
      "→ breakfast conference: croissants > coffee breaks",
      "→ recap film in 60 sec, filmed vertically",
    ],
  },
  {
    title: "To do",
    lines: [
      "☑ confirm AV supplier",
      "☑ badges — check spelling of every name (twice)",
      "☐ send speaker brief",
      "☐ seating plan v4 (final final)",
      "☐ thank-you emails within 24h",
    ],
  },
  {
    title: "Campaign — rough",
    lines: [
      "Teaser → Invite → Speakers → Last seats → Live → Recap",
      "Tone: warm, confident, never shouty.",
      "One hero visual. Six formats.",
      "KPI: registrations AND show-up rate",
    ],
  },
  {
    title: "Rules I keep",
    lines: [
      "1. Walk the venue as a guest.",
      "2. Plan B is part of plan A.",
      "3. Nobody should queue for coffee.",
      "4. Say thank you before the recap.",
    ],
  },
];

export const secretIdea =
  "A dinner where every course is served in a different room — and the menu is revealed one conversation at a time.";

/* ---------- Illana's world (home) ---------- */

export const world = {
  intro: [
    [{ t: "Made in " }, { t: "France", b: true }, { t: ", now in " }, { t: "Melbourne", b: true }, { t: "." }],
    [{ t: "Master's in " }, { t: "Communication", b: true }, { t: " & Digital Strategy." }],
    [{ t: "Loves creating " }, { t: "events", b: true }, { t: ", telling " }, { t: "stories", b: true }, { t: "," }],
    [{ t: "and a good " }, { t: "flat white", b: true }, { t: "." }],
  ],
  phrase: ["One flat white,", "one big idea.", "Plan it, then make it happen."],
  stickers: {
    nameTag: "Event maker",
    receipt: [
      ["Flat white", "5.00"],
      ["Croissant", "4.50"],
      ["10+ events", "✓"],
      ["5 yrs comms", "✓"],
      ["FR / EN", "✓"],
      ["Big ideas", "∞"],
    ],
  },
};
