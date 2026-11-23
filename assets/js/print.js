/* Family Learn to Read: builds one book's print files for Lulu in the browser (print.html).
   print.html?story=s3-rain                       our example book (our painted sets and example family, or placeholders), for checking the layout
   print.html?story=s3-rain&d=<draft>#<token>     a customer's book, from the cartoon service (the print key works too)
   &part=cover                                    the cover sheet instead of the 32 inside pages
   Lulu product "reader": 8.5 in square paperback, 32 pages. Save as PDF from Chrome (or headless Chrome):
   page sizes come from print.css. When everything has loaded, <body data-ready="1">; if something is
   missing, <body data-error="..."> and the page says what. */
(function () {
  "use strict";
  var F = window.FLR, P = window.FLRPhonics, esc = F.esc, q = new URLSearchParams(location.search);
  var key = q.get("story") || "s3-rain", part = q.get("part") === "cover" ? "cover" : "interior";
  var B = (F.readers || []).filter(function (b) { return b.id === key; })[0];
  var draft = q.get("d"), token = decodeURIComponent((location.hash || "").slice(1));
  var root = document.getElementById("book"), status = document.getElementById("status");
  var STAGE = (F.stages || []).filter(function (s) { return B && s.n === B.stage; })[0] || { band: "", color: "#FFC21A", ink: "#1E1A33" };
  var LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 8C12 5 6 5 2 6V16C6 15 12 15 16 17.2Z" fill="#EE4B2B"/><path d="M16 8C20 5 26 5 30 6V16C26 15 20 15 16 17.2Z" fill="#FFC21A"/><path d="M2 17.4C6 16.4 12 16.4 16 18.6V28C12 25 6 25 2 26Z" fill="#16A6E3"/><path d="M30 17.4C26 16.4 20 16.4 16 18.6V28C20 25 26 25 30 26Z" fill="#1FB45A"/><path d="M16 8v20" stroke="#1E1A33" stroke-width="1.5"/></svg>';
  function fail(msg) { document.body.setAttribute("data-error", msg); status.textContent = "Can't build this book: " + msg; }
  if (!B) return fail("unknown story " + key);

  // ---------- names: the family's own (saved on the draft at checkout) or our examples ----------
  var names = {};
  function role(k) { return F.readerRoles.filter(function (x) { return x.key === k; })[0]; }
  function name(k) { return (names[k] || "").trim() || role(k).example; }
  function fill(t, plain) { return esc(t).replace(/\{(\w+)\}/g, function (m, k) { return plain ? esc(name(k)) : "<b>" + esc(name(k)) + "</b>"; }); }
  function starring() { return B.cast.map(function (k) { return esc(name(k)); }).join(", ").replace(/, ([^,]*)$/, " and $1"); }

  // ---------- pictures ----------
  var pics = {};
  function api(path) { return fetch(F.config.api + "/api/drafts/" + encodeURIComponent(draft) + path, { headers: { Authorization: "Bearer " + token } }); }
  // Our example book has no paintings yet: a soft placeholder that says what the picture shows.
  function placeholder(slot, text, w, h, hue, cx) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, "hsl(" + hue + ",60%,86%)"); gr.addColorStop(1, "hsl(" + ((hue + 40) % 360) + ",55%,76%)");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(30,26,51,.55)"; g.font = "600 " + Math.round(h / 34) + "px Figtree, sans-serif"; g.textAlign = "center";
    var words = text.split(" "), line = "", y = h * 0.42, lines = [];
    words.forEach(function (wd) { var t = line ? line + " " + wd : wd; if (g.measureText(t).width > w * 0.36) { lines.push(line); line = wd; } else line = t; });
    lines.push(line);
    lines.forEach(function (l, i) { g.fillText(l, (cx || 0.5) * w, y + i * h / 24); });
    return new Promise(function (ok) { c.toBlob(function (b) { ok(URL.createObjectURL(b)); }, "image/jpeg", 0.9); });
  }
  function load() {
    if (!draft) {
      var jobs = B.cast.map(function (k) { return placeholder("char", name(k), 600, 800, 40 + k.length * 50).then(function (u) { pics["c-" + k] = u; }); });
      var Ly = F.layers, plan = Ly && Ly.plan(B), u = Ly && Ly.exampleUrl(F.config.api, key);
      B.pages.forEach(function (p, i) { jobs.push((Ly ? Ly.paint(Object.assign(document.createElement("canvas"), { width: 2400, height: 1216 }), u.scene(i + 1), plan[i], u.pose)
        .then(function (c) { return new Promise(function (ok) { c.toBlob(function (b) { pics["s" + (i + 1)] = URL.createObjectURL(b); ok(); }, "image/jpeg", 0.92); }); }) : Promise.reject())
        .catch(function () { return placeholder("spread", "Picture " + (i + 1) + ": " + fill(p.d, true).replace(/&#39;/g, "'").replace(/&amp;/g, "&"), 1600, 811, i * 37 % 360, i % 2 ? 0.66 : 0.34).then(function (u) { pics["s" + (i + 1)] = u; }); })); });
      return Promise.all(jobs);
    }
    return api("").then(function (r) { if (!r.ok) throw new Error("draft not found (" + r.status + ")"); return r.json(); }).then(function (st) {
      var c = st.cover || {};
      if (c.story && c.story !== key) throw new Error("this draft is for " + c.story);
      names = c.names || {};
      var want = B.cast.map(function (k) { return "c-" + k; }).concat(B.pages.map(function (p, i) { return "s" + (i + 1); }));
      var missing = want.filter(function (s) { return st.cartoons.indexOf(s) < 0; });
      if (missing.length) throw new Error("pictures not drawn yet: " + missing.join(", "));
      var soft = B.pages.map(function (p, i) { return "s" + (i + 1); }).filter(function (s) { return (st.printReady || []).indexOf(s) < 0; });
      if (soft.length && q.get("allowSoft") !== "1") throw new Error("pictures not at print size yet: " + soft.join(", "));
      return Promise.all(want.map(function (slot) {
        return api("/cartoons/" + slot).then(function (r) { if (!r.ok) throw new Error("couldn't load " + slot); return r.blob(); })
          .then(function (b) { pics[slot] = URL.createObjectURL(b); });
      }));
    });
  }

  // Paint each spread's word panel and its fade into the picture, as one solid JPEG
  // (a see-through panel over the picture shows up pink in some PDF viewers and printers).
  var SPREAD_W = 17.25, PANEL = 5.475, FADE = 1, CREAM = [251, 246, 236];
  function flatten() {
    return Promise.all(B.pages.map(function (p, i) {
      var slot = "s" + (i + 1), left = i % 2 === 1;
      return new Promise(function (ok, no) {
        var im = new Image();
        im.onload = function () {
          var ratio = SPREAD_W / 8.75, sw = im.naturalWidth, sh = sw / ratio, sy = (im.naturalHeight - sh) / 2;
          if (sh > im.naturalHeight) { sh = im.naturalHeight; sw = sh * ratio; sy = 0; }
          var sx = (im.naturalWidth - sw) / 2, W = Math.min(Math.round(sw), Math.round(SPREAD_W * 300)), H = Math.round(W / ratio);
          var c = document.createElement("canvas"); c.width = W; c.height = H;
          var g = c.getContext("2d"); g.drawImage(im, sx, sy, sw, sh, 0, 0, W, H);
          var px = W / SPREAD_W, rgb = CREAM.join(","), x0 = left ? 0 : (SPREAD_W - PANEL) * px, edge = left ? PANEL * px : (SPREAD_W - PANEL) * px;
          g.fillStyle = "rgb(" + rgb + ")"; g.fillRect(x0, 0, PANEL * px, H);
          var gr = g.createLinearGradient(edge, 0, left ? edge + FADE * px : edge - FADE * px, 0);
          gr.addColorStop(0, "rgba(" + rgb + ",1)"); gr.addColorStop(1, "rgba(" + rgb + ",0)");
          g.fillStyle = gr; g.fillRect(left ? edge : edge - FADE * px, 0, FADE * px, H);
          c.toBlob(function (b) { if (!b) return no(new Error("couldn't prepare " + slot)); pics[slot] = URL.createObjectURL(b); ok(); }, "image/jpeg", 0.92);
        };
        im.onerror = function () { no(new Error("couldn't load " + slot)); };
        im.src = pics[slot];
      });
    }));
  }

  // ---------- what the book teaches ----------
  function sounds() {
    var r = P.rules(B.stage), found = {}, tricky = {};
    B.pages.forEach(function (p) {
      P.words(p.t.replace(/\{\w+\}/g, "")).forEach(function (w) {
        var x = P.word(w, r, []);
        if (x.how === "tricky") tricky[w.toLowerCase()] = 1;
        (x.parts || []).forEach(function (g) { if (g.length > 1 && g.charAt(0) !== "+" && !found[g]) found[g] = w.toLowerCase(); });
      });
    });
    (B.teach || []).forEach(function (w) { tricky[w] = 1; });  // words above the stage this book needs
    return { sounds: found, tricky: Object.keys(tricky) };
  }

  // ---------- pages ----------
  function pg(side, cls, inner) { return '<section class="pg ' + side + " " + cls + '">' + inner + "</section>"; }
  function img(slot, cls, alt) { return '<img class="' + cls + '" src="' + pics[slot] + '" alt="' + esc(alt || "") + '">'; }
  function safe(inner) { return '<div class="safe">' + inner + "</div>"; }
  function interior() {
    var out = [], badge = '<span class="badge" style="--bc:' + STAGE.color + ";--bi:" + STAGE.ink + '">Stage ' + B.stage + " · " + esc(STAGE.band) + "</span>";
    // 1 (right): title page
    out.push(pg("r", "title-page", safe(badge + img("c-child", "title-art", name("child")) + '<h1 class="title">' + fill(B.title, true) + '</h1><p class="starring">Starring ' + starring() + "</p>")));
    // 2 (left): for the grown-up
    out.push(pg("l", "tips-page", safe('<p class="belongs">This book belongs to<br><b>' + esc(name("child")) + "</b></p>" +
      "<h2>Reading together</h2><ul><li>Look at the pictures first and talk about what you see.</li><li>Point to each word as it is read.</li>" +
      "<li>Sound out new words, then blend the sounds together: <i>sh-o-p, shop</i>.</li><li>Tricky words can't be sounded out, so just learn them by sight.</li>" +
      "<li>Praise every try. Read it again tomorrow: the second time is easier!</li></ul>")));
    // 3 (right): Meet the characters
    out.push(pg("r", "meet-page", safe("<h2>Meet the characters</h2><div class=\"cast\">" + B.cast.map(function (k) {
      return "<figure>" + img("c-" + k, "", name(k)) + "<figcaption>" + esc(name(k)) + "</figcaption></figure>"; }).join("") + "</div>")));
    // 4–23: ten spreads, each a left and a right page cut from one picture
    B.pages.forEach(function (p, i) {
      var slot = "s" + (i + 1), words = '<div class="words"><p>' + fill(p.t) + "</p></div>", left = i % 2 === 1;
      out.push(pg("l", "spread", img(slot, "spread-pic", fill(p.d, true)) + (left ? words : "") + (left ? '<span class="num l">' + (i * 2 + 4) + "</span>" : "")));
      out.push(pg("r", "spread", img(slot, "spread-pic", "") + (left ? "" : words) + (left ? "" : '<span class="num r">' + (i * 2 + 5) + "</span>")));
    });
    var s = sounds(), keys = Object.keys(s.sounds);
    // 24 (left): sounds in this book
    out.push(pg("l", "list-page", safe("<h2>Sounds in this book</h2><p class=\"lead\">Each of these sounds is written with more than one letter.</p><ul class=\"chips\">" +
      keys.map(function (g) { return "<li><b>" + esc(g) + "</b><span>" + esc(s.sounds[g]) + "</span></li>"; }).join("") + "</ul>")));
    // 25 (right): tricky words
    out.push(pg("r", "list-page", safe("<h2>Tricky words</h2><p class=\"lead\">These words don't follow the usual sounds. Learn them by sight.</p><ul class=\"chips words-list\">" +
      s.tricky.map(function (w) { return "<li><b>" + esc(w) + "</b></li>"; }).join("") + "</ul>")));
    // 26 (left): talk about the story
    out.push(pg("l", "list-page", safe("<h2>Talk about the story</h2><ol class=\"talk\"><li>What happened first?</li><li>What was your favourite part, and why?</li>" +
      "<li>How do you think " + esc(name("child")) + " felt at the end?</li><li>What might happen next time?</li><li>Find a word with <b>" + esc(keys[0] || "sh") + "</b> in it.</li></ol>")));
    // 27 (right): certificate
    out.push(pg("r", "cert-page", safe('<div class="cert"><p class="kicker">Well done!</p><p class="cert-name">' + esc(name("child")) + '</p><p>has read</p><p class="cert-title">' + fill(B.title, true) +
      "</p>" + badge + '<p class="sign">Signed ____________________</p></div>')));
    // 28 (left): draw your favourite part
    out.push(pg("l", "draw-page", safe('<h2>Draw your favourite part</h2><div class="frame"></div>')));
    // 29 (right): more books at this stage
    var more = F.readers.filter(function (b) { return b.stage === B.stage && b.id !== B.id; });
    out.push(pg("r", "list-page", safe("<h2>More " + esc(STAGE.band) + " books</h2><ul class=\"more\">" + more.map(function (b) { return "<li>" + fill(b.title, true) + "</li>"; }).join("") +
      "</ul><p class=\"lead\">Every one stars your family too.</p>")));
    // 30 (left): next steps for the grown-up
    out.push(pg("l", "tips-page", safe("<h2>Moving on</h2><p>When " + esc(name("child")) + " can read this book smoothly, with few stops to sound out words, it's time for the next stage.</p>" +
      "<p>Take our free reading check at familylearntoread.com to find the right stage.</p>")));
    // 31 (right): notes
    out.push(pg("r", "notes-page", safe('<h2>Our reading notes</h2><div class="lines"></div>')));
    // 32 (left): the end
    out.push(pg("l", "end-page", safe('<p class="the-end">The End</p><p class="made-for">Made especially for ' + esc(name("child")) + '.</p><span class="brand">' + LOGO + "Family Learn to Read</span>")));
    return out.join("");
  }
  function cover() {
    // Lulu's sheet for this paperback: 441.5 × 222.25 mm. Bleed W on each edge; the spine is what is left.
    var SW = 441.5, SH = 222.25, W = (SH - 215.9) / 2, spine = SW - 2 * 215.9 - 2 * W;
    return '<section class="cover" style="--sw:' + SW + "mm;--sh:" + SH + "mm;--cover:" + STAGE.color + ";--ink:" + STAGE.ink + ";--w:" + W.toFixed(3) + "mm;--s:" + spine.toFixed(3) + 'mm">' +
      '<div class="cv-back"><div class="cv-safe"><p class="cv-blurb">' + fill(B.blurb, true) + '</p><p class="cv-stage">Stage ' + B.stage + " · " + esc(STAGE.band) + " · " + esc(STAGE.phase || "") +
      '</p><div class="cv-brand"><span class="brand">' + LOGO + 'Family Learn to Read</span><span class="cv-url">familylearntoread.com</span></div></div></div><div class="cv-spine"></div>' +
      '<div class="cv-front"><div class="cv-safe"><p class="cv-kicker">Stage ' + B.stage + " · " + esc(STAGE.band) + '</p><h1 class="cv-title">' + fill(B.title, true) +
      '</h1><div class="cv-art">' + img("c-child", "", name("child")) + '</div><p class="cv-star">Starring ' + starring() + "</p></div></div></section>";
  }

  load().then(function () { return part === "cover" ? null : flatten(); }).then(function () {
    root.innerHTML = part === "cover" ? cover() : interior();
    var imgs = [].slice.call(root.querySelectorAll("img"));
    return Promise.all([document.fonts.ready].concat(imgs.map(function (i) {
      return i.complete ? (i.naturalWidth ? null : Promise.reject(new Error("a picture didn't load"))) :
        new Promise(function (ok, no) { i.onload = ok; i.onerror = function () { no(new Error("a picture didn't load")); }; });
    })));
  }).then(function () {
    var n = root.querySelectorAll(".pg").length;
    if (part !== "cover" && n !== 32) throw new Error(n + " pages, the printer needs 32");
    status.textContent = part === "cover" ? "Cover ready: print to PDF (441.5 × 222.25 mm)." : "Ready: " + n + " pages. Print to PDF (8.75 × 8.75 in, no margins).";
    document.body.setAttribute("data-ready", "1");
  }).catch(function (e) { fail(e.message); });
})();
