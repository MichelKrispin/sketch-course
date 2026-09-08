---
title: "Imitation Before Creation — Monochrome Drawing Course"
status: "implementation-ready plan"
audience: "self-learning"
delivery: "static website with print-to-PDF"
primary_print_format: "A4"
reference_policy: "Public-domain / open-access museum images only"
source_reviewed: "2026-09-05"
plan_reviewed: "2026-09-08"
---

# Imitation Before Creation

A 20-chapter self-study course in graphite or monochrome pen drawing.

Core rule:

> Copy to understand. Compare to discriminate. Create to prove transfer.

The course deliberately moves from isolated line decisions to full compositions. Every chapter studies two historical references with a related subject but meaningfully different handling. The learner first copies a controlled fragment from Reference A, then a comparable fragment from Reference B, compares the two approaches, and finally applies the learned technique to a new subject.

## Scope and success measure

The first release is a static course with 20 chapter pages, printable A4 worksheets, and no remote runtime dependencies. It does not include accounts, cloud progress sync, comments, payments, or a content-management system.

The course succeeds when a learner can complete it with the listed materials, distinguish the two reference strategies in each chapter, and demonstrate transfer in the final creation task. Site completion alone is insufficient: every chapter must include usable reference crops, concrete comparison prompts, drawing space, and a self-check.

Before Chapter 1, include a short orientation page with:

- the required materials and an explanation of the repeating chapter rhythm;
- a 15-minute baseline drawing of a shoe, plant, or hand, retained for comparison after Chapter 20;
- print instructions with a 50 mm calibration line so learners can detect printer scaling;
- a reminder that target times are guidance, not deadlines.

## 1. Product and implementation brief

### Delivery

Build as a static, Markdown-driven website with Eleventy (11ty). Implementation decisions:

- Markdown as canonical course content.
- Nunjucks for layouts and reusable exercise components.
- A checked-in package lockfile and a documented Node version in `package.json`.
- No client-side framework required.
- Local copies of open-access source images under `src/assets/references/`; do not hotlink museum image files.
- Every image must retain source metadata in the content model.
- Build-time validation must fail on missing reference IDs, missing local files, missing rights metadata, or duplicate chapter numbers/slugs.
- One chapter per route: `/chapter/01-line-quality/`, etc.
- A persistent `Print / Save PDF` button calls `window.print()`.
- The site remains fully usable with JavaScript disabled except for the convenience print button.

Suggested tree:

```text
src/
  _data/
    references.json
  _includes/
    layouts/
      base.njk
      chapter.njk
    components/
      reference-card.njk
      copy-stage.njk
      compare-table.njk
      self-check.njk
  assets/
    references/
    crops/
    css/
      screen.css
      print.css
  chapters/
    01-line-quality.md
    ...
    20-synthesis.md
  index.md
scripts/
  validate-content.mjs
  verify-links.mjs
```

### Print behavior

Target A4 first, but do not prevent Letter printing.

```css
@page {
  size: A4;
  margin: 16mm 15mm 18mm;
}

@media print {
  nav,
  .print-button,
  .screen-only {
    display: none !important;
  }

  .chapter-title,
  .reference-card,
  .copy-stage,
  .creation-task,
  figure {
    break-inside: avoid;
  }

  .worksheet-page {
    break-before: page;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
}
```

Print requirements:

- grayscale-safe design;
- white background;
- no information encoded by color alone;
- minimum body size approximately 10.5–11 pt in print;
- images at sufficient resolution for 150–300 dpi at printed size;
- source URL and compact attribution printed below each reference;
- large drawing areas have faint borders only;
- avoid dark UI backgrounds in print;
- explicit page breaks rather than trusting browser auto-pagination for worksheet pages;
- a 50 mm calibration line on the orientation page and worksheet packets; physical-size claims assume printing at 100% scale.

Treat the stated page counts as budgets rather than guarantees until representative chapters have been rendered. Prototype Chapters 1, 10, and 20 first because they cover a short crop exercise, ruled construction, and the largest final packet. Adjust spacing and page budgets from those renders before laying out the remaining chapters.

### Reference image handling

For each museum image:

1. Download from the museum's own Open Access/Public Domain control or API.
2. Store the untouched master locally.
3. Make chapter crops from that master; never upscale a thumbnail.
4. Keep a metadata record:
   - artist
   - title
   - date
   - medium
   - museum
   - object URL
   - rights statement
   - rights URL
   - direct download URL or API request used
   - retrieval date
   - original filename and SHA-256 checksum
   - local master path
   - crop path(s), crop rectangle, and derivative dimensions
   - concise alt text describing what the exercise asks the learner to inspect
5. Recheck the collection page before initial publication.
6. Do not scrape museum descriptive text into the course. Write original instructional text.

Keep untouched masters outside the generated site output when their full resolution is unnecessary for learners. Generate web and print derivatives from those masters, preserve aspect ratio, and record the transformation so every crop can be reproduced.

The Met identifies its Open Access public-domain images as CC0. The National Gallery of Art releases its eligible public-domain images under CC0. The selected object pages below were checked as Public Domain/Open Access when this draft was prepared.

Policy pages:

