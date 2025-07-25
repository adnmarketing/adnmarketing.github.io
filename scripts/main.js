// 1) Registrar plugin de GSAP
gsap.registerPlugin(ScrollTrigger);

// Funciones para bloquear/desbloquear scroll del usuario
let isScrollBlocked = false;

function blockScroll() {
  if (isScrollBlocked) return;
  isScrollBlocked = true;
  
  // Bloquear solo eventos de usuario, no scroll programático
  document.addEventListener('touchmove', preventUserScroll, { passive: false });
  document.addEventListener('wheel', preventUserScroll, { passive: false });
  document.addEventListener('keydown', preventScrollKeys, { passive: false });
}

function unblockScroll() {
  if (!isScrollBlocked) return;
  isScrollBlocked = false;
  
  // Desbloquear eventos de usuario
  document.removeEventListener('touchmove', preventUserScroll);
  document.removeEventListener('wheel', preventUserScroll);
  document.removeEventListener('keydown', preventScrollKeys);
}

function preventUserScroll(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function preventScrollKeys(e) {
  // Prevenir scroll con teclas (flechas, espacio, page up/down, home, end)
  const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

// Desbloquear scroll antes de cerrar la página o navegar
window.addEventListener('beforeunload', () => {
  if (isScrollBlocked) {
    unblockScroll();
  }
});

// Desbloquear scroll si la página pierde el foco
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isScrollBlocked) {
    unblockScroll();
  }
});

// 2) Animaciones de entrada
// Animar cada sección individualmente al hacer scroll

document.querySelectorAll('.animate-fade-down').forEach(el => {
  gsap.from(el, {
    y: -50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: el,
      toggleActions: "play reverse play reverse", // Ahora la animación se revierte al salir del viewport
    }
  });
});

document.querySelectorAll('.animate-fade-up').forEach(el => {
  gsap.from(el, {
    y: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: el,
      toggleActions: "play reverse play reverse", // Ahora la animación se revierte al salir del viewport
    }
  });
});

document.querySelectorAll('.animate-fade-right').forEach(el => {
  gsap.from(el, {
    x: -50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: el,
      toggleActions: "play reverse play reverse", // Ahora la animación se revierte al salir del viewport
    }
  });
});

// 3) Referencias a elementos del DOM
const navToggle    = document.querySelector(".nav-toggle");
const themeToggle  = document.querySelector(".tdnn");
const moonToggle   = document.querySelector(".moon");
const navLogo      = document.querySelector(".nav-logo");
const heroLogo     = document.querySelector(".hero-logo");
const root         = document.documentElement;

// Scroll automático robusto a la sección de historia después de 2 segundos
window.addEventListener('DOMContentLoaded', () => {
  let scrolled = false;
  // Detectar si el usuario ya hizo scroll
  function onUserScroll() {
    scrolled = true;
    window.removeEventListener('scroll', onUserScroll);
  }
  window.addEventListener('scroll', onUserScroll);

  setTimeout(() => {
    if (scrolled) return; // No hacer scroll si el usuario ya interactuó
    let tries = 0;
    function tryScroll() {
      // Buscar por clase o id (ajustado para #History)
      const historiaSection = document.querySelector('.section.historia, #historia, #History');

      if (historiaSection) {
        // Bloquear scroll durante la animación automática
        blockScroll();
        
        // Fallback robusto: usar scrollIntoView primero, luego GSAP si está disponible
        if (window.gsap && window.gsap.to && window.gsap.plugins && window.gsap.plugins.scrollTo) {
          gsap.to(window, {
            duration: 3,
            scrollTo: { y: historiaSection, offsetY: 0 },
            ease: "power2.inOut",
            onComplete: () => {
              // Desbloquear scroll al completar la animación
              unblockScroll();
            }
          });
        } else {
          historiaSection.scrollIntoView({ behavior: 'smooth' });
          // Si no hay GSAP, desbloquear después de un tiempo estimado
          setTimeout(() => {
            unblockScroll();
          }, 1000);
        }
      } else if (tries < 10) {
        tries++;
        setTimeout(tryScroll, 200); // Esperar a que se genere dinámicamente
      }
    }
    tryScroll();
  }, 500);
});

