export interface WikiTranslation {
  title: string;
  category: string;
  content: string;
}

export interface WikiArticle {
  id: string;
  projectId: string;
  category: string; // e.g., "Getting Started", "Guides", "Configuration"
  title: string;
  slug: string;
  content: string; // Default content (English)
  lastUpdated: string;
  translations?: Record<string, WikiTranslation>; // Localized translations (e.g., 'it')
}

export const canonicalProjectId = (id: string): string => {
  if (!id) return "project-boss-rpg";
  if (id === "infinity-smart" || id === "infinitysmart") return "infinitysmart";
  if (id === "spiral-dungeon-of-babel" || id === "sdob") return "sdob";
  if (id === "server-maintenance-spigot" || id === "pmaintanceuniversal") return "pmaintanceuniversal";
  return id;
};

export const slugifyHeading = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

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
> This modpack requires **Forge 1.20.1** and a minimum of **6 GB allocated RAM** (8 GB recommended for optimal performance with shaders).

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
> Make sure to install OptiFine or Embeddium + Oculus if you plan to use shaders with 3D texture packs like *BossTweak 3D+*.`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Introduzione & Guida Rapida",
          content: `# Primi Passi con PROJECT BOSS RPG

Benvenuto nella documentazione ufficiale di **PROJECT BOSS RPG**, un epico modpack Minecraft RPG sviluppato per progressioni con boss ad alta sfida, sistema di livelli personalizzato, dungeon dimensionali ed equipaggiamenti RPG.

> [!NOTE]
> Questo modpack richiede **Forge 1.20.1** e un minimo di **6 GB di RAM allocata** (8 GB consigliati per prestazioni ottimali con shader).

---

## Caratteristiche Principali

- ⚔️ **Progressione Boss Personalizzata**: Affronta boss unici con meccaniche a fasi multiple, attacchi telegrafati e tabelle di drop esclusive.
- 📜 **Missioni Interattive**: Oltre 300 quest create a mano che ti guideranno dalla sopravvivenza di base ai contenuti dimensionali di endgame.
- 🛡️ **Gradi di Equipaggiamento RPG**: Armi e armature con attributi elementali, moltiplicatori di rarità e gemme incastonabili.
- 🏰 **Dungeon Esplorabili**: Esplora torri procedurali dinamiche, fortezze sotterranee e templi celesti.

---

## Guida all'Installazione

1. Scarica l'applicazione CurseForge o Prism Launcher.
2. Cerca **PROJECT BOSS RPG** nel catalogo dei modpack.
3. Clicca **Installa** e alloca almeno **6144 MB** di RAM nelle impostazioni del launcher.
4. Avvia il gioco e scegli la tua Classe di Origine RPG iniziale!

> [!TIP]
> Installa Embeddium + Oculus o OptiFine se desideri utilizzare gli shader insieme a pacchetti di texture 3D come *BossTweak 3D+*.`
        }
      }
    },
    {
      id: "pbr-bosses-guide",
      projectId: "project-boss-rpg",
      category: "Guides",
      title: "Boss Mechanics & Progression",
      slug: "boss-mechanics",
      lastUpdated: "2026-08-05",
      content: `# Boss Mechanics & Progression Strategy

Every major boss in **PROJECT BOSS RPG** features customized abilities, telegraphing ground markers, and distinct phases.

## Boss Tier Summary

| Boss Name | Recommended Tier | Required Equipment | Key Drop |
|---|---|---|---|
| **Infernal Overseer** | Tier 1 (Early Game) | Diamond Gear, Fire Resistance | Flamecore Artifact |
| **Celestial Archon** | Tier 2 (Mid Game) | Enchanted Netherite, Bow | Sunstone Relic |
| **Void Sentinel** | Tier 3 (Endgame) | RPG Socketed Gear, High Mobility | Void Heart & Endgame Armor |

---

## Combat Strategy

> [!WARNING]
> Bosses enter an **Enrage Phase** when their health drops below 25%, drastically increasing attack speed and damage!

