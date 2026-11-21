/* Family Learn to Read: things the library, the book maker and the print page share.
   Names and the chosen pack are kept in this browser only (localStorage), never sent anywhere
   until the family draws their characters or orders. */
(function () {
  "use strict";
  var F = window.FLR;
  function get(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  F.loadNames = function () { return get("flr-names", {}); };
  F.saveNames = function (n) { put("flr-names", n); };
  F.loadPack = function () { return get("flr-pack", { format: "printed", ids: [] }); };
  F.savePack = function (p) { put("flr-pack", p); };

  // The best price for n books: packs of 10, then packs of 5, then single books.
  F.packPrice = function (format, n) {
    var sz = F.prices[format].sizes, parts = [], how = [], tens = Math.floor(n / 10), fives = Math.floor((n % 10) / 5), ones = n % 5;
    if (tens) { for (var i = 0; i < tens; i++) parts.push(sz[10]); how.push(tens > 1 ? tens + " packs of 10" : "a pack of 10"); }
    if (fives) { parts.push(sz[5]); how.push("a pack of 5"); }
    if (ones) { for (var j = 0; j < ones; j++) parts.push(sz[1]); how.push(ones > 1 ? ones + " single books" : "1 single book"); }
    var amt = parts.reduce(function (s, eur) { return s + (F.amount ? F.amount(eur) : eur); }, 0);
    var cur = F.regionInfo ? F.regionInfo().currency : "€";
    return { parts: parts, total: amt, text: cur + amt, how: how.length ? "As " + how.join(" and ") + "." : "" };
  };
  F.moneyText = function (eur) { return F.money ? F.money(eur) : "€" + eur; };
})();