- The Met Open Access: https://www.metmuseum.org/hubs/open-access
- The Met image/data policy: https://www.metmuseum.org/policies/image-resources
- NGA Open Access: https://www.nga.gov/artworks/free-images-and-open-access
- NGA terms / Open Access policy: https://www.nga.gov/terms-and-notices

## 2. Repeating chapter grammar

Keep the rhythm identical across all 20 chapters so the learner spends attention on drawing rather than navigation.

1. **Look** — 3–5 minutes. Identify dominant directions, largest shapes, darkest accents, repeated marks.
2. **Map** — draw only bounding box, main axis, 3–7 anchor points, and large negative spaces.
3. **Copy A** — copy one selected fragment from the first master.
4. **Copy B** — copy the same kind of element from the second master.
5. **Compare** — answer 3–5 concrete questions about line, value, simplification, edges, rhythm.
6. **Create** — draw a new example from life, a public-domain photograph, or imagination, applying one or both approaches.
7. **Self-check** — assess structure first, style second, detail last.

Do not provide tracing as the normal exercise. Optional overlay sheets may show axes, envelopes, bounding boxes, value masses, or perspective guides, but the learner should redraw by observation.

### Default printable packet

For Chapters 1–10: 4–5 A4 pages.

For Chapters 11–18: 5–6 A4 pages.

For Chapters 19–20: 6–8 A4 pages.

A chapter should normally contain:

- one overview/reference page;
- one Reference A copy page;
- one Reference B copy page;
- one compare + targeted drill page;
- one creation page;
- optional second creation/self-review page in later chapters.

### Review checkpoints

After Chapters 4, 8, 10, 14, and 18, add a 20-minute review rather than another new technique. The learner chooses one earlier creation task, redraws it without reopening the chapter, and then compares both attempts using the same self-check. These checkpoints provide retrieval practice and reveal whether the course is producing durable transfer.

After Chapter 20, the learner redraws the subject chosen for the baseline exercise. The two drawings should be shown side by side with a short comparison of proportion, line choice, value grouping, and unnecessary detail.

---

# Part I — Marks, shapes, and simple form

## Chapter 01 — Line quality: speed, pressure, and economy

**Difficulty:** 1/5\
**Target time:** 35–45 min\
**New variable:** intentional line.

### Reference A

- **John Flaxman**, _Morning: Pope's Odyssey, Book 12_, 1792.
- Pen and gray ink over graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/341696
- **Use:** crop one figure silhouette and several drapery arcs.
- **Why it fits:** unusually clear, economical contour; almost every stroke has a structural job.

### Reference B

- **George Romney**, _Study of two figures: one seated, the other standing_, ca. 1777.
- Graphite with traces of pen and brown ink.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/343399
- **Use:** crop the standing figure and 8–12 long strokes.
- **Why it fits:** loose, fast graphite gives a strong contrast to Flaxman's controlled outline.

### Copy sequence

1. Reproduce 12 isolated line segments from A at the same approximate length.
2. Repeat them once slowly and once quickly.
3. Map the chosen figure with only a head mark, spine/gesture axis, feet and outer envelope.
4. Copy the contour fragment from A without shading.
5. Repeat the exercise from B, allowing broken and searching lines.
6. Draw the same simple household object twice: once with Flaxman-like economy, once with Romney-like searching gesture.

**Creation test:** draw a shoe, mug, or folded towel in no more than 25 visible lines.

**Self-check:** line confidence; unnecessary correction marks; proportion preserved despite low line count.

---

## Chapter 02 — Contour and negative space: leaves

**Difficulty:** 1/5\
**Target time:** 40–50 min\
**New variable:** shape relationships around the subject.

### Reference A

- **Asher Brown Durand**, _Leaf and Tree Study (from Sketchbook)_.
- Graphite on paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/16220
- **Use:** one small leaf group.
- **Why it fits:** direct graphite observation with visible simplification.

### Reference B

- **Nicolas Poussin**, _Study of a Palm Tree (recto)_.
- Pen and brown ink over traces of black chalk.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/351063
- **Use:** one palm frond rather than the whole sheet.
- **Why it fits:** the repeated leaf rhythm is clear, while the pen treatment differs strongly from Durand.

### Copy sequence

1. Draw only the outer envelope of A's leaf group.
2. Draw three largest negative spaces between leaves.
3. Add stems, then leaf contours.
4. Repeat with B, first marking the central frond axis.
5. Compare: individual-leaf accuracy vs grouped rhythm.
6. Draw two real leaves: one with Durand-like observation, one with Poussin-like rhythmic abbreviation.

**Creation test:** invent a five-leaf sprig that remains believable without copying either species.

**Self-check:** angle of stems; size progression; negative spaces; no symbolic "leaf" shapes.

---

## Chapter 03 — Value and hatching: rocks

**Difficulty:** 1.5/5\
**Target time:** 45–60 min\
**New variable:** three-value structure and directional hatching.

### Reference A

- **John William Casilear**, _Study of Rocks_, ca. 1850–60.
- Graphite on off-white Bristol board.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/10383
- **Use:** one isolated rock formation.
- **Why it fits:** separates planes through restrained graphite value rather than outline alone.

### Reference B

