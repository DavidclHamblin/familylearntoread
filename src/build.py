"""Builds the Family Learn to Read static site.

python3 src/build.py  ->  dist/  (the real site, for GitHub Pages)
Stages, sound packs, school schemes and prices live in assets/js/data.js; this script reads it with node,
so there is one source of truth.
"""
import hashlib, json, re, shutil, subprocess
from pathlib import Path
from html import escape as e

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
DOMAIN = "www.familylearntoread.com"
SITE = f"https://{DOMAIN}"

data = json.loads(subprocess.check_output(["node", "-e", """
global.window = {}; require(process.argv[1]); console.log(JSON.stringify(window.FLR));
""", str(ROOT / "assets/js/data.js")]))
CFG, STAGES, PACKS, SCHEMES = data["config"], data["stages"], data["soundPacks"], data["schemes"]
REGIONS, PRICES, GBP, BAND_STAGE = data["regions"], data["prices"], data["gbp"], data["bandStage"]
# The stock stories, checked word by word before every build (tools/check_stories.js).
subprocess.check_call(["node", str(ROOT / "tools/check_stories.js")], stdout=subprocess.DEVNULL)
READERS = json.loads(subprocess.check_output(["node", "-e", "console.log(JSON.stringify(require(process.argv[1])))", str(ROOT / "assets/js/readers.js")]))
DISCOUNT = CFG["foundingDiscount"]
NOT_CONNECTED = ("Reading scheme names belong to their publishers. Family Learn to Read is not connected with "
                 "or endorsed by any reading scheme publisher; we show scheme levels only to help you find a stage.")


def money(eur):
    """A price shown in pounds by default; region.js switches it to euros for EU visitors."""
    return f'<span class="money" data-eur="{eur}">£{GBP[str(eur)]}</span>'


FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400;500;600;700&family=Oswald:wght@600&display=swap"
_BOOK = ('<path d="M16 8C12 5 6 5 2 6V16C6 15 12 15 16 17.2Z" fill="#EE4B2B"/><path d="M16 8C20 5 26 5 30 6V16C26 15 20 15 16 17.2Z" fill="#FFC21A"/>'
         '<path d="M2 17.4C6 16.4 12 16.4 16 18.6V28C12 25 6 25 2 26Z" fill="#16A6E3"/><path d="M30 17.4C26 16.4 20 16.4 16 18.6V28C20 25 26 25 30 26Z" fill="#1FB45A"/>'
         '<path d="M16 8v20" stroke="#1E1A33" stroke-width="1.5"/>')
LOGO = f'<svg class="logo-book" viewBox="0 0 32 32" aria-hidden="true">{_BOOK}</svg>'
FAVICON = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">{_BOOK}</svg>'


def v(rel):
    """Asset link with a short content hash, so browsers fetch a changed file straight away."""
    h = hashlib.sha1((ROOT / "assets" / rel).read_bytes()).hexdigest()[:8]
    return f"assets/{rel}?v={h}"


def head(title, desc, path):
    return f"""<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}/{path}">
<link rel="canonical" href="{SITE}/{path}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{v("css/site.css")}">
"""


def header(active=""):
    def a(href, label, key):
        cur = ' aria-current="page"' if key == active else ""
        return f'<a href="{href}"{cur}>{label}</a>'
    return f"""<header class="site-head"><div class="wrap">
<a class="logo" href="index.html" aria-label="Family Learn to Read home">{LOGO}Family Learn to Read</a>
<nav class="nav" aria-label="Main">{a("index.html#stages", "Stages", "stages")}{a("books.html", "Books", "books")}{a("index.html#sounds", "Sounds", "sounds")}{a("check.html", "Reading check", "check")}{a("index.html#pricing", "Pricing", "pricing")}{a("index.html#faq", "FAQ", "faq")}</nav>
<label class="region"><span class="sr-only">Deliver to</span><select class="region-select" aria-label="Deliver to">{''.join(f'<option value="{k}">{e(r["label"])}</option>' for k, r in REGIONS.items())}</select></label>
<a class="btn btn-sm red" href="index.html#join">Join the list</a>
</div></header>
<p class="region-bar" id="region-bar" role="status" hidden></p>"""


