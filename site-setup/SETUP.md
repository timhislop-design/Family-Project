# The Deep — Website Setup (one-time, ~30 minutes)

The site is fully built and lives in this folder structure:
- `index.html` (repo root) — the site
- `site/` — styles, app code, and `config.js` (one thing to paste in later)
- `robots.txt` — tells search engines to ignore the site
- `site-setup/apps-script.gs` — the feedback receiver code for Google

It reads the actual book files (`projects/the-deep/*.md`) directly — publish a chapter by saving the file and pushing. No copying, no rebuilding.

---

## Part 1 — Get the repo on GitHub (~10 min)

1. Install **GitHub Desktop** (desktop.github.com) and sign in.
2. File → **Add local repository** → choose the `Family Project` folder. It will offer to create a repository — accept.
   - *OneDrive note:* git + OneDrive coexist fine for a solo project, but if OneDrive ever complains about sync conflicts on the `.git` folder, tell Claude and we'll move the repo out.
3. Commit everything ("first commit — the library"), then **Publish repository**.
4. **The one decision:** GitHub Pages on a FREE account only works from **public** repos. Options:
   - **Public repo** — free; anyone who guesses the URL could read the notes and chapters. It's unlisted and non-indexed, but public is public.
   - **GitHub Pro (~$4/mo)** — repo stays **private**, the website is still publicly viewable at its URL. Best match for "unlisted": the notes/files are hidden, only the rendered site is exposed.
   - Recommendation: **Pro** — this is Abby's unpublished book.

## Part 2 — Turn on the website (~2 min)

1. On github.com, open the repo → **Settings → Pages**.
2. Under "Build and deployment": Source = **Deploy from a branch**, Branch = **main**, Folder = **/ (root)**. Save.
3. Wait ~2 minutes. Your site is at `https://<your-username>.github.io/<repo-name>/`.
4. Open it and check: home page, a chapter, a character page. (Feedback will show "not wired yet" — that's Part 3.)

## Part 3 — Wire feedback to your Drive (~15 min)

1. Go to **script.google.com** → **New project** (sign in as tim.hislop@gmail.com).
2. Delete the placeholder code; paste in everything from `site-setup/apps-script.gs`. Name the project "The Deep Feedback".
3. Click **Deploy → New deployment** → gear icon → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**  ← required so Abby doesn't need to log in
4. Authorize when prompted (it wants Drive + Docs + email access — that's the point). You may need to click "Advanced → Go to The Deep Feedback (unsafe)" — it's your own script, it's fine.
5. **Copy the Web app URL** it gives you.
6. Open `site/config.js` and paste the URL into the quotes:
   `appsScriptUrl: "https://script.google.com/macros/s/…/exec",`
7. Commit + push. Done.

### What happens per feedback
- A Google Doc appears in **My Drive → The Deep — Feedback → Book/Chapter-2/** (etc.)
- You get an **email immediately** with the full contents + a link to the Doc. (No need for Drive folder watches — the email IS the watch, and it's more reliable.)
- In future sessions, Claude can read that Drive folder directly and fold Abby's feedback into the project.

## Part 4 — Test (~3 min)
1. Open the live site → any chapter → fill the feedback box → Send.
2. Check your email and the Drive folder.
3. Send Abby the link. 🌊

---

## Ongoing workflow
- **New chapter drafted** → Claude updates `site/config.js` chapter list (one line) → push → it's live.
- **Character file added** → same, one config entry.
- Site content = the real project markdown. There is no second copy of anything.

## If something breaks
Tell Claude: "the site isn't loading chapter X" / "feedback isn't arriving" — everything is plain files in this repo, nothing is hidden in a build system.