- **Rodolphe Bresdin**, _Landscape_, probably ca. 1858.
- Pen and ink on tracing paper.
- National Gallery of Art. Public Domain / Open Access.
- https://www.nga.gov/artworks/56210-landscape
- **Use:** a crop containing two or three rocks.
- **Why it fits:** clear pen hatching and cross-hatching provide a sharply different solution to the same problem.

### Copy sequence

1. Reduce A to light / middle / dark only.
2. Draw the rock envelope and main plane breaks.
3. Add graphite value without blending.
4. Reduce B to the same three-value map.
5. Rebuild B using hatch direction to describe plane direction.
6. Draw one real stone twice: graphite planes, then pen hatching.

**Creation test:** draw a made-up three-rock stack that reads as solid with no cast shadow.

**Self-check:** value grouping before texture; hatching follows form; darkest marks are deliberate.

---

## Chapter 04 — Soft form and cross-contour: folds and pillows

**Difficulty:** 1.5/5\
**Target time:** 50–65 min\
**New variable:** turning form without hard edges.

### Reference A

- **Albrecht Dürer**, _Self-portrait, Study of a Hand and a Pillow (recto); Six Studies of Pillows (verso)_, 1493.
- Pen and brown ink.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/459214
- **Use:** one pillow study from the verso.
- **Why it fits:** a simple object exposes compression, fold direction, and cross-contour with minimal subject complexity.

### Reference B

- **Edgar Degas**, _Study for Vieille Italienne (recto); Drapery Study (verso)_, 1856.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/334361
- **Use:** one coherent fold group from the verso.
- **Why it fits:** graphite allows softer transitions and less line-bound construction than Dürer.

### Copy sequence

1. Mark the pillow/fold as one large shape.
2. Mark only ridge lines and deepest troughs.
3. Add five short cross-contour marks showing turn.
4. Copy A without decorative hatching until structure reads.
5. Repeat with B using soft value edges.
6. Draw a crumpled cloth or cushion from life in both approaches.

**Creation test:** invent three folds over a box-shaped cushion and make their directions physically plausible.

**Self-check:** folds originate from compression/tension points; no random zig-zag shading.

---

# Part II — Natural structure

## Chapter 05 — Texture that follows form: bark

**Difficulty:** 2/5\
**Target time:** 55–70 min\
**New variable:** surface detail subordinated to volume.

### Reference A

- **Ernst Ferdinand Oehme**, _Study of a Tree; verso: Study of Houses_, 1832.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/392332
- **Use:** lower trunk crop.
- **Why it fits:** highly legible bark channels and trunk volume in graphite.

### Reference B

- **John Crome**, _Study for Tree Trunks and Lane_, ca. 1812.
- Graphite on the recto.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/406192
- **Use:** one trunk fork.
- **Why it fits:** more atmospheric, abbreviated mark-making than Oehme despite the same medium.

### Copy sequence

1. Draw cylinder/taper before bark.
2. Place only three major longitudinal channels.
3. Add shadow-side value.
4. Add bark marks that wrap or climb the form.
5. Repeat B with fewer, broader structural accents.
6. Draw a real tree trunk or close-up bark photograph using a strict 3-minute texture limit.

**Creation test:** make a convincing trunk with only 30 texture marks.

**Self-check:** trunk remains solid if texture is mentally removed; texture density changes with light and plane.

---

## Chapter 06 — Branching systems: taper, forks, and hierarchy

**Difficulty:** 2/5\
**Target time:** 55–70 min\
**New variable:** nested structural hierarchy.

### Reference A

- **Jacques de Gheyn II**, _Study of a Tree_, late 16th–early 17th century.
- Pen and brown ink over black chalk.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/386334
- **Use:** one major fork and its secondary branches.
- **Why it fits:** branching logic is visible under energetic pen work.

### Reference B

- **Myles Birket Foster**, _Study of a Dead Tree_, 1840–99.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/363604
- **Use:** upper branching silhouette.
- **Why it fits:** bare branches expose taper and direction without foliage.

### Copy sequence

1. Mark trunk axis and first-generation branches only.
2. Add second-generation branches.
3. Check taper at every fork.
4. Copy A using decisive pen-like lines in graphite or pen.
5. Copy B with lighter searching construction.
6. Build an invented branch from a trunk → 3 major limbs → 7 secondary limbs → twigs.

**Creation test:** draw a believable bare branch from imagination, then compare it to a real branch.

**Self-check:** no branch widens toward its tip; forks do not repeat at identical angles; asymmetry feels natural.

---

## Chapter 07 — Foliage as masses, not symbols

**Difficulty:** 2/5\
**Target time:** 60–75 min\
**New variable:** grouping hundreds of small forms into a few readable masses.

### Reference A

- **Attributed to Jean Pillement**, _Study of a Tree_.
- Black chalk on beige paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/339368
- **Use:** one canopy cluster.
- **Why it fits:** strong grouped foliage with clear dark/light organization.

### Reference B

- **Asher Brown Durand**, _Leaf and Tree Study (from Sketchbook)_.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/16220
- **Use:** revisit at the scale of grouped leaf masses, not individual leaf contour.
- **Why it fits:** returning to an earlier source reveals a new level of organization.

### Copy sequence

