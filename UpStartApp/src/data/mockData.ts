// All mock data for the UpStart UI. Replace with real APIs in production.

export type Industry = 'AI' | 'Fintech' | 'Healthtech' | 'Energy' | 'Supply Chain' | 'Retail';
export type Region = 'East Coast' | 'Central' | 'West Coast';
export type Stage = 'Formation' | 'Validation' | 'Growth';

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  logoEmoji: string;
  industry: Industry[];
  region: Region;
  stage: Stage;
  raised: number;         // in USD
  raiseTarget: number;
  valuation: number;
  dealType: 'Equity' | 'SAFE' | 'Convertible';
  minInvestment: number;
  dealStatus: 'Open' | 'Filling' | 'Closed';
  problem: string;
  problemStat: string;
  solution: string;
  demoUrl: string;
  team: { name: string; role: string; bio: string; emoji: string }[];
  milestones: { date: string; title: string; description: string; complete: boolean }[];
  followers: number;
  bgColor: string;
}

export interface AppUser {
  id: string;
  name: string;
  handle: string;
  avatarEmoji: string;
  bio: string;
  followers: number;
  verified: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'none';
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  imageEmoji?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  visibility: 'public' | 'followers' | 'close' | 'only-me';
}

export interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  summary: string;       // AI-generated
  body: string;
  readTime: number;      // minutes
  likes: number;
  createdAt: string;
}

export interface LiveShow {
  id: string;
  hostId: string;
  startupId: string;
  title: string;
  description: string;
  startsAt: string;          // ISO
  visibility: 'public' | 'followers' | 'private';
  viewerCount: number;
  isLive: boolean;
  raised: number;
  raiseTarget: number;
}

export interface ChatThread {
  id: string;
  participantIds: string[];   // ids in MOCK_USERS
  isGroup: boolean;
  groupName?: string;
  lastMessage: string;
  lastTs: string;
  unread: number;
  messages: { id: string; senderId: string; text: string; ts: string; edited?: boolean; deleted?: boolean }[];
}

export interface MiniVideo {
  id: string;
  authorId: string;
  caption: string;
  emoji: string;       // big emoji to mock the video frame
  music: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  earnedAt?: string;     // if undefined, locked
  progress?: { current: number; target: number };
}

// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_USERS: AppUser[] = [
  { id: 'u_self', name: 'You', handle: 'you', avatarEmoji: '🚀', bio: 'Backing the future.', followers: 42, verified: false, tier: 'bronze' },
  { id: 'u1', name: 'Maya Chen', handle: 'mayac', avatarEmoji: '👩‍💻', bio: 'Founder @NeuralFlow • ex-Google', followers: 12400, verified: true, tier: 'gold' },
  { id: 'u2', name: 'Jordan Rivers', handle: 'jrivers', avatarEmoji: '🧑‍🚀', bio: 'Investor • SaaS • Climate', followers: 8200, verified: true, tier: 'platinum' },
  { id: 'u3', name: 'Sam Okafor', handle: 'sokafor', avatarEmoji: '👨‍🔬', bio: 'Biotech researcher turned founder', followers: 3100, verified: false, tier: 'silver' },
  { id: 'u4', name: 'Priya Iyer', handle: 'priya', avatarEmoji: '👩‍🎨', bio: 'Designer • Building @LumaUI', followers: 5600, verified: true, tier: 'silver' },
  { id: 'u5', name: 'Marcus Lee', handle: 'marcus', avatarEmoji: '🧑‍💼', bio: 'Fintech founder • YC W24', followers: 4800, verified: false, tier: 'bronze' },
  { id: 'u6', name: 'Ana Silva', handle: 'anas', avatarEmoji: '👩‍🌾', bio: 'AgTech • Carbon credits', followers: 920, verified: false, tier: 'none' },
];

export const userById = (id: string): AppUser =>
  MOCK_USERS.find((u) => u.id === id) ?? MOCK_USERS[0];

// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_STARTUPS: Startup[] = [
  {
    id: 's1',
    name: 'NeuralFlow',
    tagline: 'Real-time AI workflows for ops teams',
    logoEmoji: '🧠',
    industry: ['AI'],
    region: 'West Coast',
    stage: 'Growth',
    raised: 420000,
    raiseTarget: 1000000,
    valuation: 12000000,
    dealType: 'SAFE',
    minInvestment: 100,
    dealStatus: 'Filling',
    problem:
      'Operations teams spend 30+ hours a week stitching tools together. Existing automation platforms break the moment data shape shifts.',
    problemStat: '63% of ops teams report tool-fatigue as their #1 blocker (McKinsey, 2024).',
    solution:
      'NeuralFlow uses adaptive AI agents that infer schema changes and re-route workflows automatically — no manual patching.',
    demoUrl: 'https://example.com/demo',
    team: [
      { name: 'Maya Chen', role: 'CEO', bio: 'ex-Google Brain. Stanford CS.', emoji: '👩‍💻' },
      { name: 'Devon Hall', role: 'CTO', bio: 'Distributed systems @ Stripe.', emoji: '🧑‍💻' },
      { name: 'Riya Patel', role: 'Head of Product', bio: 'PM @ Figma, @ Notion.', emoji: '👩‍🎨' },
    ],
    milestones: [
      { date: '2023-06', title: 'Founded', description: 'Incorporated in Delaware.', complete: true },
      { date: '2023-11', title: 'Seed round', description: 'Raised $2.1M from a16z.', complete: true },
      { date: '2024-08', title: 'First 100 customers', description: 'Crossed 100 paying teams.', complete: true },
      { date: '2026-08', title: 'Series A', description: 'Targeting $15M Series A.', complete: false },
    ],
    followers: 12400,
    bgColor: '#7FD1AE',
  },
  {
    id: 's2',
    name: 'LumaUI',
    tagline: 'Design tokens, automated across every platform',
    logoEmoji: '🎨',
    industry: ['AI', 'Retail'],
    region: 'East Coast',
    stage: 'Validation',
    raised: 110000,
    raiseTarget: 500000,
    valuation: 6000000,
    dealType: 'Equity',
    minInvestment: 50,
    dealStatus: 'Open',
    problem:
      'Design systems drift the moment they cross from Figma into iOS, Android, or web. Engineering and design are perpetually out of sync.',
    problemStat: '78% of product teams say cross-platform design parity is unsolved (Stack Overflow, 2024).',
    solution:
      'LumaUI auto-generates platform-native token sets from a single source of truth, with diffs surfaced in PRs.',
    demoUrl: 'https://example.com/luma',
    team: [
      { name: 'Priya Iyer', role: 'Co-founder, CEO', bio: 'Design lead @ Airbnb.', emoji: '👩‍🎨' },
      { name: 'Tomas Berg', role: 'Co-founder, CTO', bio: 'Compiler engineer @ Apple.', emoji: '🧑‍🔬' },
    ],
    milestones: [
      { date: '2024-02', title: 'Founded', description: 'Two co-founders, NY HQ.', complete: true },
      { date: '2024-09', title: 'Beta launch', description: '23 design teams in pilot.', complete: true },
      { date: '2026-07', title: 'Public launch', description: 'Open access.', complete: false },
    ],
    followers: 4800,
    bgColor: '#5FC59A',
  },
  {
    id: 's3',
    name: 'PayPath',
    tagline: 'Stablecoin payroll for global teams',
    logoEmoji: '💸',
    industry: ['Fintech'],
    region: 'West Coast',
    stage: 'Growth',
    raised: 980000,
    raiseTarget: 2000000,
    valuation: 24000000,
    dealType: 'SAFE',
    minInvestment: 250,
    dealStatus: 'Filling',
    problem:
      'Paying remote contractors across borders is slow, expensive, and full of compliance landmines.',
    problemStat: 'Cross-border payouts cost employers an average 6.3% in fees (World Bank).',
    solution:
      'PayPath rails contractor payouts through regulated stablecoin partners — funds settle in under 10 minutes anywhere.',
    demoUrl: 'https://example.com/paypath',
    team: [
      { name: 'Marcus Lee', role: 'CEO', bio: 'Founding eng @ Plaid.', emoji: '🧑‍💼' },
      { name: 'Emi Tanaka', role: 'COO', bio: 'Ops @ Stripe LatAm.', emoji: '👩‍💼' },
    ],
    milestones: [
      { date: '2022-10', title: 'Founded', description: 'YC W23.', complete: true },
      { date: '2023-06', title: 'Series Seed', description: '$3M raised.', complete: true },
      { date: '2025-01', title: '$10M ARR', description: 'Crossed $10M annualized.', complete: true },
      { date: '2026-12', title: 'Series B', description: 'Planned $30M raise.', complete: false },
    ],
    followers: 24100,
    bgColor: '#D4A55B',
  },
  {
    id: 's4',
    name: 'Verdant',
    tagline: 'Soil-health monitoring for regenerative farms',
    logoEmoji: '🌱',
    industry: ['Energy', 'Supply Chain'],
    region: 'Central',
    stage: 'Formation',
    raised: 45000,
    raiseTarget: 250000,
    valuation: 2500000,
    dealType: 'Convertible',
    minInvestment: 25,
    dealStatus: 'Open',
    problem:
      'Regenerative farming pays measurable climate dividends but soil data is locked in $30K sensor stacks no small farm can afford.',
    problemStat: '85% of US small farms cite cost as the #1 barrier to soil-data adoption (USDA).',
    solution:
      'Verdant ships $80 LoRa sensors and a free dashboard — farmers see organic matter trends weekly.',
    demoUrl: 'https://example.com/verdant',
    team: [
      { name: 'Ana Silva', role: 'CEO', bio: 'AgTech @ Indigo Ag.', emoji: '👩‍🌾' },
      { name: 'Kai Owens', role: 'Hardware lead', bio: 'IoT @ Particle.', emoji: '🧑‍🔧' },
    ],
    milestones: [
      { date: '2025-08', title: 'Incorporated', description: 'Iowa HQ.', complete: true },
      { date: '2026-03', title: 'Pilot with 12 farms', description: 'Iowa + Nebraska.', complete: true },
      { date: '2026-11', title: 'Pre-seed close', description: '$300K raise.', complete: false },
    ],
    followers: 920,
    bgColor: '#A8E6D4',
  },
  {
    id: 's5',
    name: 'Helix Diagnostics',
    tagline: 'At-home blood panels with lab-grade accuracy',
    logoEmoji: '🧬',
    industry: ['Healthtech'],
    region: 'East Coast',
    stage: 'Validation',
    raised: 600000,
    raiseTarget: 1500000,
    valuation: 18000000,
    dealType: 'SAFE',
    minInvestment: 500,
    dealStatus: 'Filling',
    problem:
      'Routine bloodwork still requires a clinic visit. 40% of preventive panels are skipped due to access.',
    problemStat: '40% of preventive panels are never completed in the US (CDC).',
    solution:
      'Mail-in finger-prick kits paired with CLIA-certified lab partners. Results in 48 hours.',
    demoUrl: 'https://example.com/helix',
    team: [
      { name: 'Sam Okafor', role: 'CEO', bio: 'PhD biochem, UPenn.', emoji: '👨‍🔬' },
      { name: 'Lena Bauer', role: 'CMO', bio: 'Internal medicine, MGH.', emoji: '👩‍⚕️' },
    ],
    milestones: [
      { date: '2023-05', title: 'Founded', description: 'Boston HQ.', complete: true },
      { date: '2024-04', title: 'CLIA partnership', description: 'Signed with Quest sub-lab.', complete: true },
      { date: '2026-10', title: 'FDA submission', description: 'Class II 510(k).', complete: false },
    ],
    followers: 3100,
    bgColor: '#3FAA7C',
  },
  {
    id: 's6',
    name: 'Cargolane',
    tagline: 'AI dispatch for owner-operator trucking',
    logoEmoji: '🚚',
    industry: ['Supply Chain'],
    region: 'Central',
    stage: 'Growth',
    raised: 1500000,
    raiseTarget: 3000000,
    valuation: 32000000,
    dealType: 'Equity',
    minInvestment: 1000,
    dealStatus: 'Filling',
    problem:
      'Owner-operator truckers run 18% of their miles empty. Existing load boards favor fleets over individuals.',
    problemStat: 'Empty miles cost the US trucking industry $30B/year (ATA).',
    solution:
      'Cargolane matches owner-operators to backhauls with reinforcement-learned routing — fills the empty leg automatically.',
    demoUrl: 'https://example.com/cargolane',
    team: [
      { name: 'Renee Park', role: 'CEO', bio: 'Logistics @ Convoy.', emoji: '👩‍✈️' },
      { name: 'Diego Ruiz', role: 'CTO', bio: 'ML @ Uber Freight.', emoji: '🧑‍💻' },
    ],
    milestones: [
      { date: '2022-01', title: 'Founded', description: 'Austin HQ.', complete: true },
      { date: '2023-08', title: '500 active O/Os', description: 'Hit network milestone.', complete: true },
      { date: '2025-12', title: '$5M ARR', description: 'Crossed.', complete: true },
      { date: '2027-03', title: 'Series B', description: 'Targeting $40M.', complete: false },
    ],
    followers: 9700,
    bgColor: '#0E5E4D',
  },
];

