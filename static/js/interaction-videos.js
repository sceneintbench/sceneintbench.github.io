// Keep example playback independent of the template's external libraries.
(() => {
  const videos = [...document.querySelectorAll('#interactions video[autoplay]')];
  const visible = new Set();

  function update(video) {
    if (document.hidden || !visible.has(video)) {
      if (!video.paused) {
        video.pause();
      }
    } else if (video.paused) {
      video.play().catch(() => {});
    }
  }

  videos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.addEventListener('play', () => update(video));
    video.addEventListener('canplay', () => update(video));
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          visible.add(entry.target);
        } else {
          visible.delete(entry.target);
        }
        update(entry.target);
      });
    }, { threshold: [0, 0.2] });
    videos.forEach(video => observer.observe(video));
  } else {
    videos.forEach(video => {
      visible.add(video);
      update(video);
    });
  }

  document.addEventListener('visibilitychange', () => videos.forEach(update));
})();
