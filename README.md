# Family Learn to Read

Website for www.familylearntoread.com: early reading books and phonics books with your family as the characters, matched to your child's school reading level, sold in packs of five, printed or online. Part of the Our Family Presents group, built on the same design system as Family Board Books and Family Storybooks.

- `assets/js/data.js`  stages, sound packs, school-scheme levels, prices and settings (the one source of truth)
- `assets/js/finder.js`  "find your child's stage": the school-scheme picker and the free reading check
- `assets/css/site.css`  styles, shared with the sister sites plus Learn to Read additions
- `src/build.py`  builds the site into `dist/` (`python3 src/build.py`, needs node)
- `.github/workflows/pages.yml`  publishes `dist/` to GitHub Pages on every push to main

Stage 1 is a coming-soon site with a waitlist (FormSubmit, emails hello@familyboardbooks.com). Nothing uses the shared photo and cartoon service yet.
Reading scheme names appear only as plain text in the stage finder and on the schemes page, with a "not connected with any publisher" line. Never in product names, book text, ads or ad keywords.
Illustrations on the site are our own placeholders. Customer photos are never published here.

## Stories and the level checker

- `assets/js/readers.js`: the stock stories (10 Stage 3 Yellow and 10 Stage 4 Blue books so far). `{child}`, `{adult}` and `{pet}` become the family's names.
- `assets/js/phonics.js`: the level checker (letter groups and tricky words for each stage, word and sentence limits).
- `node tools/check_stories.js` checks every page at its stage; the build runs it too.
- `node tools/export_worker.js ../familyboardbooks/worker/src/readers.js` copies the picture prompts into the shared cartoon service.

## Books, characters and print files

- `assets/js/layers.js`: layered pictures. Each scene is painted once with no family in it (a "set" on the cartoon service), the family is drawn once in cut-out poses, and this file picks each page's poses, keys out the green and places them. Look inside and print.html?story= (example) show our sets with our example family. Change pages with an optional `p: {child: "wave"}`.
- `books.html` (Stage 3 Yellow) and `books-blue.html` (Stage 4 Blue), from assets/js/books.js: the stage libraries, with a band switcher. A pack can mix stages. Look inside any book with your own names, and build a pack
  of 1, 5 or 10 different stories, printed or online, with the price (packs of 10, then 5, then singles).
- `make.html` (assets/js/make.js): photos of the child, the grown-up and the pet (or our stand-ins) are drawn once by
  the shared cartoon service into one draft (book `flr-<first story>`), and one page of the first book is painted free.
  After ordering, the characters are copied into each book's own draft (`POST /api/drafts/<id>/copy`).
- `print.html?story=s3-owl` (assets/js/print.js, assets/css/print.css): the 32-page paperback interior and
  `&part=cover` the cover sheet for Lulu (product `reader`). Without `&d=` it shows our example book with placeholders.
- assets/js/family.js: names and the chosen pack (this browser only) and the pack price.
