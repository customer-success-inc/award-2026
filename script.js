/* ===================================
   カスタマーサクセス・アワード2026
   JavaScript
=================================== */

/* ──────────────────────────────────
   ナビゲーション スクロール処理
────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ──────────────────────────────────
   ハンバーガーメニュー
────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ──────────────────────────────────
   スムーズスクロール
────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ──────────────────────────────────
   カウントダウンタイマー
────────────────────────────────── */
function updateCountdown() {
  const eventDate = new Date('2026-07-15T17:30:00+09:00');
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('countDays').textContent = '00';
    document.getElementById('countHours').textContent = '00';
    document.getElementById('countMinutes').textContent = '00';
    document.getElementById('countSeconds').textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');

  document.getElementById('countDays').textContent    = pad(days);
  document.getElementById('countHours').textContent   = pad(hours);
  document.getElementById('countMinutes').textContent = pad(minutes);
  document.getElementById('countSeconds').textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ──────────────────────────────────
   スクロールアニメーション (Intersection Observer)
────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // 少し遅延をつけて順番にフェードイン
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -48px 0px'
});

// delay をつける
document.querySelectorAll('.reveal').forEach((el, idx) => {
  // 同じ親の中の兄弟順に遅延
  const parent = el.parentElement;
  const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
  const sibIdx = siblings.indexOf(el);
  el.dataset.delay = sibIdx * 80;
  revealObserver.observe(el);
});

/* ──────────────────────────────────
   ヒーローキャンバス パーティクルアニメーション
────────────────────────────────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse;
  mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.7 + 0.2;
      const rnd = Math.random();
      this.color = rnd > 0.6
        ? `rgba(255,255,255,${this.alpha * 0.8})`
        : rnd > 0.3
          ? `rgba(160,200,255,${this.alpha * 0.7})`
          : `rgba(100,170,255,${this.alpha * 0.5})`;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // マウスへの微弱な引力
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.vx += (dx / dist) * 0.02;
        this.vy += (dy / dist) * 0.02;
      }

      // 速度制限
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.2) { this.vx *= 1.2 / speed; this.vy *= 1.2 / speed; }

      if (this.y < -10) this.reset();
      if (this.x < -10 || this.x > W + 10) {
        this.x = Math.random() * W;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // ラインを繋ぐ
  function drawLines(pts) {
    const limit = 80;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < limit * limit) {
          const alpha = (1 - Math.sqrt(d2) / limit) * 0.25;
          ctx.strokeStyle = `rgba(180,215,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(W * H / 8000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // 背景グラデーション（明るいブルーの光彩）
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.38, 0, W * 0.5, H * 0.38, W * 0.65);
    grad.addColorStop(0, 'rgba(80,140,255,0.18)');
    grad.addColorStop(0.5, 'rgba(40,90,220,0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    drawLines(particles);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  init();
  animate();
})();

/* ──────────────────────────────────
   テキストのグリッチ演出（タイトル）
────────────────────────────────── */
function addGlitchEffect() {
  const title = document.querySelector('.title-main');
  if (!title) return;

  setInterval(() => {
    title.style.textShadow = `
      ${(Math.random() - 0.5) * 4}px 0 rgba(100,130,255,0.6),
      ${(Math.random() - 0.5) * 4}px 0 rgba(33,49,240,0.4)
    `;
    setTimeout(() => {
      title.style.textShadow = 'none';
    }, 100);
  }, 3000 + Math.random() * 2000);
}

addGlitchEffect();

/* ──────────────────────────────────
   ナビリンクのアクティブ状態
────────────────────────────────── */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navHeight = nav.offsetHeight + 32;

  let current = '';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= navHeight) {
      current = '#' + section.id;
    }
  });

  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === current
      ? 'rgba(255,255,255,1)'
      : 'rgba(255,255,255,0.7)';
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ──────────────────────────────────
   スライドショー（天下一武闘会）
────────────────────────────────── */
(function () {
  const slideshow = document.querySelector('.battle-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.battle-slide');
  const dotsContainer = slideshow.querySelector('.slide-dots');
  let current = 0;
  let timer;

  // ドット生成
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    slideshow.querySelector('.battle-slides').style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.slide-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 3500);
  }

  window.slideMove = function (btn, dir) {
    goTo(current + dir);
  };

  resetTimer();
})();
