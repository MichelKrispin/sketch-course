const printButton = document.querySelector('.print-button');
if (printButton) { printButton.hidden = false; printButton.addEventListener('click', () => window.print()); }
for (const label of document.querySelectorAll('.completion')) {
  const input = label.querySelector('input');
  try {
    const key = `imitation-course:chapter:${input.value}`;
    input.checked = localStorage.getItem(key) === 'complete';
    label.hidden = false;
    input.addEventListener('change', () => { try { localStorage.setItem(key, input.checked ? 'complete' : ''); } catch { /* Drawing remains available when storage is restricted. */ } });
  } catch { /* Optional progress controls stay hidden if storage is unavailable. */ }
}
