# Implementation review — 2026-09-08

The Eleventy implementation builds 20 chapters plus the course index, orientation, and sources page. All 36 museum records have local originals and 40 selected study crops. The two selected versos also have matching full-sheet derivatives. Originals remain outside the generated site.

## Checks completed

- Production build: content/provenance validation and 562 local links across 23 routes pass.
- GitHub Pages project deployment: Eleventy uses `/sketch-course/` as its `pathPrefix`; all generated internal links and assets stay under that mount point. The Actions workflow builds `_site/` and deploys the Pages artifact without a server runtime.
- Five regression tests: valid content; missing rights/files and changed checksums; duplicate chapters/unresolved references; invalid/enlarged crops; missing links/anchors and remote scripts.
- Chromium 152.0.7977.82: every course route at 375 px and 1280 px, without horizontal overflow; all 23 routes load without JavaScript, with readable content and images.
- Keyboard entry via the visible-on-focus skip link; native controls and semantic headings; local completion persists after reload. The print convenience button disappears without JavaScript.
- A4 printing: orientation 2 pages; Chapters 1–10 each 5 pages; Chapters 11–18 each 6 pages; Chapter 19 7 pages; Chapter 20 8 pages. Total: 115 pages in 21 packets.
- All packets rendered with Chromium and reviewed as Poppler page images. Reference captions, exercise groups, drawing frames, and worksheet page breaks remain together. No blank overflow pages were found.
- The 50 mm calibration line and every labeled drawing frame match CSS physical dimensions to within 0.1 CSS pixel. These checks establish 100% browser print scale; a physical printer still needs the learner’s calibration check.
- Grayscale references, dark text, faint drawing frames, and explicit source URLs remain in print. The final assessment prints independently with the full reference compositions and all process sheets.
- The three prototype chapters (1, 10, 20) passed pagination before the remaining chapter files were produced. The full-course pass then caught and corrected Chapter 19’s thumbnail layout.
- Dependency installation audit: zero reported vulnerabilities after updating Sharp and Playwright to patched releases.

Reproduce: `npm run build`, `npm test`, `npm run qa`, then `node scripts/render-review.mjs`. Browser reports, PDFs, and screenshots are generated under `qa/`; Poppler review images are under `/tmp/drawing-pdf-review/`.

## Editorial corrections

See the README for the Chapter 7 foliage substitution, the Chapter 4 verso selections, and the reduced Chapter 12 crop size. These changes follow inspection of the downloaded images. The original plan is retained unchanged.

## Remaining publication check

35 collection pages were reviewed for their public-domain labels through the web reader. The Huntington object page (`met-16087`, Chapter 9) failed web-reader retrieval and returned HTTP 429 on direct retrieval. Its official downloaded API record has `isPublicDomain: true`, and its original image was downloaded successfully from the API-provided URL, but the collection-page recheck is still pending.

This is a working local implementation, not a claim that the plan’s final publication gate has passed. Recheck https://www.metmuseum.org/art/collection/search/16087 when the museum rate limit clears, and run source verification immediately before any future publication. `qa/source-review.json` records the per-object outcome; `npm run verify:sources` does not treat network failures as rights approval.