def footer():
    return f"""<footer class="site-foot"><div class="wrap foot-grid">
<div style="display:grid;gap:10px;max-width:380px"><a class="logo" href="index.html">{LOGO}Family Learn to Read</a>
<p class="small">Early reading books and phonics books with your family as the characters, for ages 4 to 7.</p></div>
<div style="display:grid;gap:12px"><div class="foot-links"><a href="index.html#stages">Stages</a><a href="books.html">Yellow books</a><a href="books-blue.html">Blue books</a><a href="make.html">Make your characters</a><a href="index.html#sounds">Sound packs</a><a href="check.html">Reading check</a><a href="schemes.html">School schemes</a><a href="index.html#faq">FAQ</a><a href="index.html#faq-privacy">Photo privacy</a><a href="mailto:{CFG["email"]}">Contact</a></div>
<div class="foot-links"><a href="{CFG["storybooks"]}">Family Storybooks</a><a href="{CFG["boardBooks"]}">Family Board Books</a></div>
<p class="small">&copy; <span data-year>2026</span> Family Learn to Read &middot; familylearntoread.com &middot; part of <a href="{CFG["umbrella"]}">Our Family Presents</a></p>
<p class="small" style="max-width:62ch">{e(NOT_CONNECTED)}</p></div>
</div></footer>"""


def page(title, desc, path, body, active="", scripts=()):
    return f"""<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{head(title, desc, path)}</head>
<body>
{header(active)}
<main>
{body}
</main>
{footer()}
<script src="{v("js/data.js")}"></script>
<script src="{v("js/region.js")}"></script>
<script src="{v("js/site.js")}"></script>
{"".join(f'<script src="{v("js/" + x)}"></script>' for x in scripts)}
</body>
</html>
"""


# ---------- Drawings (our own placeholders, never customer photos) ----------
def kid(x, y, s, top, skin, hair, bun=False):
    return (f'<g transform="translate({x} {y}) scale({s})">'
            f'<path d="M24 126 34 62h32l10 64z" fill="{top}"/><circle cx="50" cy="44" r="16" fill="{skin}"/>'
            f'<path d="M34 42c2-14 30-14 32 0-6-6-26-6-32 0z" fill="{hair}"/>'
            + (f'<circle cx="50" cy="25" r="7" fill="{hair}"/>' if bun else "")
            + '<circle cx="44" cy="46" r="1.8" fill="#1E1A33"/><circle cx="56" cy="46" r="1.8" fill="#1E1A33"/>'
            '<path d="M45 52q5 4 10 0" stroke="#1E1A33" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>')


POND = ('<svg viewBox="0 0 400 240" aria-hidden="true"><rect width="400" height="240" fill="#DDF1F8"/>'
        '<circle cx="330" cy="50" r="26" fill="#FFE59A"/><path d="M0 150q100-30 200-10t200-10v110H0z" fill="#9CCB8C"/>'
        '<ellipse cx="250" cy="190" rx="120" ry="34" fill="#16A6E3"/><ellipse cx="250" cy="186" rx="104" ry="24" fill="#5CC4EA"/>'
        '<g transform="translate(250 186)"><path d="M-22 0q22-16 44 0-22 16-44 0z" fill="#FF8A1F"/><path d="M22 0l14-10v20z" fill="#FF8A1F"/><circle cx="-10" cy="-2" r="2.4" fill="#1E1A33"/></g>'
        + kid(40, 70, 1.15, "#8A3FD9", "#F1CFB5", "#5a3a22", bun=True) + kid(110, 96, 0.95, "#1FB45A", "#C98E6A", "#2b1d14")
        + '</svg>')


def hero_words():
    """The hero page's own words with our example names, so nothing changes when its picture is painted."""
    roles = {"child": "Sam", "adult": "Mum", "pet": "Biscuit"}
    b = next(x for x in READERS if x["id"] == "s3-rain")
    return re.sub(r"\{(\w+)\}", lambda m: "<b>" + e(roles.get(m.group(1), m.group(1))) + "</b>", e(b["pages"][4]["t"]))


def sample_page():
    """A sample Stage 3 page: picture on top, words below, the sound being practised picked out."""
    return f"""<figure class="reader" aria-label="A sample page from a Stage 3 reader" data-sample="s3-rain:5">
<div class="reader-pic">{POND}<canvas width="1600" height="900" aria-hidden="true"></canvas></div>
<p class="reader-text" data-words-after>{hero_words()}</p>
<figcaption class="small">Example page, Stage 3 (Yellow band). Your book shows your own family, drawn from your photos.</figcaption>
</figure>"""


SAMPLES = [("s3-owl", 8), ("s4-tent", 4), ("s4-snow", 7)]  # pages that layer well
TRY_PAGES = [("s3-farm", 1), ("s4-tent", 1)]  # the free preview: everyone stands, so 3 poses paint both (keep in step with preview.js)


