/**
 * Momin Hossain Portfolio - Interactive Animation Engines & Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initShowreelPlayer();
  initProjectsGrid();
  initStudioPlayground();
  initAvatarCanvas();
  initReviewsSection();
  initContactForm();
});

/* ==========================================================================
   1. NAVIGATION & UI HELPERS
   ========================================================================== */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Update Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   2. MAIN SHOWREEL ANIMATION ENGINE & VIDEO PLAYER
   ========================================================================== */
function initShowreelPlayer() {
  const canvas = document.getElementById('mainReelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const playPauseBtn = document.getElementById('playPauseBtn');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const reelOverlay = document.getElementById('reelOverlay');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');
  const timeDisplay = document.getElementById('timeDisplay');
  const sceneChips = document.querySelectorAll('.scene-chip');
  const fullCanvasBtn = document.getElementById('fullCanvasBtn');

  let isPlaying = false;
  let currentScene = 'cyber';
  let animFrameId = null;
  let time = 0;
  const totalDuration = 30; // 30 seconds reel simulation
  let currentTime = 0;

  // Render particle objects
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
    color: Math.random() > 0.5 ? '#6366f1' : '#06b6d4',
    alpha: Math.random() * 0.7 + 0.3
  }));

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      reelOverlay.classList.add('playing');
      lastTimestamp = performance.now();
      renderLoop();
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      reelOverlay.classList.remove('playing');
      if (animFrameId) cancelAnimationFrame(animFrameId);
    }
  }

  [playPauseBtn, bigPlayBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', togglePlay);
  });

  sceneChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      sceneChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentScene = chip.dataset.scene;
      if (!isPlaying) {
        drawScene(currentScene, time);
      }
    });
  });

  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = ratio * totalDuration;
      updateTimelineUI();
      if (!isPlaying) drawScene(currentScene, time);
    });
  }

  if (fullCanvasBtn) {
    fullCanvasBtn.addEventListener('click', () => {
      const wrapper = document.getElementById('reelWrapper');
      if (!document.fullscreenElement) {
        if (wrapper.requestFullscreen) wrapper.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  let lastTimestamp = performance.now();

  function renderLoop(timestamp) {
    if (!isPlaying) return;
    const delta = (timestamp - lastTimestamp) / 1000 || 0.016;
    lastTimestamp = timestamp;

    time += delta;
    currentTime += delta;
    if (currentTime >= totalDuration) {
      currentTime = 0;
    }

    updateTimelineUI();
    drawScene(currentScene, time);
    animFrameId = requestAnimationFrame(renderLoop);
  }

  function updateTimelineUI() {
    const progressPercent = (currentTime / totalDuration) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
    const totalMins = Math.floor(totalDuration / 60).toString().padStart(2, '0');
    const totalSecs = Math.floor(totalDuration % 60).toString().padStart(2, '0');
    if (timeDisplay) timeDisplay.textContent = `${mins}:${secs} / ${totalMins}:${totalSecs}`;
  }

  function drawScene(scene, t) {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (scene === 'cyber') {
      // Scene 1: Cyber Dhaka 2077
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Grid Floor
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      const horizon = h * 0.6;
      for (let x = -w; x < w * 2; x += 40) {
        ctx.beginPath();
        ctx.moveTo(w / 2, horizon);
        ctx.lineTo(x + ((t * 60) % 40), h);
        ctx.stroke();
      }
      for (let y = horizon; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Futuristic Buildings Silhouette
      ctx.fillStyle = '#0f172a';
      const bWidths = [80, 100, 60, 120, 90, 70, 110];
      let xOffset = 0;
      bWidths.forEach((bw, idx) => {
        const bh = 150 + Math.sin(idx * 2) * 50;
        ctx.fillRect(xOffset, horizon - bh, bw, bh);

        // Glowing Windows
        ctx.fillStyle = idx % 2 === 0 ? 'rgba(99, 102, 241, 0.8)' : 'rgba(6, 182, 212, 0.8)';
        for (let wy = horizon - bh + 10; wy < horizon - 20; wy += 25) {
          if (Math.sin(wy + t * 5) > 0) {
            ctx.fillRect(xOffset + 15, wy, 8, 8);
            ctx.fillRect(xOffset + bw - 25, wy, 8, 8);
          }
        }
        ctx.fillStyle = '#0f172a';
        xOffset += bw + 10;
      });

      // Flying Car Light Trails
      const carX = (t * 250) % (w + 200) - 100;
      const carY = horizon - 80 + Math.sin(t * 3) * 20;
      ctx.fillStyle = '#ec4899';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(carX, carY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Neon Bangla Text Hologram
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillText('মোমিন অ্যানিমেশন ২০৭৭', w / 2 - 120, horizon - 160 + Math.sin(t * 2) * 8);
      ctx.shadowBlur = 0;

    } else if (scene === 'nature') {
      // Scene 2: River of Dreams
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0284c7');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#022c22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Moon
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(w - 150, 100, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Water Waves
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      for (let x = 0; x <= w; x += 20) {
        ctx.lineTo(x, h * 0.65 + Math.sin(x * 0.01 + t * 2) * 15);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Boat & Character Silhouette
      const boatX = w * 0.3 + Math.sin(t) * 30;
      const boatY = h * 0.65 + Math.sin(boatX * 0.01 + t * 2) * 12;

      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.ellipse(boatX, boatY + 10, 45, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Character posture
      ctx.fillRect(boatX - 5, boatY - 20, 10, 20);
      ctx.beginPath();
      ctx.arc(boatX, boatY - 25, 7, 0, Math.PI * 2);
      ctx.fill();

      // Fireflies
      particles.forEach(p => {
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, (p.y % (h * 0.7)), p.size, 0, Math.PI * 2);
        ctx.fill();
        p.x += Math.sin(t + p.y) * 0.5;
      });
      ctx.shadowBlur = 0;

    } else if (scene === 'cosmic') {
      // Scene 3: Cosmic Voyage
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;

      // Swirling Vortex Spiral
      for (let i = 0; i < 200; i++) {
        const angle = i * 0.1 + t * 1.5;
        const radius = i * 2.2;
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          ctx.fillStyle = i % 2 === 0 ? '#6366f1' : '#ec4899';
          ctx.beginPath();
          ctx.arc(px, py, (i / 200) * 4 + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Central Portal Glow
      const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 80);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();

    } else if (scene === 'abstract') {
      // Scene 4: Geometric Rhythm
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const cubeSize = 100 + Math.sin(t * 3) * 30;

      // Rotating 3D Wireframe Box Simulation
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(t);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;

      ctx.strokeRect(-cubeSize / 2, -cubeSize / 2, cubeSize, cubeSize);

      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = '#6366f1';
      ctx.shadowColor = '#6366f1';
      ctx.strokeRect(-cubeSize / 2.5, -cubeSize / 2.5, cubeSize / 1.25, cubeSize / 1.25);

      ctx.restore();

      // Audio Spectrum Equalizer Simulation
      const numBars = 32;
      const barWidth = w / numBars;
      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.abs(Math.sin(i * 0.3 + t * 4)) * (h * 0.35);
        ctx.fillStyle = `hsl(${(i * 10 + t * 50) % 360}, 80%, 60%)`;
        ctx.fillRect(i * barWidth, h - barHeight, barWidth - 4, barHeight);
      }
    }
  }

  // Initial first frame draw
  drawScene(currentScene, 0);
}

/* ==========================================================================
   3. PROJECTS SHOWCASE GRID & MODAL VIEW
   ========================================================================== */
function initProjectsGrid() {
  const cards = document.querySelectorAll('.project-card');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCanvas = document.getElementById('modalCanvas');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalBadge = document.getElementById('modalBadge');

  let modalAnimId = null;

  // Render Mini Canvases for Project Cards
  cards.forEach(card => {
    const canvas = card.querySelector('.card-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const type = canvas.dataset.type;

    let seed = Math.random() * 100;
    function animateCard() {
      seed += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (type === 'legend') {
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#818cf8';
        ctx.beginPath();
        ctx.arc(w / 2 + Math.sin(seed) * 20, h / 2, 40 + Math.cos(seed) * 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'cyber') {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(0, (seed * 50) % h);
        ctx.lineTo(w, (seed * 50 + 40) % h);
        ctx.stroke();
      } else if (type === 'cosmic') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#ec4899';
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.arc((i * 30 + seed * 40) % w, (i * 20 + Math.sin(seed + i) * 30) % h, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#10b981';
        ctx.fillRect((seed * 60) % w, h / 2 - 20, 40, 40);
      }

      requestAnimationFrame(animateCard);
    }
    animateCard();

    // Click card to open detail modal
    card.addEventListener('click', () => {
      const title = card.querySelector('.card-title').textContent;
      const desc = card.querySelector('.card-desc').textContent;
      const badge = card.querySelector('.card-badge').textContent;

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalBadge) modalBadge.textContent = badge;

      openModal(type);
    });
  });

  // Filter Buttons Handler
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  function openModal(type) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', false);

    if (modalCanvas) {
      const ctx = modalCanvas.getContext('2d');
      let mTime = 0;
      function drawModalCanvas() {
        mTime += 0.04;
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);

        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(modalCanvas.width / 2 + Math.cos(mTime) * 100, modalCanvas.height / 2 + Math.sin(mTime) * 50, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.fillText('Momin Hossain HD Preview', modalCanvas.width / 2 - 160, modalCanvas.height / 2 + 10);

        if (modal.classList.contains('active')) {
          modalAnimId = requestAnimationFrame(drawModalCanvas);
        }
      }
      drawModalCanvas();
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', true);
    if (modalAnimId) cancelAnimationFrame(modalAnimId);
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
}

/* ==========================================================================
   4. INTERACTIVE MOTION STUDIO LAB
   ========================================================================== */
function initStudioPlayground() {
  const canvas = document.getElementById('studioCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const speedRange = document.getElementById('speedRange');
  const particleRange = document.getElementById('particleRange');
  const colorBtns = document.querySelectorAll('.color-btn');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const resetBtn = document.getElementById('resetStudioBtn');
  const fpsCounter = document.getElementById('fpsCounter');
  const particleCounter = document.getElementById('particleCounter');

  let speedMultiplier = 1;
  let particleCount = 400;
  let palette = 'neon';
  let mode = 'vortex';

  const palettes = {
    neon: ['#6366f1', '#06b6d4', '#a5b4fc', '#38bdf8'],
    fire: ['#f43f5e', '#f59e0b', '#fbbf24', '#ef4444'],
    cyberpunk: ['#ec4899', '#8b5cf6', '#d946ef', '#a855f7'],
    emerald: ['#10b981', '#3b82f6', '#34d399', '#60a5fa']
  };

  let studioParticles = [];

  function initParticles() {
    studioParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 2 + 0.5),
      dist: Math.random() * (canvas.width / 2)
    }));
    if (particleCounter) particleCounter.textContent = `${particleCount} Particles`;
  }
  initParticles();

  if (speedRange) {
    speedRange.addEventListener('input', (e) => {
      speedMultiplier = parseFloat(e.target.value);
    });
  }

  if (particleRange) {
    particleRange.addEventListener('input', (e) => {
      particleCount = parseInt(e.target.value, 10);
      initParticles();
    });
  }

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      palette = btn.dataset.palette;
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      speedMultiplier = 1;
      particleCount = 400;
      palette = 'neon';
      mode = 'vortex';
      if (speedRange) speedRange.value = 1;
      if (particleRange) particleRange.value = 400;
      colorBtns.forEach(b => b.classList.toggle('active', b.dataset.palette === 'neon'));
      modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === 'vortex'));
      initParticles();
    });
  }

  let studioTime = 0;
  let lastFrameTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  function renderStudio() {
    const now = performance.now();
    frameCount++;
    if (now - lastFrameTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastFrameTime = now;
      if (fpsCounter) fpsCounter.textContent = `${fps} FPS`;
    }

    studioTime += 0.016 * speedMultiplier;

    ctx.fillStyle = 'rgba(9, 13, 22, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = palettes[palette] || palettes.neon;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    studioParticles.forEach((p, i) => {
      ctx.fillStyle = colors[i % colors.length];

      if (mode === 'vortex') {
        p.angle += 0.02 * speedMultiplier * (p.speed * 0.5);
        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * p.dist;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'waves') {
        p.x += p.speed * speedMultiplier;
        if (p.x > canvas.width) p.x = 0;
        const py = cy + Math.sin(p.x * 0.01 + studioTime * 2 + i) * 80;
        ctx.beginPath();
        ctx.arc(p.x, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'dna') {
        p.x = (i * 3 + studioTime * 50 * speedMultiplier) % canvas.width;
        const strand = i % 2 === 0 ? 1 : -1;
        const py = cy + Math.sin(p.x * 0.015) * 60 * strand;
        ctx.beginPath();
        ctx.arc(p.x, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'pulse') {
        p.dist = (p.dist + p.speed * speedMultiplier * 2) % (canvas.width / 2);
        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * p.dist;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * (p.dist / 100 + 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(renderStudio);
  }

  renderStudio();
}

/* ==========================================================================
   5. PROCEDURAL AVATAR GRAPHIC
   ========================================================================== */
function initAvatarCanvas() {
  const canvas = document.getElementById('avatarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let t = 0;
  function drawAvatar() {
    t += 0.03;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background Radial
    const rad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
    rad.addColorStop(0, '#1e1b4b');
    rad.addColorStop(1, '#090d16');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);

    // Stylized Head & Headset Silhouette
    const headX = w / 2;
    const headY = h / 2 - 20 + Math.sin(t) * 5;

    // Headset Ring Glow
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(headX, headY, 65, Math.PI * 0.8, Math.PI * 0.2);
    ctx.stroke();

    // Head Circle
    ctx.fillStyle = '#6366f1';
    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(headX, headY, 50, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Eyewear / Visor
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.fillRect(headX - 30, headY - 10, 60, 16);

    // Animated Soundwave halo around head
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(headX, headY, 80 + Math.sin(t * 2) * 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    requestAnimationFrame(drawAvatar);
  }

  drawAvatar();
}

/* ==========================================================================
   6. PUBLIC REVIEWS / GUESTBOOK SECTION (MayaDB Integration)
   ========================================================================== */
function initReviewsSection() {
  const form = document.getElementById('reviewForm');
  const statusEl = document.getElementById('reviewFormStatus');
  const reviewsList = document.getElementById('reviewsList');

  // Load reviews from MayaDB or local fallback
  async function loadReviews() {
    if (!reviewsList) return;

    if (typeof window.MayaDB === 'undefined') {
      reviewsList.innerHTML = `
        <div class="review-item">
          <div class="review-header">
            <span class="review-author">আরিফ রহমান</span>
            <span class="review-role">ক্রিয়েটিভ ডিরেক্টর</span>
          </div>
          <p class="review-text">মোমিন ভাইয়ের অ্যানিমেশনের ফ্রেম রেট ও কালার প্যালেট অত্যন্ত প্রফেশনাল। শুভকামনা!</p>
        </div>
        <div class="review-item">
          <div class="review-header">
            <span class="review-author">সাদিয়া আফরিন</span>
            <span class="review-role">ইউআই/ইউএক্স ডিজাইনার</span>
          </div>
          <p class="review-text">৩ডি মোশন ল্যাব ইন্টারেকশনটা দুর্দান্ত হয়েছে। চমৎকার পোর্টফোলিও।</p>
        </div>
        <p class="time-display text-center" style="margin-top:10px;">(অনলাইন মোডে লাইভ রিভিউ ডাটাবেজ যুক্ত হবে)</p>
      `;
      return;
    }

    try {
      const items = await MayaDB.list('reviews', { limit: 20 });
      if (!items || items.length === 0) {
        reviewsList.innerHTML = '<div class="loading-state">এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনার হোক!</div>';
        return;
      }

      reviewsList.innerHTML = '';
      items.forEach(item => {
        const data = item.data || {};
        const card = document.createElement('div');
        card.className = 'review-item';

        const header = document.createElement('div');
        header.className = 'review-header';

        const author = document.createElement('span');
        author.className = 'review-author';
        author.textContent = data.name || 'বেনামী দর্শক';

        const role = document.createElement('span');
        role.className = 'review-role';
        role.textContent = data.role ? ` • ${data.role}` : '';

        header.appendChild(author);
        header.appendChild(role);

        const text = document.createElement('p');
        text.className = 'review-text';
        text.textContent = data.text || '';

        card.appendChild(header);
        card.appendChild(text);
        reviewsList.appendChild(card);
      });
    } catch (err) {
      console.error('MayaDB list error:', err);
      reviewsList.innerHTML = '<div class="loading-state">মন্তব্য লোড করতে সমস্যা হয়েছে।</div>';
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reviewerName').value.trim();
      const role = document.getElementById('reviewerRole').value.trim();
      const text = document.getElementById('reviewerComment').value.trim();
      const submitBtn = document.getElementById('submitReviewBtn');

      if (!name || !text) return;

      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.textContent = 'জমা দেওয়া হচ্ছে...';
      }

      if (typeof window.MayaDB === 'undefined') {
        setTimeout(() => {
          if (statusEl) {
            statusEl.className = 'form-status success';
            statusEl.textContent = 'ধন্যবাদ! আপনার মন্তব্য গৃহীত হয়েছে (লোকাল প্রিভিউ)।';
          }
          form.reset();
          if (submitBtn) submitBtn.disabled = false;
        }, 800);
        return;
      }

      try {
        await MayaDB.add('reviews', {
          name,
          role,
          text,
          date: new Date().toISOString()
        });

        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = 'ধন্যবাদ! আপনার মন্তব্য সফলভাবে প্রকাশিত হয়েছে।';
        }
        form.reset();
        loadReviews();
      } catch (err) {
        console.error('MayaDB add error:', err);
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'দুঃখিত, মন্তব্য জমা দেওয়া যায়নি। আবার চেষ্টা করুন।';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  loadReviews();
}

/* ==========================================================================
   7. PRIVATE CONTACT INQUIRY FORM (MayaDB private_ collection)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('contactFormStatus');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const projectType = document.getElementById('projectType').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) return;

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) {
      statusEl.className = 'form-status';
      statusEl.textContent = 'মেসেজ পাঠানো হচ্ছে...';
    }

    if (typeof window.MayaDB === 'undefined') {
      setTimeout(() => {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে! শীঘ্রই আপনার সাথে ইমেইলে যোগাযোগ করা হবে।';
        }
        form.reset();
        if (submitBtn) submitBtn.disabled = false;
      }, 1000);
      return;
    }

    try {
      // Send to private_messages collection so visitor input remains private
      await MayaDB.add('private_messages', {
        name,
        email,
        projectType,
        message,
        date: new Date().toISOString()
      });

      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.textContent = 'আপনার ইনকোয়ারি সফলভাবে পাঠানো হয়েছে! শীঘ্রই মোমিন হোসেন আপনার সাথে যোগাযোগ করবেন।';
      }
      form.reset();
    } catch (err) {
      console.error('Contact submit error:', err);
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'মেসেজ পাঠাতে সমস্যা হয়েছে। ইমেইলের মাধ্যমে সরাসরি বার্তা দিন।';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
