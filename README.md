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

- `assets/js/readers.js`: the stock stories (10 Stage 3 books so far). `{child}`, `{adult}` and `{pet}` become the family's names.
- `assets/js/phonics.js`: the level checker (letter groups and tricky words for each stage, word and sentence limits).
- `node tools/check_stories.js` checks every page at its stage; the build runs it too.
- `node tools/export_worker.js ../familyboardbooks/worker/src/readers.js` copies the picture prompts into the shared cartoon service.