def see_inside():
    """Real painted pages from the books, before anyone starts choosing (home.js paints them)."""
    by = {b["id"]: b for b in READERS}
    band = {x["n"]: x for x in STAGES}
    cards = "".join(f'''<figure class="peek" data-sample="{bid}:{n}" data-optional style="--bc:{band[by[bid]["stage"]]["color"]}">
<div class="peek-pic"><canvas width="1600" height="900" aria-hidden="true"></canvas></div>
<p class="peek-words" data-words></p>
<figcaption><b>{e(by[bid]["title"])}</b> · Stage {by[bid]["stage"]}, {e(band[by[bid]["stage"]]["band"])} · page {n}</figcaption></figure>''' for bid, n in SAMPLES)
    family = "".join(f'<figure><img data-family="{k}" alt="Our example {lbl}" width="180" height="240" loading="lazy"><figcaption>{lbl.capitalize()}</figcaption></figure>' for k, lbl in (("child", "child"), ("adult", "grown-up"), ("pet", "pet")))
    return f'''<section id="inside" class="section" style="padding-top:28px"><div class="wrap">
<div class="sec-head"><p class="eyebrow">See inside</p><h2>Real pages from our books</h2>
<p class="lede">Every page is painted, and your family are drawn into every picture. These pages show our example family: Sam, Mum and Biscuit the dog.</p></div>
<div class="peeks">{cards}</div>
<div class="family-row"><div><h3>Your family, drawn once</h3><p class="muted">Send a photo of your child, the grown-up who reads with them and your pet (or use ours). We draw each of them once in the book style, and they appear in every book you choose.</p>
<p><a class="btn red" href="books.html">Look inside every book</a></p></div><div class="family-figs">{family}</div></div>
{try_family()}
</div></section>'''


def try_family():
    """See your own family: try.js draws their characters from photos and paints two pages with them (free preview)."""
    pages = "".join(f'''<figure class="peek" data-try-page="{bid}:{n}" style="--bc:{dict((x["n"], x["color"]) for x in STAGES)[next(b["stage"] for b in READERS if b["id"] == bid)]}">
<div class="peek-pic"><canvas width="1600" height="900" aria-hidden="true"></canvas></div>
<p class="peek-words" data-words></p>
<figcaption><b>{e(next(b["title"] for b in READERS if b["id"] == bid))}</b> · page {n}</figcaption></figure>''' for bid, n in TRY_PAGES)
    return f'''<div class="try" data-try hidden>
<div class="try-head"><p class="eyebrow">Free preview</p><h3>See your own family in the books</h3>
<p class="muted">Add a photo of your child, and of the grown-up and pet if you like (or keep ours). We'll draw them and paint two pages with them, free, in a minute or two. Your photos stay private: they're shrunk on your device, never shown to anyone else, and you can delete them at any time.</p></div>
<div class="try-picks"></div>
<label class="check try-consent"><input type="checkbox" data-try-consent><span>I'm the parent or guardian, or I have permission from the people in these photos to use them.</span></label>
<div class="try-actions"><button type="button" class="btn red" data-try-go>Draw my family</button><button type="button" class="btn ghost btn-sm" data-try-delete hidden>Delete my photos</button></div>
<p class="try-msg" role="status" aria-live="polite"></p>
<div class="peeks try-pages" hidden>{pages}</div>
<div class="try-next" hidden><p>Your family is saved in this browser for 14 days, ready for your books.</p><p><a class="btn red" href="books.html">Choose your books</a> <a class="btn ghost" href="make.html">Change your characters</a></p></div>
</div>'''


def stage_card(s):
    return f"""<article class="stage" id="stage-{s["n"]}" style="--sc:{s["color"]};--si:{s["ink"]}">
<div class="stage-top"><span class="stage-n">Stage {s["n"]}</span><span class="stage-band">{e(s["band"])} band</span></div>
<p class="stage-what">{e(s["what"])}</p>
<dl class="stage-facts"><div><dt>School year</dt><dd>{e(s["year"])}</dd></div><div><dt>Phonics</dt><dd>{e(s["phase"])}</dd></div><div><dt>Words</dt><dd>{e(s["text"])}</dd></div></dl>
{f'<a class="stage-cta" href="{books_file(s["n"])}">See the {len([b for b in READERS if b["stage"] == s["n"]])} books &rarr;</a>' if any(b["stage"] == s["n"] for b in READERS) else f'<a class="stage-cta" href="#join" data-want="stage-{s["n"]}">Notify me &rarr;</a>'}
</article>"""


def pack_card(p):
    chips = "".join(f'<li>{e(x)}</li>' for x in p["sounds"])
    return f"""<article class="pack" style="--pc:{p["color"]}">
<p class="eyebrow">{e(p["phase"])}</p><h3>{e(p["name"])}</h3>
<ul class="sounds" aria-label="Sounds in this pack">{chips}</ul>
<p class="muted small">5 books, one for each sound, packed with words that use it.</p>
<a class="stage-cta" href="#join" data-want="sounds-{p["id"]}">Notify me &rarr;</a>
</article>"""


