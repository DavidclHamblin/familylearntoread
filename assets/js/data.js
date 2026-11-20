/* Family Learn to Read: stages, sound packs, school-scheme levels and settings shared by every page.
   src/build.py reads this file (with node), so it is the one source of truth. */
var FLR = window.FLR = window.FLR || {};

FLR.config = {
  // Waitlist sign-ups are emailed to hello@ via FormSubmit (formsubmit.co), the same as the other Family Presents sites.
  formEndpoint: "https://formsubmit.co/ajax/hello@familyboardbooks.com",
  email: "hello@familyboardbooks.com",
  foundingDiscount: 15,
  site: "https://www.familylearntoread.com",
  storybooks: "https://www.familystorybooks.co.uk",
  boardBooks: "https://www.familyboardbooks.com",
  umbrella: "https://www.ourfamilypresents.com",
  // Shared photo and cartoon service (the Family Board Books worker). Not used yet: stage 1 is a coming-soon site.
  api: "https://familyboardbooks-api.silent-forest-c98a.workers.dev",
  // Checkout opens later, through the shared Shopify store, with SKUs starting FLR-.
  shopify: { checkoutLive: false, skuPrefix: "FLR-" }
};

/* Shipping regions, the same as the other sites. Ordering is closed in both until checkout opens. */
FLR.regions = {
  uk: { id: "uk", label: "UK · £", name: "United Kingdom", currency: "£", notice: "" },
  eu: { id: "eu", label: "EU · €", name: "Europe", currency: "€", notice: "" }
};

/* Everything is sold in packs of 5 books, either printed or online only.
   Prices are in euros; UK prices in pounds come from the fixed table FLR.gbp, keyed by the euro price.
   Provisional until the printer quotes. Keep them the same as the prices in Shopify once products exist. */
FLR.prices = {
  printed: { name: "Printed pack", price: 45, what: "5 paperback books, posted to you",
             detail: "Five short paperback readers with your family as the characters, plus the online versions free." },
  online: { name: "Online pack", price: 19, what: "5 books to read on screen",
            detail: "The same five books on a private page, for a phone, tablet or computer. Yours to keep reading." },
  own: { name: "Write your own story", price: 12, what: "Added to a pack, per book",
         detail: "Tell us an idea and we write it at your child's stage, checked word by word. Coming after launch." }
};
FLR.gbp = { 45: 39, 19: 16, 12: 10 };

/* Our eight reading stages, each tied to a Book Band colour, a phonics phase and a school year.
   "sample" is a short passage for the free reading check: our own words, written to that stage. */
FLR.stages = [
  { n: 1, band: "Pink", color: "#F2A0C0", ink: "#1E1A33", phase: "Phase 2", year: "Reception", age: "4–5",
    text: "A few words a page", what: "First words made of simple sounds, like cat, sit and mum.",
    sample: "Sam and Mum sit on a mat." },
  { n: 2, band: "Red", color: "#EE4B2B", ink: "#fff", phase: "Phase 2", year: "Reception", age: "4–5",
    text: "One short line a page", what: "Short sentences with a few common words such as the and to.",
    sample: "Dad got the big red bag. Is the dog in it?" },
  { n: 3, band: "Yellow", color: "#FFC21A", ink: "#1E1A33", phase: "Phase 3", year: "Reception", age: "4–5",
    text: "One or two lines a page", what: "Two letters, one sound: ch, sh, th, ee, ai, ar and more.",
    sample: "Look at the fish in the pond. It has a long tail and it can see me!" },
  { n: 4, band: "Blue", color: "#16A6E3", ink: "#fff", phase: "Phases 3–4", year: "Reception to Year 1", age: "4–6",
    text: "Two or three lines a page", what: "Longer words with letters side by side, like stop, frog and jump.",
    sample: "Gran and Jess went to the farm. They had lunch on a big flat rock next to the stream." },
  { n: 5, band: "Green", color: "#1FB45A", ink: "#fff", phase: "Phases 4–5", year: "Year 1", age: "5–6",
    text: "Three or four lines a page", what: "New spellings of sounds, such as ay, ou and a-e, and simple speech.",
    sample: "Jake found a shiny shell on the beach. “Can I keep it?” he asked. Mum smiled and said yes." },
  { n: 6, band: "Orange", color: "#FF8A1F", ink: "#1E1A33", phase: "Phase 5", year: "Year 1", age: "5–6",
    text: "Up to five lines a page", what: "Longer stories with more description and a bit of suspense.",
    sample: "The wind blew so hard that Amy's kite flew up over the trees. She held the string tight and laughed as it danced in the sky." },
  { n: 7, band: "Turquoise", color: "#1BB8B0", ink: "#1E1A33", phase: "Phase 5", year: "Years 1–2", age: "5–7",
    text: "Short paragraphs", what: "Richer words, longer sentences and stories in several parts.",
    sample: "When the rain finally stopped, Leo and his sister pulled on their boots and splashed through every puddle in the garden, while their dog chased the ripples." },
  { n: 8, band: "Purple", color: "#8A3FD9", ink: "#fff", phase: "Phases 5–6", year: "Years 2–3", age: "6–7",
    text: "Short paragraphs", what: "Confident reading: longer stories, feelings and a little humour.",
    sample: "Nobody in the village believed a dragon lived on the hill, until Grandma noticed enormous footprints in her vegetable patch and a very polite note apologising for the missing carrots." }
];

