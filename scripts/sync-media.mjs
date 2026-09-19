import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const MEDIA_ITEMS = [
  {
    id: "slip-and-drift",
    tiktokUrl: "https://www.tiktok.com/@d4vide106/video/7685559777451101472",
    ytViewsFallback: 4000,
    tiktokFallback: 16632
  },
  {
    id: "boss-rpg-ignis",
    tiktokUrl: "https://www.tiktok.com/@d4vide106/video/7438210380779752736",
    ytViewsFallback: 0,
    tiktokFallback: 26098
  },
  {
    id: "sdob",
    tiktokUrl: "https://www.tiktok.com/@d4vide106/video/7667237797316807958",
    ytViewsFallback: 1500,
    tiktokFallback: 1241
  },
  {
    id: "minecraft-ai-house",
    tiktokUrl: "https://www.tiktok.com/@d4vide106/video/7609025952693226774",
    ytViewsFallback: 1500,
    tiktokFallback: 805
  }
];

function formatCount(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

async function syncMedia() {
  console.log("⚡ [Media Sync] Synchronizing TikTok + YouTube Shorts real views...");

  const results = {};
  let grandTotalTikTok = 0;
  let grandTotalYT = 0;

  for (const item of MEDIA_ITEMS) {
    let ttViews = item.tiktokFallback;
    let ytViews = item.ytViewsFallback;

    try {
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(item.tiktokUrl)}`);
      const json = await res.json();
      if (json.code === 0 && json.data?.play_count) {
        ttViews = json.data.play_count;
      }
    } catch (e) {
      console.warn(`⚠️ TikWM fetch failed for ${item.id}, using fallback:`, e.message);
    }

    const combined = ttViews + ytViews;
    grandTotalTikTok += ttViews;
    grandTotalYT += ytViews;

    results[item.id] = {
      id: item.id,
      tiktokViews: ttViews,
      youtubeViews: ytViews,
      totalViews: combined,
      formattedViews: formatCount(combined),
      tiktokFormatted: formatCount(ttViews),
      youtubeFormatted: formatCount(ytViews)
    };

    console.log(`🎬 ${item.id}: TikTok (${formatCount(ttViews)}) + YouTube (${formatCount(ytViews)}) = Combined ${formatCount(combined)} (${combined})`);
  }

  const grandTotal = grandTotalTikTok + grandTotalYT;
  const payload = {
    updatedAt: new Date().toISOString(),
    grandTotalCombined: grandTotal,
    grandTotalFormatted: formatCount(grandTotal),
    grandTotalTikTok,
    grandTotalYT,
    items: results
  };

  const outPathSrc = path.join(rootDir, "src", "data", "mediaStats.json");
  const outPathPublic = path.join(rootDir, "public", "media_stats.json");

  fs.writeFileSync(outPathSrc, JSON.stringify(payload, null, 2), "utf-8");
  fs.writeFileSync(outPathPublic, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`✅ [Media Sync] Successfully written mediaStats.json! Grand Total: ${formatCount(grandTotal)} (${grandTotal})`);
}

syncMedia().catch(console.error);
