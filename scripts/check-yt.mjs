async function test() {
  try {
    const res = await fetch("https://www.youtube.com/@D4vide106/shorts", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    const html = await res.text();
    const dataMatch = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (dataMatch) {
      const data = JSON.parse(dataMatch[1]);
      const jsonStr = JSON.stringify(data);
      const viewsMatches = [...jsonStr.matchAll(/"label":"([0-9,KM\.]+ (?:views|visualizzazioni))"/gi)].map(m => m[1]);
      console.log("Views matches:", viewsMatches);
    } else {
      console.log("No ytInitialData match");
    }
  } catch (e) {
    console.error(e);
  }
}
test();
