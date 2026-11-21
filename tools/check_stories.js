#!/usr/bin/env node
/* Checks every stock story page with the level checker. Run: node tools/check_stories.js
   Exits with an error if any page is above its stage, so it can run before each build. */
"use strict";
var P = require("../assets/js/phonics.js");
var readers = require("../assets/js/readers.js");

var bad = 0, ids = {};
readers.forEach(function (b) {
  if (ids[b.id]) { console.log(b.id + ": duplicate id"); bad++; }
  ids[b.id] = true;
  if (b.pages.length !== 10) { console.log(b.id + ": " + b.pages.length + " pages (books have 10)"); bad++; }
  var names = b.cast.slice();
  var title = P.page(b.title.replace(/\{(\w+)\}/g, "$1"), b.stage, names);
  if (!title.ok) { console.log(b.id + " title: " + title.problems.join("; ")); bad++; }
  b.pages.forEach(function (p, i) {
    var text = p.t.replace(/\{(\w+)\}/g, "$1");
    (p.t.match(/\{(\w+)\}/g) || []).concat(p.d.match(/\{(\w+)\}/g) || []).forEach(function (tok) {
      if (b.cast.indexOf(tok.slice(1, -1)) < 0) { console.log(b.id + " p" + (i + 1) + ": " + tok + " is not in the cast"); bad++; }
    });
    var r = P.page(text, b.stage, names);
    if (!r.ok) { console.log(b.id + " p" + (i + 1) + ": " + r.problems.join("; ")); bad++; }
  });
});
console.log(readers.length + " books, " + (bad ? bad + " problems" : "all pages pass"));
process.exit(bad ? 1 : 0);
