export interface ProjectLink {
  label: string;
  url: string;
  platform: "modrinth" | "curseforge" | "gamejolt" | "itch" | "github" | "web" | "roblox";
  mrId?: string;
  cfPath?: string;
  robloxUniverseId?: number;
  robloxPlaceId?: number;
  initialDownloads?: number;
}

export type ProjectCategory = "all" | "minecraft" | "roblox" | "games" | "apps";

export interface RobloxStats {
  universeId: number;
  placeId: number;
  creatorName: string;
  creatorType: string;
  creatorId: number;
  creatorUrl: string;
  visits: number;
  playing: number;
  maxPlayers: number;
  upVotes: number;
  downVotes: number;
  ratingPercent: number;
  favorites: number;
  groupLogo?: string;
  fallbackIconUrl?: string;
}

export interface UnifiedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_url: string;
  fallback_icon_url?: string;
  thumbnail_url?: string;
  fallback_thumbnail_url?: string;
  type: string;
  category: "minecraft" | "roblox" | "games" | "apps";
  tags: string[];
  downloads: number;
  updated: string;
  links: ProjectLink[];
  robloxStats?: RobloxStats;
}

export function resolveAssetUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const basePath = "/d4vide-portfolio";
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  if (cleanUrl.startsWith(basePath)) return cleanUrl;
  return `${basePath}${cleanUrl}`;
}

