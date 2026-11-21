/* Family Learn to Read: the stage library (books.html).
   - Names: the family's names, kept in this browser only (flr-names), fill every book.
   - Look inside: flick through any book with those names.
   - Pack builder: pick 1, 5 or 10 different stories, printed or online, with the price (flr-pack).
   Pictures are painted after ordering, from the family's own characters (make.html). Until then each page
   shows what its picture will be. */
(function () {
  "use strict";
  var F = window.FLR, esc = F.esc, P = window.FLRPhonics;
  var root = document.querySelector("[data-library]");
  if (!root || !F.readers) return;
  var stage = +root.getAttribute("data-library"), books = F.readers.filter(function (b) { return b.stage === stage; });
  var byId = {}; F.readers.forEach(function (b) { byId[b.id] = b; });  // a pack can mix stages
  var band = ((F.stages || []).filter(function (s) { return s.n === stage; })[0] || {}).band || "";

  // ---------- names ----------
  var names = F.loadNames();
  function name(k) { var r = F.readerRoles.filter(function (x) { return x.key === k; })[0]; return (names[k] || "").trim() || (r ? r.example : ""); }
  function fill(t, plain) { return esc(t).replace(/\{(\w+)\}/g, function (m, k) { return plain ? esc(name(k)) : "<b>" + esc(name(k)) + "</b>"; }); }
  root.querySelectorAll("[data-name]").forEach(function (i) {
    i.value = names[i.getAttribute("data-name")] || "";
    i.addEventListener("input", function () { names[i.getAttribute("data-name")] = i.value; F.saveNames(names); paintCards(); show(); });
  });

  // ---------- book cards ----------
  var pack = F.loadPack(), cards = root.querySelector(".lib-cards");
  if (!pack.ids) pack.ids = [];
  pack.ids = pack.ids.filter(function (id) { return byId[id]; });
  function paintCards() {
    cards.innerHTML = books.map(function (b, i) {
      var on = pack.ids.indexOf(b.id) >= 0;
      return '<article class="lib-card' + (on ? " on" : "") + '" style="--i:' + i + '"><div class="lib-cover"><span class="lib-band">Stage ' + b.stage + "</span><h3>" + fill(b.title, true) + "</h3></div>" +
        '<p class="muted">' + fill(b.blurb, true) + '</p><div class="lib-acts"><button type="button" class="btn ghost btn-sm" data-look="' + b.id + '">Look inside</button>' +
        '<label class="check lib-pick"><input type="checkbox" data-pick="' + b.id + '"' + (on ? " checked" : "") + "><span>" + (on ? "In my pack" : "Add to my pack") + "</span></label></div></article>";
    }).join("");
  }
  cards.addEventListener("change", function (e) {
    var id = e.target.getAttribute("data-pick"); if (!id) return;
    var at = pack.ids.indexOf(id);
    if (e.target.checked && at < 0) {
      if (pack.ids.length >= 10) { e.target.checked = false; note("A pack holds up to 10 books."); return; }
      pack.ids.push(id);
    }
    if (!e.target.checked && at >= 0) pack.ids.splice(at, 1);
    F.savePack(pack); paintCards(); paintPack();
  });
  cards.addEventListener("click", function (e) {
    var b = e.target.closest("[data-look]"); if (!b) return;
    open(b.getAttribute("data-look"));
  });

  // ---------- pack and price ----------
  var bar = root.querySelector(".pk");
  function note(t) { bar.querySelector(".pk-note").textContent = t; }
  function paintPack() {
    var n = pack.ids.length, fmt = pack.format === "online" ? "online" : "printed", q = F.packPrice(fmt, n);
    bar.querySelectorAll("[name=pk-format]").forEach(function (r) { r.checked = r.value === fmt; });
    bar.querySelector(".pk-count").textContent = n ? n + (n === 1 ? " book" : " books") + " chosen" : "No books chosen yet";
    bar.querySelector(".pk-list").innerHTML = pack.ids.map(function (id) { return "<li>" + fill(byId[id].title, true) + "</li>"; }).join("");
    bar.querySelector(".pk-total").textContent = n ? q.text : "";
    bar.querySelector(".pk-how").textContent = n ? q.how : "";
    var tip = "";
    if (n && n < 5) tip = "Choose " + (5 - n) + " more for a pack of 5 at " + F.moneyText(F.prices[fmt].sizes[5]) + ".";
    else if (n > 5 && n < 10) tip = "Choose " + (10 - n) + " more for a pack of 10 at " + F.moneyText(F.prices[fmt].sizes[10]) + ".";
    note(tip);
    bar.querySelector(".pk-next").classList.toggle("disabled", !n);
  }
  bar.addEventListener("change", function (e) {
    if (e.target.name === "pk-format") { pack.format = e.target.value; F.savePack(pack); paintPack(); }
  });
  bar.querySelector(".pk-all").addEventListener("click", function () {
    pack.ids = books.slice(0, 10).map(function (b) { return b.id; }); F.savePack(pack); paintCards(); paintPack();
  });
  bar.querySelector(".pk-next").addEventListener("click", function (e) {
    if (!pack.ids.length) { e.preventDefault(); note("Choose at least one book first."); }
  });

  // ---------- look inside ----------
  var bv = root.querySelector(".bv"), stageEl = bv.querySelector(".bv-stage"), count = bv.querySelector(".bv-count"), dots = bv.querySelector(".bv-dots");
  var cur = null, at = 0;
  function sounds(b) {
    // The two- and three-letter sounds in this book, with a word that uses each, and its tricky words.
    var r = P.rules(b.stage), found = {}, tricky = {};
    b.pages.forEach(function (p) {
      P.words(p.t.replace(/\{\w+\}/g, "")).forEach(function (w) {
        var x = P.word(w, r, []);
        if (x.how === "tricky") tricky[w.toLowerCase()] = 1;
        (x.parts || []).forEach(function (g) { if (g.length > 1 && g.charAt(0) !== "+" && !found[g]) found[g] = w.toLowerCase(); });
      });
    });
    return { sounds: found, tricky: Object.keys(tricky) };
  }
  F.bookSounds = sounds;
  function pages(b) {
    var out = [];
    out.push('<div class="bv-page bv-cover lr-cover"><p class="bv-kicker">Stage ' + b.stage + " · " + esc(band) + "</p><h3>" + fill(b.title, true) + '</h3><p class="bv-sub">Starring ' +
      b.cast.map(function (k) { return esc(name(k)); }).join(", ").replace(/, ([^,]*)$/, " and $1") + "</p></div>");
    out.push('<div class="bv-page bv-meet"><h3>Meet the characters</h3><div class="bv-cast lr-cast">' + b.cast.map(function (k) {
      var r = F.readerRoles.filter(function (x) { return x.key === k; })[0];
      return '<figure><span class="lr-face">' + esc(name(k).charAt(0)) + "</span><figcaption>" + esc(name(k)) + "<span>" + esc(r.name) + "</span></figcaption></figure>";
    }).join("") + '</div><p class="bv-note">In your book, these are your family, drawn from your photos. <a href="make.html">Make your characters</a></p></div>');
    b.pages.forEach(function (p, i) {
      var side = i % 2 ? "left" : "right";
      out.push('<div class="bv-page bv-spread side-' + side + '"><div class="bv-pic lr-pic" style="--h:' + (i * 37 % 360) + '"><p class="lr-desc"><span>The picture:</span> ' + fill(p.d, true) +
        '</p><canvas class="lr-canvas" width="1600" height="900" data-n="' + i + '" hidden aria-hidden="true"></canvas></div><div class="bv-text lr-text"><p>' + fill(p.t) + "</p></div></div>");
    });
    var s = sounds(b), keys = Object.keys(s.sounds);
    out.push('<div class="bv-page bv-plain lr-sounds"><h3>Sounds in this book</h3><ul class="lr-chips">' + keys.map(function (g) {
      return "<li><b>" + esc(g) + "</b> " + esc(s.sounds[g]) + "</li>"; }).join("") + '</ul><h3>Tricky words</h3><p class="lr-tricky">' + s.tricky.map(esc).join(" · ") + "</p></div>");
    return out;
  }
  function show(dir) {
    if (!cur) return;
    var list = pages(cur); at = Math.max(0, Math.min(at, list.length - 1));
    stageEl.className = "bv-stage" + (dir ? (dir > 0 ? " turn-fwd" : " turn-back") : "");
    stageEl.innerHTML = list[at];
    paintPicture();
    count.textContent = at === 0 ? "Cover" : at === 1 ? "Meet the characters" : at === list.length - 1 ? "Sounds and tricky words" : "Page " + (at - 1) + " of " + cur.pages.length;
    dots.innerHTML = list.map(function (x, i) { return '<button type="button" aria-label="Page ' + (i + 1) + '"' + (i === at ? ' aria-current="true"' : "") + ' data-go="' + i + '"></button>'; }).join("");
    bv.querySelector(".bv-title").textContent = fill(cur.title, true).replace(/&amp;/g, "&");
  }
  // The painted example: our set for this page with our example family layered on (layers.js). Until a set
  // is painted, the page keeps its description of the picture.
  function paintPicture() {
    var c = stageEl.querySelector(".lr-canvas"), Ly = F.layers;
    if (!c || !Ly || !F.config || !F.config.api) return;
    var b = cur, n = +c.getAttribute("data-n"), u = Ly.exampleUrl(F.config.api, b.id);
    Ly.paint(c, u.scene(n + 1), Ly.plan(b)[n], u.pose).then(function () {
      if (cur === b && c.isConnected) { c.hidden = false; c.parentNode.classList.add("painted"); }
    }).catch(function () {});
  }
  function open(id) {
    cur = byId[id]; at = 0; bv.hidden = false; show();
    bv.scrollIntoView({ behavior: "smooth", block: "start" }); bv.focus({ preventScroll: true });
  }
  bv.querySelector(".bv-prev").addEventListener("click", function () { at--; show(-1); });
  bv.querySelector(".bv-next").addEventListener("click", function () { at++; show(1); });
  dots.addEventListener("click", function (e) { var b = e.target.closest("[data-go]"); if (b) { var n = +b.getAttribute("data-go"); var d = n > at ? 1 : -1; at = n; show(d); } });
  bv.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { at++; show(1); } if (e.key === "ArrowLeft") { at--; show(-1); } });

  paintCards(); paintPack();
  var first = /[?&]book=([\w-]+)/.exec(location.search);
  if (first && byId[first[1]]) open(first[1]);
})();
