"""Builds the Family Learn to Read static site.

python3 src/build.py  ->  dist/  (the real site, for GitHub Pages)
Stages, sound packs, school schemes and prices live in assets/js/data.js; this script reads it with node,
so there is one source of truth.
"""
import hashlib, json, shutil, subprocess
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
<nav class="nav" aria-label="Main">{a("index.html#stages", "Stages", "stages")}{a("index.html#sounds", "Sounds", "sounds")}{a("check.html", "Reading check", "check")}{a("index.html#pricing", "Pricing", "pricing")}{a("index.html#faq", "FAQ", "faq")}</nav>
<label class="region"><span class="sr-only">Deliver to</span><select class="region-select" aria-label="Deliver to">{''.join(f'<option value="{k}">{e(r["label"])}</option>' for k, r in REGIONS.items())}</select></label>
<a class="btn btn-sm red" href="index.html#join">Join the list</a>
</div></header>
<p class="region-bar" id="region-bar" role="status" hidden></p>"""


def footer():
    return f"""<footer class="site-foot"><div class="wrap foot-grid">
<div style="display:grid;gap:10px;max-width:380px"><a class="logo" href="index.html">{LOGO}Family Learn to Read</a>
<p class="small">Early reading books and phonics books with your family as the characters, for ages 4 to 7.</p></div>
<div style="display:grid;gap:12px"><div class="foot-links"><a href="index.html#stages">Stages</a><a href="index.html#sounds">Sound packs</a><a href="check.html">Reading check</a><a href="schemes.html">School schemes</a><a href="index.html#faq">FAQ</a><a href="index.html#faq-privacy">Photo privacy</a><a href="mailto:{CFG["email"]}">Contact</a></div>
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


def sample_page():
    """A sample Stage 3 page: picture on top, words below, the sound being practised picked out."""
    return f"""<figure class="reader" aria-label="A sample page from a Stage 3 reader">
<div class="reader-pic">{POND}</div>
<p class="reader-text">Mia and Dad look at the <b>f</b><b>i</b><b class="hl">sh</b>.<br>It has a long tail!</p>
<figcaption class="small">Example page, Stage 3 (Yellow band). Your book shows your own family, drawn from your photos.</figcaption>
</figure>"""


def stage_card(s):
    return f"""<article class="stage" id="stage-{s["n"]}" style="--sc:{s["color"]};--si:{s["ink"]}">
<div class="stage-top"><span class="stage-n">Stage {s["n"]}</span><span class="stage-band">{e(s["band"])} band</span></div>
<p class="stage-what">{e(s["what"])}</p>
<dl class="stage-facts"><div><dt>School year</dt><dd>{e(s["year"])}</dd></div><div><dt>Phonics</dt><dd>{e(s["phase"])}</dd></div><div><dt>Words</dt><dd>{e(s["text"])}</dd></div></dl>
<a class="stage-cta" href="#join" data-want="stage-{s["n"]}">Notify me &rarr;</a>
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
                "", body, "stages", scripts=("finder.js",))


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


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(ROOT / "assets", DIST / "assets")
    (DIST / "assets/favicon.svg").write_text(FAVICON)
    pages = {"index.html": home(), "check.html": check(), "schemes.html": schemes()}
    for name, html in pages.items():
        (DIST / name).write_text(html)
    (DIST / "CNAME").write_text(DOMAIN + "\n")
    (DIST / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
    urls = "".join(f"<url><loc>{SITE}/{'' if n == 'index.html' else n}</loc></url>" for n in pages)
    (DIST / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    print("built", len(pages), "pages")


if __name__ == "__main__":
    main()
