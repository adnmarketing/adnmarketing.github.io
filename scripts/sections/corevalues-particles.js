// Partículas animadas para el fondo de la sección de valores
(function () {
  const canvas = document.getElementById('corevalues-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  let particles = [];
  const PARTICLE_COUNT = 32;
  const PARTICLE_SIZE = 20;
  const SPEED = 0.3;
  let mouse = { x: null, y: null };

  function resize() {
    const section = canvas.closest('.corevalues-section');
    width = section.offsetWidth;
    height = section.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function randomColor() {
    const isDark = document.body.classList.contains('dark') || document.body.getAttribute('data-theme') === 'dark';
    return isDark ? 'rgba(120,180,255,0.18)' : 'rgba(0,120,212,0.13)';
  }

  let dnaImg = new window.Image();
  dnaImg.src = 'assets/symbols/dna-symbol.svg';
  let dnaLoaded = false;
  dnaImg.onload = () => { dnaLoaded = true; };

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        size: PARTICLE_SIZE + Math.random() * 60,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.01
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (!dnaLoaded) {
      requestAnimationFrame(draw);
      return;
    }
    for (const p of particles) {
      // Interacción con mouse
      let dx = p.x - mouse.x;
      let dy = p.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let repel = 0;
      if (mouse.x !== null && dist < 90) {
        repel = (90 - dist) * 0.12;
        p.x += dx / dist * repel;
        p.y += dy / dist * repel;
      }
      // Movimiento natural
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      // Rebote en bordes
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      // Dibuja símbolo ADN
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = 0.18;
      ctx.drawImage(dnaImg, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }
  function onMouseLeave() {
    mouse.x = null;
    mouse.y = null;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);

  // Redibuja colores si cambia el tema
  const observer = new MutationObserver(() => {
    for (const p of particles) p.baseColor = randomColor();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });

  // Inicializa
  setTimeout(() => {
    resize();
    createParticles();
    draw();
  }, 200);
})();
