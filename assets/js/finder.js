/* Family Learn to Read: find your child's stage, from their school's reading scheme or with our free reading check. */
(function () {
  "use strict";
  var F = window.FLR;
  function $(s, r) { return (r || document).querySelector(s); }
  var esc = F.esc;

  function stageOf(band) { return F.bandStage[band] || null; }
  function stage(n) { return F.stages[n - 1]; }
  function levelsOf(sc) {
    if (!sc.same) return sc.levels;
    // Schemes levelled straight to Book Band colours.
    return F.schemes[0].levels;
  }

  function result(n, why) {
    var s = stage(n);
    return '<div class="stage-result" style="--sc:' + s.color + ';--si:' + s.ink + '">' +
      '<div class="sr-badge"><span>Stage</span><b>' + s.n + "</b></div>" +
      '<div class="sr-copy"><p class="eyebrow">' + esc(why) + "</p>" +
      "<h3>Stage " + s.n + ": " + esc(s.band) + " band</h3>" +
      "<p>" + esc(s.what) + " " + esc(s.phase) + ", usually " + esc(s.year) + ".</p>" +
      '<div class="hero-cta"><a class="btn red btn-sm" href="index.html#join" data-want="stage-' + s.n + '">Notify me about Stage ' + s.n + "</a>" +
      '<a class="btn ghost btn-sm" href="index.html#stage-' + s.n + '">See the stage</a></div></div></div>';
  }

  // ---------- School scheme picker ----------
  var scheme = $("#f-scheme"), level = $("#f-level"), out = $("#f-out");
  if (scheme && level && out) {
    scheme.innerHTML = '<option value="">Choose your school\'s scheme</option>' +
      F.schemes.map(function (sc) { return '<option value="' + sc.id + '">' + esc(sc.name) + "</option>"; }).join("") +
      '<option value="unsure">Not sure</option>';
    function fillLevels() {
      var sc = F.schemes.filter(function (x) { return x.id === scheme.value; })[0];
      out.innerHTML = "";
      if (scheme.value === "unsure") {
        level.innerHTML = ""; level.disabled = true;
        out.innerHTML = '<p class="finder-tip">No problem. Our <a href="check.html">free reading check</a> takes about two minutes, and you can do it together at home.</p>';
        return;
      }
      if (!sc) { level.innerHTML = '<option value="">Then choose the level</option>'; level.disabled = true; return; }
      level.disabled = false;
      level.innerHTML = '<option value="">Choose the level or colour</option>' +
        levelsOf(sc).map(function (l, i) { return '<option value="' + i + '">' + esc(l[0]) + "</option>"; }).join("");
    }
    function show() {
      var sc = F.schemes.filter(function (x) { return x.id === scheme.value; })[0];
      if (!sc || level.value === "") { out.innerHTML = ""; return; }
      var l = levelsOf(sc)[Number(level.value)], n = stageOf(l[1]);
      var note = "";
      if (l[1] === "Lilac") note = '<p class="finder-tip">Lilac books have pictures and no words, so Stage 1 is the natural next step.</p>';
      if (l[1] === "Gold") note = '<p class="finder-tip">Your child is reading beyond our stages. Stage 8 still makes a fun, quick read, or try our <a href="' + F.config.storybooks + '">storybooks</a> to read together.</p>';
      out.innerHTML = result(n, sc.name + ", " + l[0]) + note +
        '<p class="finder-tip">Schools vary a little. If it feels too easy or too hard, try our <a href="check.html">reading check</a>.</p>';
      remember(n);
    }
    scheme.addEventListener("change", fillLevels);
    level.addEventListener("change", show);
    fillLevels();
  }

  // ---------- Free reading check ----------
  var box = $("#check");
  if (box) {
    var cur = 1;
    function ask() {
      var s = stage(cur);
      box.innerHTML = '<div class="check-card" style="--sc:' + s.color + '">' +
        '<p class="eyebrow">Passage ' + cur + " of " + F.stages.length + "</p>" +
        '<p class="check-text" lang="en-GB">' + esc(s.sample) + "</p>" +
        '<p class="muted">Ask your child to read this out loud. How did it go?</p>' +
        '<div class="check-btns">' +
        '<button class="btn" type="button" data-a="easy">Read it easily</button>' +
        '<button class="btn ghost" type="button" data-a="help">Needed a little help</button>' +
        '<button class="btn ghost" type="button" data-a="hard">Too hard</button></div>' +
        (cur > 1 ? '<button class="linkish" type="button" data-a="back">&larr; Back</button>' : "") + "</div>";
      var t = $(".check-text", box); if (t) t.focus && t.setAttribute("tabindex", "-1");
    }
    function done(n, why) {
      box.innerHTML = result(n, why) +
        '<p class="finder-tip">Practice books work best when your child can read almost every word. We picked the hardest passage they managed with little or no help.</p>' +
        '<button class="linkish" type="button" data-a="again">Start the check again</button>';
      remember(n);
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-a]"); if (!b) return;
      var a = b.dataset.a;
      if (a === "again") { cur = 1; return ask(); }
      if (a === "back") { cur = Math.max(1, cur - 1); return ask(); }
      if (a === "easy") {
        if (cur === F.stages.length) return done(cur, "Read every passage easily");
        cur++; return ask();
      }
      if (a === "help") return done(cur, "Read passage " + cur + " with a little help");
      if (a === "hard") return done(Math.max(1, cur - 1), cur === 1 ? "Just starting out" : "Read passage " + (cur - 1) + " easily");
    });
    ask();
  }

  // Remember the stage so the sign-up form suggests it.
  function remember(n) {
    try { localStorage.setItem("flr-stage", String(n)); } catch (e) {}
    var sel = $("#w-want"); if (sel) sel.value = "stage-" + n;
  }
  try {
    var saved = localStorage.getItem("flr-stage"), sel = $("#w-want");
    if (saved && sel && !sel.dataset.touched) sel.value = "stage-" + saved;
  } catch (e) {}
})();
