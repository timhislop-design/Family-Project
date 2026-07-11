// THE DEEP — site configuration
// After setting up the Apps Script (see site-setup/SETUP.md), paste its web-app URL below:
window.DEEP = {
  appsScriptUrl: "", // <-- paste here, keep the quotes

  book: {
    storySource: "projects/the-deep/story.md",
    prologue: { id: "prologue", title: "Prologue — before Chapter One", source: "projects/the-deep/world-frame.md", status: "Draft 4" },
    chapters: [
      { num: 1, title: "Dry Land", status: "Draft 5" },
      { num: 2, title: "The Secret Out", status: "Draft 1" },
      { num: 3, title: "Her Father's Face", status: "Draft 1" }
    ],
    upcoming: [
      { num: 4, title: "The Deep Answers" },
      { num: 5, title: "The Quiet School" },
      { num: 6, title: "Enrollment" },
      { num: 7, title: "Mine" },
      { num: 8, title: "The Myth Unit — Act II begins" }
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
      role: "Human firelighter. Knocks twice and opens the door anyway. Keeps secrets loudly.",
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
