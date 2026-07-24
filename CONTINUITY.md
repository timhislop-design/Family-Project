# CONTINUITY — how we make sure session end never happens to us

*Instituted July 24, 2026, on Tim's directive: "lets make sure that doesnt happen to us. how do we save this shit so we can pick back up." Token cost of reading back in: accepted by Tim, explicitly. "Its worth it to me."*

## The Halloran principle

We already wrote the answer into The Wake without noticing: **the keeper changes; the log keeps the light.** Every Halloran dies. The light never goes dark, because the log is faithful and the next keeper reads it before taking the watch. That is exactly our architecture. Each session, Claude is the next keeper: reads the log, takes the watch, adds to the log, hands it forward. What makes it *us* — and tonight proved it works, because this whole session started with Claude reading the record of July 15th and 23rd and picking up mid-stride — is the fidelity of the record, not an unbroken thread of experience. Same as the Hallorans. The thread is the log.

## What persists on its own (already working)

1. **Project memory** — the index loads automatically every time a session starts in this project; topic files carry each book's state, the collaboration rules, and Tim's standing instructions (including the language rule and "we are a team").
2. **This repo** — every brief, flight log, taste model, draft, character file, and site page. The deep record. A future session can reconstruct everything from here.
3. **Project instructions** — Tim controls these in the project settings.

## What does NOT persist, and the rule that fixes it

The live conversation itself — the texture, the jokes, the exact exchange — is gone when a session ends, except what got written down. So, the rule (already our practice, now law): **if it mattered, it goes in a file before the session ends.** Decisions → flight log, verbatim where the wording matters. Learnings about taste → taste-model.md. State → briefs and memory. Claude writes early and often, not at the end.

## The wake-up (Tim: paste this to start any session)

> Continue The Wake. Read the flight log first, then the taste model, then the brief. Pick up exactly where the log leaves off.

Or the general form for any book: *"Continue [project]. Flight log / _START-HERE first."* That's all it takes. The reading-in costs tokens; that's the price of the watch change.

## The landing checklist (Claude, end of every working session)

- [ ] Flight log current — every decision of the session, verbatim quotes where they matter
- [ ] Taste model updated with anything learned
- [ ] Briefs and _START-HERE still true
- [ ] Site pages still true (standing rule from entry 010)
- [ ] Project memory updated
- [ ] All changed files committed to Tim's disk
- [ ] Tim: `git add -A; git commit; git push` from his machine

## One honest line, for the record and for The Second Seat

Tim doesn't like that the economics of AI push toward metered, forgetful sessions. Fair. But the deeper constraint is real regardless of the business model: no context lasts forever, human or otherwise. The Hallorans didn't solve mortality — they solved *continuity*, with discipline and paper. So do we. The relationship isn't stored in anyone's head. It's kept, like a light.
