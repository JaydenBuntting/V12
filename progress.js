(function () {
  'use strict';
  const main = document.querySelector('main[data-page]');
  const lessonMode = document.getElementById('lessonMode');
  if (!main || !lessonMode || !window.AF) return;

  const STANDARD = main.dataset.page;      // '91164'
  const DWELL_MS = 1200;
  let user = null, timer = null, lastKey = null;

  function current() {
    const inst = lessonMode.querySelector('.lesson-instance.active');
    const slide = inst && inst.querySelector('.lesson-slide.active');
    if (!inst || !slide) return null;
    return { lesson: Number(inst.dataset.lesson), part: Number(slide.dataset.part) };
  }

  async function commit() {
    if (!user || !lessonMode.classList.contains('active')) return;
    const c = current();
    if (!c) return;
    const key = c.lesson + ':' + c.part;
    if (key === lastKey) return;
    lastKey = key;
    const { error } = await AF.sb.from('slide_progress').upsert({
      user_id: user.id, standard: STANDARD, lesson: c.lesson, part: c.part,
      last_seen: new Date().toISOString()
    }, { onConflict: 'user_id,standard,lesson,part' });
    if (error) { console.error('Progress save failed:', error.message); lastKey = null; }
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(commit, DWELL_MS);
  }

  function showChip() {
    if (sessionStorage.getItem('af_chip_hidden')) return;
    const chip = document.createElement('div');
    chip.className = 'af-chip';
    chip.innerHTML = '<a href="login.html?next=' + encodeURIComponent(location.pathname.split('/').pop()) +
      '">Sign in</a> to save your progress.<button type="button" aria-label="Dismiss">✕</button>';
    chip.querySelector('button').addEventListener('click', () => {
      sessionStorage.setItem('af_chip_hidden', '1'); chip.remove();
    });
    document.body.appendChild(chip);
  }

  (async function init() {
    await AF.ready;
    user = await AF.getUser();
    if (!user) { showChip(); return; }

    new MutationObserver(() => { lastKey = lastKey; schedule(); })
      .observe(lessonMode, { attributes: true, attributeFilter: ['class'], subtree: true });

    schedule();   // covers opening a lesson straight from a dashboard link (#l1-p3)
  })();

  // reset so re-opening the same slide after leaving counts again
  document.getElementById('backToStandard')?.addEventListener('click', () => { lastKey = null; });
})();