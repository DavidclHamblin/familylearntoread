/* Family Learn to Read: "See your own family in the books" on the home page (free preview).
   The family adds a photo of their child, and of the grown-up and pet if they like. We draw each one (preview.js),
   then paint two pages with them. Anyone without a photo stays as our example family, which costs nothing.
   The same draft is used on make.html and when ordering, so nothing has to be drawn twice.
   Photos are shrunk and stripped of hidden data in this browser, and drawings are only fetched back into it. */
(function () {
  "use strict";
  var F = window.FLR, P = F && F.preview, root = document.querySelector("[data-try]");
  if (!root || !P || !F.layers || !P.api()) return;
  root.hidden = false;
  var esc = F.esc, roles = F.readerRoles, names = F.loadNames(), byId = {};
  F.readers.forEach(function (b) { byId[b.id] = b; });
  var STORY = P.HOME_PAGES[0][0];
  var files = {}, previews = {}, toons = {}, poseUrls = {}, busy = false, kinds = {};
  P.ROLES.forEach(function (k) { kinds[k] = names[k + "Kind"] || P.DEFAULT_KIND[k]; });
  var picks = root.querySelector(".try-picks"), msg = root.querySelector(".try-msg"), go = root.querySelector("[data-try-go]"),
    del = root.querySelector("[data-try-delete]"), pages = root.querySelector(".try-pages"), next = root.querySelector(".try-next");
  function role(k) { return roles.filter(function (r) { return r.key === k; })[0]; }
  var GROWN = { man: "Dad", "older woman": "Gran", "older man": "Grandad" };
  function name(k) { return (names[k] || "").trim() || (k === "adult" && toons.adult && GROWN[kinds.adult]) || role(k).example; }
  function fill(t) { return esc(t).replace(/\{(\w+)\}/g, function (m, k) { return "<b>" + esc(name(k)) + "</b>"; }); }
  function exampleImg(k) { return P.api() + "/api/sets/example/c-" + k + "?w=web&v=" + F.layers.ART; }

  picks.innerHTML = roles.map(function (r) {
    var k = r.key;
    return '<div class="try-pick" data-role="' + k + '"><div class="try-pic"></div><div class="try-body"><p class="who">' + esc(r.name) + "</p>" +
      '<label class="mk-file btn ghost btn-sm"><input type="file" accept="image/jpeg,image/png,image/webp" data-file="' + k + '"><span>Choose a photo</span></label>' +
      '<label class="field"><span>' + esc(r.label) + '</span><input type="text" data-name="' + k + '" maxlength="20" placeholder="e.g. ' + esc(r.example) + '"></label>' +
      '<label class="field"><span>' + (k === "pet" ? "What kind of pet?" : "Who is it?") + '</span><select data-kind="' + k + '">' +
      P.KINDS[k].map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join("") + "</select></label>" +
      '<p class="try-state small"></p></div></div>';
  }).join("");
  picks.querySelectorAll("[data-name]").forEach(function (i) { i.value = names[i.getAttribute("data-name")] || ""; });
  picks.querySelectorAll("[data-kind]").forEach(function (s) { s.value = kinds[s.getAttribute("data-kind")]; });

  function paint() {
    roles.forEach(function (r) {
      var k = r.key, card = picks.querySelector('[data-role="' + k + '"]'), pic = card.querySelector(".try-pic");
      var src = previews[k] || toons[k], ours = !src;
      pic.innerHTML = '<img src="' + (src || exampleImg(k)) + '" alt="">' + (ours ? '<span class="try-tag">' + (k === "child" ? "Example" : "Ours") + "</span>" : "");
      pic.className = "try-pic" + (previews[k] ? " photo" : toons[k] ? " drawn" : " ours") + (busy && files[k] ? " busy" : "");
      card.querySelector(".mk-file span").textContent = src ? "Use a different photo" : "Choose a photo";
      card.querySelector(".try-state").textContent = files[k] ? "Ready to draw." : toons[k] ? "Drawn." : k === "child" ? "" : "No photo? We'll use ours.";
    });
    // The family row above shows whoever is drawn.
    document.querySelectorAll("[data-family]").forEach(function (img) {
      var k = img.getAttribute("data-family"), want = toons[k] || exampleImg(k);
      if (img.getAttribute("src") !== want) img.src = want;
      var cap = img.closest("figure").querySelector("figcaption");
      if (cap) cap.textContent = toons[k] ? name(k) : (k === "adult" ? "Grown-up" : k.charAt(0).toUpperCase() + k.slice(1));
    });
    pages.querySelectorAll("[data-try-page]").forEach(function (el) {
      var bits = el.getAttribute("data-try-page").split(":"), b = byId[bits[0]];
      if (b) el.querySelector("[data-words]").innerHTML = fill(b.pages[+bits[1] - 1].t);
    });
    del.hidden = !P.saved();
  }
  function paintPages() {
    return Promise.all(P.HOME_PAGES.map(function (pg) {
      var el = pages.querySelector('[data-try-page="' + pg[0] + ":" + pg[1] + '"]'), b = byId[pg[0]];
      if (!el || !b) return null;
      return P.paint(el.querySelector("canvas"), b, pg[1], poseUrls).then(function () { el.classList.add("painted"); });
    })).then(function () { pages.hidden = false; next.hidden = false; });
  }

  picks.addEventListener("input", function (e) {
    var k = e.target.getAttribute("data-name");
    if (k) { names[k] = e.target.value; F.saveNames(names); paint(); }
  });
  picks.addEventListener("change", function (e) {
    var k = e.target.getAttribute("data-file");
    if (k && e.target.files[0]) {
      var f = e.target.files[0];
      if (!/^image\//.test(f.type)) { msg.textContent = "Please choose a photo (JPG, PNG or WebP)."; return; }
      files[k] = f;
      if (previews[k]) URL.revokeObjectURL(previews[k]);
      previews[k] = URL.createObjectURL(f);  // shown only here, in this browser
      msg.textContent = ""; paint();
    }
    var w = e.target.getAttribute("data-kind");
    if (w) { kinds[w] = e.target.value; names[w + "Kind"] = e.target.value; F.saveNames(names); }
  });

  function drawn() { return P.ROLES.filter(function (k) { return toons[k]; }); }
  go.addEventListener("click", function () {
    if (busy) return;
    msg.textContent = "";
    var want = P.ROLES.filter(function (k) { return files[k]; });
    if (!files.child && !toons.child) { msg.textContent = "Please add a photo of your child first."; return; }
    if (want.length && !root.querySelector("[data-try-consent]").checked) { msg.textContent = "Please tick the box to confirm you may use these photos."; root.querySelector("[data-try-consent]").focus(); return; }
    busy = true; go.disabled = true; paint();
    msg.textContent = want.length ? "Drawing your family. This takes about a minute…" : "Painting the pages with your family…";
    var pack = F.loadPack(), first = byId[(pack.ids || [])[0]] ? pack.ids[0] : STORY, failed = [];
    P.draft(first, true).then(function (d) {
      var queue = want.slice();
      function one() {
        var k = queue.shift();
        if (!k) return Promise.resolve();
        return P.drawChar(d, k, files[k], kinds[k], STORY).then(function () { return P.fetch(d, "c-" + k); }).then(function (u) {
          if (toons[k]) URL.revokeObjectURL(toons[k]);
          toons[k] = u; delete files[k]; URL.revokeObjectURL(previews[k]); delete previews[k];
        }, function (e) { failed.push(e); if (P.gone(e)) P.forget(); }).then(function () { paint(); return one(); });
      }
      return Promise.all([one(), one()]).then(function () {
        if (failed.length) throw failed[0];
        msg.textContent = "Here they are! Now painting two pages with them…";
        return P.req("GET", "/api/drafts/" + d.id, d);
      }).then(function (st) {
        return P.poses(d, drawn(), st.cartoons || [], kinds, STORY);
      }).then(function (r) {
        Object.keys(r.urls).forEach(function (s) { if (poseUrls[s]) URL.revokeObjectURL(poseUrls[s]); poseUrls[s] = r.urls[s]; });
        if (r.errors.length) throw r.errors[0];
        return paintPages();
      });
    }).then(function () {
      msg.textContent = "Done! This is how " + name("child") + " will look in every book.";
    }, function (e) {
      msg.textContent = e.message;
    }).then(function () { busy = false; go.disabled = false; paint(); });
  });

  del.addEventListener("click", function () {
    var d = P.saved();
    var done = function () {
      P.forget();
      [toons, previews, poseUrls].forEach(function (m) { Object.keys(m).forEach(function (k) { URL.revokeObjectURL(m[k]); delete m[k]; }); });
      files = {};
      picks.querySelectorAll("input[type=file]").forEach(function (i) { i.value = ""; });
      pages.hidden = true; next.hidden = true;
      pages.querySelectorAll(".painted").forEach(function (el) { el.classList.remove("painted"); });
      paint(); msg.textContent = "Deleted. Your photos and drawings have been removed from our service.";
    };
    if (!d) return done();
    P.req("DELETE", "/api/drafts/" + d.id, d).then(done, function (e) { if (e.status === 404 || e.status === 403) done(); else msg.textContent = e.message; });
  });

  paint();

  // Coming back: show the family already drawn, and the pages if their poses are up to date (nothing new is drawn).
  var d0 = P.saved();
  if (d0) {
    P.req("GET", "/api/drafts/" + d0.id, d0).then(function (st) {
      var have = st.cartoons || [];
      var ks = P.ROLES.filter(function (k) { return have.indexOf("c-" + k) >= 0; });
      return Promise.all(ks.map(function (k) { return P.fetch(d0, "c-" + k).then(function (u) { toons[k] = u; }, function () {}); })).then(function () {
        paint();
        var ready = ks.length && toons.child && ks.every(function (k) { return d0.poses && d0.poses[k] && have.indexOf(P.poseSlot(k)) >= 0; });
        if (!ready) { if (toons.child) msg.textContent = "Your family is drawn. Press “Draw my family” to paint two pages with them."; return; }
        return P.poses(d0, ks, have, kinds, STORY).then(function (r) { poseUrls = r.urls; return paintPages(); });
      });
    }).catch(function (e) { if (P.gone(e)) { P.forget(); paint(); } });
  }
})();
