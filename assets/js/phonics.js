/* Family Learn to Read: the level checker.
   Decides whether every word in a story can be read at a stage: it splits each word into the letter groups
   (graphemes) taught so far, or finds it in the stage's tricky-word list, or it's a family name.
   Works in the browser (window.FLRPhonics) and in node (require), so stories are checked the same way
   when we write them (tools/check_stories.js) and, later, when a parent writes their own.

   Phase order and tricky words follow the usual order schools in England teach phonics in
   (Letters and Sounds 2007 phases). This is a spelling check, not a pronunciation check: a human still
   reads every story before it is printed. */
(function (root) {
  "use strict";

  var PHASES = {
    2: { graphemes: ["s", "a", "t", "p", "i", "n", "m", "d", "g", "o", "c", "k", "ck", "e", "u", "r", "h", "b", "f", "ff", "l", "ll", "ss"],
         tricky: ["the", "to", "no", "go", "i", "into", "of", "is", "his", "as", "has", "and"] },
    3: { graphemes: ["j", "v", "w", "x", "y", "z", "zz", "qu", "ch", "sh", "th", "ng", "ai", "ee", "igh", "oa", "oo", "ar", "or", "ur", "ow", "oi", "ear", "air", "ure", "er"],
         tricky: ["he", "she", "we", "me", "be", "was", "you", "they", "all", "are", "my", "her"] },
    4: { graphemes: [],
         tricky: ["said", "have", "like", "so", "do", "some", "come", "were", "there", "little", "one", "when", "out", "what"] },
    5: { graphemes: ["ay", "ou", "ie", "ea", "oy", "ir", "ue", "aw", "wh", "ph", "ew", "oe", "au", "ey", "a-e", "e-e", "i-e", "o-e", "u-e"],
         tricky: ["oh", "their", "people", "mr", "mrs", "looked", "called", "asked", "could", "water", "where", "who", "again", "thought", "through", "work", "mouse", "many", "laughed", "because", "different", "any", "eyes", "friends", "once", "please"] },
    6: { graphemes: [], tricky: [] }
  };

  /* What each of our stages allows. "blends": consonants side by side, like st, fr, mp (Phase 4).
     "words": the most words on one page; "sentence": the most words in one sentence. */
  var STAGES = {
    1: { phase: 2, blends: false, suffixes: ["s"], words: 8, sentence: 8 },
    2: { phase: 2, extra: ["j", "v", "w", "x", "y", "z", "zz", "qu", "ch", "sh", "th", "ng"], tricky3: true, blends: false, suffixes: ["s"], words: 12, sentence: 9 },
    3: { phase: 3, blends: false, suffixes: ["s"], words: 18, sentence: 11 },
    4: { phase: 4, blends: true, suffixes: ["s", "ing", "ed"], words: 22, sentence: 12 },
    5: { phase: 5, blends: true, suffixes: ["s", "es", "ing", "ed", "er", "est", "y"], words: 34, sentence: 14 },
    6: { phase: 5, blends: true, suffixes: ["s", "es", "ing", "ed", "er", "est", "y", "ly"], words: 45, sentence: 16 },
    7: { phase: 6, blends: true, open: true, words: 60, sentence: 28 },
    8: { phase: 6, blends: true, open: true, words: 80, sentence: 32 }
  };

  var VOWELS = /^(a|e|i|o|u|y|ai|ee|igh|oa|oo|ar|or|ur|ow|oi|ear|air|ure|er|ay|ou|ie|ea|oy|ir|ue|aw|ew|oe|au|ey|[aeiou]-e)$/;

  function rules(n) {
    var st = STAGES[n]; if (!st) throw new Error("No stage " + n);
    var g = [], tricky = [];
    for (var p = 2; p <= st.phase; p++) { g = g.concat(PHASES[p].graphemes); tricky = tricky.concat(PHASES[p].tricky); }
    if (st.extra) g = g.concat(st.extra);
    if (st.tricky3) tricky = tricky.concat(PHASES[3].tricky.slice(0, 5));
    var split = g.filter(function (x) { return x.indexOf("-") > 0; });
    var plain = g.filter(function (x) { return x.indexOf("-") < 0; }).sort(function (a, b) { return b.length - a.length; });
    return { stage: n, graphemes: plain, split: split, tricky: tricky, blends: st.blends, suffixes: st.suffixes || [], open: !!st.open, maxWords: st.words, maxSentence: st.sentence };
  }

  // Every way to split a word into allowed graphemes (longest first). Returns one split, or null.
  function segment(word, r) {
    var memo = {};
    function go(i) {
      if (i === word.length) return [];
      if (i in memo) return memo[i];
      memo[i] = null;
      for (var k = 0; k < r.graphemes.length; k++) {
        var gr = r.graphemes[k];
        if (word.substr(i, gr.length) === gr) {
          var rest = go(i + gr.length);
          if (rest) { memo[i] = [gr].concat(rest); break; }
        }
      }
      return memo[i];
    }
    var parts = go(0);
    // Split digraphs such as a-e (make, ride): try the word with its final e taken as part of the vowel.
    if (!parts && r.split.length && /[aeiou][^aeiou]e$/.test(word)) {
      var v = word.charAt(word.length - 3);
      if (r.split.indexOf(v + "-e") >= 0) {
        var inner = go2(word.slice(0, -1), r);
        if (inner) {
          var at = inner.lastIndexOf(v);
          if (at >= 0) { inner[at] = v + "-e"; parts = inner; }
        }
      }
    }
    if (parts && !r.blends) {
      for (var j = 1; j < parts.length; j++) {
        if (!VOWELS.test(parts[j - 1]) && !VOWELS.test(parts[j])) return null;
      }
    }
    return parts;
  }
  function go2(word, r) { return segment(word, { graphemes: r.graphemes, split: [], blends: true }); }

  /* Check one word. names: family names and other words allowed in this book (taught on the cast page). */
  function word(w, r, names) {
    var raw = w, lw = w.toLowerCase().replace(/[’']s$/, "").replace(/[’']/g, "");
    if (!lw) return { word: raw, ok: true, how: "blank" };
    if (names && names.indexOf(lw) >= 0) return { word: raw, ok: true, how: "name" };
    if (r.tricky.indexOf(lw) >= 0) return { word: raw, ok: true, how: "tricky" };
    if (r.open) return { word: raw, ok: true, how: "open" };
    var s = segment(lw, r);
    if (s) return { word: raw, ok: true, how: "decodable", parts: s };
    for (var i = 0; i < r.suffixes.length; i++) {
      var suf = r.suffixes[i];
      if (lw.length > suf.length + 1 && lw.slice(-suf.length) === suf) {
        var stem = lw.slice(0, -suf.length);
        var stems = [stem];
        if (suf === "ed" || suf === "ing" || suf === "er" || suf === "est") {
          if (/(.)\1$/.test(stem)) stems.push(stem.slice(0, -1));   // hopped -> hop
          stems.push(stem + "e");                                    // baked -> bake
        }
        if (suf === "es" && /ie$/.test(stem)) stems.push(stem.slice(0, -2) + "y");
        for (var k = 0; k < stems.length; k++) {
          if (r.tricky.indexOf(stems[k]) >= 0 || (names && names.indexOf(stems[k]) >= 0)) return { word: raw, ok: true, how: "tricky+" + suf };
          var ss = segment(stems[k], r);
          if (ss) return { word: raw, ok: true, how: "decodable+" + suf, parts: ss.concat(["+" + suf]) };
        }
      }
    }
    return { word: raw, ok: false, how: "above stage" };
  }

  function words(text) { return (text.match(/[A-Za-z][A-Za-z’'-]*/g) || []).map(function (w) { return w.replace(/-$/, ""); }); }
  function sentences(text) { return text.split(/[.!?]+["”’]?\s*/).filter(function (s) { return /[A-Za-z]/.test(s); }); }

  /* Check a page of text. Returns { ok, problems: [...], words: [...] }. */
  function page(text, stage, names) {
    var r = typeof stage === "object" ? stage : rules(stage);
    var nm = (names || []).map(function (n) { return n.toLowerCase(); });
    var ws = words(text), out = ws.map(function (w) { return word(w, r, nm); });
    var problems = out.filter(function (x) { return !x.ok; }).map(function (x) { return "“" + x.word + "” is above Stage " + r.stage; });
    if (ws.length > r.maxWords) problems.push(ws.length + " words on the page (Stage " + r.stage + " allows " + r.maxWords + ")");
    sentences(text).forEach(function (s) {
      var n = words(s).length;
      if (n > r.maxSentence) problems.push("A sentence of " + n + " words (Stage " + r.stage + " allows " + r.maxSentence + "): " + s.trim().slice(0, 40));
    });
    return { ok: problems.length === 0, problems: problems, words: out };
  }

  var api = { PHASES: PHASES, STAGES: STAGES, rules: rules, segment: segment, word: word, page: page, words: words };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FLRPhonics = api;
})(this);