// 4) Detectar y aplicar tema inicial (por hora local, ignorando localStorage)
function getDefaultThemeByHour() {
  const now = new Date();
  const hour = now.getHours();
  // Noche: de 20 (8pm) a 6:59am
  return (hour >= 20 || hour < 7) ? "dark" : "light";
}

const prefersDark  = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultTheme = getDefaultThemeByHour();
const isDark = (defaultTheme === "dark");
root.setAttribute("data-theme", isDark ? "dark" : "light");

// 5) Función para actualizar rutas de los logos según tema
function updateLogos() {
  const dark = root.getAttribute("data-theme") === "dark";
  navLogo.src  = dark
    ? "assets/images/logos/just_logo_white.png"
    : "assets/images/logos/just_logo_black.png";
  heroLogo.src = dark
    ? "assets/images/logos/adn_logo_w.svg"
    : "assets/images/logos/adn_logo_b.svg";
}

// 6) Inicializar logos al cargar la página
themeToggle && setInitialToggleState();
updateLogos();

// 7) Listener para abrir/cerrar menú hamburguesa
navToggle.addEventListener("click", () => {
  document.body.classList.toggle("nav-open");
});

// 8) Listener para alternar tema
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentlyDark = root.getAttribute("data-theme") === "dark";
    const nextTheme     = currentlyDark ? "light" : "dark";
    // Aplicar y almacenar el nuevo tema
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme); // El toggle manual sí guarda preferencia
    // Actualizar logos
    updateLogos();
    // Actualizar toggle visual
    themeToggle.classList.toggle("day", nextTheme === "light");
    moonToggle.classList.toggle("sun", nextTheme === "light");
    document.body.classList.toggle("light", nextTheme === "light");
  });
}
// Sincronizar el estado visual del toggle al cargar
function setInitialToggleState() {
  const isDark = root.getAttribute("data-theme") === "dark";
  themeToggle.classList.toggle("day", !isDark ? true : false);
  moonToggle.classList.toggle("sun", !isDark ? true : false);
  document.body.classList.toggle("light", !isDark ? true : false);
}

// Hacer que el nav-logo lleve al inicio al hacer click y muestre cursor tipo hand
if (navLogo) {
  navLogo.style.cursor = 'pointer';
  navLogo.addEventListener('click', () => {
    // Bloquear scroll durante la animación
    blockScroll();
    
    if (window.gsap && window.gsap.to && window.gsap.plugins && window.gsap.plugins.scrollTo) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: 0, offsetY: 0 },
        ease: "power2.inOut",
        onComplete: () => {
          // Desbloquear scroll al completar la animación
          unblockScroll();
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Desbloquear después de un tiempo estimado
      setTimeout(() => {
        unblockScroll();
      }, 800);
    }
  });
}

// Solución para quitar el estado :focus de los íconos sociales al hacer click
// (Evita que queden "pegados" con el estilo de hover/focus al volver de la red social)
document.querySelectorAll('.social-links a').forEach(link => {
  link.addEventListener('mouseup', e => {
    link.blur();
  });
  link.addEventListener('mouseleave', e => {
    link.blur();
  });
});

// Scroll animado al hacer click en los enlaces del nav

document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').replace('#', '').trim();
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      
      // Bloquear scroll durante la animación
      blockScroll();
      
      if (window.gsap && window.gsap.to && window.gsap.plugins && window.gsap.plugins.scrollTo) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 0 },
          ease: "power2.inOut",
          onComplete: () => {
            // Desbloquear scroll al completar la animación
            unblockScroll();
          }
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
        // Desbloquear después de un tiempo estimado
        setTimeout(() => {
          unblockScroll();
        }, 800);
      }
    }
  });
});

// Footer: año dinámico y selector de idioma
const footerYearRange = document.getElementById('footer-year-range');
if (footerYearRange) {
  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  footerYearRange.textContent = startYear === currentYear ? `${currentYear}` : `${startYear}–${currentYear}`;
}
const langSelect = document.getElementById('footer-lang-select');
if (langSelect) {
  langSelect.addEventListener('change', e => {
    const lang = langSelect.value;
    document.documentElement.lang = lang;
    // Aquí podrías disparar lógica de traducción si la implementas después
  });
}