def finder():
    return """<div class="finder">
<div class="finder-col"><h3>My child's school uses a reading scheme</h3>
<p class="muted">Pick the scheme and the level or colour of the books your child brings home. We'll match it to our stage.</p>
<div class="field"><label for="f-scheme">School reading scheme</label><select id="f-scheme"></select></div>
<div class="field"><label for="f-level">Level or colour</label><select id="f-level" disabled><option value="">Then choose the level</option></select></div>
<p class="small"><a href="schemes.html">How school schemes match our stages</a></p></div>
<div class="finder-col finder-alt"><h3>Not sure? Take our reading check</h3>
<p class="muted">Your child reads a few short passages out loud and you tell us how it went. It takes about two minutes and needs no sign-up.</p>
<a class="btn" href="check.html">Start the free reading check</a></div>
<div id="f-out" class="finder-out" aria-live="polite"></div>
</div>"""


def want_options(selected=""):
    opts = ['<option value="">Not sure yet</option>']
    opts += [f'<option value="stage-{s["n"]}">Stage {s["n"]} ({e(s["band"])} band)</option>' for s in STAGES]
    opts += [f'<option value="sounds-{p["id"]}">Sounds: {e(p["phase"])}, {e(p["name"])}</option>' for p in PACKS]
    return "".join(o.replace(f'value="{selected}"', f'value="{selected}" selected') if selected else o for o in opts)


def join_band():
    return f"""<section class="section" style="padding-top:0"><div class="wrap">
<div class="band" id="join">
<div style="display:grid;gap:14px"><p class="eyebrow" style="color:#CFCADE">Founding families</p><h2>Be first to read, and get {DISCOUNT}% off</h2><p>Our first reading packs open for orders soon. Join the list and we'll email you a {DISCOUNT}% founding-family discount for your first pack.</p></div>
<form class="form" data-signup="waitlist" novalidate>
<div class="field"><label for="w-email" style="color:#fff">Email</label><div class="form-row"><input id="w-email" name="email" type="email" autocomplete="email" placeholder="name@example.com" required><button class="btn red" type="submit">Join the list</button></div></div>
<div class="field"><label for="w-want" style="color:#fff">Which pack would you like first?</label><select id="w-want" name="want" onchange="this.dataset.touched=1">{want_options()}</select></div>
<div class="field"><label for="w-format" style="color:#fff">Printed or online?</label><select id="w-format" name="format"><option value="printed">Printed books (online copies included)</option><option value="online">Online only</option><option value="unsure">Not sure yet</option></select></div>
<div class="field"><label for="w-cast" style="color:#fff">Who would star in the books? (optional)</label><input id="w-cast" name="cast" type="text" placeholder="For example: Mia, Dad, Grandma and Biscuit the dog"></div>
<p class="form-msg" role="status" style="color:#fff"></p>
</form></div></div></section>"""


FAQ = [
    ("How do I know which stage to choose?", "Pick the reading scheme your child's school uses and the level or colour of the books they bring home, and we'll match it to our stage. If you're not sure, our free reading check takes about two minutes: your child reads a few short passages and you tell us how it went."),
    ("Are these the same books my child reads at school?", "No. Every story and picture is our own, and we are not connected with any reading scheme publisher. Our stages follow the same Book Band colours and phonics phases that most UK schools use, so the words are pitched at the level your child is learning."),
    ("How do you put my family in the books?", "You add an ordinary photo of each person and choose who is who. We first draw everyone as a cartoon character, you approve them, and every page of every book is drawn from those characters. Your family looks the same from the first page of the first book to the last."),
    ("What is a sound pack?", "Five books, each built around one sound such as ch, sh or ar. The story is packed with words that use the sound, the letters are picked out in colour, and the last page has a few words to practise."),
    ("Printed or online?", f"Printed books are short square paperbacks posted to you, and they come with the online versions free. Online books are the same stories on a private page you can open on a phone, tablet or computer. Launch prices: one printed book {money(PRICES['printed']['sizes']['1'])}, 5 for {money(PRICES['printed']['sizes']['5'])} or 10 for {money(PRICES['printed']['sizes']['10'])}; online, one book {money(PRICES['online']['sizes']['1'])}, 5 for {money(PRICES['online']['sizes']['5'])} or 10 for {money(PRICES['online']['sizes']['10'])}."),
    ("Can I buy just one book, or more than five?", "Yes. Every book can be bought on its own, or in a pack of 5 or 10. A pack is always different stories at the same stage (or different sounds), never copies of one book, and your family's characters are the same in every book."),
    ("Can I write my own story?", "Soon. You'll be able to tell us an idea, such as a day at the beach with Grandad, and we'll write it at your child's stage. Every word is checked against the sounds and words for that stage before anything is drawn, and you read and approve the story first."),
    ("When my child moves up, can the same family appear again?", "Yes, if you choose to keep your family's characters. We keep only the cartoon characters, never your photos, so the next pack shows the same family. You can delete them at any time."),
    ("Where are my photos stored?", "In private, encrypted storage in the European Union, in Cloudflare's EU data centres. Before a photo leaves your phone or computer, we shrink it and remove hidden details such as where it was taken. Your photos are never published.", "faq-privacy"),
    ("How long do you keep my photos?", "Free previews are deleted after 14 days if you don't order. Original photos are deleted once your books are made. You can delete everything yourself at any time. We never use your photos for advertising or to train AI."),
    ("Where do you deliver?", "The UK and Europe. We'll confirm delivery times and costs when ordering opens. Online packs work anywhere."),
]


