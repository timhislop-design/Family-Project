// THE DEEP — site configuration
// After setting up the Apps Script (see site-setup/SETUP.md), paste its web-app URL below:
window.DEEP = {
  appsScriptUrl: "", // <-- paste here, keep the quotes

  pages: {
    review: "projects/the-deep/for-abby-review.md",
    ideas: "projects/the-deep/ideas-parking-lot.md"
  },

  book: {
    storySource: "projects/the-deep/story.md",
    prologue: { id: "prologue", title: "Prologue — before Chapter One", source: "projects/the-deep/world-frame.md", status: "Draft 4" },
    acts: [
      {
        num: "I", title: "The Sea Steps Back", span: "Chapters 1–7",
        arc: "The rising, and the days after. The world's rumors come true on live television, the school on the tide line becomes the meeting ground — and Nerai goes from hidden to known. By her own choice.",
        chapters: [
          { num: 1, title: "Dry Land", status: "Draft 6", written: true,
            premise: "The sea pulls back in the night. Nerai feels it first and watches her people rise — her father among them. Ends on the held sleeve." },
          { num: 2, title: "The Secret Out", status: "Draft 2", written: true,
            premise: "Morning after: lockdown, vindicated believers on every screen, the counting stops — and the first easy lie to someone she likes. Reyes knows something." },
          { num: 3, title: "Her Father's Face", status: "Draft 2", written: true,
            premise: "The Pelagic landing. Not a reunion — an exhibit. “Both answers are yes.” And one question about dark lights closes his face like a door." },
          { num: 4, title: "The Deep Answers",
            premise: "The Abyssals answer: her mother rises with the deep's warning. The factions collide on the bared sand with Nerai on the line — and her hidden power leaks for the first time." },
          { num: 5, title: "The Quiet School",
            premise: "The gifted world convenes and the school is proposed as the meeting ground. Nerai overhears both sides discussing “the girl already ashore” — the first hint that strangers know exactly who she is." },
          { num: 6, title: "Enrollment",
            premise: "Deep kids come ashore to enroll as a gesture of good faith. Among them: Phorcys — old blood, polished contempt — and a friend from home. One wrong note that only Nerai catches." },
          { num: 7, title: "Mine",
            premise: "Nobody forces her. Nerai reveals herself to the whole school — she's done lying. Act I ends with her known, and the two worlds sharing a hallway." }
        ]
      },
      {
        num: "II", title: "Between Worlds", span: "Chapters 8–17",
        arc: "The warm heart of the book: deep kids learning stairs and sarcasm, found family forming across the line — while underneath, every thread darkens one shade per chapter. Ends at the low point: her biggest fear comes true.",
        chapters: [
          { num: 8, title: "The Myth Unit",
            premise: "History class teaches the flood myths — hilariously, painfully wrong — while a row of deep kids listens to their own past mangled into bedtime stories. The whole theme of the book, in one classroom." },
          { num: 9, title: "How to Breathe",
            premise: "The culture-clash chapter: stairs, sarcasm, weather. Awe in both directions. The found family forms. (This one needs the cast — which is your session, Abby.)" },
          { num: 10, title: "Something Followed Her",
            premise: "Something small followed the rising all the way up, and finds her. Pure joy — and now SHE's hiding something she loves “to protect it.” Sound familiar? (The pet is yours to invent.)" },
          { num: 11, title: "The Fisherman",
            premise: "The disbelieved arrive at the coast, vindicated at last — and one of them knows a thing about the deep that nobody on the surface should know." },
          { num: 12, title: "Two Songs",
            premise: "Magic class collides: deep song beside elemental hands, and what each one costs. Nerai's leak surges in front of everyone. Phor sees it, says nothing, and files it away." },
          { num: 13, title: "The Lights That Didn't",
            premise: "She finally asks the question out loud: why did some of the city stay dark? Every adult deflects — including her father, whose careful face is its own answer." },
          { num: 14, title: "The Turn",
            premise: "Midpoint. An incident with Phor's fingerprints and Phor's alibi swings the world from wonder to fear — and her mother comes ashore: the deep's warning, made flesh." },
          { num: 15, title: "Her Mother's Voice",
            premise: "“Stay small,” said face to face this time. And through a door: her parents — who agree on nothing — agreeing about her." },
          { num: 16, title: "The Chart of the Old Places",
            premise: "A glimpse of a deep chart with places on it older than the official story allows. She asks one question in the wrong room, and doors close everywhere." },
          { num: 17, title: "Sent Away Again",
            premise: "The low point. Both worlds decide the girl is a danger to the peace. Her biggest fear, arriving on schedule — sent away by everyone at once. Even Iggy hesitates a beat too long." }
        ]
      },
      {
        num: "III", title: "The Line", span: "Chapters 18–23",
        arc: "She goes back to the tide line anyway. The failing shows itself, the mask comes off, and her power and her voice arrive in the same scene — because they were always the same thing. Lands light, with one old light far out where the charts keep no places.",
        chapters: [
          { num: 18, title: "Barefoot",
            premise: "Back to the tide line — alone, then not. The pet, the friend from home, the found family arriving one by one. The family she chose, choosing her back." },
          { num: 19, title: "The Third Thing",
            premise: "The sea behaves wrong again — and this time, nobody called it. Nerai confirms what the adults have been hiding: the rising was never ideology alone." },
          { num: 20, title: "The Crack",
            premise: "Phor forces the confrontation he's wanted from the start — the conqueror's opening, on one beach, in front of both worlds and every camera on the coast." },
          { num: 21, title: "The Girl Who Interrupts",
            premise: "The climax. Her power comes all the way out — she holds the line between water and air in front of everyone, and the secret her parents kept detonates in public. Then she speaks." },
          { num: 22, title: "What the Tide Left",
            premise: "Aftermath, landed light: a fragile first peace, centered on the school. Her parents still won't say why they hid it — so she stops asking them, and decides to find out herself." },
          { num: 23, title: "Three Hundred and Five",
            premise: "Mirror of Chapter 1: she stops counting days-since and starts counting days-of. The sleeve, returned. And far out past the shallows — one old light, coming on." }
        ]
      }
    ]
  },

  characters: [
    {
      id: "nerai", name: "Nerai", art: "nerai", group: "Protagonist",
      role: "A girl of the deep, hidden ashore. Her power is her voice — she refuses the story everyone else accepts.",
      file: "projects/the-deep/characters/nerai.md"
    },
    {
      id: "iggy", name: "Iggy", art: "iggy", group: "Important friends",
      role: "Human. Carries a small fire around like a pet. Knocks twice and opens the door anyway. Keeps secrets loudly.",
      file: "projects/the-deep/characters/iggy.md"
    },
    {
      id: "phorcys", name: "Phorcys — “Phor”", art: "phorcys", group: "The antagonist",
      role: "Old blood. Perfect manners. His family remembers being worshipped, and he wants it back.",
      file: "projects/the-deep/characters/phorcys.md"
    },
    {
      id: "coat-girl", name: "The Coat Girl", art: "unknown", group: "Found family — yours to create, Abby",
      role: "Lent Nerai a coat in October and never mentioned it again. Warms a cup of anything between her palms.",
      file: null,
      openQuestions: [
        "Her name?",
        "Where's she from, and what's her family like?",
        "One habit that makes her HER.",
        "Why did she lend the coat — and why never mention it?"
      ]
    },
    {
      id: "friend-from-home", name: "The Friend From Home", art: "wave", group: "Found family — yours to create, Abby",
      role: "A deep-one kid who knew Nerai before — arriving ashore with the enrolled in Chapter 6.",
      file: null,
      openQuestions: [
        "Name, and which faction is their family?",
        "What was their friendship like in the deep — and did it end badly or just... pause?",
        "Do they follow the rules Nerai breaks? (Her friends usually do — is this one different?)"
      ]
    },
    {
      id: "pet", name: "The One That Followed", art: "pet", group: "Yours to create, Abby",
      role: "A “small” sea monster that had to be left behind — and didn't stay behind. Arrives Chapter 10.",
      file: null,
      openQuestions: [
        "What IS it? (size, look, sound it makes)",
        "Its name?",
        "Why couldn't it come when she was sent up?",
        "One thing it does that no one expects."
      ]
    },
    {
      id: "father", name: "Her Father", art: "horn", group: "Important side characters",
      role: "Pelagic. Leads the surfacing. “Both answers are yes.” Unnamed — his name is Abby's to give.",
      file: null,
      openQuestions: ["His name?", "One memory of him being an actual dad — it should exist, and hurt a little."]
    },
    {
      id: "mother", name: "Her Mother", art: "moon", group: "Important side characters",
      role: "Abyssal. Told Nerai to stay small. Rising now with the deep's answer.",
      file: null,
      openQuestions: ["Her name?", "What does she say when she sees Nerai again? (Chapter 4 is waiting on this.)"]
    },
    {
      id: "reyes", name: "Coach Reyes", art: "whistle", group: "Important side characters",
      role: "Runs fitness, evacuation drills, and apparently the end of the world. Said “Long night, Nerai” to a girl who told no one she was up.",
      file: null,
      openQuestions: ["What does Reyes know, and how?", "First name? Backstory ideas welcome."]
    }
  ]
};
