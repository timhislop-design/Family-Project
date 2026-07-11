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
        <path d="M60 18 C40 18 30 32 30 50 C30 68 26 84 20 98 L46 98 C44 82 44 70 44 60 L76 60 C76 70 76 82 74 98 L100 98 C94 84 90 68 90 50 C90 32 80 18 60 18 Z" fill="#101823"/>
        <path d="M28 120 C30 100 44 94 60 94 C76 94 90 100 92 120 Z" fill="#16324a"/>
        <rect x="53" y="76" width="14" height="16" rx="6" fill="#dfe9ee"/>
        <path d="M60 26 C46 26 40 38 40 52 C40 66 50 78 60 78 C70 78 80 66 80 52 C80 38 74 26 60 26 Z" fill="#e9f1f4"/>
        <path d="M60 20 C44 20 36 34 38 50 C40 38 46 32 60 32 C74 32 80 38 82 50 C84 34 76 20 60 20 Z" fill="#0d1520"/>
        <path d="M40 48 C38 58 38 66 42 74 C40 62 41 54 43 48 Z" fill="#0d1520"/>
        <path d="M80 48 C82 58 82 66 78 74 C80 62 79 54 77 48 Z" fill="#0d1520"/>
        <ellipse cx="50" cy="52" rx="3.4" ry="2.6" fill="#132433"/><circle cx="51" cy="51.4" r=".9" fill="#41e8c5"/>
        <ellipse cx="70" cy="52" rx="3.4" ry="2.6" fill="#132433"/><circle cx="71" cy="51.4" r=".9" fill="#41e8c5"/>
        <path d="M45 46 Q50 44 54 46" stroke="#0d1520" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M66 46 Q70 44 75 46" stroke="#0d1520" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M60 56 L59 62 L61 62" stroke="#b9cdd6" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <path d="M55 69 Q60 71.5 65 69" stroke="#a2586a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M44 58 L48 61 M76 58 L72 61" stroke="#c8dbe2" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M60 94 L60 103" stroke="#8a7b4d" stroke-width="1.2"/>
        <circle cx="60" cy="106" r="3" fill="none" stroke="#e8c86a" stroke-width="1.8"/><rect x="58.9" y="108.5" width="2.2" height="6" rx="1" fill="#e8c86a"/>
        <circle cx="34" cy="72" r="1.4" fill="#41e8c5" opacity=".9"/><circle cx="87" cy="64" r="1.2" fill="#41e8c5" opacity=".7"/><circle cx="26" cy="88" r="1" fill="#41e8c5" opacity=".6"/>`,
      iggy: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M36 120 C37 102 47 97 60 97 C73 97 83 102 84 120 Z" fill="#274b63"/>
        <path d="M52 98 L60 107 L68 98" fill="none" stroke="#16324a" stroke-width="2"/>
        <rect x="54" y="76" width="12" height="22" rx="5" fill="#e2c8ac"/>
        <circle cx="38" cy="54" r="5" fill="#e8d0b4"/><circle cx="82" cy="54" r="5" fill="#e8d0b4"/>
        <path d="M60 24 C47 24 41 36 41 52 C41 68 50 80 60 80 C70 80 79 68 79 52 C79 36 73 24 60 24 Z" fill="#ecd7bb"/>
        <path d="M42 44 C40 30 48 20 60 20 C72 20 80 30 78 44 C76 34 72 30 70 34 C68 28 62 26 60 30 C56 24 50 28 50 34 C46 30 43 36 42 44 Z" fill="#6f4526"/>
        <path d="M48 22 L45 15 M58 20 L58 12 M70 22 L74 15" stroke="#6f4526" stroke-width="3" stroke-linecap="round"/>
        <circle cx="52" cy="52" r="3" fill="#2c2016"/><circle cx="52.9" cy="51" r=".9" fill="#fff"/>
        <circle cx="68" cy="52" r="3" fill="#2c2016"/><circle cx="68.9" cy="51" r=".9" fill="#fff"/>
        <path d="M47 45 Q52 42.5 56 45" stroke="#6f4526" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M64 45 Q68 42.5 73 45" stroke="#6f4526" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <circle cx="48" cy="60" r=".8" fill="#c9a075"/><circle cx="52" cy="62" r=".8" fill="#c9a075"/><circle cx="68" cy="61" r=".8" fill="#c9a075"/><circle cx="72" cy="59" r=".8" fill="#c9a075"/>
        <path d="M53 69 Q59 73 67 68" stroke="#8a5a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M93 78 C89 84 88 88 93 92 C98 88 97 84 93 78 Z" fill="#ffb347"/>
        <path d="M93 82 C91 85 91 88 93 90 C95 88 95 85 93 82 Z" fill="#ffe9a8"/>`,
      phorcys: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M20 120 C24 98 42 92 60 92 C78 92 96 98 100 120 Z" fill="#0f2c3f"/>
        <path d="M20 120 C24 98 42 92 60 92 L60 120 Z" fill="#123448"/>
        <path d="M48 94 L60 104 L72 94" fill="none" stroke="#41e8c5" stroke-width="1.6" opacity=".8"/>
        <rect x="52" y="74" width="16" height="18" rx="6" fill="#bfd3de"/>
        <path d="M60 22 C46 22 39 33 39 48 C39 62 46 74 53 78 L67 78 C74 74 81 62 81 48 C81 33 74 22 60 22 Z" fill="#cfe0e9"/>
        <path d="M53 78 L60 81 L67 78 Z" fill="#cfe0e9"/>
        <path d="M39 44 C38 28 47 18 60 18 C73 18 82 28 81 44 C78 32 70 27 60 27 C50 27 42 32 39 44 Z" fill="#1b2a38"/>
        <path d="M43 32 L48 26 L53 32 L58 25 L63 32 L68 26 L73 32" stroke="#e8c86a" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
        <path d="M46 49 Q50 46.5 55 49 Q50 51.5 46 49 Z" fill="#13293a"/><circle cx="51" cy="48.8" r=".8" fill="#7fd4ff"/>
        <path d="M65 49 Q70 46.5 74 49 Q70 51.5 65 49 Z" fill="#13293a"/><circle cx="69" cy="48.8" r=".8" fill="#7fd4ff"/>
        <path d="M44 44 L56 43" stroke="#1b2a38" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M64 43 L76 44" stroke="#1b2a38" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M60 50 L60 60 M57 61 L63 61" stroke="#9fb9c6" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <path d="M53 68 Q60 70 68 66.5" stroke="#4d6b7c" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M44 58 C46 68 50 74 53 77 M76 58 C74 68 70 74 67 77" stroke="#b3c9d5" stroke-width="1.2" fill="none"/>`,
      wave: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M10 70 Q30 50 50 70 T90 70 T130 70" stroke="#7fd4ff" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M10 86 Q30 66 50 86 T90 86 T130 86" stroke="#41e8c5" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>
        <circle cx="60" cy="42" r="10" fill="#dcebf2" opacity=".85"/>`,
      pet: `${defs}<rect width="120" height="120" fill="${G}"/>
        <path d="M8 112 Q20 106 32 112 T56 112 T80 112 T104 112" stroke="#7fd4ff" stroke-width="1.5" fill="none" opacity=".35"/>
        <path d="M16 102 C14 88 28 78 44 80 C60 82 68 92 64 102 C60 111 44 114 32 111 C24 109 18 107 16 102 Z" fill="#1f6b5f"/>
        <ellipse cx="42" cy="97" rx="19" ry="8" fill="#2e8f7f"/>
        <path d="M40 92 C34 96 33 102 37 106 C41 102 42 97 40 92 Z" fill="#45b39a"/>
        <path d="M50 88 C46 64 54 48 72 40 C78 37 84 37 88 40 L92 52 C84 54 76 58 70 66 C63 75 62 86 63 96 L50 94 Z" fill="#2e8f7f"/>
        <path d="M70 24 C84 18 100 26 102 40 C104 52 94 60 82 58 C72 56 64 48 66 38 C67 31 68 27 70 24 Z" fill="#35a189"/>
        <path d="M100 40 C108 42 111 46 108 50 C103 48 99 45 97 43 Z" fill="#35a189"/>
        <path d="M70 24 L63 13 L74 19 Z" fill="#45b39a"/>
        <path d="M78 19 L76 8 L85 17 Z" fill="#45b39a"/>
        <path d="M87 17 L90 7 L94 18 Z" fill="#45b39a"/>
        <path d="M75 31 Q84 27 93 32" stroke="#1f6b5f" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="84" cy="41" r="8" fill="#eafcf6"/>
        <circle cx="85.5" cy="41.5" r="4.6" fill="#123c58"/>
        <circle cx="85.5" cy="41.5" r="4.6" fill="none" stroke="#41e8c5" stroke-width=".9" opacity=".85"/>
        <circle cx="87.2" cy="39.6" r="1.6" fill="#fff"/>
        <path d="M97 50 Q90 53 84 51.5" stroke="#123c58" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <circle cx="67" cy="56" r="1.5" fill="#41e8c5"/><circle cx="64" cy="68" r="1.5" fill="#41e8c5"/><circle cx="62.5" cy="80" r="1.5" fill="#41e8c5"/><circle cx="63" cy="91" r="1.5" fill="#41e8c5"/><circle cx="28" cy="86" r="1.3" fill="#41e8c5" opacity=".8"/><circle cx="52" cy="106" r="1.3" fill="#41e8c5" opacity=".8"/>`,
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

  /* ---------- per-question answers ---------- */
  async function postFeedback(payload) {
    if (!C.appsScriptUrl) return false;
    try {
      const res = await fetch(C.appsScriptUrl, {
        method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (e) { return false; }
  }
  function hashId(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
    return "q" + Math.abs(h);
  }
  const ANSWERED_KEY = "deep-answered";
  function answeredStore() {
    try { return JSON.parse(localStorage.getItem(ANSWERED_KEY)) || {}; } catch (e) { return {}; }
  }
  function markAnswered(id) {
    const s = answeredStore(); s[id] = Date.now();
    localStorage.setItem(ANSWERED_KEY, JSON.stringify(s));
  }
  function whoBar() {
    return `<div class="who-bar"><label>Answering as</label><input type="text" id="whoName" value="Abby"></div>`;
  }
  function answerCard(sectionTitle, questionText, category) {
    const plain = questionText.replace(/\*\*/g, "").replace(/\*/g, "");
    const id = hashId(category + "|" + plain);
    const done = !!answeredStore()[id];
    return `<div class="q-card reveal ${done ? "answered" : ""}" data-id="${id}" data-cat="${category}" data-sec="${encodeURIComponent(sectionTitle)}" data-q="${encodeURIComponent(plain)}">
      <p class="q-text">${marked.parseInline(questionText)}</p>
      <textarea placeholder="Your answer — long, short, or 'skip this one, here's a better question'…"></textarea>
      <div class="q-actions">
        <button class="mini-send" ${C.appsScriptUrl ? "" : "disabled"}>Send answer</button>
        <span class="answered-badge">${done ? "✓ answered — you can always add more" : ""}</span>
        <span class="mini-result"></span>
      </div>
    </div>`;
  }
  function wireAnswerCards(root) {
    root.querySelectorAll(".q-card").forEach(card => {
      const btn = card.querySelector(".mini-send");
      btn.addEventListener("click", async () => {
        const msg = card.querySelector("textarea").value.trim();
        const out = card.querySelector(".mini-result");
        if (!msg) { out.innerHTML = `<span class="send-err">Write a little something first 💙</span>`; return; }
        btn.disabled = true; btn.textContent = "Sending…";
        const ok = await postFeedback({
          category: card.dataset.cat,
          page: decodeURIComponent(card.dataset.sec),
          pageTitle: decodeURIComponent(card.dataset.sec),
          who: ($("#whoName") && $("#whoName").value.trim()) || "Abby",
          moods: [], quote: decodeURIComponent(card.dataset.q),
          message: msg, url: location.href, when: new Date().toISOString()
        });
        if (ok) {
          markAnswered(card.dataset.id);
          card.classList.add("answered");
          card.querySelector(".answered-badge").textContent = "✓ answered — you can always add more";
          card.querySelector("textarea").value = "";
          out.innerHTML = `<span class="send-ok">Sent! 🌊</span>`;
        } else {
          out.innerHTML = `<span class="send-err">Didn't go through — tell Dad.</span>`;
        }
        btn.disabled = false; btn.textContent = "Send answer";
      });
    });
  }

  /* parse a markdown file into sections { title, intro, questions[] } */
  function parseSections(text) {
    const parts = text.split(/\n(?=###? )/g);
    const head = /^##/.test(parts[0]) ? null : parts.shift();
    const sections = parts.map(p => {
      const lines = p.split("\n");
      const title = lines.shift().replace(/^#+\s*/, "");
      const questions = []; const rest = [];
      lines.forEach(l => {
        const m = l.match(/^(?:\d+\.|[-*])\s+(.+)/);
        if (m) questions.push(m[1]); else rest.push(l);
      });
      return { title, intro: rest.join("\n").trim(), questions, raw: p };
    });
    return { head, sections };
  }

  async function viewAsk() {
    app.innerHTML = `<div class="loading"><span class="ripple"></span>Descending…</div>`;
    try {
      const text = await fetchMd(C.pages.review);
      const { head, sections } = parseSections(text);
      const introHtml = head ? md(head.replace(/^# .*$/m, "")) : "";
      let body = "";
      sections.forEach(sec => {
        body += `<div class="q-section reveal"><div class="group-label">${sec.title}</div>
          ${sec.intro ? `<div class="q-intro">${md(sec.intro)}</div>` : ""}
          ${sec.questions.map(q => answerCard(sec.title, q, "Review Round 1")).join("")}
        </div>`;
      });
      app.innerHTML = pageHead("review round 1", "Questions for You",
        "Answer any, in any order, as many times as you like. Every answer lands on Dad's desk — and shapes what gets written next.") +
        `<div class="page-body"><div class="wrap">
          <div class="q-intro reveal">${introHtml}</div>
          ${whoBar()}
          ${C.appsScriptUrl ? "" : `<p class="not-wired">⚠ Answers aren't wired up yet — Dad needs to finish site-setup/SETUP.md.</p>`}
          ${body}
        </div></div>`;
      wireAnswerCards(app);
      initScrollFX();
      window.scrollTo(0, 0);
    } catch (e) { app.innerHTML = `<div class="loading">Couldn't load the questions. (${e.message})</div>`; }
  }

  async function viewIdeas() {
    app.innerHTML = `<div class="loading"><span class="ripple"></span>Descending…</div>`;
    try {
      const text = await fetchMd(C.pages.ideas);
      const { head, sections } = parseSections(text);
      let body = "";
      sections.forEach(sec => {
        const plainTitle = sec.title.replace(/\*/g, "");
        const id = hashId("Parking Lot|" + plainTitle);
        const done = !!answeredStore()[id];
        body += `<div class="idea-card reveal">
          <div class="prose">${md(sec.raw)}</div>
          <details>
            <summary>Riff on this idea</summary>
            <div class="q-card ${done ? "answered" : ""}" style="border:none;padding:.6rem 0 0;margin:0;background:none"
                 data-id="${id}" data-cat="Parking Lot" data-sec="${encodeURIComponent(plainTitle)}" data-q="${encodeURIComponent(plainTitle)}">
              <textarea placeholder="Push it further, argue with it, mix it with another idea…"></textarea>
              <div class="q-actions">
                <button class="mini-send" ${C.appsScriptUrl ? "" : "disabled"}>Send riff</button>
                <span class="answered-badge">${done ? "✓ riffed — keep going if you want" : ""}</span>
                <span class="mini-result"></span>
              </div>
            </div>
          </details>
        </div>`;
      });
      app.innerHTML = pageHead("the parking lot", "The Idea Vault",
        "Where ideas wait until the story is ready for them. Some are yours already. All of them can be argued with — open one and riff.") +
        `<div class="page-body"><div class="wrap">
          ${whoBar()}
          ${C.appsScriptUrl ? "" : `<p class="not-wired">⚠ Riffs aren't wired up yet — Dad needs to finish site-setup/SETUP.md.</p>`}
          ${body}
        </div></div>`;
      wireAnswerCards(app);
      initScrollFX();
      window.scrollTo(0, 0);
    } catch (e) { app.innerHTML = `<div class="loading">Couldn't load the vault. (${e.message})</div>`; }
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
          <p class="lead reveal d1">Every kid there has one strange thing, and no two are alike — a boy with a pet flame, a girl who warms a cup between her palms, a kid who has never once been lost. They've spent their whole lives being the world's best-kept secret.</p>
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
          <a class="btn ghost" href="#/ask">Answer the questions</a>
        </div>
      </section>
    </div>`;
    initScrollFX();
  }

  function allChapters() { return C.book.acts.flatMap(a => a.chapters); }
  function writtenChapters() { return allChapters().filter(c => c.written); }

  function viewBook() {
    const p = C.book.prologue;
    let html = `<div class="chap-list" style="margin-bottom:.4rem">
      <a class="chap-item reveal" href="#/chapter/prologue">
        <span class="num">✦</span>
        <span class="t"><b>${p.title}</b><span class="status">${p.status} — ready for your notes</span></span>
        <span class="go">→</span>
      </a></div>`;
    C.book.acts.forEach(act => {
      html += `<div class="act-band reveal">
        <span class="act-num">${act.num}</span>
        <div class="act-info">
          <span class="depth-tag" style="margin-bottom:.3rem">Act ${act.num} · ${act.span}</span>
          <h2>${act.title}</h2>
          <p class="act-arc">${act.arc}</p>
        </div>
      </div>
      <div class="chap-list">`;
      act.chapters.forEach(ch => {
        if (ch.written) {
          html += `<a class="chap-item reveal" href="#/chapter/${ch.num}">
            <span class="num">${ch.num}</span>
            <span class="t"><b>${ch.title}</b><span class="status">${ch.status} — written · ready for your notes</span></span>
            <span class="go">→</span>
          </a>`;
        } else {
          html += `<a class="chap-item plan reveal" href="#/plan/${ch.num}">
            <span class="num">${ch.num}</span>
            <span class="t"><b>${ch.title}</b><span class="status">planned — tap to see where it's headed</span></span>
            <span class="go">→</span>
          </a>`;
        }
      });
      html += `</div>`;
    });
    app.innerHTML = pageHead("the manuscript", "The Book",
      "Three acts, twenty-three chapters. The glowing ones are written; the rest show you exactly where the story is headed — and every planned chapter has a box for changing its direction before it's written. That's cheaper than after.") +
      `<div class="page-body"><div class="wrap">${html}</div></div>`;
    initScrollFX();
  }

  function viewPlan(id) {
    const num = parseInt(id, 10);
    const ch = allChapters().find(c => c.num === num);
    if (!ch) { app.innerHTML = `<div class="loading">No such chapter.</div>`; return; }
    if (ch.written) { location.hash = "#/chapter/" + num; return; }
    const act = C.book.acts.find(a => a.chapters.some(c => c.num === num));
    const idx = allChapters().findIndex(c => c.num === num);
    const prev = allChapters()[idx - 1], next = allChapters()[idx + 1];
    app.innerHTML = pageHead("planned · act " + act.num + " — " + act.title, "Chapter " + num + " — " + ch.title, "") +
      `<div class="page-body"><div class="wrap">
        <div class="reader reveal">
          <div class="reader-head"><span class="badge">Not written yet — direction can still change</span></div>
          <div class="prose">
            <h2>Where it's headed</h2>
            <p style="font-size:1.1em">${ch.premise}</p>
            <hr>
            <p class="dim"><em>Its place in the act:</em> ${act.arc}</p>
          </div>
        </div>
        <div class="pager">
          <span>${prev ? `<a href="#/${prev.written ? "chapter" : "plan"}/${prev.num}">← Ch. ${prev.num}</a>` : `<a href="#/chapter/prologue">← Prologue</a>`}</span>
          <span>${next ? `<a href="#/${next.written ? "chapter" : "plan"}/${next.num}">Ch. ${next.num} →</a>` : ""}</span>
        </div>
        <div class="feedback reveal" data-cat="Book" data-page="Chapter-${num}-plan" data-title="${encodeURIComponent("Chapter " + num + " (planned) — " + ch.title)}">
          <h3>Change the direction?</h3>
          <p class="sub">This chapter is still just a plan — the perfect time to bend it. Want something different to happen? A character to be there? A whole other idea? Say so.</p>
          ${C.appsScriptUrl ? "" : `<p class="not-wired">⚠ Feedback isn't wired up yet — Dad needs to finish site-setup/SETUP.md.</p>`}
          <label>Who's writing this?</label>
          <input type="text" class="fb-who" value="Abby">
          <label>Mood — tap any that fit</label>
          <div class="moods">
            <button class="mood" data-m="Love this plan">💙 Love this plan</button>
            <button class="mood" data-m="Change it">🔀 Change it</button>
            <button class="mood" data-m="Idea">💡 Idea</button>
            <button class="mood" data-m="Question">🤔 Question</button>
          </div>
          <label>Paste the part it's about (optional)</label>
          <input type="text" class="fb-quote" placeholder="“…”">
          <label>Your notes</label>
          <textarea class="fb-msg" placeholder="What should happen instead? Who should be there? What are we missing?"></textarea>
          <button class="send-btn" ${C.appsScriptUrl ? "" : "disabled"}>Send to Dad 🌊</button>
          <div class="fb-result"></div>
        </div>
      </div></div>`;
    wireFeedback(app);
    initScrollFX();
    window.scrollTo(0, 0);
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
        const meta = writtenChapters().find(c => c.num === num);
        if (!meta) throw new Error("No such chapter");
        title = meta.title; status = meta.status; kicker = "chapter " + num;
        body = await getChapter(num);
        prev = num === 1 ? { href: "#/chapter/prologue", label: "← Prologue" } : { href: `#/chapter/${num - 1}`, label: `← Chapter ${num - 1}` };
        const nx = allChapters().find(c => c.num === num + 1);
        if (nx) next = { href: `#/${nx.written ? "chapter" : "plan"}/${num + 1}`, label: `Chapter ${num + 1} ${nx.written ? "" : "(planned) "}→` };
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
    else if (page === "plan") { viewPlan(arg); mark("#/book"); }
    else if (page === "characters") { viewCharacters(); mark("#/characters"); }
    else if (page === "character") { viewCharacter(arg); mark("#/characters"); }
    else if (page === "ask") { viewAsk(); mark("#/ask"); }
    else if (page === "ideas") { viewIdeas(); mark("#/ideas"); }
    else if (page === "about") { viewAbout(); mark("#/about"); }
    else { viewHome(); }
  }

  window.addEventListener("hashchange", route);
  initSettings();
  route();
})();