1. Blur/squint at A and map only 4–6 canopy blobs.
2. Mark shadow pockets.
3. Add a small sample of leaf texture only at selected edges.
4. Repeat on B, grouping individual marks into larger masses.
5. Compare edge density and internal detail.
6. Draw a shrub or houseplant without outlining every leaf.

**Creation test:** create a canopy using five masses and no more than 50 small leaf marks.

**Self-check:** foliage reads at thumbnail size; detail concentrates near focal edges; interior is not evenly noisy.

---

## Chapter 08 — The whole tree: silhouette, weight, and rhythm

**Difficulty:** 2.5/5\
**Target time:** 65–80 min\
**New variable:** integrating trunk, branches, foliage, and ground into one proportioned subject.

### Reference A

- **Thomas Rowlandson**, _Study of trees_, 1780–1827.
- Pen and brown ink.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/364025
- **Use:** one complete tree.
- **Why it fits:** lively economy, strong silhouette, and calligraphic pen rhythm.

### Reference B

- **Henry Ward Ranger**, _Tree Study (from Sketchbook)_.
- Graphite and ink on paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/16188
- **Use:** one complete tree.
- **Why it fits:** sketchbook simplification contrasts with Rowlandson's pen rhythm.

### Copy sequence

1. Draw only the tree's total height/width envelope.
2. Place trunk and 3–5 dominant branch directions.
3. Place canopy masses.
4. Copy A at half-page size.
5. Copy B at half-page size.
6. Draw a new tree outdoors or from a public-domain photograph, preserving its unique silhouette.

**Creation test:** redraw the new tree from memory after a 10-minute break.

**Self-check:** individual tree identity; believable center of gravity; clear large-to-small hierarchy.

---

# Part III — Space and constructed form

## Chapter 09 — Landscape depth: overlap, scale, and simplification

**Difficulty:** 2.5/5\
**Target time:** 65–85 min\
**New variable:** depth across several spatial layers.

### Reference A

- **Daniel Huntington**, _The Delaware, East Branch, Walton, 1871 (from Sketchbook)_, ca. 1870.
- Graphite on paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/16087
- **Use:** whole composition, initially reduced to foreground / middle ground / distance.
- **Why it fits:** readable graphite depth without overwhelming detail.

### Reference B

- **Fra Bartolomeo**, _Landscape (Wooded Approach to a Town)_, ca. 1508.
- Pen and brown ink.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/338149
- **Use:** whole composition or a broad central crop.
- **Why it fits:** pen economy organizes landscape depth very differently from Huntington.

### Copy sequence

1. Reduce each reference to three horizontal/spatial bands.
2. Mark overlap points.
3. Mark where detail density decreases with distance.
4. Copy A without rendering texture until depth reads.
5. Copy B using pen-like accents and line-density shifts.
6. Make a new three-depth landscape using a tree, rock group, and distant mass.

**Creation test:** create depth using overlap and scale before any shading.

**Self-check:** foreground is not merely darker; scale, overlap, detail and edge handling all contribute.

---

## Chapter 10 — Perspective through architecture: doorway and wall

**Difficulty:** 2.5/5\
**Target time:** 70–90 min\
**New variable:** measured perspective and repeated alignment.

### Reference A

- **Anonymous, British, 19th century**, _Design for a Doorway_, first half 19th century.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/386475
- **Use:** whole elevation.
- **Why it fits:** simple architectural symmetry and proportion before deep perspective.

### Reference B

- **Luigi Vanvitelli**, _Architectural Sketch for the design of a Wall with Doorway..._, 1700–1773.
- Graphite partly reworked with pen and black ink; ruled graphite construction.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/341563
- **Use:** doorway/wall perspective section.
- **Why it fits:** construction lines reveal architectural thinking rather than hiding it.

### Copy sequence

1. Locate centerline, horizon if applicable, and major rectangles.
2. Copy A as a clean proportion study.
3. Rebuild A using only centerline, bounding rectangle and subdivisions.
4. Identify receding edge families in B.
5. Copy B while leaving construction lines visible.
6. Draw a real doorway in the learner's room using the same construction-first method.

**Creation test:** invent a simple doorway in a wall viewed obliquely.

**Self-check:** repeated edges converge consistently; verticals remain intentional; ornament follows structure.

---

# Part IV — The head

## Chapter 11 — Eye and brow: small form, precise edges

**Difficulty:** 3/5\
**Target time:** 60–80 min\
**New variable:** high sensitivity to small proportional errors.

### Reference A

- **Paul Gauguin**, _Eye and Part of Face; A Breton Woman and Two Men [recto]_, 1884–88.
- Graphite and crayon on wove paper.
- National Gallery of Art. Public Domain / Open Access.
- https://www.nga.gov/artworks/74237-eye-and-part-face-breton-woman-and-two-men-recto
- **Use:** the isolated eye/face fragment.
- **Why it fits:** directly isolates the feature and uses sparse pencil shading.

### Reference B

- **Giovanni Gerolamo Savoldo**, _Study of a Head_, ca. 1508–18.
- Black chalk on blue paper, highlighted with white.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/341220
- **Use:** one eye, brow, upper cheek and nose bridge; reproduce in graphite only.
- **Why it fits:** strongly modeled form contrasts with Gauguin's abbreviated eye.

