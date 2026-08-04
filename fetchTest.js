const slugs = ['project-boss-rpg', 'project-horror', 'the-rpg-reborn', 'spiral-dungeon-of-babel', 'structural-beyond', 'bosstweak-3d'];
async function fetchCF() {
  for (let s of slugs) {
    for (let type of ['modpacks', 'mc-mods', 'texture-packs']) {
      try {
        let r = await fetch(`https://api.cfwidget.com/minecraft/${type}/${s}`);
        if(r.ok){
           let d = await r.json();
           console.log(s, type, d.downloads?.total);
           break;
        }
      } catch(e) {}
    }
  }
}
fetchCF();
