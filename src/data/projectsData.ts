export interface ProjectLink {
  label: string;
  url: string;
  platform: "modrinth" | "curseforge" | "gamejolt" | "itch";
  mrId?: string;
  cfPath?: string;
  initialDownloads?: number;
}

export interface UnifiedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_url: string;
  type: string;
  tags: string[];
  downloads: number;
  updated: string;
  links: ProjectLink[];
}

export const MAIN_PROJECTS: UnifiedProject[] = [
  {
    id: "project-boss-rpg",
    title: "PROJECT BOSS RPG",
    slug: "project-boss-rpg",
    description: "An epic RPG modpack with unique boss progression, custom gear, and questlines.",
    icon_url: "https://cdn.modrinth.com/data/6qXHHAYn/365235145c0d9cc2cd208c674761ade3f3d1b825.png",
    type: "Modpack",
    tags: ["Modpack", "RPG", "Bosses", "Quests", "1.20.1", "Forge"],
    downloads: 45096,
    updated: "2025-06-12",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-boss-rpg",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-boss-rpg",
        initialDownloads: 33242
      },
      {
        label: "Modrinth (Modpack)",
        url: "https://modrinth.com/modpack/project-boss-rpg",
        platform: "modrinth",
        mrId: "6qXHHAYn",
        initialDownloads: 11854
      }
    ]
  },
  {
    id: "sdob",
    title: "SPIRAL DUNGEON OF BABEL",
    slug: "spiral-dungeon-of-babel",
    description: "Explore the tallest dungeon tower ever created! Available for Minecraft Java, Bedrock, and Datapack.",
    icon_url: "https://cdn.modrinth.com/data/5Zdqv8rG/22f82f9f215c73845bedc57059c0c8143977d76f.png",
    type: "Mod / Datapack / Addon",
    tags: ["Mod", "Datapack", "Bedrock Addon", "Java & Bedrock", "Dungeon", "Adventure", "Structures"],
    downloads: 30093,
    updated: "2026-07-18",
    links: [
      {
        label: "CurseForge (Java Mod)",
        url: "https://www.curseforge.com/minecraft/mc-mods/sdob",
        platform: "curseforge",
        cfPath: "minecraft/mc-mods/sdob",
        initialDownloads: 19755
      },
      {
        label: "CurseForge (Datapack)",
        url: "https://www.curseforge.com/minecraft/texture-packs/spiral-dungeon-of-babel-sdob-datapack",
        platform: "curseforge",
        cfPath: "minecraft/texture-packs/spiral-dungeon-of-babel-sdob-datapack",
        initialDownloads: 167
      },
      {
        label: "CurseForge (Bedrock Addon)",
        url: "https://www.curseforge.com/minecraft-bedrock/addons/spiral-dungeon-of-babel-sdob-bedrock",
        platform: "curseforge",
        cfPath: "minecraft-bedrock/addons/spiral-dungeon-of-babel-sdob-bedrock",
        initialDownloads: 135
      },
      {
        label: "Modrinth (Mod)",
        url: "https://modrinth.com/mod/sdob",
        platform: "modrinth",
        mrId: "sdob",
        initialDownloads: 9176
      },
      {
        label: "GameJolt",
        url: "https://gamejolt.com/games/sdob/953274",
        platform: "gamejolt",
        initialDownloads: 340
      },
      {
        label: "Itch.io",
        url: "https://d4vide106.itch.io/sdob-mc",
        platform: "itch",
        initialDownloads: 520
      }
    ]
  },
  {
    id: "structural-beyond",
    title: "STRUCTURAL BEYOND",
    slug: "structural-beyond",
    description: "Adds dozens of unique, breathtaking structures to your world across Java, Bedrock, and Datapacks!",
    icon_url: "https://cdn.modrinth.com/data/6Yica65F/6a4532c2cd308d8791e5ba2afc12d4aca1d07d65.png",
    type: "Mod / Datapack / Addon",
    tags: ["Mod", "Datapack", "Bedrock Addon", "Resourcepack", "Java & Bedrock", "Structures", "World Gen"],
    downloads: 27775,
    updated: "2026-07-17",
    links: [
      {
        label: "CurseForge (Java Mod)",
        url: "https://www.curseforge.com/minecraft/mc-mods/structural-beyond",
        platform: "curseforge",
        cfPath: "minecraft/mc-mods/structural-beyond",
        initialDownloads: 15891
      },
      {
        label: "CurseForge (Datapack)",
        url: "https://www.curseforge.com/minecraft/data-packs/structural-beyond-sbd",
        platform: "curseforge",
        cfPath: "minecraft/data-packs/structural-beyond-sbd",
        initialDownloads: 1159
      },
      {
        label: "CurseForge (Resourcepack)",
        url: "https://www.curseforge.com/minecraft/texture-packs/structural-beyond-sbrd",
        platform: "curseforge",
        cfPath: "minecraft/texture-packs/structural-beyond-sbrd",
        initialDownloads: 490
      },
      {
        label: "CurseForge (Bedrock Addon)",
        url: "https://www.curseforge.com/minecraft-bedrock/addons/structural-beyond-sb-bedrock",
        platform: "curseforge",
        cfPath: "minecraft-bedrock/addons/structural-beyond-sb-bedrock",
        initialDownloads: 389
      },
      {
        label: "Modrinth (Mod)",
        url: "https://modrinth.com/mod/structural-beyond",
        platform: "modrinth",
        mrId: "structural-beyond",
        initialDownloads: 8772
      },
      {
        label: "Modrinth (Datapack)",
        url: "https://modrinth.com/datapack/structural-beyond-sbd",
        platform: "modrinth",
        mrId: "structural-beyond-sbd",
        initialDownloads: 384
      },
      {
        label: "GameJolt",
        url: "https://gamejolt.com/games/structural_beyond_mc/944658",
        platform: "gamejolt",
        initialDownloads: 280
      },
      {
        label: "Itch.io",
        url: "https://d4vide106.itch.io/structuralbeyond-mc",
        platform: "itch",
        initialDownloads: 410
      }
    ]
  },
  {
    id: "project-horror",
    title: "PROJECT HORROR",
    slug: "project-horror",
    description: "Terrifying survival horror experience packed with scariest entities, custom atmosphere, and mechanics.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/994/340/256/256/638509827334101640.png",
    type: "Modpack",
    tags: ["Modpack", "Horror", "Survival", "Entities", "Atmosphere", "Forge"],
    downloads: 4911,
    updated: "2023-11-11",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-horror",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-horror",
        initialDownloads: 4911
      }
    ]
  },
  {
    id: "project-the-rpg-reborn",
    title: "PROJECT THE RPG REBORN",
    slug: "project-the-rpg-reborn",
    description: "Incredible RPG experience alone or with friends featuring leveling, magic, dungeons, and bosses.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/965/108/256/256/638463726503298813.png",
    type: "Modpack",
    tags: ["Modpack", "RPG", "Magic", "Dungeons", "Leveling", "Forge"],
    downloads: 178,
    updated: "2024-11-21",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-the-rpg-reborn",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-the-rpg-reborn",
        initialDownloads: 178
      }
    ]
  },
  {
    id: "project-realistic-rpg",
    title: "PROJECT REALISTIC RPG",
    slug: "project-realistic-rpg",
    description: "Realistic survival experience with health, weapons, medkits, temperature, and immersive mechanics.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/1172/959/256/256/638744641399341869.png",
    type: "Modpack",
    tags: ["Modpack", "Realistic", "Survival", "Weapons", "Temperature", "Forge"],
    downloads: 321,
    updated: "2025-03-24",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-realistic-rpg",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-realistic-rpg",
        initialDownloads: 321
      }
    ]
  },
  {
    id: "project-gunparty",
    title: "PROJECT GUNPARTY",
    slug: "project-gunparty",
    description: "Action-packed multiplayer gun warfare and deathmatch experience inside Minecraft.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/1408/864/256/256/638912980924519123.png",
    type: "Modpack",
    tags: ["Modpack", "Guns", "Multiplayer", "PvP", "Deathmatch", "Forge"],
    downloads: 148,
    updated: "2024-08-15",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-gunparty",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-gunparty",
        initialDownloads: 148
      }
    ]
  },
  {
    id: "bosstweak-3d",
    title: "BOSSTWEAK 3D+",
    slug: "bosstweak-3d",
    description: "Official resource pack of Boss RPG: corrects visual problems, improves textures, and adds 3D models.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/1221/657/256/256/638800200916334761.png",
    type: "Resource Pack",
    tags: ["Resource Pack", "3D Models", "Textures", "Boss RPG Companion"],
    downloads: 354,
    updated: "2025-04-13",
    links: [
      {
        label: "CurseForge (Texture Pack)",
        url: "https://www.curseforge.com/minecraft/texture-packs/bosstweak-3d",
        platform: "curseforge",
        cfPath: "minecraft/texture-packs/bosstweak-3d",
        initialDownloads: 354
      }
    ]
  },
  {
    id: "pmaintanceuniversal",
    title: "PROJECT MAINTENANCE UNIVERSAL",
    slug: "pmaintanceuniversal",
    description: "Universal server maintenance plugin for Minecraft Java servers with customizable MOTDs.",
    icon_url: "https://cdn.modrinth.com/data/y11fODQe/99a1f5300424ed796792d9454768eaff5d5b7b98.png",
    type: "Plugin",
    tags: ["Plugin", "Server", "Paper", "Spigot", "MOTD", "Maintenance"],
    downloads: 145,
    updated: "2025-02-10",
    links: [
      {
        label: "Modrinth (Plugin)",
        url: "https://modrinth.com/plugin/pmaintanceuniversal",
        platform: "modrinth",
        mrId: "pmaintanceuniversal",
        initialDownloads: 145
      }
    ]
  },
  {
    id: "infinitysmart",
    title: "INFINITYSMART SERVER",
    slug: "infinitysmart",
    description: "Crossplatform European Minecraft Java & Bedrock network featuring InfinitySMP and minigames.",
    icon_url: "https://cdn.modrinth.com/data/c2w1TKgN/4da379944f5c563294a488f7738950ebc6a68c74.png",
    type: "Minecraft Server",
    tags: ["Minecraft Server", "Java & Bedrock", "Crossplatform", "Minigames", "SMP"],
    downloads: 15200,
    updated: "2026-08-01",
    links: [
      {
        label: "Modrinth (Server)",
        url: "https://modrinth.com/minecraft_java_server/infinitysmart",
        platform: "modrinth",
        mrId: "infinitysmart",
        initialDownloads: 15200
      }
    ]
  }
];