### Copy sequence

1. Draw the eyeball as an implied sphere, not an almond symbol.
2. Place lid overlap, iris direction and brow separately.
3. Copy A with minimal value.
4. Copy B in graphite, translating chalk value into pencil.
5. Compare hard/soft edges and amount of information.
6. Draw your own eye from a mirror without eyelashes until the final pass.

**Creation test:** draw the same eye twice: five-value modeled version and line-economy version.

**Self-check:** lids wrap the sphere; iris is not pasted on; brow has volume and direction.

---

## Chapter 12 — Nose and mouth: profile and facial planes

**Difficulty:** 3/5\
**Target time:** 65–85 min\
**New variable:** subtle plane change with few outlines.

### Reference A

- **John Singer Sargent**, _Studies of a Man's Head_, ca. 1875.
- Graphite on wove paper.
- National Gallery of Art. Public Domain / Open Access.
- https://www.nga.gov/artworks/184327-studies-mans-head
- **Use:** one profile, cropped from brow to chin.
- **Why it fits:** the double-profile sheet makes projection of nose, lips and chin unusually easy to study.

### Reference B

- **Jean Auguste Dominique Ingres**, _Jean-Joseph Fournier_, 1815.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/409000
- **Use:** crop nose, philtrum, lips and chin.
- **Why it fits:** precise contour and restrained modeling contrast with Sargent's more searching study.

### Copy sequence

1. Mark brow → nose tip → lips → chin as a broken profile rhythm.
2. Copy Sargent without interior shading first.
3. Add only the shadow shapes required to turn the nose.
4. Copy the equivalent area from Ingres.
5. Compare where each artist uses contour and where each lets value define the edge.
6. Draw two anonymous profile studies from public-domain portrait photographs.

**Creation test:** invent a plausible profile by changing only nose projection and chin angle.

**Self-check:** mouth wraps around muzzle form; nostril is not a dark symbol; nose bridge direction is coherent.

---

## Chapter 13 — The head as a whole: proportion before likeness

**Difficulty:** 3/5\
**Target time:** 75–95 min\
**New variable:** coordinating features inside the skull mass.

### Reference A

- **Alphonse Legros**, _Study of a Head_.
- Graphite on gray paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/337649
- **Use:** full head.
- **Why it fits:** clear graphite head study with sufficient modeling but little distracting context.

### Reference B

- **Giovanni Gerolamo Savoldo**, _Study of a Head_, ca. 1508–18.
- Black chalk on blue paper, highlighted with white.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/341220
- **Use:** now revisit the full head rather than the eye crop; translate to graphite.
- **Why it fits:** the revisit increases scale of the problem while contrasting tonal modeling with Legros.

### Copy sequence

1. Draw cranial mass + jaw as two connected solids.
2. Place centerline and eye line.
3. Place brow, nose base, mouth and chin as horizontal landmarks.
4. Copy A without hair detail.
5. Copy B with a five-value limit.
6. Draw a new head from reference and stop before eyelashes/hair strands.

**Creation test:** redraw the new head from memory using only construction landmarks.

**Self-check:** skull volume; feature spacing; face centerline; likeness considered only after structural check.

---

## Chapter 14 — Hair and edge control: masses before strands

**Difficulty:** 3.25/5\
**Target time:** 70–90 min\
**New variable:** controlling edge variety around a complex organic mass.

### Reference A

- **Elemér de Kóródy**, _Cubist Study of A Head_, ca. 1913.
- Graphite on paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/489087
- **Use:** head/hair silhouette and internal large planes.
- **Why it fits:** forces simplification into large masses instead of strand rendering.

### Reference B

- **Jean Auguste Dominique Ingres**, _Jean-Joseph Fournier_, 1815.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/409000
- **Use:** hairline, outer hair mass, and a limited number of internal accents.
- **Why it fits:** precise naturalistic contour provides an opposite solution to de Kóródy's planar simplification.

### Copy sequence

1. Fill hair as one flat silhouette.
2. Cut three major light/shadow subdivisions into the silhouette.
3. Copy A with angular simplification.
4. Copy B with restrained contour and selective strands.
5. Compare hard, soft and lost edges.
6. Draw a new hairstyle using only masses for 80% of the time and strands for the final 20%.

**Creation test:** convert a complex hairstyle into no more than seven shapes.

**Self-check:** skull continues beneath hair; strand detail does not destroy mass; focal edges are selective.

---

# Part V — Body, clothing, and gesture

## Chapter 15 — Hands: gesture before fingers

**Difficulty:** 3.5/5\
**Target time:** 80–100 min\
**New variable:** multiple small articulated forms with foreshortening.

### Reference A

- **Eugène Delacroix**, _Studies of Hands and Figures for the Salon du Roi, Palais Bourbon_, 1833–38.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/355648
- **Use:** choose one clearly readable hand.
- **Why it fits:** loose construction emphasizes action before finish.

### Reference B

- **Jean Auguste Dominique Ingres**, _Study of Hands for "Christ Among the Doctors"_, 1852–62.
- Graphite on tracing paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/854147
- **Use:** one hand at comparable scale.
- **Why it fits:** careful contour and proportion contrast with Delacroix's searching graphite.

