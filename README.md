# Imitation Before Creation

A static, self-study monochrome drawing course implemented from `plan.md`: twenty chapters, an orientation/baseline exercise, local museum references, and A4 worksheets. Built with Eleventy and Nunjucks. No runtime server, external fonts, tracking, or accounts are required.

## Run

Use Node 22–26 (Node 24 LTS recommended). The lockfile is checked in.

```sh
npm ci
npm run dev
```

Eleventy prints the local preview address. For a production build:

```sh
npm run build
```

The production site is mounted at `/sketch-course/`, matching the GitHub Pages project URL. The production build validates content and provenance, clears old output, generates 23 routes, and checks that every internal link and asset remains within that prefix. Untouched museum masters are deliberately excluded from `_site/`.

## GitHub Pages deployment

Pushing `main` runs `.github/workflows/deploy-pages.yml`. The workflow installs the locked dependencies with `npm ci`, runs `npm run build`, uploads `_site/` as the Pages artifact, and deploys it to the `github-pages` environment. It uses GitHub Pages only; there is no server runtime or Sites hosting configuration.

The repository's Pages source must be set to **GitHub Actions** under **Settings → Pages → Build and deployment**. The expected project URL is `https://michelkrispin.github.io/sketch-course/`.

## Course content

Edit `src/chapters/*.md`. Each chapter uses JSON front matter (a valid YAML subset) and Markdown prose. The front matter is the canonical source for printable exercises, study selections, comparison prompts, self-checks, navigation, and page budgets. The Markdown body retains the complete practice sequence. Do not regenerate chapters from `plan.md`: the published chapter sources contain the editorial and asset corrections described below.

- `src/_includes/layouts/`: shared screen and worksheet layouts.
- `src/_includes/components/`: study cards, copy stages, comparison table, self-check, and explicitly labeled course analysis guides.
- `src/assets/css/`: separate screen and print styles.
- `src/_data/references.json`: rights, provenance, source views, hashes, and exact derivative transformations.
- `src/assets/references/`: untouched originals and official Met API records.
- `scripts/crop-selections.json`: reviewed relative source rectangles and selected recto/verso views.

Validation blocks missing chapters/references/files/rights, duplicate numbers/slugs/crops, mismatched checksums or dimensions, invalid source rectangles, enlargement, inadequate crop print resolution, incomplete exercises, and incorrect review checkpoints. Browser QA independently checks rendered page counts and physical layout. See `scripts/validate-content.mjs` for the executable schema.

## Images and provenance

All 36 works were downloaded using official Met API outputs or NGA collection-page Download links. Every original view retains its own checksum and download URL. Derivatives use grayscale and 1–99 percentile normalization, preserving aspect ratio without upscaling; this adjustment is documented, and the originals remain untouched.

To reproduce derivatives from existing masters:

```sh
npm run assets
npm run build
```

To retrieve missing original images (Python 3 standard library; network access required):

```sh
python3 scripts/fetch-references.py
npm run assets
```

`npm run verify:sources` rechecks current collection-page rights and Met API image URLs. It fails on inaccessible pages or changed labels and writes `qa/source-check.json`; it never silently updates rights approvals. Museum anti-bot responses may require a manual collection-page review.

Editorial decisions from actual image inspection:

- Chapter 2 uses Durand’s two overlapping leaves. The sheet’s other study is bark, not foliage.
- Chapter 7 replaces the planned Durand revisit with a canopy crop from Oehme’s Chapter 5 reference. This supplies an actual graphite foliage mass against Pillement’s chalk treatment.
- Chapter 4 uses the pillow and drapery versos, not the primary rectos.
- Chapter 12’s small Ingres crop prints at a reduced width to preserve at least 150 dpi. Its three-quarter view is compared with Sargent’s profile by equivalent planes, not assumed matching projection.
- Chapters 19–20 print the full compositions on their overview pages and the selected junctions/subgroups on their copy pages.

## Print

Choose A4, portrait, 100% scale; disable browser headers/footers. Enable background graphics for the construction grid and writing lines. Each packet has a 50 mm calibration line. Physical size labels refer to 100% print scale, not screen size. Letter is allowed, but may reflow and needs a preview/calibration check.

Packets: Chapters 1–10 have 5 pages, 11–18 have 6, Chapter 19 has 7, and Chapter 20 has 8. Orientation has 2 pages. The final assessment includes six thumbnails, two construction studies, two style tests, a final drawing, a 150-word critique, and baseline comparison instructions. Extra timed drills and retrieval reviews use plain paper from the working kit.

## Verification

```sh
npm test
npm run qa
```

Browser QA needs Chromium and Poppler (`pdfinfo`, `pdftoppm`). Set `CHROMIUM_PATH` if Chromium is not at `/usr/sbin/chromium`. It starts an ephemeral local server and checks mobile/desktop overflow, images, keyboard entry, persistent checkmarks, all routes without JavaScript, calibration, and worksheet pagination. It saves PDFs/screenshots and a machine-readable report in `qa/`; generated QA files are ignored by Git. See `qa/release-review.md` for the latest visual review and source-check limitations.
