/* Family Learn to Read: "Make your characters" (make.html).
   The family adds a photo for the reader, the grown-up and the pet, and the shared photo and cartoon
   service draws each one once, in the style every Learn to Read book shares. Then one page of their first
   book is painted with them, free. After ordering, the characters are copied into every book in the pack
   (POST /api/drafts/<id>/copy) and the rest of the pages are painted from them.
   Photos are shrunk and stripped of hidden data (such as location) in the browser before upload, kept in
   private storage, and never shown anywhere except back to this browser. */
(function () {
  "use strict";
  var F = window.FLR, esc = F.esc;
  var root = document.querySelector("[data-maker]");
  if (!root || !F.readers) return;
  var roles = F.readerRoles, names = F.loadNames(), pack = F.loadPack();
  var byId = {}; F.readers.forEach(function (b) { byId[b.id] = b; });
  var first = byId[(pack.ids || [])[0]] || F.readers[0];
  var API = (testApi() || F.config.api || "").replace(/\/+$/, "");
  function testApi() { try { return localStorage.getItem("flr-api"); } catch (e) { return ""; } }
  var DKEY = "flr-cast";
  var files = {}, previews = {}, toons = {}, busy = {}, errors = {}, kind = { child: "child", adult: "woman", pet: "dog" }, standin = {};
  var msg = root.querySelector(".mk-msg"), left = root.querySelector(".mk-left");
  function name(k) { var r = roles.filter(function (x) { return x.key === k; })[0]; return (names[k] || "").trim() || r.example; }
  function fill(t) { return esc(t).replace(/\{(\w+)\}/g, function (m, k) { return "<b>" + esc(name(k)) + "</b>"; }); }

  // ---------- talking to the service ----------
  function saved() { try { var d = JSON.parse(localStorage.getItem(DKEY) || "null"); return d && d.id && d.token ? d : null; } catch (e) { return null; } }
  function forget() { try { localStorage.removeItem(DKEY); } catch (e) {} }
  function req(method, path, d, body, type) {
    var h = {};
    if (d) h.Authorization = "Bearer " + d.token;
    if (body instanceof Blob) h["Content-Type"] = type || body.type;
    else if (body !== undefined) { h["Content-Type"] = "application/json"; body = JSON.stringify(body); }
    return fetch(API + path, { method: method, headers: h, body: body }).then(function (r) {
      var isJson = (r.headers.get("Content-Type") || "").indexOf("json") >= 0;
      if (!r.ok) return (isJson ? r.json() : Promise.resolve({})).then(function (j) { var e = new Error(j.error || "Something went wrong. Please try again."); e.status = r.status; throw e; });
      return isJson ? r.json() : r.blob();
    }, function () { var e = new Error("We couldn't reach our drawing service. Please check your connection and try again."); e.status = 0; throw e; });
  }
  var creating = null;
  function draft(consent) {
    var d = saved();
    if (d) return Promise.resolve(d);
    if (!creating) creating = req("POST", "/api/drafts", null, { book: "flr-" + first.id, style: "storybook", consent: !!consent }).then(function (j) {
      var nd = { id: j.id, token: j.token, book: first.id };
      try { localStorage.setItem(DKEY, JSON.stringify(nd)); } catch (e) {}
      creating = null; return nd;
    }, function (e) { creating = null; throw e; });
    return creating;
  }
  function bookOf(d) { return byId[d.book] || first; }
  // Shrink to at most 1600px and re-encode as JPEG: smaller uploads, no EXIF or location data.
  function prepare(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var s = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error("We couldn't read that photo.")); }, "image/jpeg", 0.9);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("We couldn't read that photo. Please try a JPG or PNG.")); };
      img.src = url;
    });
  }
  function slot(k) { return /^s\d+$/.test(k) ? k : "c-" + k; }
  function fetchToon(d, k) {
    return req("GET", "/api/drafts/" + d.id + "/cartoons/" + slot(k) + "?w=web", d).then(function (b) {
      if (toons[k]) URL.revokeObjectURL(toons[k]);
      toons[k] = URL.createObjectURL(b);
    });
  }

  // ---------- drawing ----------
  var status = null;
  function showLeft() { left.textContent = status && !status.paid ? "Free tries left: " + status.redosLeft + "." : ""; }
  function draw(k, d) {
    var upload = !!files[k], stand = !upload && standin[k];
    busy[k] = true; delete errors[k]; stale(k); paint();
    var step = upload ? prepare(files[k]).then(function (b) { return req("PUT", "/api/drafts/" + d.id + "/photos/" + slot(k), d, b, "image/jpeg"); }) : Promise.resolve();
    return step.then(function () {
      var body = { story: bookOf(d).id, who: kind[k] || "" };
      if (stand) body.standin = true;
      return req("POST", "/api/drafts/" + d.id + "/cartoons/" + slot(k), d, body);
    }).then(function (j) {
      status = j; if (upload) delete files[k];
      return fetchToon(d, k);
    }).then(function () { busy[k] = false; }, function (e) {
      busy[k] = false; errors[k] = e.message;
      if (e.status === 402 || e.status === 429) msg.textContent = e.message;
      if ((e.status === 403 || e.status === 404) && (e.message === "Not found" || e.message === "Not allowed")) forget();
    }).then(function () { paint(); showLeft(); });
  }
  function wanted() { return roles.filter(function (r) { return files[r.key] || (standin[r.key] && !toons[r.key]); }); }
  function drawAll() {
    msg.textContent = "";
    var want = wanted();
    if (!files.child && !toons.child) { msg.textContent = "Please add a photo of " + name("child") + " first."; return; }
    if (!want.length) { msg.textContent = "Everyone is drawn. Choose a new photo to draw someone again."; return; }
    if (!root.querySelector("#mk-consent").checked) { msg.textContent = "Please tick the box to confirm you may use these photos."; root.querySelector("#mk-consent").focus(); return; }
    if (!API) { msg.textContent = "Drawing isn't switched on yet. Please try again soon."; return; }
    var btn = root.querySelector(".mk-go"); btn.disabled = true;
    msg.textContent = "Drawing your characters. This takes about 20 to 40 seconds each…";
    draft(true).then(function (d) {
      var queue = want.slice();
      function nextOne() { var r = queue.shift(); return r ? draw(r.key, d).then(nextOne) : Promise.resolve(); }
      return Promise.all([nextOne(), nextOne()]).then(function () { return d; });
    }).then(function (d) {
      btn.disabled = false;
      if (roles.some(function (r) { return errors[r.key]; })) { if (!/free/i.test(msg.textContent)) msg.textContent = "Some characters couldn't be drawn. You can try those again, or use a different photo."; return; }
      if (!toons.s) paintSample(d, true); else msg.textContent = "Here they are!";
    }, function (e) { btn.disabled = false; msg.textContent = e.message; });
  }

  // ---------- one free page painted with the family ----------
  var sample = root.querySelector(".mk-sample"), sampleBusy = false;
  function samplePage(b) {
    // The first page whose characters are all drawn, preferring one with the reader in it.
    for (var i = 0; i < b.pages.length; i++) {
      var cast = b.cast.filter(function (k) { return b.pages[i].d.indexOf("{" + k + "}") >= 0; });
      if (cast.indexOf("child") >= 0 && cast.every(function (k) { return toons[k]; })) return i + 1;
    }
    return 0;
  }
  function stale(k) { if (k !== "s" && toons.s) { URL.revokeObjectURL(toons.s); delete toons.s; } }
  function paintSample(d, after) {
    var b = bookOf(d), n = samplePage(b);
    if (!n || sampleBusy) return;
    sampleBusy = true; paint();
    msg.textContent = (after ? "Here are your characters! Now we're painting a page of “" + b.title + "” with them. This takes about a minute…" : "Painting a page with your family…");
    req("POST", "/api/drafts/" + d.id + "/cartoons/s" + n, d, { story: b.id }).then(function (j) {
      status = j; d.sample = n; try { localStorage.setItem(DKEY, JSON.stringify(d)); } catch (e) {}
      return req("GET", "/api/drafts/" + d.id + "/cartoons/s" + n + "?w=web", d);
    }).then(function (blob) {
      toons.s = URL.createObjectURL(blob); msg.textContent = "Done! Here is a page of your first book.";
    }, function (e) { msg.textContent = e.message; }).then(function () { sampleBusy = false; paint(); showLeft(); });
  }

  // ---------- the cards ----------
  var cards = root.querySelector(".mk-cards");
  var KINDS = {
    child: [["girl", "A girl"], ["boy", "A boy"], ["child", "Rather not say"]],
    adult: [["woman", "A woman"], ["man", "A man"], ["older woman", "An older woman"], ["older man", "An older man"]],
    pet: [["dog", "A dog"], ["cat", "A cat"], ["rabbit", "A rabbit"], ["guinea pig", "A guinea pig"], ["pet", "Another pet"]]
  };
  cards.innerHTML = roles.map(function (r) {
    return '<div class="mk-card" data-role="' + r.key + '"><div class="mk-pic"></div><div class="mk-body"><p class="who">' + esc(r.who) + "</p><h3>" + esc(r.name) + "</h3>" +
      '<label class="field"><span>' + esc(r.label) + '</span><input type="text" data-name="' + r.key + '" maxlength="20" placeholder="e.g. ' + esc(r.example) + '"></label>' +
      '<label class="field"><span>' + (r.key === "pet" ? "What kind of pet?" : "Who is it?") + '</span><select data-kind="' + r.key + '">' +
      KINDS[r.key].map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join("") + "</select></label>" +
      '<label class="mk-file btn ghost btn-sm"><input type="file" accept="image/jpeg,image/png,image/webp" data-file="' + r.key + '"><span>Choose a photo</span></label>' +
      (r.required && r.key === "child" ? "" : '<label class="check"><input type="checkbox" data-standin="' + r.key + '"><span>' + (r.key === "pet" ? "No pet? Use our stand-in dog" : "Use our stand-in instead") + "</span></label>") +
      '<p class="mk-state" role="status"></p><button type="button" class="btn ghost btn-sm mk-redo" data-redo="' + r.key + '" hidden>Draw again</button></div></div>';
  }).join("");
  cards.querySelectorAll("[data-name]").forEach(function (i) { i.value = names[i.getAttribute("data-name")] || ""; });
  cards.querySelectorAll("[data-kind]").forEach(function (s) { var k = s.getAttribute("data-kind"); if (names[k + "Kind"]) kind[k] = names[k + "Kind"]; s.value = kind[k]; });

  function paint() {
    roles.forEach(function (r) {
      var k = r.key, card = cards.querySelector('[data-role="' + k + '"]'), pic = card.querySelector(".mk-pic"), st = card.querySelector(".mk-state");
      var src = toons[k] || previews[k];
      pic.innerHTML = src ? '<img src="' + src + '" alt="">' : '<span class="mk-empty">' + (standin[k] ? "Our stand-in" : "No photo yet") + "</span>";
      pic.className = "mk-pic" + (toons[k] ? " drawn" : previews[k] ? " photo" : "") + (busy[k] ? " busy" : "");
      card.querySelector(".mk-redo").hidden = !toons[k] || busy[k] || !!files[k];
      card.querySelector(".mk-file span").textContent = toons[k] || files[k] ? "Use a different photo" : "Choose a photo";
      st.textContent = busy[k] ? "Drawing " + name(k) + "…" : errors[k] ? errors[k] : files[k] ? "Ready to draw." : toons[k] ? "Drawn." : standin[k] ? "We'll draw our own stand-in." : "";
      st.className = "mk-state" + (errors[k] ? " bad" : "");
    });
    var d = saved(), b = d ? bookOf(d) : first, n = samplePage(b);
    sample.hidden = !toons.s && !sampleBusy;
    if (toons.s) {
      var p = b.pages[(d && d.sample ? d.sample : n || 1) - 1];
      sample.innerHTML = '<p class="eyebrow">Painted with your family</p><div class="bv-page bv-spread side-right"><div class="bv-pic"><img src="' + toons.s + '" alt=""></div><div class="bv-text"><p>' + fill(p.t) +
        '</p></div></div><p class="small muted">A page of “' + esc(b.title) + "”. Every page of every book in your pack is painted the same way after you order.</p>";
    } else if (sampleBusy) sample.innerHTML = '<p class="muted">Painting a page with your family…</p>';
    var paintBtn = root.querySelector(".mk-scenes");
    paintBtn.hidden = !d || !!toons.s || !n || sampleBusy;
    root.querySelector(".mk-next").hidden = !toons.child;
  }
  cards.addEventListener("input", function (e) {
    var k = e.target.getAttribute("data-name");
    if (k) { names[k] = e.target.value; F.saveNames(names); paint(); }
  });
  cards.addEventListener("change", function (e) {
    var k = e.target.getAttribute("data-file");
    if (k && e.target.files[0]) {
      var f = e.target.files[0];
      if (!/^image\//.test(f.type)) { errors[k] = "Please choose a photo (JPG, PNG or WebP)."; paint(); return; }
      files[k] = f; delete errors[k]; standin[k] = false;
      var sb = cards.querySelector('[data-standin="' + k + '"]'); if (sb) sb.checked = false;
      if (previews[k]) URL.revokeObjectURL(previews[k]);
      previews[k] = URL.createObjectURL(f);  // shown only here, in this browser
      if (toons[k]) { URL.revokeObjectURL(toons[k]); delete toons[k]; stale(k); }
      paint();
    }
    var w = e.target.getAttribute("data-kind");
    if (w) { kind[w] = e.target.value; names[w + "Kind"] = e.target.value; F.saveNames(names); }
    var s = e.target.getAttribute("data-standin");
    if (s) { standin[s] = e.target.checked; if (e.target.checked) { delete files[s]; if (previews[s]) URL.revokeObjectURL(previews[s]); delete previews[s]; } paint(); }
  });
  cards.addEventListener("click", function (e) {
    var b = e.target.closest("[data-redo]"); if (!b) return;
    var d = saved(); if (!d) return;
    msg.textContent = ""; draw(b.getAttribute("data-redo"), d);
  });
  root.querySelector(".mk-go").addEventListener("click", drawAll);
  root.querySelector(".mk-scenes").addEventListener("click", function () { var d = saved(); if (d) paintSample(d); });
  root.querySelector(".mk-delete").addEventListener("click", function () {
    var d = saved();
    var done = function () {
      forget(); status = null;
      Object.keys(toons).forEach(function (k) { URL.revokeObjectURL(toons[k]); });
      Object.keys(previews).forEach(function (k) { URL.revokeObjectURL(previews[k]); });
      toons = {}; previews = {}; files = {}; errors = {};
      cards.querySelectorAll("input[type=file]").forEach(function (i) { i.value = ""; });
      paint(); showLeft(); msg.textContent = "Deleted. Your photos and characters have been removed from our service.";
    };
    if (!d) return done();
    req("DELETE", "/api/drafts/" + d.id, d).then(done, function (e) { if (e.status === 404 || e.status === 403) done(); else msg.textContent = e.message; });
  });

  // The books chosen on the library page.
  var list = root.querySelector(".mk-pack");
  var n = (pack.ids || []).length;
  list.innerHTML = n ? "<p><b>Your " + (n === 1 ? "book" : n + " books") + ":</b> " + pack.ids.map(function (id) { return byId[id] ? esc(byId[id].title) : ""; }).join(", ") +
    '. <a href="books.html">Change</a></p>' : '<p>You haven\'t chosen your books yet. <a href="books.html">Choose your books</a>, or draw your characters first.</p>';

  paint();

  // ---------- coming back later: show characters already drawn ----------
  var d0 = saved();
  if (d0 && API) {
    req("GET", "/api/drafts/" + d0.id, d0).then(function (st) {
      status = st; showLeft();
      var ks = roles.map(function (r) { return r.key; }).filter(function (k) { return st.cartoons.indexOf(slot(k)) >= 0; });
      return Promise.all(ks.map(function (k) { return fetchToon(d0, k).catch(function () {}); })).then(function () {
        if (d0.sample && st.cartoons.indexOf("s" + d0.sample) >= 0)
          return req("GET", "/api/drafts/" + d0.id + "/cartoons/s" + d0.sample + "?w=web", d0).then(function (b) { toons.s = URL.createObjectURL(b); }, function () {});
      });
    }).then(paint, function (e) { if (e.status === 404 || e.status === 403) forget(); });
  }
})();
