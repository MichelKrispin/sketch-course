---
layout: layouts/base.njk
title: Before you begin
permalink: /orientation/
---
<div class="prose">
<section class="orientation-sheet">
<p class="eyebrow">{{ 'Orientation / Your first two sheets' | t }}</p>
<h1>{{ 'Before you begin.' | t }}</h1>
<p>{{ 'Work in graphite or a single ink. Learn one drawing decision at a time, then use it on something new. Target times are guidance, not deadlines.' | t }}</p>
<h2>{{ 'A small working kit' | t }}</h2>
<ul><li>{{ 'HB and 2B pencils; 4B is optional.' | t }}</li><li>{{ 'A kneaded or soft eraser and a sharpener.' | t }}</li><li>{{ 'Plain A4 drawing paper or printed worksheets.' | t }}</li><li>{{ 'A ruler for Chapter 10. A black fineliner or dip pen is optional.' | t }}</li></ul>
<p>{{ 'Translate ink and black chalk into graphite if you prefer. Leave paper white; you do not need to imitate tinted paper, white highlights, or historical materials.' | t }}</p>
<h2>{{ 'The repeating rhythm' | t }}</h2>
<ol>{% for step in ['Look for 3–5 minutes: directions, shapes, accents, and repeated marks.','Map the bounding box, main axis, 3–7 anchors, and large gaps.','Copy the selected fragment from Reference A.','Copy a comparable fragment from Reference B.','Compare concrete choices in the marks.','Create a new subject using one of those choices.','Self-check structure first, style second, detail last.'] %}<li>{{ step | t }}</li>{% endfor %}</ol>
<h2>{{ 'What counts as completing a chapter' | t }}</h2>
<p>{{ 'Finish the original drawing and rate every self-check criterion. “Revise” is useful evidence, not failure: redraw only the weakest area once, write the next practice you need, and move on. At your next session, attempt the 60-second retrieval prompt before reviewing the previous lesson.' | t }}</p>
<h2>{{ 'Print a working packet' | t }}</h2>
<p>{{ 'Use “Print / Save PDF”, or your browser’s print command when JavaScript is disabled. Choose A4, portrait, 100% scale, and turn off browser headers and footers. The stylesheet supplies the margins. Enable background graphics for Chapter 10’s faint grid.' | t }}</p>
<p>{{ 'Measure the line below: it should be 50 mm. If it differs, turn off “fit to page” and check the scale. Letter paper may reflow; check print preview and the calibration before drawing. Screen sizes are not physical measurements.' | t }}</p>
<div class="calibration"><span>{{ '50 mm at 100% print scale' | t }}</span></div>
</section>
<section class="orientation-sheet" id="baseline">
<p class="eyebrow">{{ 'Baseline / Keep this sheet' | t }}</p>
<h2>{{ 'Fifteen minutes. One familiar subject.' | t }}</h2>
<p>{{ 'Draw a shoe, plant, or your hand from life. Work as you normally would. Do not study a chapter first. Write the date, subject, and time used above the drawing.' | t }}</p>
<p class="space-label">{{ 'Baseline drawing · 180 × 165 mm at 100% print scale' | t }}</p>
<div class="drawing-space final-space" aria-label="{{ 'Blank space for your baseline drawing' | t }}"></div>
<h3>{{ 'Keep it for Chapter 20' | t }}</h3>
<p>{{ 'After the final chapter, redraw the same subject for 15 minutes. Place both attempts side by side and compare proportion, line choice, value grouping, and unnecessary detail.' | t }}</p>
<p>{{ 'Pause for a 20-minute memory review after Chapters 4, 8, 10, 14, and 18. Revisit an earlier creation task on a separate sheet before opening its self-check.' | t }}</p>
<p class="screen-only"><a class="button" href="{{ '/chapter/01-line-quality/' | localeUrl | url }}">{{ 'Start Chapter 01 →' | t }}</a></p>
</section>
</div>