def faq_html():
    return "".join(f'<details{" id=" + chr(34) + q[2] + chr(34) if len(q) > 2 else ""}><summary>{e(q[0])}</summary><p>{q[1] if "money" in q[1] else e(q[1])}</p></details>' for q in FAQ)


def sizes_table(sz):
    rows = "".join(f'<tr><th scope="row">{"1 book" if n == "1" else n + " books"}</th><td>{money(eur)}</td></tr>' for n, eur in sz.items())
    return f'<table class="sizes">{rows}</table>'


def pricing():
    p, o, w = PRICES["printed"], PRICES["online"], PRICES["own"]
    return f"""<section id="pricing" class="section" style="--bc:var(--red);padding-top:0"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Pricing</p><h2>One book, or a pack of 5 or 10</h2><p class="lede">Buy a single book, or save with a pack of 5 or 10 different stories at your child's stage. Choose printed books, or read them online. Founding families on our list get {DISCOUNT}% off their first order.</p></div>
<div class="editions">
<div class="edition featured"><span class="badge">Most popular</span><h3>{e(p["name"])}</h3><p class="muted">{e(p["what"])}</p><p class="amt">{money(p["sizes"]["5"])} <small>for 5 books</small></p>{sizes_table(p["sizes"])}<p class="muted">{e(p["detail"])}</p><a class="btn red" href="#join">Join the list for {DISCOUNT}% off</a></div>
<div class="edition"><h3>{e(o["name"])}</h3><p class="muted">{e(o["what"])}</p><p class="amt">{money(o["sizes"]["5"])} <small>for 5 books</small></p>{sizes_table(o["sizes"])}<p class="muted">{e(o["detail"])}</p></div>
<div class="edition"><span class="badge" style="background:var(--muted)">Coming later</span><h3>{e(w["name"])}</h3><p class="muted">{e(w["what"])}</p><p class="amt">+{money(w["price"])} <small>a book</small></p><p class="muted">{e(w["detail"])}</p></div>
</div>
<p class="note">Launch prices, to be confirmed before ordering opens. A pack is always different stories, never copies of one book. Delivery costs for printed books are shown at checkout.</p>
</div></section>"""