export const startupById = (id: string): Startup | undefined =>
  MOCK_STARTUPS.find((s) => s.id === id);

// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_POSTS: Post[] = [
  { id: 'p1', authorId: 'u1', text: 'NeuralFlow just crossed 100 paying teams. Massive thanks to every early believer. 🚀', likes: 421, comments: 38, shares: 12, createdAt: '2h', visibility: 'public' },
  { id: 'p2', authorId: 'u2', text: 'Hot take: most pitch decks should be 4 slides, not 20.', likes: 1100, comments: 184, shares: 41, createdAt: '5h', visibility: 'public' },
  { id: 'p3', authorId: 'u5', text: 'Stablecoin rails are eating wire transfers. Look at LatAm.', imageEmoji: '🌎', likes: 320, comments: 22, shares: 7, createdAt: '1d', visibility: 'public' },
  { id: 'p4', authorId: 'u4', text: 'Design parity across iOS / Android / web is genuinely an unsolved problem. We have ideas.', likes: 88, comments: 11, shares: 3, createdAt: '2d', visibility: 'public' },
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    authorId: 'u1',
    title: 'Why adaptive agents beat static automations',
    summary:
      'Static workflows break when source data shifts. Adaptive agents infer schema changes and re-route automatically, saving ops teams 30+ hours a week.',
    body:
      'When we started NeuralFlow, every customer demo opened with the same question: "what happens when our CRM adds a new field?" The honest answer for most automation tools is: your workflow breaks silently...\n\nOver the last 18 months we have built a runtime that treats workflow steps as agents, not as wiring. Each step inspects its inputs, decides whether the contract still holds, and either proceeds or asks for help.\n\nThe result: a customer who had been patching workflows three times a week now goes weeks without manual intervention. The math on engineering time alone is staggering.',
    readTime: 6,
    likes: 248,
    createdAt: '1d',
  },
  {
    id: 'b2',
    authorId: 'u2',
    title: 'What I look for in a pre-seed deck',
    summary:
      'Most pre-seed decks bury the lede. The strongest founders compress the entire thesis into the first two slides and earn the right to keep talking.',
    body:
      'I review somewhere between 40 and 60 pre-seed decks a month. By slide three I have already decided whether I will keep reading...\n\nThe pattern is simple. The decks I forward to my partners all do the same three things in the first ninety seconds: name a sharp problem, name an unfair insight, and prove the team has shipped something hard before. Everything else — the TAM, the financials, the cap table — is downstream of those three.',
    readTime: 4,
    likes: 612,
    createdAt: '3d',
  },
];

