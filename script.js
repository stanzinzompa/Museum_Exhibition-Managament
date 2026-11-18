// ---------- Sample data (edit this to change the site) ----------
// Add an image URL in "img" to show a real picture; leave "" for a coloured placeholder.
const CATS = ["Painting", "Sculpture", "Traditional", "Contemporary", "Photography"];

const artists = [
  { id: 1, name: "Raja Ravi Varma", nat: "Indian", style: "Academic Realism", img: "", bio: "Kerala-born painter who brought Indian epics to life in oil." },
  { id: 2, name: "Amrita Sher-Gil", nat: "Indian-Hungarian", style: "Modernism", img: "", bio: "Pioneer of modern Indian art, known for her bold colour and quiet portraits." },
  { id: 3, name: "Claude Monet", nat: "French", style: "Impressionism", img: "", bio: "Founder of Impressionism, devoted to painting changing light." },
  { id: 4, name: "Auguste Rodin", nat: "French", style: "Expressive Realism", img: "", bio: "Often called the father of modern sculpture." },
  { id: 5, name: "Raghu Rai", nat: "Indian", style: "Photojournalism", img: "", bio: "Photographer documenting India's streets, people and monuments." },
  { id: 6, name: "Jamini Roy", nat: "Indian", style: "Bengal Folk", img: "", bio: "Drew on village scroll painting traditions with bold outlines." }
];

const galleries = [
  { id: 1, name: "Ivory Hall", floor: "Floor 1, East Wing", img: "", desc: "Light-filled hall for European and Indian canvases." },
  { id: 2, name: "Terracotta Wing", floor: "Ground Floor", img: "", desc: "Folk and traditional art in warm surroundings." },
  { id: 3, name: "Modern Rotunda", floor: "Floor 2, Central", img: "", desc: "Circular space for modern and contemporary work." },
  { id: 4, name: "Lens Room", floor: "Floor 2, West Wing", img: "", desc: "Dim, intimate room for photography." }
];

const exhibitions = [
  { id: 1, title: "Masters of Light", cat: "Painting", start: "2026-10-01", end: "2027-01-15", gallery: 1, img: "", desc: "Luminous landscapes and the artists who chased the same fleeting light." },
  { id: 2, title: "Echoes of Bengal", cat: "Traditional", start: "2026-11-01", end: "2027-02-28", gallery: 2, img: "", desc: "Folk-inspired art from Bengal." },
  { id: 3, title: "Indian Modernism", cat: "Painting", start: "2026-09-15", end: "2027-01-31", gallery: 3, img: "", desc: "How Indian artists reimagined tradition in the 20th century." },
  { id: 4, title: "Form & Void", cat: "Sculpture", start: "2026-12-10", end: "2027-03-20", gallery: 3, img: "", desc: "Bronzes and installations exploring emptiness." },
  { id: 5, title: "Through the Lens", cat: "Photography", start: "2027-01-20", end: "2027-04-30", gallery: 4, img: "", desc: "Five decades of Indian street and monument photography." },
  { id: 6, title: "Royal Canvases", cat: "Painting", start: "2026-03-01", end: "2026-08-31", gallery: 1, img: "", desc: "Mythology and royalty in oil painting." }
];

const artworks = [
  { id: 1, title: "Shakuntala Looking Back", artist: 1, year: 1870, cat: "Painting", medium: "Oil on canvas", gallery: 1, exhibition: 6, desc: "A tender scene from the Mahabharata." },
  { id: 2, title: "Three Girls", artist: 2, year: 1935, cat: "Painting", medium: "Oil on canvas", gallery: 3, exhibition: 3, desc: "Three young women in quiet poses." },
  { id: 3, title: "Water Lilies", artist: 3, year: 1906, cat: "Painting", medium: "Oil on canvas", gallery: 1, exhibition: 1, desc: "Reflections from the pond at Giverny." },
  { id: 4, title: "The Thinker", artist: 4, year: 1904, cat: "Sculpture", medium: "Bronze", gallery: 3, exhibition: 4, desc: "A seated figure lost in thought." },
  { id: 5, title: "Morning Mist at the Taj", artist: 5, year: 1985, cat: "Photography", medium: "Silver gelatin print", gallery: 4, exhibition: 5, desc: "The monument half-dissolved in dawn fog." },
  { id: 6, title: "Krishna and Balarama", artist: 6, year: 1940, cat: "Traditional", medium: "Tempera on cloth", gallery: 2, exhibition: 2, desc: "Flat colour and bold outline in the folk style." },
  { id: 7, title: "Untitled (Void)", artist: 4, year: 1995, cat: "Contemporary", medium: "Pigmented fibreglass", gallery: 3, exhibition: 4, desc: "A deep hollow that swallows the viewer's gaze." },
  { id: 8, title: "Haystacks at Sunset", artist: 3, year: 1891, cat: "Painting", medium: "Oil on canvas", gallery: 1, exhibition: 1, desc: "Harvest stacks glowing in late light." }
];