### Essential Preparation Items
- 🧪 **Healing & Regeneration Potions**: Essential for surviving sustained area damage.
- 🛡️ **Resistance & Speed Potions**: Allow rapid repositioning when dodging boss telegraph zones.
- 🏹 **Long-range Projectiles**: Keep distance during radial burst shockwaves.`,
      translations: {
        it: {
          category: "Guide",
          title: "Meccaniche Boss & Progressione",
          content: `# Meccaniche Boss & Strategia di Progressione

Ogni boss principale in **PROJECT BOSS RPG** include abilità personalizzate, indicatori di attacco al suolo e fasi di combattimento distinte.

## Riepilogo Gradi Boss

| Nome Boss | Grado Consigliato | Equipaggiamento Richiesto | Drop Chiave |
|---|---|---|---|
| **Infernal Overseer** | Tier 1 (Inizio Gioco) | Armatura in Diamante, Resistenza Fuoco | Artefatto Flamecore |
| **Celestial Archon** | Tier 2 (Metà Gioco) | Netherite Incantata, Arco | Reliquia Pietra Solare |
| **Void Sentinel** | Tier 3 (Fine Gioco) | Equipaggiamento con Gemme RPG, Alta Mobilità | Cuore del Vuoto & Armatura Finale |

---

## Strategia di Combattimento

> [!WARNING]
> I boss entrano in **Fase Enrage (Furia)** quando la salute scende sotto il 25%, aumentando drasticamente velocità d'attacco e danni inflitti!