export const MOCK_LIVE_SHOWS: LiveShow[] = [
  {
    id: 'l1',
    hostId: 'u1',
    startupId: 's1',
    title: 'NeuralFlow product demo + live AMA',
    description: 'Walking through the new adaptive-agent runtime. Investing window open during the show.',
    startsAt: '2026-05-13T18:00:00Z',
    visibility: 'public',
    viewerCount: 184,
    isLive: true,
    raised: 12400,
    raiseTarget: 25000,
  },
  {
    id: 'l2',
    hostId: 'u5',
    startupId: 's3',
    title: 'PayPath: how stablecoin payroll actually works',
    description: 'Walking through real money movement, in real time. Q&A at the end.',
    startsAt: '2026-05-14T22:00:00Z',
    visibility: 'public',
    viewerCount: 0,
    isLive: false,
    raised: 0,
    raiseTarget: 50000,
  },
  {
    id: 'l3',
    hostId: 'u3',
    startupId: 's5',
    title: 'Helix Diagnostics — building a regulated home-test',
    description: 'The path from idea to 510(k) submission. Founder-only deep dive.',
    startsAt: '2026-05-16T17:30:00Z',
    visibility: 'followers',
    viewerCount: 0,
    isLive: false,
    raised: 0,
    raiseTarget: 20000,
  },
];