// ---------- Helpers ----------
const $ = id => document.getElementById(id);
const find = (list, id) => list.find(x => x.id === id);
const nm = o => (o ? o.title || o.name : "—");
const colors = ["#a65d43", "#b8923f", "#6b705c", "#8d6b4f", "#5c4b3b", "#7a5c58"];
const fmt = d => new Date(d + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function status(e) {
  const today = new Date().toISOString().slice(0, 10);
  return today < e.start ? "Upcoming" : today > e.end ? "Completed" : "Ongoing";
}
function pic(item, label) {
  if (item.img) return `<img class="pic" src="${item.img}" alt="${label}">`;
  return `<div class="ph" style="background:${colors[(item.id + label.length) % colors.length]}">${label}</div>`;
}
function fillCats(id) {
  $(id).innerHTML += CATS.map(c => `<option>${c}</option>`).join("");
}

// ---------- Renderers ----------
function renderStats() {
  const n = s => exhibitions.filter(e => status(e) === s).length;
  $("stats").innerHTML = [
    [artworks.length, "Artworks"], [artists.length, "Artists"], [galleries.length, "Galleries"],
    [exhibitions.length, "Exhibitions"], [n("Ongoing"), "Ongoing now"]
  ].map(([v, l]) => `<div><b>${v}</b>${l}</div>`).join("");
}

function list(el, items, html) {
  $(el).innerHTML = items.length ? items.map(html).join("") : `<p class="empty">No results found.</p>`;
}

function renderExhibitions() {
  const q = $("exSearch").value.toLowerCase(), c = $("exCat").value, s = $("exStatus").value, dir = $("exSort").value === "asc" ? 1 : -1;
  const items = exhibitions
    .filter(e => e.title.toLowerCase().includes(q) && (!c || e.cat === c) && (!s || status(e) === s))
    .sort((a, b) => (a.start < b.start ? -1 : 1) * dir);
  list("exList", items, e => `<div class="card click" onclick="openExhibition(${e.id})">${pic(e, e.title)}
    <div class="body"><span class="tag ${status(e)}">${status(e)}</span><h3>${e.title}</h3>
    <p class="muted">${fmt(e.start)} – ${fmt(e.end)}<br>${nm(find(galleries, e.gallery))}</p></div></div>`);
}

function renderArtworks() {
  const q = $("awSearch").value.toLowerCase(), c = $("awCat").value;
  const items = artworks.filter(w =>
    (w.title.toLowerCase().includes(q) || nm(find(artists, w.artist)).toLowerCase().includes(q)) && (!c || w.cat === c));
  list("awList", items, w => `<div class="card click" onclick="openArtwork(${w.id})">${pic(w, w.title)}
    <div class="body"><h3>${w.title}</h3><p class="muted">${nm(find(artists, w.artist))}, ${w.year} · ${w.cat}</p></div></div>`);
}

function renderArtists() {
  const q = $("arSearch").value.toLowerCase();
  list("arList", artists.filter(a => a.name.toLowerCase().includes(q) || a.style.toLowerCase().includes(q)),
    a => `<div class="card click" onclick="openArtist(${a.id})">${pic(a, a.name)}
    <div class="body"><h3>${a.name}</h3><p class="muted">${a.nat} · ${a.style}</p></div></div>`);
}

function renderGalleries() {
  list("glList", galleries, g => {
    const cur = exhibitions.find(e => e.gallery === g.id && status(e) === "Ongoing");
    return `<div class="card">${pic(g, g.name)}<div class="body"><h3>${g.name}</h3>
      <p class="muted">${g.floor}</p><p>${g.desc}</p>
      <p class="muted"><b>Now showing:</b> ${cur ? cur.title : "No current exhibition"}</p></div></div>`;
  });
}

// ---------- Detail popups ----------
function showModal(html) { $("modalBody").innerHTML = html; $("modal").hidden = false; }
function openExhibition(id) {
  const e = find(exhibitions, id), ws = artworks.filter(w => w.exhibition === id);
  showModal(`${pic(e, e.title)}<div class="body"><span class="tag ${status(e)}">${status(e)}</span><h2>${e.title}</h2>
    <p class="muted">${e.cat} · ${fmt(e.start)} – ${fmt(e.end)} · ${nm(find(galleries, e.gallery))}</p><p>${e.desc}</p>
    <b>Featured artworks</b><ul>${ws.map(w => `<li>${w.title} (${w.year})</li>`).join("") || "<li>None yet</li>"}</ul></div>`);
}
function openArtwork(id) {
  const w = find(artworks, id);
  showModal(`${pic(w, w.title)}<div class="body"><h2>${w.title}</h2>
    <p class="muted">${nm(find(artists, w.artist))} · ${w.year} · ${w.cat} · ${w.medium}</p><p>${w.desc}</p>
    <p class="muted">Gallery: ${nm(find(galleries, w.gallery))}<br>Exhibition: ${nm(find(exhibitions, w.exhibition))}</p></div>`);
}
function openArtist(id) {
  const a = find(artists, id), ws = artworks.filter(w => w.artist === id);
  showModal(`${pic(a, a.name)}<div class="body"><h2>${a.name}</h2><p class="muted">${a.nat} · ${a.style}</p><p>${a.bio}</p>
    <b>Famous artworks</b><ul>${ws.map(w => `<li>${w.title} (${w.year})</li>`).join("") || "<li>None yet</li>"}</ul></div>`);
}
$("close").onclick = () => ($("modal").hidden = true);
$("modal").onclick = e => { if (e.target.id === "modal") $("modal").hidden = true; };

// ---------- Start ----------
["exCat", "awCat"].forEach(fillCats);
["exSearch", "exCat", "exStatus", "exSort"].forEach(id => $(id).addEventListener("input", renderExhibitions));
["awSearch", "awCat"].forEach(id => $(id).addEventListener("input", renderArtworks));
$("arSearch").addEventListener("input", renderArtists);
renderStats(); renderExhibitions(); renderArtworks(); renderArtists(); renderGalleries();