### Copy sequence

1. Reduce hand to palm block + wrist axis + one line per finger.
2. Group the four fingers before separating them.
3. Copy A at gesture stage only.
4. Finish A with knuckle rhythm and overlap.
5. Repeat B with cleaner contour.
6. Draw your non-drawing hand in two poses.

**Creation test:** invent a hand grasping a simple cylinder using the block-and-axis method.

**Self-check:** palm proportion; finger length rhythm; overlap; thumb attachment; gesture survives when details are removed.

---

## Chapter 16 — Drapery on the body: cloth follows anatomy

**Difficulty:** 3.5/5\
**Target time:** 80–105 min\
**New variable:** visible cloth structure over an implied body.

### Reference A

- **Johann Friedrich Overbeck**, _A Drapery Study of a Seated Man_, early 19th century.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/382512
- **Use:** whole seated drapery mass.
- **Why it fits:** clear relationship between seated pose, gravity and fold direction.

### Reference B

- **Kenyon Cox**, _Science Instructing Industry: Drapery Study_, 1898.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/10563
- **Use:** one major drapery section.
- **Why it fits:** more developed value treatment and larger fold systems raise difficulty without changing medium.

### Copy sequence

1. Sketch hidden torso/pelvis/limb axes beneath the cloth.
2. Mark tension and compression points.
3. Copy A using ridge/trough lines only.
4. Add restrained value.
5. Repeat B with broader value grouping.
6. Drape a towel over a chair or bent knee and draw it.

**Creation test:** design cloth over a bent cylinder and box form, then check whether fold origins match gravity and contact.

**Self-check:** cloth reveals underlying pose; no decorative folds disconnected from structure.

---

## Chapter 17 — Figure gesture: action in few lines

**Difficulty:** 4/5\
**Target time:** 80–105 min\
**New variable:** whole-body proportion under time pressure.

### Reference A

- **George Romney**, _Study of two figures: one seated, the other standing_, ca. 1777.
- Graphite with traces of pen and brown ink.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/343399
- **Use:** revisit the standing and seated figures as complete gestures.
- **Why it fits:** an intentional spiral back to Chapter 1, now reading the marks as whole-body action.

### Reference B

- **Mihály Munkácsy**, _Studies of Standing Men_, ca. 1891–92.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/394683
- **Use:** two standing figures.
- **Why it fits:** repeated standing poses make weight shift and proportion easy to compare.

### Copy sequence

1. 30-second gesture copies: head, action line, shoulder/pelvis tilt, feet.
2. 2-minute copies: add limb cylinders.
3. 5-minute copies: add silhouette.
4. Copy one Romney figure at 10 minutes.
5. Copy one Munkácsy figure at 10 minutes.
6. Make six original 2-minute gestures from public-domain figure photographs or a mirror.

**Creation test:** redraw one pose from memory, exaggerating the action line while keeping balance plausible.

**Self-check:** weight-bearing leg; center of gravity; shoulder/pelvis relationship; no detail before pose.

---

## Chapter 18 — Figure volume: from gesture to solid body

**Difficulty:** 4.25/5\
**Target time:** 95–120 min\
**New variable:** maintaining gesture while adding three-dimensional mass.

### Reference A

- **Jean Auguste Dominique Ingres**, _Study of a Seated Nude Male_.
- Graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/337441
- **Use:** whole figure.
- **Why it fits:** clear, sustained graphite study suitable for converting contour into simple solids.

### Reference B

- **Alphonse Legros**, _Study of a Figure_.
- Graphite on light buff paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/337601
- **Use:** whole figure.
- **Why it fits:** different balance of contour and modeling while staying close enough in medium for direct comparison.

### Copy sequence

1. Gesture skeleton.
2. Rib cage and pelvis as simple masses.
3. Limbs as tapered cylinders/wedges.
4. Copy A through these three construction layers before contour.
5. Repeat B.
6. Add only the largest shadow families.
7. Draw a new clothed or unclothed figure using the same construction order.

**Creation test:** rotate one simplified pose slightly in imagination without adding anatomical detail.

**Self-check:** gesture preserved after volume; joints connect; limbs taper; shadow does not replace construction.

---

# Part VI — Composition and synthesis

## Chapter 19 — Grouped figures: hierarchy and visual emphasis

**Difficulty:** 4.75/5\
**Target time:** 105–135 min\
**New variable:** several figures competing for attention.

### Reference A

- **Rembrandt van Rijn**, _Study Sheet with Three Women and a Boy_, ca. 1638–39.
- Pen and brown ink.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/370468
- **Use:** whole sheet, then one two-figure relationship.
- **Why it fits:** exceptionally economical figure shorthand with varying line emphasis.

### Reference B

- **Eugène Delacroix**, _Study for "The Sultan of Morocco and His Entourage"_, 1845.
- Graphite; squared in white chalk.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/336042
- **Use:** whole group as a thumbnail composition, then a central subgroup.
- **Why it fits:** a more organized, hierarchical multi-figure study contrasts with Rembrandt's immediate observations.

### Copy sequence