### Oggetti di Preparazione Essenziali
- 🧪 **Pozioni di Cura & Rigenerazione**: Fondamentali per sopravvivere ai danni ad area prolungati.
- 🛡️ **Pozioni di Resistenza & Velocità**: Permettono di riposizionarsi rapidamente evitando le zone rosse di impatto.
- 🏹 **Armi a Distanza**: Mantieni le distanze durante le onde d'urto radiali del boss.`
        }
      }
    },
    {
      id: "pbr-config-setup",
      projectId: "project-boss-rpg",
      category: "Configuration",
      title: "Modpack Configuration & Settings",
      slug: "configuration",
      lastUpdated: "2026-07-28",
      content: `# Modpack Configuration & Settings

Fine-tune client performance, difficulty balance, and server allocation.

## Performance Tuning

> [!NOTE]
> If you experience micro-stutters, adjust your video settings:
> - Set **Render Distance** to 8-12 chunks.
> - Allocate between 6 GB and 8 GB of RAM (do not allocate more than 10 GB to prevent garbage collector pauses).
> - Enable **Entity Culling** in the video settings menu.`,
      translations: {
        it: {
          category: "Configurazione",
          title: "Configurazione & Ottimizzazione Modpack",
          content: `# Configurazione & Ottimizzazione Modpack

Ottimizza le prestazioni di gioco, il bilanciamento e l'allocazione della memoria.

## Ottimizzazione Prestazioni

> [!NOTE]
> Se noti cali di frame rate o micro-scatti, regola le impostazioni video:
> - Imposta la **Distanza di Rendering** tra 8 e 12 chunk.
> - Alloca tra 6 GB e 8 GB di memoria RAM (evita di superare 10 GB per non appesantire il garbage collector Java).
> - Attiva **Entity Culling** nel menu delle opzioni video.`
        }
      }
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

**Spiral Dungeon of Babel** is a massive multi-layered procedural structure mod and datapack available for **Java**, **Bedrock**, and **Datapack** formats.

> [!NOTE]
> The Tower of Babel spawns in **Deep Ocean** biomes and reaches from Y level -64 all the way to Y level 319!

---

## Dungeon Structure Features

- 🏗️ **Spiral Architecture**: Over 100+ procedural rooms connected by spiraling stairways and hidden passages.
- 🔑 **Keycard & Shrine Lock Doors**: Unlock deeper floors by defeating sector guardians and collecting Sigil Keys.
- 🌐 **Crossplatform Compatibility**: Native Java Mod (Forge/Fabric), Bedrock Addon (.mcaddon), and Pure Datapack.

---

## Locating the Tower

Use the in-game command:

\`\`\`bash
/locate structure sdob:spiral_dungeon_babel
\`\`\`

> [!TIP]
> Bring Water Breathing potions and Feather Falling boots before entering Sector 1!`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Panoramica & Generazione Struttura",
          content: `# Spiral Dungeon of Babel (SDOB)

**Spiral Dungeon of Babel** è una monumentale struttura procedurale a più livelli disponibile per **Minecraft Java**, **Bedrock** e formato **Datapack**.

> [!NOTE]
> La Torre di Babele si genera nei biomi **Deep Ocean (Oceano Profondo)** e si estende dal livello Y -64 fino al livello Y 319!

---

## Caratteristiche della Struttura

- 🏗️ **Architettura a Spirale**: Oltre 100 stanze procedurali connesse da rampe di scale elicoidali e passaggi segreti.
- 🔑 **Porte a Sigillo & Santuari**: Sblocca i piani più profondi sconfiggendo i guardiani di settore e raccogliendo le Chiavi Sigillo.
- 🌐 **Compatibilità Multipiattaforma**: Mod nativa Java (Forge/Fabric), Addon Bedrock (.mcaddon) e Datapack puro.

---

## Trovare la Torre

Usa il comando in-game:

\`\`\`bash
/locate structure sdob:spiral_dungeon_babel
\`\`\`

> [!TIP]
> Porta con te pozioni di Respirazione Acquatica e stivali con Caduta Morbida prima di scendere nel Settore 1!`
        }
      }
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
      content: `# Structural Beyond (SB)

**Structural Beyond** adds dozens of breathtaking, lore-rich structures across Overworld, Nether, and End dimensions.

> [!NOTE]
> Compatible with **Java (Forge, Fabric, NeoForge)**, **Bedrock Edition**, and **Vanilla Datapacks**. Fully compatible with Terralith and vanilla world generation!

---

## Included Structures

- 🏰 **Overworld Sunken Ruins**: Underwater ancient temples with hidden treasure rooms and guardian traps.
- 🌋 **Nether Forge Bastions**: Volcanic fortresses filled with Magma enemies and rare materials.
- 🌌 **End Void Sanctuaries**: Floating celestial islands with custom elytra challenges and dimensional loot.`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Panoramica & Generazione Mondo",
          content: `# Structural Beyond (SB)

**Structural Beyond** introduce decine di strutture mozzafiato ricche di lore nell'Overworld, nel Nether e nell'End.

> [!NOTE]
> Compatibile con **Java (Forge, Fabric, NeoForge)**, **Bedrock Edition** e **Datapack Vanilla**. Completamente compatibile con Terralith e generatori di biomi!

---

## Strutture Incluse

- 🏰 **Rovine Sommerse Overworld**: Antichi templi subacquei con stanze del tesoro nascoste e trappole.
- 🌋 **Bastioni Forgia del Nether**: Fortezze vulcaniche piene di nemici magmatici e risorse preziose.
- 🌌 **Santuari del Vuoto nell'End**: Isole celesti sospese con percorsi di volo per elitre e bottino raro.`
        }
      }
    }
  ],

  "project-horror": [
    {
      id: "ph-overview",
      projectId: "project-horror",
      category: "Getting Started",
      title: "Survival Guide & Mechanics",
      slug: "overview",
      lastUpdated: "2026-07-20",
      content: `# PROJECT HORROR Survival Guide

A terrifying survival horror modpack designed to test your sanity, stealth, and resourcefulness.

> [!WARNING]
> Total darkness reduces your sanity rapidly. Keep lit torches, lanterns, or flashlights active at all times!

---

## Core Survival Mechanics

- 👁️ **Sanity Meter**: Low sanity causes auditory hallucinations, distorted vision, and aggressive entity stalkers.
- 🔦 **Battery & Fuel Management**: Flashlights and lanterns burn out. Conserve resources and craft spare fuel.
- 📻 **Atmospheric Audio**: Environmental sounds and ambient audio warn you of nearby creatures.`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Guida Sopravvivenza & Meccaniche",
          content: `# Guida Sopravvivenza PROJECT HORROR

Un modpack survival horror terrificante progettato per mettere alla prova la tua prudenza, sanità mentale e capacità di sopravvivenza.

> [!WARNING]
> Il buio totale consuma rapidamente la sanità mentale. Tieni torce accese, lanterne o torce elettriche sempre attive!

---

## Meccaniche Principali

- 👁️ **Indicatore di Sanità Mentale**: Una sanità bassa provoca allucinazioni visive, suoni distorti e attacchi di entità oscure.
- 🔦 **Gestione Batterie & Combustibile**: Le fonti di luce si esauriscono. Gestisci accuratamente le scorte e crea carburante di riserva.
- 📻 **Audio Ambientale Immersivo**: I rumori ambientali ti avvisano della vicinanza e del comportamento delle creature.`
        }
      }
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

