export interface WikiArticle {
  id: string;
  projectId: string;
  category: string; // e.g., "Getting Started", "Guides", "Configuration", "Advanced"
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
}

export interface WikiCategory {
  name: string;
  articles: WikiArticle[];
}

export const DEFAULT_WIKI_DATA: Record<string, WikiArticle[]> = {
  "project-boss-rpg": [
    {
      id: "pbr-getting-started",
      projectId: "project-boss-rpg",
      category: "Getting Started",
      title: "Introduction & Quickstart",
      slug: "introduction",
      lastUpdated: "2026-08-10",
      content: `# Getting Started with PROJECT BOSS RPG

Welcome to the official documentation for **PROJECT BOSS RPG**, an epic Minecraft RPG modpack built for high-stakes boss progression, unique leveling, custom dimensional dungeons, and RPG gear systems.

> [!NOTE]
> This modpack requires **Forge 1.20.1** and a minimum of **6 GB allocated RAM** (8 GB recommended for optimal shader performance).

---

## Key Features

- ⚔️ **Custom Boss Progression**: Battle unique bosses with customized phase mechanics, AI telegraphing, and exclusive drop tables.
- 📜 **Interactive Questlines**: Over 300+ hand-crafted quests guiding you from basic survival to dimensional endgame content.
- 🛡️ **RPG Gear Tiering**: Equipment with elemental attributes, rarity multipliers, and socketable gems.
- 🏰 **Handcrafted Dungeons**: Explore dynamic procedural towers, underground keeps, and celestial temples.

---

## Installation Guide

1. Download the CurseForge App or Prism Launcher.
2. Search for **PROJECT BOSS RPG** in the modpack browser.
3. Click **Install** and allocate at least **6144 MB** of RAM in your launcher settings.
4. Launch and select your initial RPG Origin Class!

> [!TIP]
> Make sure to install OptiFine or Embeddium + Oculus if you plan to use shaders with 3D texture packs like *BossTweak 3D+*.`
    },
    {
      id: "pbr-bosses-guide",
      projectId: "project-boss-rpg",
      category: "Guides",
      title: "Boss Mechanics & Phase Strategy",
      slug: "boss-mechanics",
      lastUpdated: "2026-08-05",
      content: `# Boss Mechanics & Strategy Guide

Every boss in **PROJECT BOSS RPG** has telegraphed abilities and multi-phase transformations. Below is a overview of core mechanics.

## Boss Tier Summary

| Boss Name | Tier | Recommended Level | Signature Ability | Key Drops |
|---|---|---|---|---|
| **Infernal Overseer** | Tier 1 | Lv. 15 | Magma Surge & Ground Slam | Flamecore Core, Obsidian Blade |
| **Celestial Archon** | Tier 2 | Lv. 40 | Solar Beam & Gravitational Pull | Sunstone Gem, Winged Relic |
| **Void Sentinel** | Tier 3 | Lv. 75 | Dimensional Rift & Blindness | Void Essence, Sentinel Armor |

---

## Combat Tips

> [!WARNING]
> Bosses gain **Enrage State** when dropped below 25% Health. Dodging telegraphed red ground markers is vital to survival!

\`\`\`kotlin
// Damage multiplier calculation during Enrage phase
fun calculateEnrageDamage(baseDamage: Double, bossHpRatio: Double): Double {
    return if (bossHpRatio < 0.25) baseDamage * 1.75 else baseDamage
}
\`\`\`

### Essential Buff Items
- 🧪 **Flask of Greater Healing**: Restores 50% HP over 4 seconds.
- 🛡️ **Ironhide Elixir**: Grants Resistance II for 3 minutes.`
    },
    {
      id: "pbr-config-setup",
      projectId: "project-boss-rpg",
      category: "Configuration",
      title: "Server & Mod Configuration",
      slug: "configuration",
      lastUpdated: "2026-07-28",
      content: `# Server & Mod Configuration

Configure server limits, difficulty scaling, and RPG drop rates in \`config/projectbossrpg-common.toml\`.

\`\`\`toml
[general]
  # Enable global RPG leveling system
  enableRPGLeveling = true
  # Maximum player level cap
  maxPlayerLevel = 100
  # Global XP multiplier for mob kills
  xpMultiplier = 1.25

[boss_scaling]
  # Scale boss health dynamically per online player in arena (0.15 = +15% per player)
  healthPerPlayerScale = 0.15
  # Enable enrage phase below 25% HP
  enableEnragePhase = true
\`\`\`

> [!IMPORTANT]
> Always restart your dedicated server after making edits to \`projectbossrpg-common.toml\`.`
    }
  ],

  "sdob": [
    {
      id: "sdob-overview",
      projectId: "sdob",
      category: "Getting Started",
      title: "Overview & Structure Spawning",
      slug: "overview",
      lastUpdated: "2026-08-12",
      content: `# Spiral Dungeon of Babel (SDOB)

**Spiral Dungeon of Babel** is a massive multi-layered structure mod and datapack available for **Java**, **Bedrock**, and **Datapack** formats.

> [!NOTE]
> The Tower of Babel spawns in **Deep Ocean** biomes and reaches from Y level -64 all the way to Y level 319!

---

## Dungeon Structure Features

- 🏗️ **Spiral Architecture**: Over 100+ procedural rooms connected by spiraling stairways and hidden passages.
- 🔑 **Keycard & Shrine Lock Doors**: Unlock deeper floors by defeating sector guardians and collecting Sigil Keys.
- 🌐 **Crossplatform Compatibility**: Native Java Mod (Forge/Fabric), Bedrock Addon (.mcaddon), and Pure Datapack.

---

## Locating the Tower

Use the in-game command or locator item:

\`\`\`bash
/locate structure sdob:spiral_dungeon_babel
\`\`\`

> [!TIP]
> Bring Water Breathing potions and Feather Falling boots before entering Sector 1!`
    },
    {
      id: "sdob-floors-guide",
      projectId: "sdob",
      category: "Guides",
      title: "Floor Breakdown & Loot Tables",
      slug: "floors-breakdown",
      lastUpdated: "2026-08-01",
      content: `# Floor Breakdown & Sigil Keys

| Sector | Y Level Range | Enemy Type | Sigil Key Required |
|---|---|---|---|
| **Sub-Level Abyss** | -64 to 0 | Deepsea Drowners, Abyssal Guardians | Abyss Sigil Key |
| **Middle Keep** | 1 to 150 | Golem Knights, Spectral Archers | Babel Crest |
| **Apex Pinnacle** | 151 to 319 | Celestial Dragon Herald | Apex Keycard |

---

## Loot Tier Distribution

- 🪙 **Common Chests**: Iron Ingot, Lapis, Experience Bottles
- 💎 **Rare Relic Chests**: Ancient Debris, Enchanted Golden Apples, SDOB Custom Artifacts`
    }
  ],

  "structural-beyond": [
    {
      id: "sb-overview",
      projectId: "structural-beyond",
      category: "Getting Started",
      title: "Overview & World Generation",
      slug: "overview",
      lastUpdated: "2026-08-08",
      content: `# Structural Beyond

**Structural Beyond** adds dozens of breathtaking, lore-rich structures across Overworld, Nether, and End dimensions.

> [!NOTE]
> Compatible with **Java (Forge, Fabric, NeoForge)**, **Bedrock Edition**, and **Vanilla Datapacks**. Fully compatible with Terralith and Worldgen mods!

---

## Included Structures

- 🏰 **Overworld Sunken Ruins**: Underwater ancient temples with hidden treasure rooms.
- 🌋 **Nether Forge Bastions**: Volcanic fortresses filled with Magma Golems and Netherite scraps.
- 🌌 **End Void Sanctuaries**: Floating celestial islands with custom elytra challenges.`
    }
  ],

  "project-horror": [
    {
      id: "ph-overview",
      projectId: "project-horror",
      category: "Getting Started",
      title: "Survival Survival Guide & Mechanics",
      slug: "overview",
      lastUpdated: "2026-07-20",
      content: `# PROJECT HORROR Survival Guide

A terrifying survival horror modpack designed to test your sanity, stealth, and resourcefulness.

> [!WARNING]
> Darkness reduces Sanity rapidly. Keep lit torches, lanterns, or flashlights active at all times!

---

## Core Survival Mechanics

- 👁️ **Sanity Meter**: Low sanity causes hallucinations, distorted audio, and aggressive entity spawns.
- 🔦 **Battery & Fuel Management**: Flashlights and lanterns burn out. Craft spare batteries using Copper and Redstone.
- 📻 **Proximity Voice Chat**: In-game audio travels through walls and draws surrounding monsters towards sound!`
    }
  ],

  "project-the-rpg-reborn": [
    {
      id: "ptr-overview",
      projectId: "project-the-rpg-reborn",
      category: "Getting Started",
      title: "Class System & Magic Spells",
      slug: "overview",
      lastUpdated: "2026-07-15",
      content: `# PROJECT THE RPG REBORN

Embark on a classic magic and leveling adventure alone or with friends.

## Available Classes

- 🧙‍♂️ **Mage**: High spell casting output, teleportation, elemental barrier.
- ⚔️ **Warrior**: High armor proficiency, whirlwind melee attacks, taunt shout.
- 🏹 **Ranger**: Extended archery range, trap placement, critical agility.`
    }
  ],

  "project-realistic-rpg": [
    {
      id: "prr-overview",
      projectId: "project-realistic-rpg",
      category: "Getting Started",
      title: "Realistic Mechanics & Body Health",
      slug: "overview",
      lastUpdated: "2026-07-10",
      content: `# PROJECT REALISTIC RPG

Realistic survival overhaul featuring directional limb damage, hypothermia, firearms, and medical kits.`
    }
  ],

  "project-gunparty": [
    {
      id: "pgp-overview",
      projectId: "project-gunparty",
      category: "Getting Started",
      title: "Gamemodes & Weapon Loadouts",
      slug: "overview",
      lastUpdated: "2026-07-05",
      content: `# PROJECT GUNPARTY

Action-packed multiplayer gun warfare inside Minecraft featuring Team Deathmatch, Domination, and Gun Game.`
    }
  ],

  "bosstweak-3d": [
    {
      id: "bt3d-overview",
      projectId: "bosstweak-3d",
      category: "Getting Started",
      title: "Installation & Shader Setup",
      slug: "overview",
      lastUpdated: "2026-07-01",
      content: `# BossTweak 3D+ Resource Pack

Official 3D texture pack and model tweak for Minecraft and Boss RPG.`
    }
  ],

  "pmaintanceuniversal": [
    {
      id: "pmu-overview",
      projectId: "pmaintanceuniversal",
      category: "Getting Started",
      title: "Plugin Commands & Config",
      slug: "overview",
      lastUpdated: "2026-06-25",
      content: `# Project Maintenance Universal

Universal server maintenance plugin for Paper, Spigot, and Purpur servers.`
    }
  ],

  "infinitysmart": [
    {
      id: "inf-overview",
      projectId: "infinitysmart",
      category: "Getting Started",
      title: "Server IP & Connection Guide",
      slug: "overview",
      lastUpdated: "2026-06-20",
      content: `# InfinitySmart Server Network

Join the official Minecraft Java & Bedrock crossplatform server network!`
    }
  ]
};