1. Reduce each composition to 5–8 blobs.
2. Mark primary figure, secondary figures and empty spaces.
3. Make three 5 cm thumbnails of A.
4. Copy one relationship from A at larger scale.
5. Repeat for B.
6. Rearrange three simple figure silhouettes into three different compositions.

**Creation test:** make a three-person scene where the focal person is clear without using darker facial detail.

**Self-check:** hierarchy reads at thumbnail size; overlaps are legible; empty spaces are intentional.

---

## Chapter 20 — Figure in environment: synthesis and style transfer

**Difficulty:** 5/5\
**Target time:** 2–3 sessions of 60–90 min\
**New variable:** independent selection and combination of all prior skills.

### Reference A

- **Francis William Edmonds**, _Boys Playing in a Doorway (from Sketchbook)_, ca. 1838 and after.
- Graphite on off-white wove paper.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/12880
- **Use:** figures + doorway as one integrated scene.
- **Why it fits:** combines architecture, figures and spatial placement in accessible graphite.

### Reference B

- **John Flaxman**, _Dante and Virgil in the Suicidal Wood_, 1792–93.
- Reed pen and black ink over graphite.
- The Metropolitan Museum of Art. Public Domain / Open Access.
- https://www.metmuseum.org/art/collection/search/341693
- **Use:** figures + trees as one integrated scene.
- **Why it fits:** returns to the course's opening artist, now at compositional scale; extreme line economy contrasts with Edmonds's sketchbook naturalism.

### Copy sequence

1. Thumbnail both works in 2 minutes each.
2. Map the large environment before figures.
3. Copy one figure/environment junction from A: foot-to-ground, body-to-doorway, overlap, or scale cue.
4. Copy one comparable junction from B: figure-to-tree, figure-to-ground, or contour overlap.
5. Redraw A using a Flaxman-like line economy.
6. Redraw B using a loose graphite sketchbook approach.
7. Compare what survives when style changes.

### Final creation

Create one original monochrome drawing containing:

- at least one human figure;
- one natural or architectural structure;
- clear foreground/middle-ground relationship;
- one dominant focal area;
- deliberate choice of line strategy;
- at least three grouped values if graphite shading is used.

Required process pages:

1. 6 thumbnails.
2. 2 construction studies.
3. 1 style test in Reference A's logic.
4. 1 style test in Reference B's logic.
5. final drawing.
6. written self-critique of no more than 150 words.

**Final self-check:** structure, depth, hierarchy, line quality, edge control, value grouping, stylistic consistency, and evidence that studied methods were transferred rather than merely copied.

---

# 3. Difficulty progression review

The final order was checked against four constraints:

| Chapters | Main cognitive load                                         | Why it comes here                                                 |
| -------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| 1–4      | line, shape, value, simple turning form                     | no complex subject construction required                          |
| 5–8      | natural hierarchy from bark → branch → foliage → whole tree | each chapter nests the previous one                               |
| 9–10     | spatial depth and perspective                               | uses already-learned natural forms before introducing measurement |
| 11–14    | eye → facial planes → whole head → hair/edges               | moves from a bounded feature to coordinated head structure        |
| 15–16    | articulated hand and cloth over body                        | local body problems before the full figure                        |
| 17–18    | gesture → volume                                            | motion is established before anatomy/mass                         |
| 19–20    | multi-figure hierarchy → figure in environment              | composition only after local drawing problems are stable          |

### Reference-fit review

The second pass made these deliberate choices:

- Early chapters use crops, not full master copies, to prevent subject complexity from outrunning the technique being taught.
- Tree chapters progress from surface → branching → foliage → whole silhouette. Full-tree references are withheld until Chapter 8.
- The head starts with the eye only after perspective and value have already been introduced.
- Romney, Durand, Savoldo, Ingres and Flaxman are intentionally revisited. The repeated reference is used at a different scale/problem each time, creating a spiral curriculum rather than accidental duplication.
- Exact drawing studies were preferred over paintings and most prints. The Bresdin pen drawing is retained because it is an unusually clean hatching comparison for the rock chapter.
- Colored media were avoided where possible. Black chalk is retained only where its monochrome tonal logic transfers directly to graphite; learners should reproduce those examples in graphite.
- References containing brown ink remain valid because they are single-ink drawings and reproduce cleanly in grayscale.
- No chapter requires the learner to imitate museum paper color, white-chalk highlights, or historical materials. The working kit can remain graphite plus an optional black pen.

---

# 4. Learner materials

Required:

- HB pencil;
- 2B pencil;
- 4B optional;
- kneaded or soft eraser;
- sharpener;
- plain A4 drawing paper or printed worksheets;
- ruler only for Chapter 10 construction;
- black fineliner or dip pen optional for pen exercises.

Avoid a large materials list. Technique rather than equipment is the course variable.

---

# 5. Site UX

## Course index

Show a compact grid/list with:

- chapter number;
- title;
- one-line skill;
- difficulty 1–5;
- approximate duration;
- two small grayscale reference thumbnails;
- completion checkbox stored locally if desired.

Do not gamify with points, streaks, badges, or mandatory accounts.

## Chapter page

Desktop:

```text
[chapter title]                         [Print / Save PDF]

[goal] [time] [materials]

[Reference A]            [Reference B]
[image]                  [image]
[caption/source]         [caption/source]

[Look]
[Map]
[Copy A]
[Copy B]
[Compare]
[Create]
[Self-check]
```

