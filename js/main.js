  function showAboutPage() {
    document.querySelectorAll('.band-page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-about').classList.add('active');
  }
  function hideAboutPage() {
    document.getElementById('page-about').classList.remove('active');
  }
  function loadAboutPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const placeholder = document.querySelector('.about-photo-placeholder');
      let img = placeholder.querySelector('img');
      if (!img) { img = document.createElement('img'); placeholder.appendChild(img); }
      img.src = e.target.result;
      placeholder.querySelector('.collage-icon').style.display = 'none';
      placeholder.querySelector('.collage-label').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  function showPage(id) {
    document.querySelectorAll('.band-page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + id);
    if (page) page.classList.add('active');
  }
  function hidePage() {
    document.querySelectorAll('.band-page').forEach(p => p.classList.remove('active'));
  }

  // Populated from Sanity (js/sanity.js) or static fallback below
  window.mediaRegistry = window.mediaRegistry || {
    "tigers-eye": [null, null, null],
    whisk: [null, null, null],
    "cloud-companion": [null, null, null],
    "soul-sipper": [null, null, null],
    "savoy-big-band": [null, null, null],
    souveniir: [null, null, null],
  };

  function openLightbox(band, index) {
    const lb = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    const src = window.mediaRegistry[band] && window.mediaRegistry[band][index];
    const isVideo = index < 3;

    if (src) {
      if (isVideo) {
        content.innerHTML = `<video src="${src}" controls autoplay style="max-width:90vw;max-height:90vh;border-radius:6px;"></video>`;
      } else {
        content.innerHTML = `<img src="${src}" alt="media" style="max-width:90vw;max-height:90vh;border-radius:6px;object-fit:contain;">`;
      }
    } else {
      const label = isVideo ? 'Video' : 'Photo';
      content.innerHTML = `<div class="lightbox-placeholder"><div class="big-icon">${isVideo ? '▶' : '◻'}</div><p>${label} placeholder — add your file path in the mediaRegistry</p></div>`;
    }
    lb.classList.add('open');
  }

  function closeLightbox(e) {
    if (!e || e.target === document.getElementById('lightbox') || e.target.classList.contains('lightbox-close')) {
      const lb = document.getElementById('lightbox');
      lb.classList.remove('open');
      document.getElementById('lightbox-content').innerHTML = '';
    }
  }

  // Fade in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
  window.__fadeObserver = observer;

  // Stagger children of fade-in parents
  document.querySelectorAll('.playing-grid, .session-cols, .gear-inner, .about-inner, .contact-inner').forEach(parent => {
    parent.querySelectorAll('.fade-in').forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.12}s`;
    });
  });