- 🧙‍♂️ **Mage**: High spell casting output, teleportation, and elemental shields.
- ⚔️ **Warrior**: Heavy armor proficiency, whirlwind melee strikes, and taunt abilities.
- 🏹 **Ranger**: Extended archery range, traps, and high evasion agility.`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Classi & Sistema Magico",
          content: `# PROJECT THE RPG REBORN

Vivi un'avventura RPG classica incentrata su magia, progressione di livelli e dungeon da solo o con i tuoi amici.

## Classi Disponibili

- 🧙‍♂️ **Mago**: Elevato danno magico a distanza, teletrasporto e scudi elementali.
- ⚔️ **Guerriero**: Maestria con armature pesanti, attacchi vortice in mischia e resistenza aumentata.
- 🏹 **Arciere / Ranger**: Gittata dell'arco estesa, trappole e grande agilità di schivata.`
        }
      }
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

Realistic survival overhaul featuring directional limb damage, hypothermia, firearms, and medical kits.

> [!NOTE]
> Wounds to individual limbs require specific medical items (splints for fractures, bandages for bleeding).`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Meccaniche Realistiche & Salute",
          content: `# PROJECT REALISTIC RPG

Un'esperienza di sopravvivenza realistica con salute localizzata per arto, ipotermia, armi da fuoco e kit medici.

> [!NOTE]
> Le ferite ai singoli arti richiedono cure specifiche (stecche per le fratture, bende per le emorragie).`
        }
      }
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

Action-packed multiplayer gun warfare inside Minecraft featuring customizable loadouts, attachments, and arena combat.`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Modalità di Gioco & Armamenti",
          content: `# PROJECT GUNPARTY

Azione multiplayer frenetica con armi da fuoco in Minecraft, con classi personalizzabili, accessori e arene da combattimento.`
        }
      }
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

Official 3D texture pack and model tweak designed for high immersion with Boss RPG and vanilla Minecraft.

> [!TIP]
> Designed for optimal visual quality with modern shaderpacks such as Complementary or Bliss shaders.`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Installazione & Configurazione Shader",
          content: `# Pacchetto Risorse BossTweak 3D+

Texture pack 3D ufficiale con modelli tridimensionali ottimizzati per la massima immersione con Boss RPG e Minecraft vanilla.

> [!TIP]
> Progettato per dare il meglio con shader moderni come Complementary o Bliss.`
        }
      }
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
      content: `# Project: Maintenance Universal (PMU)

Universal server maintenance plugin for Paper, Spigot, and Purpur servers with customizable MOTDs and whitelist bypass permissions.

## Key Commands
- \`/maintenance on\` - Enables maintenance mode.
- \`/maintenance off\` - Disables maintenance mode.
- \`/maintenance reload\` - Reloads the configuration file.`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "Comandi & Configurazione Plugin",
          content: `# Project: Maintenance Universal (PMU)

Plugin di manutenzione universale per server Paper, Spigot e Purpur con MOTD personalizzabili e permessi di bypass whitelist.

## Comandi Principali
- \`/maintenance on\` - Attiva la modalità manutenzione.
- \`/maintenance off\` - Disattiva la modalità manutenzione.
- \`/maintenance reload\` - Ricarica il file di configurazione.`
        }
      }
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

Join the official Minecraft Java & Bedrock crossplatform server network!

- **Java IP**: \`play.infinitysmart.it\` (Port: 25565)
- **Bedrock IP**: \`play.infinitysmart.it\` (Port: 19132)`,
      translations: {
        it: {
          category: "Primi Passi",
          title: "IP Server & Guida alla Connessione",
          content: `# Network Server InfinitySmart

Entra nel network Minecraft multipiattaforma ufficiale Java & Bedrock!

- **IP Java**: \`play.infinitysmart.it\` (Porta: 25565)
- **IP Bedrock**: \`play.infinitysmart.it\` (Porta: 19132)`
        }
      }
    }
  ]
};