# ---------- Home ----------
def home():
    stages = "".join(stage_card(s) for s in STAGES)
    packs = "".join(pack_card(p) for p in PACKS)
    body = f"""
<section class="hero"><div class="wrap hero-grid split">
<div class="hero-copy">
<h1 class="wordmark">Family Learn to Read</h1>
<p class="lede">Early reading books and phonics books at your child's exact level, with your family as the characters.</p>
<div class="hero-cta"><a class="btn red" href="#find">Find your child's stage</a><a class="btn ghost" href="#join">Join the list for {DISCOUNT}% off</a></div>
</div>
{sample_page()}
</div></section>

{see_inside()}

<section id="find" class="section" style="padding-top:28px"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Step one</p><h2>Find your child's stage</h2><p class="lede">Books at the right level build confidence: your child should be able to read almost every word.</p></div>
{finder()}
</div></section>

<section id="stages" class="section" style="padding-top:0"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Reading stages</p><h2>Eight stages, from first words to confident reading</h2><p class="lede">Each stage follows the Book Band colours and phonics phases used in most UK schools. Every pack has five stories written for that stage.</p></div>
<div class="stages">{stages}</div>
</div></section>

<section id="sounds" class="section" style="padding-top:0"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Sound packs</p><h2>One sound, one story</h2><p class="lede">Practise the sounds your child is learning at school, from the very first letters to ch, sh, ar and ew. Each book is packed with words that use its sound, and the letters are picked out in colour.</p></div>
<div class="packs">{packs}</div>
</div></section>

<section id="how" class="section" style="padding-top:0"><div class="wrap">
<div class="sec-head"><p class="eyebrow">How it works</p><h2>From photos to reading books</h2></div>
<div class="steps four">
<div class="step"><h3>Choose a stage or sounds</h3><p>Match your school's reading scheme, or take our two-minute reading check.</p></div>
<div class="step"><h3>Cast your family</h3><p>Add a photo of each person: your reader, grown-ups, brothers and sisters, even the dog.</p></div>
<div class="step"><h3>Meet your characters</h3><p>We draw everyone as a cartoon first. You approve them, and they open every book.</p></div>
<div class="step"><h3>Read in print or online</h3><p>Every page is drawn from your approved characters, so they look the same in every book.</p></div>
</div></div></section>

<section class="section" style="padding-top:0"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Why families choose us</p><h2>Reading practice they'll want to do</h2></div>
<div class="why">
<div class="why-item"><h3>The right level</h3><p>Written to the sounds and words your child knows, checked word by word.</p></div>
<div class="why-item"><h3>Starring the family</h3><p>Children try harder when the story is about them and the people they love.</p></div>
<div class="why-item"><h3>The same on every page</h3><p>Characters are drawn and approved first, so everyone looks like themselves throughout.</p></div>
<div class="why-item"><h3>Names made easy</h3><p>A cast page at the start of each book introduces every name before the story begins.</p></div>
</div></div></section>

{pricing()}

<section id="faq" class="section" style="padding-top:0"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Questions</p><h2>Good to know</h2></div>
<div class="faq">{faq_html()}</div></div></section>

{join_band()}

<section class="section" style="padding-top:0"><div class="wrap"><div class="sister">
<div style="display:grid;gap:6px"><h3>Stories to read together</h3><p>Our sister site Family Storybooks retells the classic fairy tales as hardcover picture books, with your family as the characters.</p></div>
<a class="btn ghost" href="{CFG["storybooks"]}">Visit Family Storybooks</a></div></div></section>
"""
    return page("Family Learn to Read: personalised reading books at your child's level",
                "Early reading books and phonics books with your family as the characters. Matched to your child's school reading level, printed or online. Ages 4 to 7.",
                "", body, "stages", scripts=("finder.js", "readers.js", "layers.js", "family.js", "preview.js", "home.js", "try.js"))


# ---------- Reading check ----------
def check():
    body = f"""
<section class="section" style="padding-top:clamp(36px,6vw,72px)"><div class="wrap check-wrap">
<div class="sec-head"><p class="eyebrow">Free reading check</p><h1 class="page-title">Which stage is right for your child?</h1>
<p class="lede">Sit together and ask your child to read each passage out loud. Tell us how it went, and we'll suggest a stage. There's no sign-up, and nothing you choose leaves this page.</p></div>
<div id="check" class="check" aria-live="polite"><noscript><p>The reading check needs JavaScript. You can also <a href="schemes.html">match your school's reading scheme</a>.</p></noscript></div>
<div class="check-tips"><h3>Tips</h3><ul>
<li>Choose a calm moment, and stop whenever your child has had enough.</li>
<li>Let them sound words out. A little help on one word still counts as "a little help".</li>
<li>If they read every word without stopping, choose "Read it easily".</li></ul>
<p class="small">Already know their school level? <a href="index.html#find">Match your school's reading scheme</a> instead.</p></div>
</div></section>
{join_band()}"""
    return page("Free reading check: find your child's reading stage | Family Learn to Read",
                "A free two-minute reading check. Your child reads short passages and we suggest the right reading stage.",
                "check.html", body, "check", scripts=("finder.js",))