export const MAIN_PROJECTS: UnifiedProject[] = [
  {
    id: "project-boss-rpg",
    title: "PROJECT BOSS RPG",
    slug: "project-boss-rpg",
    description: "An epic RPG modpack with unique boss progression, custom gear, and questlines.",
    icon_url: "https://cdn.modrinth.com/data/6qXHHAYn/365235145c0d9cc2cd208c674761ade3f3d1b825.png",
    type: "Modpack",
    category: "minecraft",
    tags: ["Modpack", "RPG", "Bosses", "Quests", "1.20.1", "Forge"],
    downloads: 47705,
    updated: "2025-06-12",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-boss-rpg",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-boss-rpg",
        initialDownloads: 33934
      },
      {
        label: "Modrinth (Modpack)",
        url: "https://modrinth.com/modpack/project-boss-rpg",
        platform: "modrinth",
        mrId: "6qXHHAYn",
        initialDownloads: 13771
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
    category: "minecraft",
    tags: ["Mod", "Datapack", "Bedrock Addon", "Java & Bedrock", "Dungeon", "Adventure", "Structures"],
    downloads: 33501,
    updated: "2026-07-18",
    links: [
      {
        label: "CurseForge (Java Mod)",
        url: "https://www.curseforge.com/minecraft/mc-mods/sdob",
        platform: "curseforge",
        cfPath: "minecraft/mc-mods/sdob",
        initialDownloads: 22380
      },
      {
        label: "CurseForge (Datapack)",
        url: "https://www.curseforge.com/minecraft/texture-packs/spiral-dungeon-of-babel-sdob-datapack",
        platform: "curseforge",
        cfPath: "minecraft/texture-packs/spiral-dungeon-of-babel-sdob-datapack",
        initialDownloads: 186
      },
      {
        label: "CurseForge (Bedrock Addon)",
        url: "https://www.curseforge.com/minecraft-bedrock/addons/spiral-dungeon-of-babel-sdob-bedrock",
        platform: "curseforge",
        cfPath: "minecraft-bedrock/addons/spiral-dungeon-of-babel-sdob-bedrock",
        initialDownloads: 194
      },
      {
        label: "Modrinth (Mod)",
        url: "https://modrinth.com/mod/sdob",
        platform: "modrinth",
        mrId: "sdob",
        initialDownloads: 10306
      },
      {
        label: "GameJolt",
        url: "https://gamejolt.com/games/sdob/953274",
        platform: "gamejolt",
        initialDownloads: 430
      },
      {
        label: "Itch.io",
        url: "https://d4vide106.itch.io/sdob-mc",
        platform: "itch",
        initialDownloads: 5
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
    category: "minecraft",
    tags: ["Mod", "Datapack", "Bedrock Addon", "Resourcepack", "Java & Bedrock", "Structures", "World Gen"],
    downloads: 56175,
    updated: "2026-07-17",
    links: [
      {
        label: "CurseForge (Java Mod)",
        url: "https://www.curseforge.com/minecraft/mc-mods/structural-beyond",
        platform: "curseforge",
        cfPath: "minecraft/mc-mods/structural-beyond",
        initialDownloads: 40034
      },
      {
        label: "CurseForge (Datapack)",
        url: "https://www.curseforge.com/minecraft/data-packs/structural-beyond-sbd",
        platform: "curseforge",
        cfPath: "minecraft/data-packs/structural-beyond-sbd",
        initialDownloads: 1542
      },
      {
        label: "CurseForge (Resourcepack)",
        url: "https://www.curseforge.com/minecraft/texture-packs/structural-beyond-sbrd",
        platform: "curseforge",
        cfPath: "minecraft/texture-packs/structural-beyond-sbrd",
        initialDownloads: 659
      },
      {
        label: "CurseForge (Bedrock Addon)",
        url: "https://www.curseforge.com/minecraft-bedrock/addons/structural-beyond-sb-bedrock",
        platform: "curseforge",
        cfPath: "minecraft-bedrock/addons/structural-beyond-sb-bedrock",
        initialDownloads: 775
      },
      {
        label: "Modrinth (Mod)",
        url: "https://modrinth.com/mod/structural-beyond",
        platform: "modrinth",
        mrId: "structural-beyond",
        initialDownloads: 12535
      },
      {
        label: "GameJolt",
        url: "https://gamejolt.com/games/structural_beyond_mc/944658",
        platform: "gamejolt",
        initialDownloads: 163
      },
      {
        label: "Itch.io",
        url: "https://d4vide106.itch.io/structuralbeyond-mc",
        platform: "itch",
        initialDownloads: 6
      }
    ]
  },
  {
    id: "project-horror",
    title: "PROJECT HORROR",
    slug: "project-horror",
    description: "Terrifying survival horror experience packed with scariest entities, custom atmosphere, and mechanics.",
    icon_url: "https://media.forgecdn.net/avatars/994/340/638509827334101640.png",
    type: "Modpack",
    category: "minecraft",
    tags: ["Modpack", "Horror", "Survival", "Entities", "Atmosphere", "Forge"],
    downloads: 4994,
    updated: "2023-11-11",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-horror",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-horror",
        initialDownloads: 4994
      }
    ]
  },
  {
    id: "project-the-rpg-reborn",
    title: "PROJECT THE RPG REBORN",
    slug: "project-the-rpg-reborn",
    description: "Incredible RPG experience alone or with friends featuring leveling, magic, dungeons, and bosses.",
    icon_url: "https://media.forgecdn.net/avatars/965/108/638463726503298813.png",
    type: "Modpack",
    category: "minecraft",
    tags: ["Modpack", "RPG", "Magic", "Dungeons", "Leveling", "Forge"],
    downloads: 188,
    updated: "2024-11-21",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-the-rpg-reborn",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-the-rpg-reborn",
        initialDownloads: 188
      }
    ]
  },
  {
    id: "project-realistic-rpg",
    title: "PROJECT REALISTIC RPG",
    slug: "project-realistic-rpg",
    description: "Realistic survival experience with health, weapons, medkits, temperature, and immersive mechanics.",
    icon_url: "https://media.forgecdn.net/avatars/1172/959/638744641399341869.png",
    type: "Modpack",
    category: "minecraft",
    tags: ["Modpack", "Realistic", "Survival", "Weapons", "Temperature", "Forge"],
    downloads: 359,
    updated: "2025-03-24",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-realistic-rpg",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-realistic-rpg",
        initialDownloads: 359
      }
    ]
  },
  {
    id: "project-gunparty",
    title: "PROJECT GUNPARTY",
    slug: "project-gunparty",
    description: "Action-packed multiplayer gun warfare and deathmatch experience inside Minecraft.",
    icon_url: "https://media.forgecdn.net/avatars/1408/864/638912980924519123.png",
    type: "Modpack",
    category: "minecraft",
    tags: ["Modpack", "Guns", "Multiplayer", "PvP", "Deathmatch", "Forge"],
    downloads: 180,
    updated: "2024-08-15",
    links: [
      {
        label: "CurseForge (Modpack)",
        url: "https://www.curseforge.com/minecraft/modpacks/project-gunparty",
        platform: "curseforge",
        cfPath: "minecraft/modpacks/project-gunparty",
        initialDownloads: 180
      }
    ]
  },
  {
    id: "bosstweak-3d",
    title: "BOSSTWEAK 3D+",
    slug: "bosstweak-3d",
    description: "Official resource pack of Boss RPG: corrects visual problems, improves textures, and adds 3D models.",
    icon_url: "https://media.forgecdn.net/avatars/1221/657/638800200916334761.png",
    type: "Resource Pack",
    category: "minecraft",
    tags: ["Resource Pack", "3D Models", "Textures", "Boss RPG Companion"],
    downloads: 359,
    updated: "2025-04-13",
    links: [
      {
        label: "CurseForge (Texture Pack)",
        url: "https://www.curseforge.com/minecraft/texture-packs/bosstweak-3d",
        platform: "curseforge",
        cfPath: "minecraft/texture-packs/bosstweak-3d",
        initialDownloads: 359
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
    category: "minecraft",
    tags: ["Plugin", "Server", "Paper", "Spigot", "MOTD", "Maintenance"],
    downloads: 162,
    updated: "2025-02-10",
    links: [
      {
        label: "Modrinth (Plugin)",
        url: "https://modrinth.com/plugin/pmaintanceuniversal",
        platform: "modrinth",
        mrId: "pmaintanceuniversal",
        initialDownloads: 162
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
    category: "minecraft",
    tags: ["Minecraft Server", "Java & Bedrock", "Crossplatform", "Minigames", "SMP"],
    downloads: 0,
    updated: "2026-08-01",
    links: [
      {
        label: "Modrinth (Server)",
        url: "https://modrinth.com/minecraft_java_server/infinitysmart",
        platform: "modrinth",
        mrId: "infinitysmart",
        initialDownloads: 0
      }
    ]
  },
  {
    id: "extreme-obby",
    title: "Extreme Obby! [UPD]",
    slug: "extreme-obby",
    description: "Intense 50+ level parkour obstacle challenge! Complete levels with as few deaths as possible in open beta v3.0.",
    icon_url: "https://tr.rbxcdn.com/180DAY-83fb2d91121df9100add640107598e6d/512/512/Image/Png/noFilter",
    fallback_icon_url: "/images/roblox/extreme-obby.png",
    thumbnail_url: "https://tr.rbxcdn.com/180DAY-1f21c39edd0a217a8f3d59799f5c425d/768/432/Image/Png/noFilter",
    fallback_thumbnail_url: "/images/roblox/extreme-obby-thumb.png",
    type: "Roblox Obby",
    category: "roblox",
    tags: ["Roblox", "Obby", "Parkour", "50+ Levels", "Hardcore", "Speedrun", "Beta 3.0", "Multiplayer"],
    downloads: 666,
    updated: "2026-08-27",
    robloxStats: {
      universeId: 3266189000,
      placeId: 8568254840,
      creatorName: "Infinity Project Studio's",
      creatorType: "Group",
      creatorId: 33742489,
      creatorUrl: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
      visits: 666,
      playing: 0,
      maxPlayers: 50,
      upVotes: 8,
      downVotes: 2,
      ratingPercent: 80,
      favorites: 11,
      groupLogo: "https://tr.rbxcdn.com/180DAY-4ed5652c6445287484e24e35b0ba6235/420/420/Image/Png/noFilter",
      fallbackIconUrl: "https://tr.rbxcdn.com/180DAY-83fb2d91121df9100add640107598e6d/512/512/Image/Png/noFilter"
    },
    links: [
      {
        label: "Gioca su Roblox",
        url: "https://www.roblox.com/games/8568254840/Extreme-Obby",
        platform: "roblox",
        robloxUniverseId: 3266189000,
        robloxPlaceId: 8568254840,
        initialDownloads: 666
      },
      {
        label: "Infinity Project Studio's",
        url: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
        platform: "roblox"
      }
    ]
  },
  {
    id: "stud-difficulty",
    title: "Stud Difficulty [ALPHA]",
    slug: "stud-difficulty",
    description: "Professional precision challenge pushing your skills to the limit. Features high jumps, long jumps, quests, and checkpoints.",
    icon_url: "https://tr.rbxcdn.com/180DAY-345d28dab47057bb1973e17a7872c781/512/512/Image/Png/noFilter",
    fallback_icon_url: "/images/roblox/stud-difficulty.png",
    thumbnail_url: "https://tr.rbxcdn.com/180DAY-38d051e294d848c54603dc9d727e1759/768/432/Image/Png/noFilter",
    fallback_thumbnail_url: "/images/roblox/stud-difficulty-thumb.png",
    type: "Roblox Obby",
    category: "roblox",
    tags: ["Roblox", "Obby", "Studs", "Parkour", "Precision", "Long Jump", "Alpha", "Quests"],
    downloads: 773,
    updated: "2026-08-27",
    robloxStats: {
      universeId: 7239022329,
      placeId: 140410268649534,
      creatorName: "Infinity Project Studio's",
      creatorType: "Group",
      creatorId: 33742489,
      creatorUrl: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
      visits: 773,
      playing: 0,
      maxPlayers: 10,
      upVotes: 6,
      downVotes: 2,
      ratingPercent: 75,
      favorites: 5,
      groupLogo: "https://tr.rbxcdn.com/180DAY-4ed5652c6445287484e24e35b0ba6235/420/420/Image/Png/noFilter",
      fallbackIconUrl: "https://tr.rbxcdn.com/180DAY-345d28dab47057bb1973e17a7872c781/512/512/Image/Png/noFilter"
    },
    links: [
      {
        label: "Gioca su Roblox",
        url: "https://www.roblox.com/games/140410268649534/Stud-Difficulty",
        platform: "roblox",
        robloxUniverseId: 7239022329,
        robloxPlaceId: 140410268649534,
        initialDownloads: 773
      },
      {
        label: "Infinity Project Studio's",
        url: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
        platform: "roblox"
      }
    ]
  },
  {
    id: "italian-hangout",
    title: "ITALIAN HANGOUT [BETA NEW]",
    slug: "italian-hangout",
    description: "The ultimate Italian social hangout hub. Relax, meet new friends, explore beaches, attend music events, and drive VIP vehicles.",
    icon_url: "https://tr.rbxcdn.com/180DAY-1114d0b564d34ba68d6946d1581098e8/512/512/Image/Png/noFilter",
    fallback_icon_url: "/images/roblox/italian-hangout.png",
    thumbnail_url: "https://tr.rbxcdn.com/180DAY-34e9515a125af11ecc8561edab43e16f/768/432/Image/Png/noFilter",
    fallback_thumbnail_url: "/images/roblox/italian-hangout-thumb.png",
    type: "Roblox Social",
    category: "roblox",
    tags: ["Roblox", "Social", "Hangout", "Italian", "Music", "Events", "Roleplay", "Vehicles"],
    downloads: 153,
    updated: "2026-09-04",
    robloxStats: {
      universeId: 7330243159,
      placeId: 121996194682331,
      creatorName: "Infinity Project Studio's",
      creatorType: "Group",
      creatorId: 33742489,
      creatorUrl: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
      visits: 153,
      playing: 0,
      maxPlayers: 50,
      upVotes: 2,
      downVotes: 0,
      ratingPercent: 100,
      favorites: 7,
      groupLogo: "https://tr.rbxcdn.com/180DAY-4ed5652c6445287484e24e35b0ba6235/420/420/Image/Png/noFilter",
      fallbackIconUrl: "https://tr.rbxcdn.com/180DAY-1114d0b564d34ba68d6946d1581098e8/512/512/Image/Png/noFilter"
    },
    links: [
      {
        label: "Gioca su Roblox",
        url: "https://www.roblox.com/games/121996194682331/ITALIAN-HANGOUT",
        platform: "roblox",
        robloxUniverseId: 7330243159,
        robloxPlaceId: 121996194682331,
        initialDownloads: 153
      },
      {
        label: "Infinity Project Studio's",
        url: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
        platform: "roblox"
      }
    ]
  },
  {
    id: "infinity-obby-record",
    title: "Infinity Obby Record! [NEW]",
    slug: "infinity-obby-record",
    description: "Endless jump challenge! Keep leaping forward, beat your previous high scores, race against the timer, and challenge friends globally.",
    icon_url: "https://tr.rbxcdn.com/180DAY-6dc8451d69e47d589f4791b327038a19/512/512/Image/Png/noFilter",
    fallback_icon_url: "/images/roblox/infinity-obby-record.png",
    thumbnail_url: "https://tr.rbxcdn.com/180DAY-a630ab167a064309bee9f967649a3c2e/768/432/Image/Png/noFilter",
    fallback_thumbnail_url: "/images/roblox/infinity-obby-record-thumb.png",
    type: "Roblox Runner",
    category: "roblox",
    tags: ["Roblox", "Obby", "Runner", "Endless Jump", "High Scores", "Speedrun", "Multiplayer"],
    downloads: 20,
    updated: "2025-11-12",
    robloxStats: {
      universeId: 6963288939,
      placeId: 101498791758910,
      creatorName: "Infinity Project Studio's",
      creatorType: "Group",
      creatorId: 33742489,
      creatorUrl: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
      visits: 20,
      playing: 0,
      maxPlayers: 10,
      upVotes: 1,
      downVotes: 0,
      ratingPercent: 100,
      favorites: 1,
      groupLogo: "https://tr.rbxcdn.com/180DAY-4ed5652c6445287484e24e35b0ba6235/420/420/Image/Png/noFilter",
      fallbackIconUrl: "https://tr.rbxcdn.com/180DAY-6dc8451d69e47d589f4791b327038a19/512/512/Image/Png/noFilter"
    },
    links: [
      {
        label: "Gioca su Roblox",
        url: "https://www.roblox.com/games/101498791758910/Infinity-Obby-Record",
        platform: "roblox",
        robloxUniverseId: 6963288939,
        robloxPlaceId: 101498791758910,
        initialDownloads: 20
      },
      {
        label: "Infinity Project Studio's",
        url: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
        platform: "roblox"
      }
    ]
  },
  {
    id: "dodger-climber",
    title: "Dodger Climber",
    slug: "dodger-climber",
    description: "Scale challenging vertical cliffs and mountain paths while dodging hazards and testing your timing and reflexes.",
    icon_url: "https://t6.rbxcdn.com/180DAY-007dc222a830b5992e1a04073454e980",
    fallback_icon_url: "/images/roblox/dodger-climber.png",
    thumbnail_url: "https://tr.rbxcdn.com/180DAY-e0736769672017234e02eb8938cb684d/768/432/GameMediaItem12/Png/noFilter",
    fallback_thumbnail_url: "/images/roblox/dodger-climber-thumb.png",
    type: "Roblox Climber",
    category: "roblox",
    tags: ["Roblox", "Climber", "Action", "Dodger", "Precision", "Vertical", "Multiplayer"],
    downloads: 82,
    updated: "2026-09-04",
    robloxStats: {
      universeId: 8934658965,
      placeId: 92147363880035,
      creatorName: "Infinity Project Studio's",
      creatorType: "Group",
      creatorId: 33742489,
      creatorUrl: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
      visits: 82,
      playing: 0,
      maxPlayers: 50,
      upVotes: 0,
      downVotes: 0,
      ratingPercent: 100,
      favorites: 1,
      groupLogo: "https://tr.rbxcdn.com/180DAY-4ed5652c6445287484e24e35b0ba6235/420/420/Image/Png/noFilter",
      fallbackIconUrl: "https://t6.rbxcdn.com/180DAY-007dc222a830b5992e1a04073454e980"
    },
    links: [
      {
        label: "Gioca su Roblox",
        url: "https://www.roblox.com/games/92147363880035/Dodger-Climber",
        platform: "roblox",
        robloxUniverseId: 8934658965,
        robloxPlaceId: 92147363880035,
        initialDownloads: 82
      },
      {
        label: "Infinity Project Studio's",
        url: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
        platform: "roblox"
      }
    ]
  },
  {
    id: "nycron",
    title: "Nycron [EARLY TESTING]",
    slug: "nycron",
    description: "Experimental platformer featuring custom momentum mechanics, unique physics challenges, and world progression.",
    icon_url: "https://t4.rbxcdn.com/180DAY-dc729135d7789ab11a92a9d761648577",
    fallback_icon_url: "/images/roblox/nycron.png",
    thumbnail_url: "https://tr.rbxcdn.com/180DAY-181dd0532816faa51a071e6f17e29010/768/432/GameMediaItem11/Png/noFilter",
    fallback_thumbnail_url: "/images/roblox/nycron-thumb.png",
    type: "Roblox Platformer",
    category: "roblox",
    tags: ["Roblox", "Platformer", "Early Testing", "Runner", "Physics", "Mechanics", "Exploration"],
    downloads: 19,
    updated: "2026-07-31",
    robloxStats: {
      universeId: 7853966833,
      placeId: 96607350124786,
      creatorName: "Infinity Project Studio's",
      creatorType: "Group",
      creatorId: 33742489,
      creatorUrl: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
      visits: 19,
      playing: 0,
      maxPlayers: 50,
      upVotes: 1,
      downVotes: 0,
      ratingPercent: 100,
      favorites: 1,
      groupLogo: "https://tr.rbxcdn.com/180DAY-4ed5652c6445287484e24e35b0ba6235/420/420/Image/Png/noFilter",
      fallbackIconUrl: "https://t4.rbxcdn.com/180DAY-dc729135d7789ab11a92a9d761648577"
    },
    links: [
      {
        label: "Gioca su Roblox",
        url: "https://www.roblox.com/games/96607350124786/Nycron",
        platform: "roblox",
        robloxUniverseId: 7853966833,
        robloxPlaceId: 96607350124786,
        initialDownloads: 19
      },
      {
        label: "Infinity Project Studio's",
        url: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios",
        platform: "roblox"
      }
    ]
  }
];

