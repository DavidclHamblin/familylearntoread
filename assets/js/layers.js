/* Family Learn to Read: layered pictures.
   Each scene (a "set") is painted once with none of the family in it, and kept for every order. Each family member
   is drawn once in a few cut-out poses on flat magenta. This file decides which pose and outfit each character has on
   each page, keys out the magenta and places the poses on the set.
   Used by books.js (Look inside), print.js and tools/export_worker.js (which tells the cartoon service the poses). */
var FLR = (typeof window !== "undefined" ? (window.FLR = window.FLR || {}) : {});
(function (F) {
  "use strict";
  var L = F.layers = {};
  L.PEOPLE = ["stand", "walk", "wave", "point", "cheer", "hold", "crouch", "sit", "bed"];  // "bed": the child in their bed (the bed is part of the cut-out)
  L.PETS = ["stand", "sit", "run", "lie", "roll"];
  // Words in a character's part of the picture description, and the pose they get: [pattern, person, pet].
  var RULES = [
    [/\b(wav(e|es|ing))\b/, "wave", "stand"],
    [/\bpoint/, "point", "stand"],
    [/\b(cheer|jump|leap|danc|hop|splash|swim|arms out|arms up|wings)/, "cheer", "run"],
    [/\b(sit|sits|sitting|sip)/, "sit", "sit"],
    [/\b(snooz|sleep|rest|lies|lying|curl)/, "sit", "lie"],
    [/\b(crouch|kneel|dig|peek|pick|search|scoop|look(s|ing)? (into|down|under))/, "crouch", "sit"],
    [/\b(hold|carr|spoon|cut|stir|giv|hand|hug|pour|wrap|tie|put|lean|lift|stroke|show)/, "hold", "stand"],
    [/\b(walk|stroll|run|race|trot|follow|head|go|went|set off)/, "walk", "run"]
  ];
  var HEIGHT = { adult: 0.74, child: 0.56, pet: 0.3 };  // of the picture's height, standing
  var SHRINK = { sit: 0.68, crouch: 0.7, lie: 0.62, roll: 0.6, cheer: 1.06, bed: 0.88 };

  // The part of the description about this role: from its {role} to the next role or the end of the clause.
  function partFor(d, role) {
    var at = d.indexOf("{" + role + "}");
    if (at < 0) return null;
    var rest = d.slice(at + role.length + 2), stop = rest.search(/[;.]|\{(child|adult|pet)\}/);
    var part = (stop < 0 ? rest : rest.slice(0, stop)).toLowerCase();
    // "{child} and {adult} sit…": the first name shares the verb that follows the next one.
    if (stop >= 0 && /^\s*(,|and|&)?\s*$/.test(part) && rest.charAt(stop) === "{") { var m = /^\{(\w+)\}/.exec(rest.slice(stop)); if (m) return partFor(rest.slice(stop), m[1]); }
    return part;
  }
  L.poseFor = function (d, role) {
    var part = partFor(d, role), pet = role === "pet";
    if (part === null) return null;
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(part)) return RULES[i][pet ? 2 : 1];
    return "stand";
  };
  // Outfit keys per page, exactly as the cartoon service names them: "costume", then outfit3, outfit4… per new outfit.
  L.outfits = function (book) {
    var seen = {}, out = [];
    book.pages.forEach(function (p) {
      var o = {};
      Object.keys(p.w || {}).forEach(function (r) {
        var list = seen[r] = seen[r] || [], n = list.indexOf(p.w[r]);
        if (n < 0) { list.push(p.w[r]); n = list.length - 1; }
        o[r] = "outfit" + (3 + n);
      });
      out.push(o);
    });
    return out;
  };
  // For each page: { side: where the words go, figures: [{ role, outfit, pose, slot, x }] } (x: a fixed place, 0–1 across).
  L.plan = function (book) {
    var outfits = L.outfits(book);
    return book.pages.map(function (p, i) {
      var figs = [];
      ["adult", "child", "pet"].forEach(function (r) {
        if (book.cast.indexOf(r) < 0) return;
        var pose = (p.p && p.p[r]) || L.poseFor(p.d, r);
        if (!pose) return;
        var outfit = outfits[i][r] || "costume";
        figs.push({ role: r, outfit: outfit, pose: pose, slot: "pose-" + r + "-" + outfit + "-" + pose, x: p.x && p.x[r] });
      });
      if (!figs.length && /\b(all three|everyone|the family|both of them|together)\b/i.test(p.d))  // the whole cast, unnamed
        book.cast.slice().sort(function (a, b) { return ["adult", "child", "pet"].indexOf(a) - ["adult", "child", "pet"].indexOf(b); }).forEach(function (r) {
          var outfit = outfits[i][r] || "costume";
          figs.push({ role: r, outfit: outfit, pose: "stand", slot: "pose-" + r + "-" + outfit + "-stand" });
        });
      return { side: i % 2 ? "left" : "right", figures: figs };
    });
  };
  // Every pose slot a set of books needs (so a family's poses are drawn once for the whole pack).
  L.slotsFor = function (books) {
    var all = {};
    books.forEach(function (b) { L.plan(b).forEach(function (pg) { pg.figures.forEach(function (f) { all[f.slot] = f; }); }); });
    return Object.keys(all).sort().map(function (k) { return all[k]; });
  };

  if (typeof document === "undefined") return;

  // ---------- drawing ----------
  var cache = {};
  function loadImg(url) {
    if (!cache[url]) cache[url] = new Promise(function (ok, no) {
      var i = new Image(); i.crossOrigin = "anonymous";
      i.onload = function () { ok(i); }; i.onerror = function () { delete cache[url]; no(new Error("couldn't load " + url)); };
      i.src = url;
    });
    return cache[url];
  }
  // Keys out the flat magenta (#FF00FF; green would cut out green clothes) and trims to the character. Returns a canvas.
  var keyed = {};
  L.cutout = function (url) {
    if (!keyed[url]) keyed[url] = loadImg(url).then(function (img) {
      var w = img.naturalWidth, h = img.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
      var g = c.getContext("2d"); g.drawImage(img, 0, 0);
      var px = g.getImageData(0, 0, w, h), d = px.data, x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var o = (y * w + x) * 4, r = d[o], gr = d[o + 1], b = d[o + 2], k = Math.min(r, b) - gr;
        if (k > 90) { d[o + 3] = 0; continue; }
        if (k > 30) { d[o + 3] = Math.round(255 * (1 - (k - 30) / 60)); d[o] = Math.max(gr, r - k); d[o + 2] = Math.max(gr, b - k); }  // soft edge, no pink fringe
        else if (k > 0) { d[o] = r - Math.round(k / 3); d[o + 2] = b - Math.round(k / 3); }
        if (d[o + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      g.putImageData(px, 0, 0);
      if (x1 <= x0 || y1 <= y0) throw new Error("empty cut-out");
      var t = document.createElement("canvas"); t.width = x1 - x0 + 1; t.height = y1 - y0 + 1;
      t.getContext("2d").drawImage(c, x0, y0, t.width, t.height, 0, 0, t.width, t.height);
      return t;
    });
    return keyed[url];
  };
  // The painter sometimes draws a thin "book fold" line straight down the middle of a set. Finds a column near the
  // middle that differs from both neighbours (which match each other) on most rows, and blends it away.
  L.unseam = function (g, W, H) {
    var r = Math.max(4, Math.round(W * 0.012)), x0 = Math.round(W / 2) - r - 4, w = 2 * r + 8, step = Math.max(1, Math.floor(H / 300));
    var img = g.getImageData(x0, 0, w, H), d = img.data, lum = function (x, y) { var o = (y * w + x) * 4; return d[o] * 0.3 + d[o + 1] * 0.59 + d[o + 2] * 0.11; };
    var bad = [];
    for (var x = 4; x < w - 4; x++) {
      var hit = 0, n = 0;
      for (var y = 0; y < H; y += step) {
        var a = lum(x - 3, y), b = lum(x + 3, y), m = lum(x, y); n++;
        if (Math.abs(a - b) < 14 && Math.abs(m - (a + b) / 2) > 10) hit++;
      }
      bad.push(hit / n > 0.45);
    }
    var fixed = 0;
    for (var i = 0; i < bad.length; i++) {
      if (!bad[i]) continue;
      var j = i; while (j + 1 < bad.length && bad[j + 1]) j++;
      if (j - i < 6) {  // a thin line, not a real edge in the picture
        var L0 = i + 4 - 2, R0 = j + 4 + 2;
        for (var y2 = 0; y2 < H; y2++) for (var xx = L0 + 1; xx < R0; xx++) {
          var t = (xx - L0) / (R0 - L0), o = (y2 * w + xx) * 4, oa = (y2 * w + L0) * 4, ob = (y2 * w + R0) * 4;
          for (var k = 0; k < 3; k++) d[o + k] = d[oa + k] * (1 - t) + d[ob + k] * t;
        }
        fixed++;
      }
      i = j;
    }
    if (fixed) g.putImageData(img, x0, 0);
    return fixed;
  };
  // Paints a set with its figures onto canvas c (any size, 16:9 is best). page: one entry of L.plan();
  // url(slot) gives each picture's address. Resolves when done; rejects if the set is missing.
  L.paint = function (c, sceneUrl, page, url) {
    return Promise.all([loadImg(sceneUrl)].concat(page.figures.map(function (f) { return L.cutout(url(f.slot)).catch(function () { return null; }); })))
      .then(function (got) {
        var W = c.width, H = c.height, g = c.getContext("2d"), scene = got[0];
        var s = Math.max(W / scene.naturalWidth, H / scene.naturalHeight);
        g.drawImage(scene, (W - scene.naturalWidth * s) / 2, (H - scene.naturalHeight * s) / 2, scene.naturalWidth * s, scene.naturalHeight * s);
        try { L.unseam(g, W, H); } catch (e) {}  // a canvas from another site without CORS can't be read; leave it
        var figs = page.figures.map(function (f, i) { return { f: f, img: got[i + 1] }; }).filter(function (x) { return x.img; });
        var zone = page.side === "right" ? [0.05, 0.64] : [0.36, 0.95], flip = page.side === "left", ground = 0.95 * H;
        figs.forEach(function (x, i) {
          var hgt = HEIGHT[x.f.role] * (SHRINK[x.f.pose] || 1) * (figs.length === 1 && x.f.role === "pet" ? 1.6 : 1) * H, wid = hgt * x.img.width / x.img.height;
          var at = zone[0] + (zone[1] - zone[0]) * (flip ? (figs.length - i) : (i + 1)) / (figs.length + 1);
          var cx = (x.f.x != null ? x.f.x : at) * W, left = cx - wid / 2;
          g.save(); g.fillStyle = "rgba(30,26,51,.16)"; g.beginPath(); g.ellipse(cx, ground - 2, wid * 0.42, hgt * 0.035, 0, 0, Math.PI * 2); g.fill(); g.restore();
          g.save();
          if (flip) { g.translate(cx * 2, 0); g.scale(-1, 1); }
          g.drawImage(x.img, left, ground - hgt, wid, hgt);
          g.restore();
        });
        return c;
      });
  };
  // Our example family's pictures (stand-ins, never a real person) and the sets, from the cartoon service.
  // Change this after repainting any example pictures, so browsers and the cache fetch the new ones at once.
  L.ART = "20261126a";
  L.exampleUrl = function (api, bookId) {
    api = (api || "").replace(/\/+$/, "");
    return {
      scene: function (n) { return api + "/api/sets/" + bookId + "/s" + n + "?w=web&v=" + L.ART; },
      // A pose in the usual clothes is shared by every book; one in a book's own outfit lives with that book.
      pose: function (slot) { return api + "/api/sets/" + (/-costume-/.test(slot) ? "example" : bookId) + "/" + slot + "?w=web&v=" + L.ART; }
    };
  };
})(FLR);

if (typeof module !== "undefined" && module.exports) module.exports = FLR.layers;