# ---------- School schemes ----------
def schemes():
    rows = []
    for sc in SCHEMES:
        if sc.get("same"):
            rows.append(f'<tr><td>{e(sc["name"])}</td><td colspan="2">Uses the Book Band colours: choose the colour on the book</td></tr>')
            continue
        by = {}
        for name, band in sc["levels"]:
            by.setdefault(BAND_STAGE[band], []).append(name)
        cells = "".join(f'<li><span class="mini" style="--sc:{STAGES[n-1]["color"]}">Stage {n}</span> {e(", ".join(by[n]))}</li>' for n in sorted(by))
        rows.append(f'<tr><td>{e(sc["name"])}</td><td colspan="2"><ul class="map">{cells}</ul></td></tr>')
    stage_rows = "".join(f'<tr><td><span class="mini" style="--sc:{s["color"]}">Stage {s["n"]}</span></td><td>{e(s["band"])}</td><td>{e(s["phase"])}</td><td>{e(s["year"])}</td></tr>' for s in STAGES)
    body = f"""
<section class="section" style="padding-top:clamp(36px,6vw,72px)"><div class="wrap">
<div class="sec-head"><p class="eyebrow">School reading schemes</p><h1 class="page-title">How school schemes match our stages</h1>
<p class="lede">Most UK schools send home books levelled with Book Band colours, or with a phonics scheme's own levels. Here's how they line up with our eight stages.</p></div>
{finder()}
<h2 class="sub-h">Our stages</h2>
<div class="table-wrap"><table><thead><tr><th>Our stage</th><th>Book Band</th><th>Phonics</th><th>School year</th></tr></thead><tbody>{stage_rows}</tbody></table></div>
<h2 class="sub-h">School schemes</h2>
<div class="table-wrap"><table><thead><tr><th>Scheme</th><th colspan="2">Levels and our matching stage</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div>
<p class="note">Matches are a guide, based on the publishers' own level guides and school correlation charts. Schools use schemes differently, so if a stage feels too easy or too hard, try our <a href="check.html">reading check</a> or move one stage up or down.</p>
<p class="note">{e(NOT_CONNECTED)}</p>
</div></section>
{join_band()}"""
    return page("School reading schemes and our reading stages | Family Learn to Read",
                "How the reading schemes and Book Band colours used in UK schools match the Family Learn to Read stages.",
                "schemes.html", body, "", scripts=("finder.js",))


# ---------- Books (a stage library and pack builder) ----------
def books_file(stage):
    return "books.html" if stage == 3 else f"books-{[x for x in STAGES if x['n'] == stage][0]['band'].lower()}.html"


def books(stage=3):
    st = [x for x in STAGES if x["n"] == stage][0]
    roles = [r for r in json.loads(subprocess.check_output(["node", "-e", "global.window={FLR:{}};require(process.argv[1]);console.log(JSON.stringify(window.FLR.readerRoles))", str(ROOT / "assets/js/readers.js")]))]
    names = "".join(f'<label class="field"><span>{e(r["label"])}</span><input type="text" data-name="{r["key"]}" maxlength="20" placeholder="e.g. {e(r["example"])}"></label>' for r in roles)
    pr = PRICES
    body = f"""<section class="section" style="--bc:{st["color"]};padding-bottom:24px"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Stage {stage} · {e(st["band"])} band · {e(st["phase"])}</p><h1>{e(st["band"])} books</h1>
<p class="lede">Ten short stories for children reading at Stage {stage}: {e(st["what"][0].lower() + st["what"][1:])} Every word is checked against the sounds and tricky words taught by this stage, and your family are the characters on every page.</p></div>
<nav class="lib-stages" aria-label="Book bands">{"".join(f'<a class="badge" style="--bc:{x["color"]};--bi:{x["ink"]}" href="{books_file(x["n"])}"{' aria-current="page"' if x["n"] == stage else ""}>Stage {x["n"]} · {e(x["band"])}</a>' for x in STAGES if any(b["stage"] == x["n"] for b in READERS))}</nav>
<p class="small muted">A pack can mix books from different stages, so you can add a few from the next band to grow into.</p>
<div data-library="{stage}" class="lib">
<details class="bv-names" open><summary>Read them with your names</summary><div class="bv-name-grid">{names}</div></details>
<div class="lib-cards"></div>
<div class="bv" tabindex="-1" hidden><h2 class="bv-title"></h2>
<div class="bv-stage" aria-live="polite"></div>
<div class="bv-nav"><button class="arrow bv-prev" type="button" aria-label="Previous page">&larr;</button><p class="bv-count"></p><button class="arrow bv-next" type="button" aria-label="Next page">&rarr;</button></div>
<div class="bv-dots" aria-label="Pages"></div>
<p class="small muted">Every picture is painted with your family after you order, from the characters you make.</p></div>
<aside class="pk" aria-label="Your pack"><div class="pk-head"><h2>Your pack</h2><button type="button" class="btn ghost btn-sm pk-all">Choose all 10</button></div>
<fieldset class="pk-format"><legend class="sr-only">Printed or online</legend>
<label class="check"><input type="radio" name="pk-format" value="printed"><span>Printed paperbacks ({money(pr["printed"]["sizes"]["1"])} each, 5 for {money(pr["printed"]["sizes"]["5"])}, 10 for {money(pr["printed"]["sizes"]["10"])})</span></label>
<label class="check"><input type="radio" name="pk-format" value="online"><span>Online only ({money(pr["online"]["sizes"]["1"])} each, 5 for {money(pr["online"]["sizes"]["5"])}, 10 for {money(pr["online"]["sizes"]["10"])})</span></label></fieldset>
<p class="pk-count"></p><ol class="pk-list"></ol>
<p class="pk-sum"><span class="pk-total"></span> <span class="pk-how small muted"></span></p>
<p class="pk-note small" role="status"></p>
<a class="btn red pk-next" href="make.html">Next: make your characters</a>
<p class="small muted">Launch prices. Ordering opens soon: founding families on <a href="index.html#join">our list</a> get {DISCOUNT}% off.</p></aside>
</div></div></section>"""
    return page(f"{st['band']} reading books with your family | Family Learn to Read",
                f"Ten personalised Stage {stage} ({st['band']} band) reading books, every word checked for your child's phonics stage. Buy one, or packs of 5 or 10.",
                books_file(stage), body, "books", scripts=("phonics.js", "readers.js", "layers.js", "family.js", "books.js"))