/* Book Band colour -> our stage. Lilac books have no words, so they start at Stage 1;
   Gold and beyond are above our range, so they get Stage 8. */
FLR.bandStage = { Lilac: 1, Pink: 1, Red: 2, Yellow: 3, Blue: 4, "Light Blue": 4, Green: 5, Orange: 6, Turquoise: 7, Purple: 8, Gold: 8, White: 8, Lime: 8 };

/* School reading schemes and their levels, each converted to a Book Band.
   Names are shown as plain text only, to help parents find a stage. We are not connected with any publisher.
   Sources: each publisher's own level guides and school correlation charts (see the schemes page). */
FLR.schemes = [
  { id: "bands", name: "Book Band colours (most schools)", levels: [
    ["Lilac", "Lilac"], ["Pink", "Pink"], ["Red", "Red"], ["Yellow", "Yellow"], ["Blue", "Blue"], ["Green", "Green"],
    ["Orange", "Orange"], ["Turquoise", "Turquoise"], ["Purple", "Purple"], ["Gold or higher", "Gold"]] },
  { id: "ort", name: "Oxford Reading Tree (Oxford Levels)", levels: [
    ["Level 1", "Lilac"], ["Level 1+", "Pink"], ["Level 2", "Red"], ["Level 3", "Yellow"], ["Level 4", "Light Blue"],
    ["Level 5", "Green"], ["Level 6", "Orange"], ["Level 7", "Turquoise"], ["Level 8", "Purple"], ["Level 9 or higher", "Gold"]] },
  { id: "rwi", name: "Read Write Inc. Phonics", levels: [
    ["Sound blending books", "Pink"], ["Red Ditty books", "Red"], ["Green storybooks", "Yellow"], ["Purple storybooks", "Blue"],
    ["Pink storybooks", "Green"], ["Orange storybooks", "Orange"], ["Yellow storybooks", "Turquoise"], ["Blue storybooks", "Purple"],
    ["Grey storybooks", "Gold"]] },
  { id: "wandle", name: "Little Wandle Letters and Sounds Revised", levels: [
    ["Phase 2", "Pink"], ["Phase 3", "Yellow"], ["Phase 4", "Green"], ["Phase 5", "Orange"]] },
  { id: "bigcat", name: "Collins Big Cat", same: true },
  { id: "bugclub", name: "Bug Club", same: true }
];

/* Sound packs: 5 books, one sound each (or a small group for the very first sounds).
   Phases follow the usual order schools teach phonics in England. */
FLR.soundPacks = [
  { id: "p2", phase: "Phase 2", name: "First sounds", color: "#F2A0C0", sounds: ["s a t p", "i n m d", "g o c k ck", "e u r h b", "f ff l ll ss"] },
  { id: "p3a", phase: "Phase 3", name: "Two letters, one sound", color: "#FFC21A", sounds: ["ch", "sh", "th", "ng", "qu"] },
  { id: "p3b", phase: "Phase 3", name: "Long vowel sounds", color: "#FFC21A", sounds: ["ai", "ee", "igh", "oa", "oo"] },
  { id: "p3c", phase: "Phase 3", name: "More vowel sounds", color: "#FFC21A", sounds: ["ar", "or", "ur", "ow", "oi"] },
  { id: "p3d", phase: "Phase 3", name: "Sounds with r and more", color: "#FFC21A", sounds: ["ear", "air", "ure", "er", "oo (book)"] },
  { id: "p5a", phase: "Phase 5", name: "New spellings 1", color: "#1FB45A", sounds: ["ay", "ou", "ie", "ea", "oy"] },
  { id: "p5b", phase: "Phase 5", name: "New spellings 2", color: "#1FB45A", sounds: ["ir", "ue", "aw", "wh", "ph"] },
  { id: "p5c", phase: "Phase 5", name: "New spellings 3", color: "#1FB45A", sounds: ["ew", "oe", "au", "ey", "a-e"] },
  { id: "p5d", phase: "Phase 5", name: "Magic e", color: "#1FB45A", sounds: ["e-e", "i-e", "o-e", "u-e", "ow (snow)"] }
];

FLR.esc = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
};