Mobile: single column.

Print: one controlled worksheet flow with source image and exercise text kept together.

## Comparison component

Use the same prompts throughout the course where applicable:

| Question                                                    | Reference A | Reference B |
| ----------------------------------------------------------- | ----------- | ----------- |
| What carries the form: contour, value, or both?             |             |             |
| Where are the darkest accents?                              |             |             |
| Which details are omitted?                                  |             |             |
| How are edges varied?                                       |             |             |
| What is the smallest set of marks that preserves the style? |             |             |

## Step diagrams

Do not fabricate fake "master progress shots." The museum provides the finished artwork, not intermediate states.

Instead create original instructional overlays:

- bounding rectangle;
- major axis;
- envelope;
- anchor dots;
- branch-generation diagram;
- value-map overlay;
- perspective lines;
- head centerline/landmarks;
- rib-cage/pelvis masses.

Label them explicitly as **course analysis overlay**, not as an artist's historical process.

---

# 6. Content data model

A reference record should resemble:

```json
{
  "id": "met-flaxman-morning-341696",
  "artist": "John Flaxman",
  "title": "Morning: Pope's Odyssey, Book 12",
  "date": "1792",
  "medium": "Pen and gray ink over graphite",
  "museum": "The Metropolitan Museum of Art",
  "objectUrl": "https://www.metmuseum.org/art/collection/search/341696",
  "rights": "Public Domain / Open Access",
  "rightsUrl": "https://www.metmuseum.org/policies/image-resources",
  "downloadUrl": "https://images.metmuseum.org/...",
  "retrievedAt": "YYYY-MM-DD",
  "originalFilename": "...",
  "sha256": "...",
  "masterImage": "/assets/references/met-flaxman-morning-341696.jpg",
  "crops": [
    {
      "id": "figure-contour",
      "path": "/assets/crops/met-flaxman-morning-341696-figure-contour.jpg",
      "purpose": "Chapter 01 line-quality copy",
      "sourceRect": { "x": 0, "y": 0, "width": 0, "height": 0 },
      "width": 0,
      "height": 0,
      "alt": "..."
    }
  ]
}
```

Chapter front matter:

```yaml
---
number: 1
slug: line-quality
title: "Line quality: speed, pressure, and economy"
difficulty: 1
duration: "35–45 min"
references:
  - met-flaxman-morning-341696
  - met-romney-two-figures-343399
printPages: 5
---
```

# 7. Implementation sequence

Use the following order so print and asset risks are resolved before all 20 chapters are laid out.

1. **Scaffold and validation**
   - initialize Eleventy, layouts, CSS entry points, and package scripts;
   - define the reference and chapter schemas;
   - make validation failures block the production build.
2. **Asset preflight**
   - verify every object page and current rights label;
   - download masters from official controls or APIs;
   - record provenance and checksums before creating derivatives;
   - flag any unavailable or inadequate image for replacement before chapter work begins.
3. **Representative vertical slice**
   - implement the orientation page and Chapters 1, 10, and 20;
   - render their A4 packets in current Chromium;
   - settle typography, crop sizes, drawing-space dimensions, and page budgets.
4. **Course production**
   - build the remaining chapters by part;
   - run content validation after each part;
   - add review checkpoints after Chapters 4, 8, 10, 14, and 18.
5. **Release verification**
   - test screen layouts at narrow mobile and desktop widths;
   - test keyboard use and the complete course with JavaScript disabled;
   - render all chapter packets and inspect page breaks, scale, captions, and grayscale legibility;
   - rerun source-page and rights checks immediately before release.

Each phase is complete only when its outputs pass validation. In particular, do not proceed from the vertical slice to all chapters until the three representative print packets have acceptable pagination.

---

# 8. Acceptance criteria for Codex implementation

The implementation is ready when:

1. all 20 chapter routes build statically;
2. the orientation route includes the baseline exercise, print guidance, and a correctly sized 50 mm calibration line at 100% print scale;
3. every reference card links to the museum object page;
4. every locally stored reference image has a complete rights/source record and reproducible crop metadata;
5. no guessed image download URLs are committed; images come from official museum download/API outputs;
6. all chapter source images and captions are visible in print;
7. `Print / Save PDF` produces a clean A4 result in current Chromium;
8. no exercise block is split awkwardly across pages where CSS can prevent it;
9. grayscale print remains legible;
10. all drawing spaces print at the specified physical dimensions when the calibration line measures 50 mm;
11. browser accessibility basics are met: semantic headings, meaningful alt text, keyboard-accessible controls, visible focus, and sufficient contrast;
12. every route and local asset link passes the automated link check;
13. the course index, chapters, and worksheets remain usable with JavaScript disabled;
14. the website contains no tracking requirement, account requirement, or server-side dependency;
15. the final chapter can be printed as a standalone assessment packet;
16. all source URLs and rights labels are checked once more immediately before release because museum records can change.

# 9. Editorial rule

Keep prose short. Each instructional paragraph should answer one of three things only:

- what to look at;
- what to draw next;
- how to judge the result.

The visual references, crops, overlays, and drawing spaces should carry most of the course.
