import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const GROUP_ID = 33742489;
const KNOWN_UIDS = [
  8934658965, // Dodger Climber
  8054104811, // SLIP & DRIFT
  7853966833, // Nycron
  7330243159, // Italian Hangout
  7239022329, // Stud Difficulty
  6963288939, // Infinity Obby Record
  3266189000  // Extreme Obby
];

async function syncRobloxData() {
  console.log("⚡ [Roblox Sync] Fetching public games for group:", GROUP_ID);
  
  const universeIdsSet = new Set(KNOWN_UIDS);

  try {
    const groupRes = await fetch(`https://games.roblox.com/v2/groups/${GROUP_ID}/games?accessFilter=Public&sortOrder=Desc&limit=100`);
    if (groupRes.ok) {
      const groupData = await groupRes.json();
      if (Array.isArray(groupData?.data)) {
        for (const g of groupData.data) {
          if (g.id) universeIdsSet.add(g.id);
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ Could not fetch group games directly, using known universe IDs:", err.message);
  }

  const allUids = Array.from(universeIdsSet);
  console.log(`⚡ [Roblox Sync] Querying ${allUids.length} universe IDs:`, allUids);

  const uidsQuery = allUids.join(",");

  // 1. Fetch game details
  let gamesData = { data: [] };
  try {
    const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${uidsQuery}`);
    if (res.ok) {
      gamesData = await res.json();
    }
  } catch (err) {
    console.warn("⚠️ Failed fetching games data:", err.message);
  }

  // 2. Fetch icons
  let iconsData = { data: [] };
  try {
    const res = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${uidsQuery}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);
    if (res.ok) {
      iconsData = await res.json();
    }
  } catch (err) {
    console.warn("⚠️ Failed fetching icons:", err.message);
  }

  // 3. Fetch thumbnails (banners)
  let thumbnailsData = { data: [] };
  try {
    const res = await fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${uidsQuery}&countPerUniverse=1&defaults=true&size=768x432&format=Png`);
    if (res.ok) {
      thumbnailsData = await res.json();
    }
  } catch (err) {
    console.warn("⚠️ Failed fetching thumbnails:", err.message);
  }

  // 4. Fetch votes
  let votesData = { data: [] };
  try {
    const res = await fetch(`https://games.roblox.com/v1/games/votes?universeIds=${uidsQuery}`);
    if (res.ok) {
      votesData = await res.json();
    }
  } catch (err) {
    console.warn("⚠️ Failed fetching votes:", err.message);
  }

  // Write roblox_data.json
  const robloxDataPayload = {
    syncedAt: new Date().toISOString(),
    groupId: GROUP_ID,
    games: gamesData,
    icons: iconsData,
    votes: votesData
  };

  const robloxDataPath = path.join(rootDir, "roblox_data.json");
  fs.writeFileSync(robloxDataPath, JSON.stringify(robloxDataPayload, null, 2), "utf-8");
  console.log(`✅ [Roblox Sync] Saved roblox_data.json (${gamesData.data?.length || 0} games)`);

  // Write roblox_thumbnails.json
  const robloxThumbPath = path.join(rootDir, "roblox_thumbnails.json");
  fs.writeFileSync(robloxThumbPath, JSON.stringify(thumbnailsData, null, 2), "utf-8");
  console.log(`✅ [Roblox Sync] Saved roblox_thumbnails.json (${thumbnailsData.data?.length || 0} thumbnails)`);

  console.log("🎮 Synced maps:");
  for (const g of (gamesData.data || [])) {
    console.log(`   - [${g.id}] ${g.name} (Visits: ${g.visits}, Playing: ${g.playing})`);
  }
}

syncRobloxData().catch((err) => {
  console.error("❌ [Roblox Sync] Error:", err);
  process.exit(0); // non-fatal to allow build even offline
});
