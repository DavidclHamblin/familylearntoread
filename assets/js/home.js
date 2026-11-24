/* Family Learn to Read: real painted pages on the home page.
   Each [data-sample="<book>:<page>"] gets that page painted from our sets with our example family (layers.js),
   and the words with our example names. A sample whose picture isn't painted yet stays as it is (the hero keeps
   its drawing; a card in the "See inside" row is hidden). [data-family] images show our example family. */
(function () {
  "use strict";
  var F = window.FLR, L = F && F.layers;
  if (!L || !F.readers || !F.config || !F.config.api) return;
  var API = F.config.api.replace(/\/+$/, ""), byId = {};
  F.readers.forEach(function (b) { byId[b.id] = b; });
  function name(k) { var r = F.readerRoles.filter(function (x) { return x.key === k; })[0]; return r ? r.example : k; }
  function esc(s) { return F.esc ? F.esc(s) : String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function words(t) { return esc(t).replace(/\{(\w+)\}/g, function (m, k) { return "<b>" + esc(name(k)) + "</b>"; }); }

  document.querySelectorAll("[data-sample]").forEach(function (el) {
    var bits = el.getAttribute("data-sample").split(":"), b = byId[bits[0]], n = +bits[1] - 1;
    if (!b || !b.pages[n]) return;
    var c = el.querySelector("canvas"), text = el.querySelector("[data-words]"), after = el.querySelector("[data-words-after]"), u = L.exampleUrl(API, b.id);
    if (text) text.innerHTML = words(b.pages[n].t);
    L.paint(c, u.scene(n + 1), L.plan(b)[n], u.pose).then(function () {
      el.classList.add("painted");
      if (after) after.innerHTML = words(b.pages[n].t);  // the hero keeps its own words until its picture is painted
    }).catch(function () {
      if (el.hasAttribute("data-optional")) el.hidden = true;
      else el.classList.add("failed");
    });
  });
  document.querySelectorAll("[data-family]").forEach(function (img) {
    img.addEventListener("error", function () { var f = img.closest("figure"); if (f) f.hidden = true; });
    img.src = API + "/api/sets/example/c-" + img.getAttribute("data-family") + "?w=web&v=" + L.ART;
  });
})();
