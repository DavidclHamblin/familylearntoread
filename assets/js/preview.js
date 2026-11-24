/* Family Learn to Read: the free preview, shared by the home page and "Make your characters" (make.html).
   A family's photos go to the shared photo and cartoon service, which draws each person once (c-<role>) and then
   once standing in the usual clothes (pose-<role>-costume-stand). Pages are painted in this browser by layers.js:
   our empty scene plus their cut-outs, so a preview page costs nothing extra to paint.
   The draft (id and secret token) is kept in this browser (localStorage "flr-cast"), so characters drawn on the
   home page are already there on make.html and when ordering. Photos and drawings are only ever fetched back
   with that token, into this browser; they are never published. */
(function () {
  "use strict";
  var F = window.FLR;
  if (!F) return;
  var P = F.preview = {}, DKEY = "flr-cast";
  P.ROLES = ["child", "adult", "pet"];
  P.KINDS = {
    child: [["girl", "A girl"], ["boy", "A boy"], ["child", "Rather not say"]],
    adult: [["woman", "A woman"], ["man", "A man"], ["older woman", "An older woman"], ["older man", "An older man"]],
    pet: [["dog", "A dog"], ["cat", "A cat"], ["rabbit", "A rabbit"], ["guinea pig", "A guinea pig"], ["pet", "Another pet"]]
  };
  P.DEFAULT_KIND = { child: "child", adult: "woman", pet: "dog" };
  // Pages for the home page preview: lovely scenes where everyone simply stands, so three poses paint both.
  P.HOME_PAGES = [["s3-farm", 1], ["s4-tent", 1]];

  P.api = function () {
    var t = "";
    try { t = localStorage.getItem("flr-api") || ""; } catch (e) {}
    return (t || (F.config && F.config.api) || "").replace(/\/+$/, "");
  };
  P.saved = function () { try { var d = JSON.parse(localStorage.getItem(DKEY) || "null"); return d && d.id && d.token ? d : null; } catch (e) { return null; } };
  P.keep = function (d) { try { localStorage.setItem(DKEY, JSON.stringify(d)); } catch (e) {} };
  P.forget = function () { try { localStorage.removeItem(DKEY); } catch (e) {} };

  P.req = function (method, path, d, body, type) {
    var h = {};
    if (d) h.Authorization = "Bearer " + d.token;
    if (body instanceof Blob) h["Content-Type"] = type || body.type;
    else if (body !== undefined) { h["Content-Type"] = "application/json"; body = JSON.stringify(body); }
    return fetch(P.api() + path, { method: method, headers: h, body: body }).then(function (r) {
      var isJson = (r.headers.get("Content-Type") || "").indexOf("json") >= 0;
      if (!r.ok) return (isJson ? r.json() : Promise.resolve({})).then(function (j) { var e = new Error(j.error || "Something went wrong. Please try again."); e.status = r.status; throw e; });
      return isJson ? r.json() : r.blob();
    }, function () { var e = new Error("We couldn't reach our drawing service. Please check your connection and try again."); e.status = 0; throw e; });
  };
  // A lost or deleted draft: start again next time.
  P.gone = function (e) { return (e.status === 403 || e.status === 404) && (e.message === "Not found" || e.message === "Not allowed"); };

  var creating = null;
  P.draft = function (bookId, consent) {
    var d = P.saved();
    if (d) return Promise.resolve(d);
    if (!creating) creating = P.req("POST", "/api/drafts", null, { book: "flr-" + bookId, style: "storybook", consent: !!consent }).then(function (j) {
      var nd = { id: j.id, token: j.token, book: bookId };
      P.keep(nd); creating = null; return nd;
    }, function (e) { creating = null; throw e; });
    return creating;
  };

  // Shrink to at most 1600px and re-encode as JPEG: smaller uploads, no EXIF or location data.
  P.prepare = function (file) {
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
  };

  // One drawing from the draft, as an object URL for this page only.
  P.fetch = function (d, slot) {
    return P.req("GET", "/api/drafts/" + d.id + "/cartoons/" + slot + "?w=web", d).then(function (b) { return URL.createObjectURL(b); });
  };

  // Draw (or redraw) a family member: from a photo when one is given, otherwise our own stand-in.
  P.drawChar = function (d, role, file, who, story) {
    var step = file ? P.prepare(file).then(function (b) { return P.req("PUT", "/api/drafts/" + d.id + "/photos/c-" + role, d, b, "image/jpeg"); }) : Promise.resolve();
    return step.then(function () {
      var body = { story: story, who: who || "" };
      if (!file) body.standin = true;
      return P.req("POST", "/api/drafts/" + d.id + "/cartoons/c-" + role, d, body);
    }).then(function (j) { P.stalePose(d, role); return j; });
  };

  P.poseSlot = function (role) { return "pose-" + role + "-costume-stand"; };
  // A redrawn character makes their pose out of date; d.poses remembers which poses match the drawing.
  P.stalePose = function (d, role) { if (d.poses) { delete d.poses[role]; P.keep(d); } };
  // Make sure each drawn role has a current standing pose, then fetch them all. cartoons: the slots the draft has.
  P.poses = function (d, roles, cartoons, kinds, story) {
    var urls = {}, errs = [];
    return Promise.all(roles.map(function (role) {
      var slot = P.poseSlot(role), fresh = d.poses && d.poses[role] && cartoons.indexOf(slot) >= 0;
      var make = fresh ? Promise.resolve(null) : P.req("POST", "/api/drafts/" + d.id + "/cartoons/" + slot, d, { story: story, who: kinds[role] || "" }).then(function (j) {
        d.poses = d.poses || {}; d.poses[role] = 1; P.keep(d); return j;
      });
      return make.then(function () { return P.fetch(d, slot); }).then(function (u) { urls[slot] = u; }, function (e) { errs.push(e); });
    })).then(function () { return { urls: urls, errors: errs }; });
  };

  // The first page of a book where the reader and everyone else simply stand in their usual clothes.
  P.standPage = function (book) {
    var plan = F.layers.plan(book);
    for (var i = 0; i < plan.length; i++) {
      var s = plan[i].figures.map(function (f) { return f.slot; });
      if (s.indexOf(P.poseSlot("child")) >= 0 && s.every(function (x) { return /-costume-stand$/.test(x); })) return i + 1;
    }
    return 0;
  };
  // Paint page n of a book with the family's poses; anyone not drawn is our example family.
  P.paint = function (canvas, book, n, urls) {
    var L = F.layers, ex = L.exampleUrl(P.api(), book.id);
    return L.paint(canvas, ex.scene(n), L.plan(book)[n - 1], function (slot) { return urls[slot] || ex.pose(slot); });
  };
})();