export const MOCK_CHATS: ChatThread[] = [
  {
    id: 'c1',
    participantIds: ['u_self', 'u1'],
    isGroup: false,
    lastMessage: 'Thanks for the early backing — really appreciate it.',
    lastTs: '14m',
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'u_self', text: 'Loved the live show. Excited to invest.', ts: '20m' },
      { id: 'm2', senderId: 'u1', text: 'Thanks for the early backing — really appreciate it.', ts: '14m' },
    ],
  },
  {
    id: 'c2',
    participantIds: ['u_self', 'u2', 'u4'],
    isGroup: true,
    groupName: 'Pitch Circle',
    lastMessage: 'Priya: Anyone reviewing decks tonight?',
    lastTs: '1h',
    unread: 0,
    messages: [
      { id: 'm3', senderId: 'u2', text: "Reminder: founder circle Thursday 7pm.", ts: '4h' },
      { id: 'm4', senderId: 'u4', text: "Anyone reviewing decks tonight?", ts: '1h' },
    ],
  },
  {
    id: 'c3',
    participantIds: ['u_self', 'u5'],
    isGroup: false,
    lastMessage: 'Sent. Lmk what you think.',
    lastTs: '2d',
    unread: 0,
    messages: [
      { id: 'm5', senderId: 'u5', text: 'I can share the deck if useful.', ts: '2d' },
      { id: 'm6', senderId: 'u_self', text: 'Please do.', ts: '2d' },
      { id: 'm7', senderId: 'u5', text: 'Sent. Lmk what you think.', ts: '2d' },
    ],
  },
];

export const MOCK_VIDEOS: MiniVideo[] = [
  { id: 'v1', authorId: 'u1', caption: 'Behind the scenes at NeuralFlow HQ', emoji: '🧠', music: 'Lo-fi Beats — Dreamy', likes: 1240, comments: 88, shares: 41 },
  { id: 'v2', authorId: 'u4', caption: 'Designing tokens in real time', emoji: '🎨', music: 'Ambient Pad — Iris', likes: 612, comments: 24, shares: 12 },
  { id: 'v3', authorId: 'u5', caption: 'Wiring stablecoin rails — explained in 60s', emoji: '💸', music: 'Future Funk — Daze', likes: 980, comments: 51, shares: 30 },
  { id: 'v4', authorId: 'u6', caption: 'Soil sensor v3 — first field test', emoji: '🌱', music: 'Indie Folk — Field', likes: 220, comments: 9, shares: 4 },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-invest', name: 'First Investment', description: 'Make your first investment.', emoji: '🌱', rarity: 'Common', earnedAt: '2 days ago' },
  { id: 'live-investor', name: 'Live Investor', description: 'Invest during a live show.', emoji: '🎙️', rarity: 'Common', earnedAt: '1 day ago' },
  { id: 'diversified', name: 'Diversified Backer', description: 'Back 5 distinct startups.', emoji: '🌈', rarity: 'Rare', progress: { current: 2, target: 5 } },
  { id: 'first-comment', name: 'First Word', description: 'Leave your first comment.', emoji: '💬', rarity: 'Common', earnedAt: 'last week' },
  { id: 'whale', name: 'Whale Watcher', description: 'Invest 5,000+ coins in a single deal.', emoji: '🐋', rarity: 'Epic', progress: { current: 750, target: 5000 } },
  { id: 'streak', name: 'On a Streak', description: 'Visit the app 7 days in a row.', emoji: '🔥', rarity: 'Rare', progress: { current: 4, target: 7 } },
  { id: 'platinum', name: 'Platinum Visionary', description: 'Spend 5,000 coins lifetime.', emoji: '💎', rarity: 'Legendary', progress: { current: 750, target: 5000 } },
  { id: 'verified', name: 'Verified Identity', description: 'Complete ID verification.', emoji: '✅', rarity: 'Common', earnedAt: 'last week' },
];

export const INDUSTRIES: Industry[] = ['AI', 'Fintech', 'Healthtech', 'Energy', 'Supply Chain', 'Retail'];
export const REGIONS: Region[]   = ['East Coast', 'Central', 'West Coast'];
export const STAGES: Stage[]     = ['Formation', 'Validation', 'Growth'];
