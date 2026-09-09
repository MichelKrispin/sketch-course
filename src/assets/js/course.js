const printButton = document.querySelector('.print-button');
if (printButton) { printButton.hidden = false; printButton.addEventListener('click', () => window.print()); }
const languageToggle = document.querySelector('.language-toggle');
if (languageToggle) {
  try {
    const preferredLanguage = localStorage.getItem('imitation-course:language');
    if (preferredLanguage === languageToggle.lang) window.location.replace(languageToggle.href);
  } catch { /* The requested page remains available when storage is restricted. */ }
  languageToggle.addEventListener('click', () => {
    try { localStorage.setItem('imitation-course:language', languageToggle.lang); } catch { /* The language link still works without storage. */ }
  });
}
const completionLabels = [...document.querySelectorAll('.completion')];
const completionInputs = completionLabels.map(label => label.querySelector('input'));
function updateProgress() {
  const progress = document.querySelector('.progress-summary');
  if (!progress) return;
  const completed = new Set(completionInputs.filter(input => input.checked).map(input => input.value));
  progress.querySelector('[data-progress-count]').textContent = completed.size;
  const nextInput = completionInputs.find(input => !completed.has(input.value));
  const nextCardLink = nextInput?.closest('.chapter-card')?.querySelector('h3 a');
  const nextLink = progress.querySelector('[data-next-chapter]');
  if (nextCardLink) nextLink.href = nextCardLink.href;
  nextLink.hidden = !nextCardLink;
  progress.hidden = false;
}
for (const label of completionLabels) {
  const input = label.querySelector('input');
  try {
    const key = `imitation-course:chapter:${input.value}`;
    input.checked = localStorage.getItem(key) === 'complete';
    label.hidden = false;
    input.addEventListener('change', () => { try { localStorage.setItem(key, input.checked ? 'complete' : ''); } catch { /* Drawing remains available when storage is restricted. */ } updateProgress(); });
  } catch { /* Optional progress controls stay hidden if storage is unavailable. */ }
}
updateProgress();
