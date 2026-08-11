export interface LabDomain {
  id: string;
  title: string;
  category: string;
  badge: string;
  iconType: "discord" | "plugin" | "web" | "system";
  description: string;
  capabilities: string[];
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
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

export const LABS_DOMAINS: LabDomain[] = [
  {
    id: "discord-bots",
    title: "Discord Bots & Automation Suite",
    category: "COMMUNITY & BOT ARCHITECTURE",
    badge: "FEATURED LAB",
    iconType: "discord",
    description: "Architecting high-performance Node.js & TypeScript Discord bots for gaming networks, live status tracking, auto-moderation, and database systems.",
    capabilities: [
      "Custom Slash Commands, Select Menus & Dynamic Modals",
      "Interactive Ticket Systems, Verification & Anti-Raid",
      "Database Persistence (MySQL, SQLite, MongoDB & Prisma)",
      "Live Server Status Tracking & Custom API Webhooks"
    ],
    techStack: ["Node.js", "TypeScript", "Discord.js", "Prisma", "REST APIs"],
    discordUrl: "https://discord.gg/7T3u9a9"
  },
  {
    id: "software-plugins",
    title: "Plugin & Software Engineering",
    category: "JAVA & SYSTEM ENGINE",
    badge: "CORE SKILL",
    iconType: "plugin",
    description: "Developing custom Java server plugins, NBT structure generators, game engine extensions, and high-concurrency systems.",
    capabilities: [
      "Spigot, Paper, Fabric & Velocity Server Plugins",
      "Procedural Structure Generation & World Gen Systems",
      "NBT Data Engines & Custom Game Mechanics",
      "High Performance Code Optimization & Multi-threading"
    ],
    techStack: ["Java", "Forge / Fabric API", "Spigot / Paper API", "NBT & WorldGen"],
    discordUrl: "https://discord.gg/7T3u9a9"
  },
  {
    id: "web-architecture",
    title: "Full-Stack Web & Dashboard Apps",
    category: "MODERN WEB & INTERFACES",
    badge: "HIGH IMPACT",
    iconType: "web",
    description: "Building ultra-fast modern web applications, interactive web panels, and dark-themed glassmorphism user experiences.",
    capabilities: [
      "Next.js App Router & React Server Components",
      "Custom Glassmorphic Dark Design System & Motion",
      "Real-Time Data Fetching & Web Socket Integration",
      "SEO Architecture & Responsive Mobile Optimization"
    ],
    techStack: ["Next.js", "React", "TypeScript", "CSS Modules", "Vercel"],
    githubUrl: "https://github.com/D4vide106"
  },
  {
    id: "backend-tooling",
    title: "Python Tools & Backend Pipelines",
    category: "SYSTEMS & BACKEND ENGINEERING",
    badge: "PRO TOOLING",
    iconType: "system",
    description: "Creating Python automation scripts, web scrapers, data processing pipelines, and cross-platform desktop tools.",
    capabilities: [
      "Python Automated Data Pipelines & Scrapers",
      "CLI Tools & Automated Utility Scripts",
      "RESTful API Development & Webhook Dispatchers",
      "System Monitoring & Server Maintenance Tools"
    ],
    techStack: ["Python", "FastAPI", "Asyncio", "Docker", "Git"],
    githubUrl: "https://github.com/D4vide106"
  }
];

export const EXTERNAL_PROJECTS: ExternalProject[] = [
  {
    id: "d4v-bot-core",
    title: "D4V Bot Core System",
    category: "Discord Bot Suite",
    description: "Multi-purpose community management bot with live server status tracking, automated roles, and interactive commands.",
    iconUrl: "https://mc-heads.net/avatar/_D4vide106_/64",
    tags: ["Discord.js", "Node.js", "TypeScript", "MongoDB"],
    linkUrl: "https://discord.gg/7T3u9a9",
    linkLabel: "Join Discord Community",
    isPopular: true
  },
  {
    id: "fiverr-freelance-portfolio",
    title: "Custom Developer Commissions",
    category: "Freelance Showcase",
    description: "Showcase of over 50+ completed custom plugins, structure generation engines, and system setups for international clients.",
    iconUrl: "https://mc-heads.net/avatar/_D4vide106_/64",
    tags: ["Fiverr 5★", "Java", "Plugin Dev", "Custom Tools"],
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
    linkLabel: "View Source on GitHub"
  }
];
