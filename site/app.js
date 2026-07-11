/* THE DEEP — reveal-site app (vanilla JS, no build step) */
(function () {
  const $ = (s, el) => (el || document).querySelector(s);
  const app = $("#app");
  const C = window.DEEP;

  /* ---------- reader settings ---------- */
  const SETTINGS_KEY = "deep-reader-settings";
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; }
  }
  function applySettings(s) {
    const html = document.documentElement;
    ["size", "theme", "font", "space"].forEach(k => { if (s[k]) html.dataset[k] = s[k]; });
    document.querySelectorAll(".seg").forEach(seg => {
      const key = seg.dataset.set;
      seg.querySelectorAll("button").forEach(b =>
        b.classList.toggle("on", String(b.dataset.v) === String(html.dataset[key])));
    });
  }
  function initSettings() {
    applySettings(loadSettings());
    $("#settingsBtn").addEventListener("click", () => {
      const p = $("#settingsPanel");
      p.classList.toggle("hidden");
      p.setAttribute("aria-hidden", p.classList.contains("hidden"));
    });
    document.querySelectorAll(".seg button").forEach(btn => {
      btn.addEventListener("click", () => {
        const s = loadSettings();
        s[btn.parentElement.dataset.set] = btn.dataset.v;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
        applySettings(s);
      });
    });
    document.addEventListener("click", (e) => {
      const p = $("#settingsPanel");
      if (!p.classList.contains("hidden") && !p.contains(e.target) && e.target.id !== "settingsBtn") {
        p.classList.add("hidden");
      }
    });
  }

  /* ---------- scroll effects ---------- */
  let revealObs = null;
  function initScrollFX() {
    // topbar
    const onScroll = () => {
      $("#topbar").classList.toggle("scrolled", window.scrollY > 40);
      const meter = $("#depthMeter");
      if (meter) {
        const max = document.documentElement.scrollHeight - innerHeight;
        const depth = Math.round((window.scrollY / Math.max(max, 1)) * 10914);
        meter.querySelector(".val").textContent = depth.toLocaleString() + " m";
      }
    };
    window.removeEventListener("scroll", window.__deepScroll || (() => {}));
    window.__deepScroll = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    // reveals
    if (revealObs) revealObs.disconnect();
    revealObs = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));
  }

  /* ---------- markdown ---------- */
  const cache = {};
  async function fetchMd(path) {
    if (cache[path]) return cache[path];
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error("Could not load " + path);
    const text = await res.text();
    cache[path] = text;
    return text;
  }
  function md(text) { return marked.parse(text); }
  async function getChapter(num) {
    const text = await fetchMd(C.book.storySource);
    const parts = text.split(/\n(?=## Chapter )/g).filter(p => p.startsWith("## Chapter"));
    return parts[num - 1] || null;
  }

  /* ---------- portraits (inline SVG) ---------- */
  function portrait(kind, size, cls) {
    const s = size || 88;
    const defs = `<defs><radialGradient id="g-${kind}-${s}" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#0f3a55"/><stop offset="100%" stop-color="#051826"/></radialGradient></defs>`;
    const G = `url(#g-${kind}-${s})`;
    const art = {
      nerai: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M0 84 Q20 74 40 84 T80 84 T120 84 V120 H0 Z" fill="#0b2e46"/>
        <path d="M0 92 Q20 82 40 92 T80 92 T120 92 V120 H0 Z" fill="#123c58" opacity=".8"/>
        <path d="M60 26 C48 26 42 38 42 50 C42 64 50 70 50 80 L70 80 C70 70 78 64 78 50 C78 38 72 26 60 26 Z" fill="#dcebf2" opacity=".92"/>
        <path d="M42 50 C36 58 30 60 24 74 C34 70 40 64 44 58 Z" fill="#9fd4de" opacity=".7"/>
        <path d="M78 50 C84 58 90 60 96 74 C86 70 80 64 76 58 Z" fill="#9fd4de" opacity=".7"/>
        <circle cx="53" cy="48" r="2.6" fill="#0a2438"/><circle cx="67" cy="48" r="2.6" fill="#0a2438"/>
        <rect x="57" y="86" width="6" height="14" rx="2" fill="#e8c86a"/><circle cx="60" cy="84" r="5" fill="none" stroke="#e8c86a" stroke-width="2.5"/>
        <circle cx="22" cy="30" r="2" fill="#41e8c5" opacity=".9"/><circle cx="100" cy="22" r="1.6" fill="#41e8c5" opacity=".7"/><circle cx="88" cy="38" r="1.2" fill="#41e8c5" opacity=".6"/>`,
      iggy: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M38 96 C38 78 46 74 60 74 C74 74 82 78 82 96 Z" fill="#1d4a66"/>
        <circle cx="60" cy="52" r="20" fill="#e8d8c6"/>
        <path d="M44 44 C46 34 74 34 76 44 C76 36 70 28 60 28 C50 28 44 36 44 44 Z" fill="#7a4a28"/>
        <circle cx="53" cy="52" r="2.4" fill="#20323c"/><circle cx="67" cy="52" r="2.4" fill="#20323c"/>
        <path d="M54 61 Q60 66 66 61" stroke="#20323c" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="90" cy="84" r="9" fill="none" stroke="#e8d8c6" stroke-width="3" opacity=".7"/>
        <path d="M90 70 C86 76 85 80 90 84 C95 80 94 76 90 70 Z" fill="#ffb347"/>
        <path d="M90 74 C88 77 88 80 90 82 C92 80 92 77 90 74 Z" fill="#ffe9a8"/>`,
      phorcys: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M60 24 C46 24 40 36 40 48 C40 62 48 68 48 78 L72 78 C72 68 80 62 80 48 C80 36 74 24 60 24 Z" fill="#c9d8e2" opacity=".95"/>
        <path d="M48 30 L52 22 L56 30 L60 20 L64 30 L68 22 L72 30" stroke="#e8c86a" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
        <circle cx="52" cy="47" r="2.4" fill="#0a2438"/><circle cx="68" cy="47" r="2.4" fill="#0a2438"/>
        <path d="M52 60 Q60 63 68 60" stroke="#0a2438" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M30 96 C42 88 50 92 60 86 C70 92 78 88 90 96" stroke="#41e8c5" stroke-width="2" fill="none" opacity=".5"/>
        <path d="M84 70 C96 74 100 84 96 96 C90 88 88 80 84 70 Z" fill="#123c58"/>`,
      wave: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M10 70 Q30 50 50 70 T90 70 T130 70" stroke="#7fd4ff" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M10 86 Q30 66 50 86 T90 86 T130 86" stroke="#41e8c5" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>
        <circle cx="60" cy="42" r="10" fill="#dcebf2" opacity=".85"/>`,
      pet: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M28 74 C28 52 44 42 62 44 C80 46 92 58 90 74 C88 88 74 92 60 90 C44 88 28 88 28 74 Z" fill="#2e8f7f"/>
        <path d="M30 72 C22 66 18 58 22 48 C30 54 32 62 30 72 Z" fill="#2e8f7f"/>
        <circle cx="72" cy="62" r="6" fill="#eafcf6"/><circle cx="74" cy="62" r="2.6" fill="#0a2438"/>
        <path d="M48 80 Q58 86 68 80" stroke="#0a2438" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="44" cy="52" r="2" fill="#41e8c5"/><circle cx="54" cy="46" r="2" fill="#41e8c5"/><circle cx="66" cy="46" r="2" fill="#41e8c5"/>`,
      horn: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M34 84 C34 60 46 40 78 32 C70 48 66 60 64 84 Z" fill="#c9d8e2" opacity=".9"/>
        <path d="M80 30 Q92 26 96 34 Q88 36 82 34 Z" fill="#e8c86a"/>
        <path d="M20 92 Q40 84 60 92 T100 92" stroke="#41e8c5" stroke-width="2" fill="none" opacity=".5"/>`,
      moon: `${defs}<rect width="120" height="120" fill="${G}"/>
        <circle cx="60" cy="54" r="24" fill="#dcebf2" opacity=".9"/>
        <circle cx="70" cy="48" r="22" fill="#0a2438" opacity=".85"/>
        <path d="M20 92 Q40 84 60 92 T100 92" stroke="#7fd4ff" stroke-width="2" fill="none" opacity=".5"/>`,
      whistle: `${defs}<rect width="120" height="120" fill="${G}"/>
        <rect x="34" y="50" width="40" height="20" rx="8" fill="#c9d8e2"/>
        <circle cx="76" cy="68" r="14" fill="#c9d8e2"/><circle cx="76" cy="68" r="5" fill="#0a2438"/>
        <path d="M84 44 L94 34 M88 52 L100 46 M80 40 L84 28" stroke="#41e8c5" stroke-width="2.5" stroke-linecap="round"/>`,
      unknown: `${defs}<rect width="120" height="120" fill="${G}"/>
        <text x="60" y="72" text-anchor="middle" font-size="44" fill="#41e8c5" font-family="Georgia">?</text>
        <path d="M20 92 Q40 84 60 92 T100 92" stroke="#41e8c5" stroke-width="2" fill="none" opacity=".4"/>`
    };
    return `<svg class="portrait ${cls || ""}" width="${s}" height="${s}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${kind}">${art[kind] || art.unknown}</svg>`;
  }

  function leviathanSVG() {
    return `<svg class="leviathan" viewBox="0 0 520 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 60 C60 20 120 18 190 40 C250 58 320 58 380 44 C420 35 470 40 510 60 C470 80 420 85 380 76 C320 62 250 62 190 80 C120 102 60 100 10 60 Z" fill="#7fd4ff"/>
      <circle cx="452" cy="55" r="4" fill="#03101c"/>
      <path d="M180 40 L196 12 L212 38 Z M250 34 L262 10 L274 32 Z" fill="#7fd4ff"/></svg>`;
  }

  /* ---------- feedback ---------- */
  function feedbackForm(category, pageId, pageTitle) {
    const wired = !!C.appsScriptUrl;
    return `
    <div class="feedback reveal" data-cat="${category}" data-page="${pageId}" data-title="${encodeURIComponent(pageTitle)}">
      <h3>What do you think?</h3>
      <p class="sub">Your notes go straight to Dad. “I hated this part” is as useful as “I loved it.” More, usually.</p>
      ${wired ? "" : `<p class="not-wired">⚠ Feedback isn't wired up yet — Dad needs to finish site-setup/SETUP.md.</p>`}
      <label>Who's writing this?</label>
      <input type="text" class="fb-who" value="Abby">
      <label>Mood — tap any that fit</label>
      <div class="moods">
        <button class="mood" data-m="Loved it">💙 Loved it</button>
        <button class="mood" data-m="Confused">🤔 Confused</button>
        <button class="mood" data-m="Idea">💡 Idea</button>
        <button class="mood" data-m="Fix this">✂️ Fix this</button>
      </div>
      <label>Paste the exact line it's about (optional, but gold)</label>
      <input type="text" class="fb-quote" placeholder="“…”">
      <label>Your notes</label>
      <textarea class="fb-msg" placeholder="Say anything. Seriously."></textarea>
      <button class="send-btn" ${wired ? "" : "disabled"}>Send to Dad 🌊</button>
      <div class="fb-result"></div>
    </div>`;
  }
  function wireFeedback(root) {
    root.querySelectorAll(".feedback").forEach(box => {
      box.querySelectorAll(".mood").forEach(m => m.addEventListener("click", () => m.classList.toggle("on")));
      const btn = box.querySelector(".send-btn");
      btn.addEventListener("click", async () => {
        const payload = {
          category: box.dataset.cat, page: box.dataset.page,
          pageTitle: decodeURIComponent(box.dataset.title),
          who: box.querySelector(".fb-who").value.trim() || "Anonymous",
          moods: [...box.querySelectorAll(".mood.on")].map(m => m.dataset.m),
          quote: box.querySelector(".fb-quote").value.trim(),
          message: box.querySelector(".fb-msg").value.trim(),
          url: location.href, when: new Date().toISOString()
        };
        const out = box.querySelector(".fb-result");
        if (!payload.message && !payload.quote && payload.moods.length === 0) {
          out.innerHTML = `<p class="send-err">Write a little something first 💙</p>`; return;
        }
        btn.disabled = true; btn.textContent = "Sending…";
        try {
          const res = await fetch(C.appsScriptUrl, {
            method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });
          out.innerHTML = res.ok
            ? `<p class="send-ok">Sent! Dad's been notified. 🌊</p>`
            : `<p class="send-err">Hmm, that didn't go through. Tell Dad.</p>`;
          if (res.ok) {
            box.querySelector(".fb-msg").value = ""; box.querySelector(".fb-quote").value = "";
            box.querySelectorAll(".mood.on").forEach(m => m.classList.remove("on"));
          }
        } catch (e) { out.innerHTML = `<p class="send-err">Couldn't reach the feedback service. Tell Dad.</p>`; }
        btn.disabled = false; btn.textContent = "Send to Dad 🌊";
      });
    });
  }

  /* ---------- shared bits ---------- */
  function glowDots(n) {
    let dots = "";
    for (let i = 0; i < n; i++) {
      const x = 4 + Math.random() * 92, y = 30 + Math.random() * 65, r = 1.5 + Math.random() * 3;
      dots += `<span class="glow-dot" style="left:${x}%;top:${y}%;width:${r * 2}px;height:${r * 2}px;animation-delay:${(Math.random() * 6).toFixed(1)}s;animation-duration:${(5 + Math.random() * 5).toFixed(1)}s"></span>`;
    }
    return dots;
  }
  function pageHead(kicker, title, sub) {
    return `<div class="page-head"><div class="rays"></div>${glowDots(7)}
      <div class="wrap">
        <span class="depth-tag">${kicker}</span>
        <h1>${title}</h1>
        ${sub ? `<p class="sub">${sub}</p>` : ""}
      </div></div>`;
  }
  function charCard(ch, delay) {
    const mystery = !ch.file;
    return `<a class="card ${mystery ? "mystery" : ""} reveal ${delay || ""}" href="#/character/${ch.id}">
      ${portrait(ch.art, 88)}
      <span class="tag">${ch.group}</span>
      <h3>${ch.name}</h3>
      <span class="role">${ch.role}</span>
    </a>`;
  }

  /* ---------- views ---------- */
  function viewHome() {
    const featured = ["nerai", "iggy", "phorcys", "pet"]
      .map(id => C.characters.find(c => c.id === id)).filter(Boolean);
    app.innerHTML = `
    <div class="descent">
      <div class="hero">
        <div class="rays"></div>
        ${glowDots(14)}
        <span class="badge">A book is surfacing · by Abby &amp; Dad</span>
        <h1>THE DEEP</h1>
        <p class="tagline">Every myth you've ever heard is a memory.<br><b>The oldest one is about to surface.</b></p>
        <div class="hero-cta">
          <a class="btn primary" href="#/chapter/prologue">Start reading</a>
          <a class="btn ghost" href="#descend" onclick="document.getElementById('descend').scrollIntoView({behavior:'smooth'});return false;">Begin the descent ↓</a>
        </div>
        <div class="scroll-hint">descend</div>
      </div>

      <div id="depthMeter" class="depth-meter"><span class="val">0 m</span><span class="line"></span><span style="opacity:.6">hadal</span></div>

      <section class="zone" id="descend">
        <div class="wrap">
          <span class="depth-tag reveal">0 m — the surface</span>
          <h2 class="reveal">There's a school on the coast<br>for kids the world <em>isn't supposed to know about.</em></h2>
          <p class="lead reveal d1">The fire-handed. The water-callers. The wind-listeners. The ones who can fold the dark around them like a coat. They've spent their whole lives being the world's best-kept secret.</p>
          <p class="lead reveal d2"><strong>They're not even close.</strong></p>
        </div>
      </section>

      <section class="zone">
        <div class="wrap">
          <span class="depth-tag reveal">200 m — where the light starts failing</span>
          <h2 class="reveal">You've heard the rumors.<br><em>Everyone has.</em></h2>
          <div class="clips">
            <div class="clip reveal d1" data-k="sonar log"><q>Shapes on the scan, in rows too straight to be anything the ocean did by itself.</q><span class="src">— laughed off the news, again</span></div>
            <div class="clip reveal d2" data-k="eyewitness"><q>I know what I saw. I always knew what I saw.</q><span class="src">— a fisherman, eleven years too early</span></div>
            <div class="clip reveal d3" data-k="tide report"><q>The sea pulled back in the night. And it did not come back.</q><span class="src">— where the story begins</span></div>
          </div>
        </div>
      </section>

      <div class="sea-strip">${leviathanSVG()}</div>

      <section class="zone">
        <div class="wrap">
          <span class="depth-tag reveal">4,000 m — the midnight zone</span>
          <h2 class="reveal">Long before the first human stood up,<br>the first people were <em>already old.</em></h2>
          <p class="lead reveal d1">They never left the water. They grew their cities instead of building them, down where no light has ever reached — and they kept one law above every other: <strong>do not interrupt.</strong> Let the surface become whatever it's going to become.</p>
          <p class="lead reveal d2">They kept that law for twelve thousand years. Some of them want to keep it forever. Some of them say it's finally, at long last, <em>time.</em></p>
          <p class="lead reveal d3">And something down there — something nobody talks about — has started to fail.</p>
        </div>
      </section>

      <section class="zone">
        <div class="wrap">
          <span class="depth-tag reveal">10,914 m — the trench</span>
          <div class="feature">
            <div class="reveal">${portrait("nerai", 190, "portrait-lg")}</div>
            <div style="flex:1;min-width:260px">
              <h2 class="reveal">One girl was born<br>in the year the deep <em>first shivered.</em></h2>
              <p class="lead reveal d1">Fifteen. Sent ashore. Hidden in the school for three hundred and four days, never once told whether she was sent up to come home again — or simply sent away. Homesick for both sides of the water. Believer of exactly none of the official stories.</p>
              <blockquote class="reveal d2">"They're mine," she said.</blockquote>
            </div>
          </div>
        </div>
      </section>

      <section class="zone">
        <div class="wrap">
          <span class="depth-tag reveal">the cast</span>
          <h2 class="reveal">The people in it.<br><em>Some of them are waiting for you, Abby.</em></h2>
          <div class="cast-grid">${featured.map((c, i) => charCard(c, "d" + Math.min(i, 3))).join("")}</div>
          <p class="reveal" style="margin-top:1.4rem"><a href="#/characters">Meet everyone →</a></p>
        </div>
      </section>

      <section class="final">
        ${glowDots(10)}
        <span class="depth-tag reveal">chapter one</span>
        <h2 class="reveal">The sea is about to step back.</h2>
        <p class="reveal d1">Prologue and three chapters are waiting — with a feedback box on every page that goes straight to Dad. Be ruthless.</p>
        <div class="hero-cta reveal d2">
          <a class="btn primary" href="#/chapter/prologue">Read the Prologue</a>
          <a class="btn ghost" href="#/book">See all chapters</a>
        </div>
      </section>
    </div>`;
    initScrollFX();
  }

  function viewBook() {
    const p = C.book.prologue;
    const items = [`
      <a class="chap-item reveal" href="#/chapter/prologue">
        <span class="num">✦</span>
        <span class="t"><b>${p.title}</b><span class="status">${p.status}</span></span>
        <span class="go">→</span>
      </a>`];
    C.book.chapters.forEach((ch, i) => {
      items.push(`<a class="chap-item reveal" href="#/chapter/${ch.num}">
        <span class="num">${ch.num}</span>
        <span class="t"><b>${ch.title}</b><span class="status">${ch.status} — ready for your notes</span></span>
        <span class="go">→</span>
      </a>`);
    });
    C.book.upcoming.forEach(ch => {
      items.push(`<div class="chap-item soon reveal">
        <span class="num">${ch.num}</span>
        <span class="t"><b>${ch.title}</b><span class="status">not written yet</span></span>
      </div>`);
    });
    app.innerHTML = pageHead("the manuscript", "The Book", "Chapters surface here as they're drafted. “Draft 1” means brand-new clay — the perfect time to bend it.") +
      `<div class="page-body"><div class="wrap"><div class="chap-list">${items.join("")}</div></div></div>`;
    initScrollFX();
  }

  async function viewChapter(id) {
    app.innerHTML = `<div class="loading"><span class="ripple"></span>Descending…</div>`;
    try {
      let title, status, body, prev = null, next = null, kicker;
      if (id === "prologue") {
        const p = C.book.prologue;
        title = p.title; status = p.status; kicker = "before chapter one";
        body = await fetchMd(p.source);
        next = { href: "#/chapter/1", label: "Chapter One →" };
      } else {
        const num = parseInt(id, 10);
        const meta = C.book.chapters.find(c => c.num === num);
        if (!meta) throw new Error("No such chapter");
        title = meta.title; status = meta.status; kicker = "chapter " + num;
        body = await getChapter(num);
        prev = num === 1 ? { href: "#/chapter/prologue", label: "← Prologue" } : { href: `#/chapter/${num - 1}`, label: `← Chapter ${num - 1}` };
        if (C.book.chapters.find(c => c.num === num + 1)) next = { href: `#/chapter/${num + 1}`, label: `Chapter ${num + 1} →` };
      }
      app.innerHTML = pageHead(kicker, title, "") +
        `<div class="page-body"><div class="wrap">
          <div class="reader">
            <div class="reader-head"><span class="badge">${status}</span></div>
            <div class="prose">${md(body)}</div>
          </div>
          <div class="pager">
            <span>${prev ? `<a href="${prev.href}">${prev.label}</a>` : ""}</span>
            <span>${next ? `<a href="${next.href}">${next.label}</a>` : ""}</span>
          </div>
          ${feedbackForm("Book", id === "prologue" ? "Prologue" : "Chapter-" + id, title)}
        </div></div>`;
      wireFeedback(app);
      initScrollFX();
      window.scrollTo(0, 0);
    } catch (e) {
      app.innerHTML = `<div class="loading">Couldn't load that chapter. (${e.message})</div>`;
    }
  }

  function viewCharacters() {
    const groups = {};
    C.characters.forEach(ch => { (groups[ch.group] = groups[ch.group] || []).push(ch); });
    let html = "";
    Object.entries(groups).forEach(([g, list]) => {
      html += `<div class="group-label reveal">${g}</div>
        <div class="cast-grid">${list.map((c, i) => charCard(c, "d" + Math.min(i, 3))).join("")}</div>`;
    });
    app.innerHTML = pageHead("the cast", "Characters", "Every page here is a workspace, not just a bio. The dashed cards are waiting for you, Abby — they're yours to invent.") +
      `<div class="page-body"><div class="wrap">${html}</div></div>`;
    initScrollFX();
  }

  async function viewCharacter(id) {
    const ch = C.characters.find(c => c.id === id);
    if (!ch) { app.innerHTML = `<div class="loading">No such character.</div>`; return; }
    let bodyHtml = "";
    if (ch.file) {
      app.innerHTML = `<div class="loading"><span class="ripple"></span>Descending…</div>`;
      try { bodyHtml = `<div class="reader reveal"><div class="prose">${md(await fetchMd(ch.file))}</div></div>`; }
      catch (e) { bodyHtml = `<p class="dim">Couldn't load this character's file.</p>`; }
    }
    const oq = (ch.openQuestions || []).map(q => `<li>${q}</li>`).join("");
    app.innerHTML = pageHead(ch.group, ch.name, ch.role) +
      `<div class="page-body"><div class="wrap">
        <div class="char-hero reveal">${portrait(ch.art, 150)}
          <div><p class="role-line">${ch.file ? "The full working file — everything we know so far. It changes as the book grows." : "Not written yet. That's the point — see the questions below."}</p></div>
        </div>
        ${bodyHtml}
        ${oq ? `<div class="workspace reveal"><h3>Open questions — have at it</h3><ul>${oq}</ul></div>` : ""}
        ${feedbackForm("Characters", ch.name.replace(/[^\w]+/g, "-"), ch.name)}
      </div></div>`;
    wireFeedback(app);
    initScrollFX();
    window.scrollTo(0, 0);
  }

  function viewAbout() {
    app.innerHTML = pageHead("the crew", "How We Work", "Three of us. One book. No preciousness.") +
      `<div class="page-body"><div class="wrap">
        <div class="reader reveal"><div class="prose">
          <p>This book is written by three of us: <strong>Abby</strong> (ideas, taste, and the veto), <strong>Dad</strong> (editing, direction, and the other veto), and <strong>Claude</strong> (drafting and worldbuilding). First drafts are clay. Nothing is precious. The lessons we learn get written down and kept, even when the pages don't.</p>
          <p><em>House rules:</em> read <em>with</em> the reader, never at them. One close point of view. Drip, don't dump. Feeling lives in things — keys, sleeves, held doors — never in labels. Let characters be wrong. Find her biggest fear and make it come true <span class="dim">(that last one is Abby's rule)</span>.</p>
          <p>Every chapter and character page has a feedback box at the bottom. It writes to Dad directly. Use it ruthlessly.</p>
        </div></div>
        ${feedbackForm("Site", "General", "General / the site itself")}
      </div></div>`;
    wireFeedback(app);
    initScrollFX();
  }

  /* ---------- router ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [page, arg] = h.split("/");
    document.querySelectorAll(".topbar nav a").forEach(a => a.classList.remove("active"));
    const mark = sel => { const el = document.querySelector(`.topbar nav a[href="${sel}"]`); if (el) el.classList.add("active"); };
    if (!page) { viewHome(); }
    else if (page === "book") { viewBook(); mark("#/book"); }
    else if (page === "chapter") { viewChapter(arg); mark("#/book"); }
    else if (page === "characters") { viewCharacters(); mark("#/characters"); }
    else if (page === "character") { viewCharacter(arg); mark("#/characters"); }
    else if (page === "about") { viewAbout(); mark("#/about"); }
    else { viewHome(); }
  }

  window.addEventListener("hashchange", route);
  initSettings();
  route();
})();
