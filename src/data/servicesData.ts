export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  iconType: "discord" | "fiverr" | "web" | "system";
  description: string;
  features: string[];
  techStack: string[];
  status: "AVAILABLE" | "LIMITED";
  fiverrUrl?: string;
  discordUrl?: string;
}

export interface ExternalProject {
  id: string;
  title: string;
  category: string;
  description: string;
  iconUrl: string;
  tags: string[];
  linkUrl: string;
  linkLabel: string;
  isPopular?: boolean;
}

export interface EstimatorOption {
  id: string;
  label: string;
  basePrice: number;
  estDays: number;
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "discord-bots",
    title: "Custom Discord Bots",
    category: "BOT DEVELOPMENT & AUTOMATION",
    badge: "MOST POPULAR",
    iconType: "discord",
    description: "High-performance Node.js & TypeScript Discord bots tailored for gaming communities, servers, and automated workflows.",
    features: [
      "Custom Slash Commands & Dynamic Modals",
      "Ticket Systems, Auto-Moderation & Anti-Raid",
      "Database Integration (MySQL, SQLite, MongoDB)",
      "Live Server Status & API Webhook Integration"
    ],
    techStack: ["Node.js", "TypeScript", "Discord.js", "Prisma", "REST APIs"],
    status: "AVAILABLE",
    discordUrl: "https://discord.gg/7T3u9a9"
  },
  {
    id: "fiverr-commissions",
    title: "Fiverr Freelance Commissions",
    category: "MINECRAFT & SYSTEM CONTRACTS",
    badge: "5-STAR RATED",
    iconType: "fiverr",
    description: "Professional custom Minecraft Java/Bedrock plugin, mod, structure generator, or server configuration development on demand.",
    features: [
      "Custom Spigot/Paper/Velocity Server Plugins",
      "Procedural World Generation & Structure Datapacks",
      "Server Performance Optimization & Bug Fixing",
      "1-on-1 Dedicated Technical Support"
    ],
    techStack: ["Java", "Forge/Fabric API", "Spigot API", "NBT/Datapacks"],
    status: "AVAILABLE",
    fiverrUrl: "https://www.fiverr.com/s/D4vide106",
    discordUrl: "https://discord.gg/7T3u9a9"
  },
  {
    id: "web-development",
    title: "Full-Stack Web Development",
    category: "MODERN WEB & DASHBOARDS",
    badge: "HIGH IMPACT",
    iconType: "web",
    description: "Modern, ultra-fast web applications, portfolio showcases, and web control panels built with Next.js and glassmorphism UI.",
    features: [
      "Next.js App Router & React Server Components",
      "Custom Glassmorphic Dark UI & Rich Animations",
      "SEO Optimization & Responsive Mobile Design",
      "API Integration & Real-time Live Stats"
    ],
    techStack: ["Next.js", "React", "TypeScript", "CSS Modules", "Vercel"],
    status: "AVAILABLE",
    discordUrl: "https://discord.gg/7T3u9a9"
  },
  {
    id: "system-tooling",
    title: "Backend Tools & Automation",
    category: "SYSTEMS & BACKEND ENGINEERING",
    badge: "PRO TOOLING",
    iconType: "system",
    description: "Custom Python automation scripts, web scrapers, data processing pipelines, and system utilities.",
    features: [
      "Python Data Extraction & Scraper Pipelines",
      "CLI Tools & Automated System Scripts",
      "API Development & Webhook Dispatchers",
      "Cross-Platform Desktop & Server Utilities"
    ],
    techStack: ["Python", "FastAPI", "Asyncio", "Docker", "Git"],
    status: "AVAILABLE",
    discordUrl: "https://discord.gg/7T3u9a9"
  }
];

export const EXTERNAL_PROJECTS: ExternalProject[] = [
  {
    id: "d4v-bot-core",
    title: "D4V Bot Core",
    category: "Discord Bot Suite",
    description: "Multi-purpose community management bot with live Minecraft server status tracking and automated roles.",
    iconUrl: "https://mc-heads.net/avatar/_D4vide106_/64",
    tags: ["Discord.js", "Node.js", "TypeScript", "MongoDB"],
    linkUrl: "https://discord.gg/7T3u9a9",
    linkLabel: "Join Community Bot",
    isPopular: true
  },
  {
    id: "fiverr-custom-commissions",
    title: "Fiverr Client Showcase",
    category: "Freelance Work",
    description: "Over 50+ completed custom plugins, structure generation packs, and server setups for international clients.",
    iconUrl: "https://mc-heads.net/avatar/_D4vide106_/64",
    tags: ["Fiverr 5★", "Java", "Minecraft", "Custom Plugins"],
    linkUrl: "https://www.fiverr.com/s/D4vide106",
    linkLabel: "View Fiverr Profile",
    isPopular: true
  },
  {
    id: "nextjs-portfolio-engine",
    title: "Next.js Portfolio Engine",
    category: "Web Engine",
    description: "Ultra-high performance glassmorphic portfolio web engine powered by Next.js 16, Turbopack & Three.js.",
    iconUrl: "https://mc-heads.net/avatar/_D4vide106_/64",
    tags: ["Next.js", "React 19", "Three.js", "TypeScript"],
    linkUrl: "https://github.com/D4vide106",
    linkLabel: "GitHub Repository"
  }
];

export const ESTIMATOR_SERVICE_TYPES: EstimatorOption[] = [
  { id: "discord_bot", label: "Custom Discord Bot", basePrice: 25, estDays: 3 },
  { id: "mc_plugin", label: "Minecraft Custom Plugin", basePrice: 35, estDays: 4 },
  { id: "mc_modpack", label: "Custom Modpack / Config", basePrice: 30, estDays: 3 },
  { id: "web_app", label: "Modern Web App / Portfolio", basePrice: 60, estDays: 5 },
  { id: "python_script", label: "Python Automation Script", basePrice: 20, estDays: 2 }
];

export const ESTIMATOR_COMPLEXITIES: EstimatorOption[] = [
  { id: "basic", label: "Basic (Essential Features)", basePrice: 0, estDays: 0 },
  { id: "standard", label: "Standard (Advanced Logic & Database)", basePrice: 20, estDays: 2 },
  { id: "pro", label: "Pro / Enterprise (Full System & Live API)", basePrice: 45, estDays: 4 }
];
