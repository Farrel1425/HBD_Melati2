/* ===================================================
   BIRTHDAY MELATI — script.js
   =================================================== */

// ── Loading Screen ────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hide');
    initParticles();
    initPetalRain();
  }, 2000);
});

// ── Open Message Button ───────────────────────────
document.getElementById('open-msg-btn').addEventListener('click', () => {
  const slider = document.getElementById('slider-section');
  slider.classList.add('revealed');
  slider.scrollIntoView({ behavior: 'smooth', block: 'start' });
  tryAutoplayMusic();
});

// ── Music Player ──────────────────────────────────
const music   = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
let musicStarted = false;

function tryAutoplayMusic() {
  if (musicStarted) return;
  music.volume = 0.45;
  music.play().then(() => {
    musicStarted = true;
    musicIcon.textContent = '♫';
  }).catch(() => {});
}

musicBtn.addEventListener('click', () => {
  tryAutoplayMusic();
  if (music.paused) {
    music.play();
    musicIcon.textContent = '♫';
  } else {
    music.pause();
    musicIcon.textContent = '♪';
  }
});

// ── Slider ────────────────────────────────────────
const slides     = document.querySelectorAll('.slide');
const dotsWrap   = document.getElementById('sliderDots');
let current      = 0;
let autoSlide;

// Build dots
slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
});
slides[0].classList.add('active');

function goTo(n) {
  slides[current].classList.remove('active');
  dotsWrap.children[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dotsWrap.children[current].classList.add('active');
  resetAuto();
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

function startAuto() { autoSlide = setInterval(() => goTo(current + 1), 3800); }
function resetAuto()  { clearInterval(autoSlide); startAuto(); }
startAuto();

// Touch / Swipe support
let touchStartX = 0;
const track = document.getElementById('sliderTrack');
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const dx = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(dx) > 40) goTo(dx > 0 ? current + 1 : current - 1);
});

// Real media: replace placeholders if files exist
function tryLoadMedia(slide, type, src) {
  if (type === 'img') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = src;
    img.onload = () => {
      const m = slide.querySelector('.slide-media');
      m.innerHTML = '';
      m.classList.remove('placeholder');
      m.appendChild(img);
    };
  } else if (type === 'video') {
    const v = document.createElement('video');
    v.src = src; v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
    v.oncanplay = () => {
      const m = slide.querySelector('.slide-media');
      m.innerHTML = '';
      m.classList.remove('placeholder');
      m.appendChild(v);
    };
  }
}
tryLoadMedia(slides[0], 'img',   'assets/images/photo1.jpg');
tryLoadMedia(slides[1], 'video', 'assets/videos/video1.mp4');
tryLoadMedia(slides[2], 'img',   'assets/images/photo2.jpg');
tryLoadMedia(slides[3], 'img',   'assets/images/photo3.jpg');
tryLoadMedia(slides[4], 'video', 'assets/videos/video2.mp4');
tryLoadMedia(slides[5], 'img',   'assets/images/photo4.jpg');
tryLoadMedia(slides[6], 'video', 'assets/videos/video3.mp4');

// ── Scroll Reveal (Cards + Closing) ──────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.18 });
reveals.forEach(el => revealObserver.observe(el));

// ── Floating Particles ────────────────────────────
function initParticles() {
  const container = document.getElementById('particles-container');
  const symbols = ['🌸', '🌷', '✨', '🤍', '💛', '🫧', '🌼', '💮'];
  const count   = window.innerWidth < 600 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const size    = (.6 + Math.random() * .6) + 'rem';
    const left    = Math.random() * 100 + '%';
    const dur     = (8 + Math.random() * 14) + 's';
    const delay   = (Math.random() * 12) + 's';
    p.style.cssText = `font-size:${size};left:${left};animation-duration:${dur};animation-delay:${delay};`;
    container.appendChild(p);
  }
}

// ── Petal Rain (Closing Section) ─────────────────
function initPetalRain() {
  const rain = document.getElementById('petalRain');
  const petals = ['🌷', '🌸', '🌼', '💮', '🪷'];
  const count  = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    const left  = Math.random() * 100 + '%';
    const dur   = (4 + Math.random() * 7) + 's';
    const delay = (Math.random() * 8) + 's';
    const size  = (.9 + Math.random() * .8) + 'rem';
    p.style.cssText = `left:${left};font-size:${size};animation-duration:${dur};animation-delay:${delay};`;
    rain.appendChild(p);
  }
}

// ── First interaction → try music ─────────────────
document.addEventListener('click', tryAutoplayMusic, { once: true });
document.addEventListener('touchstart', tryAutoplayMusic, { once: true });