GUIDE_GOOD = ["A recent photo, in good daylight", "Face to the camera, with the face nice and big", "Eyes clearly visible: no sunglasses or hats pulled low", "Just them in the photo", "For a pet: the whole animal, side on, is ideal"]
GUIDE_BAD = ["Blurry, dark or very small photos", "Faces far away, turned sideways or partly hidden", "Heavy filters, stickers or edited faces", "Photos of a screen or a printed photo"]


def make():
    good = "".join(f"<li>{e(x)}</li>" for x in GUIDE_GOOD)
    bad = "".join(f"<li>{e(x)}</li>" for x in GUIDE_BAD)
    body = f"""<section class="section" style="--bc:var(--red)"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Free preview</p><h1>Make your characters</h1><p class="lede">Add a photo of your child, the grown-up who reads with them and your pet. We draw each of them once, free, and paint a page of your first book with them. After you order, every book in your pack is painted from these same characters, so your family looks the same in all of them.</p></div>
<div class="mk" data-maker>
<div class="mk-pack"></div>
<div class="guide">
<div class="guide-col good"><h3>Photos that work best</h3><ul class="ticks">{good}</ul></div>
<div class="guide-col bad"><h3>Try to avoid</h3><ul class="crosses">{bad}</ul></div>
<p class="guide-privacy">Your photos stay private. They're shrunk and stripped of hidden details (such as where they were taken) on your device, kept in encrypted storage in the EU, and never shown to anyone else. If you don't order, they're deleted after 14 days, or you can delete them now.</p>
</div>
<div class="mk-cards"></div>
<label class="check mk-consent"><input type="checkbox" id="mk-consent"><span>I'm the parent or guardian, or I have permission from the people in these photos to use them.</span></label>
<div class="mk-actions"><button type="button" class="btn red mk-go">Draw my characters</button><button type="button" class="btn red mk-scenes" hidden>Paint a page with my family</button><button type="button" class="btn ghost btn-sm mk-delete">Delete my photos</button><p class="mk-left small"></p></div>
<p class="mk-msg" role="status" aria-live="polite"></p>
<div class="mk-sample" hidden></div>
<div class="mk-next" hidden><h2>Next: order your books</h2><p>Ordering opens soon. Join the list and we'll email you a {DISCOUNT}% founding-family discount; your characters are kept for 14 days.</p><a class="btn red" href="index.html#join">Join the list</a></div>
</div></div></section>"""
    return page("Make your characters | Family Learn to Read", "Turn photos of your child, a grown-up and your pet into the characters of their own reading books. Free preview.",
                "make.html", body, "", scripts=("readers.js", "layers.js", "family.js", "preview.js", "make.js"))


def print_page():
    """Print files for Lulu (not linked from the site, not indexed): see assets/js/print.js."""
    return f"""<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<title>Print files | Family Learn to Read</title>
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{v("css/print.css")}">
</head>
<body>
<p class="status" id="status" role="status">Building the print file…</p>
<div id="book"></div>
<script src="{v("js/data.js")}"></script>
<script src="{v("js/phonics.js")}"></script>
<script src="{v("js/readers.js")}"></script>
<script src="{v("js/layers.js")}"></script>
<script src="{v("js/print.js")}"></script>
</body>
</html>
"""


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(ROOT / "assets", DIST / "assets")
    (DIST / "assets/favicon.svg").write_text(FAVICON)
    pages = {"index.html": home(), "books.html": books(3), "books-blue.html": books(4), "make.html": make(), "check.html": check(), "schemes.html": schemes()}
    for name, html in pages.items():
        (DIST / name).write_text(html)
    (DIST / "print.html").write_text(print_page())  # kept out of the sitemap
    (DIST / "CNAME").write_text(DOMAIN + "\n")
    (DIST / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
    urls = "".join(f"<url><loc>{SITE}/{'' if n == 'index.html' else n}</loc></url>" for n in pages)
    (DIST / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    print("built", len(pages), "pages")


if __name__ == "__main__":
    main()
