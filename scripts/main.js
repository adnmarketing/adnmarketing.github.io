// 1) Registrar plugin de GSAP
gsap.registerPlugin(ScrollTrigger);

// NUEVO: Sistema de preload ultra-temprano para eliminar lag completamente
(function initEarlyPreload() {
  // Ejecutar tan pronto como el DOM básico esté disponible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeEarlyPreload);
  } else {
    executeEarlyPreload();
  }

  function executeEarlyPreload() {
    console.log('🚀 Iniciando preload ultra-temprano...');
    
    // Preload inmediato de imágenes críticas usando JavaScript
    const criticalImages = [
      'assets/images/team/rubi/adn-rubi.avif',
      'assets/images/team/jack/adn-jack.avif', 
      'assets/images/team/gabo/adn-gabo.avif',
      'assets/images/services/content_visual.webp',
      'assets/images/services/social_media_management.webp'
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Preparar elementos DOM para animaciones fluidas
    setTimeout(() => {
      const teamSection = document.querySelector('#Team');
      const servicesSection = document.querySelector('#Services');
      
      if (teamSection) {
        // Forzar cálculo de estilos para evitar reflow posterior
        teamSection.style.transform = 'translateZ(0)'; // Activar aceleración por hardware
      }
      
      if (servicesSection) {
        servicesSection.style.transform = 'translateZ(0)';
      }
    }, 100);
  }
})();

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
  // Portfolio section should only reverse when exiting upward
  const isPortfolio = el.id === 'Portfolio';
  
  gsap.from(el, {
    y: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: el,
      toggleActions: isPortfolio ? "play none play reverse" : "play reverse play reverse", // Portfolio keeps animation when scrolling down
    }
  });
});

document.querySelectorAll('.animate-fade-right').forEach(el => {
  // Services and Contactus sections should only reverse when exiting upward
  const isServicesOrContact = el.id === 'Services' || el.id === 'Contactus';
  
  gsap.from(el, {
    x: -50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: el,
      toggleActions: isServicesOrContact ? "play none play reverse" : "play reverse play reverse", // Services and Contact keep animation when scrolling down
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
  // NUEVO: Sistema de preload inteligente para eliminar lag
  setTimeout(() => {
    if (window.viewportManager) {
      console.log('🚀 Iniciando preload inteligente...');
      
      // Preload de la sección Team (la más pesada) después de 1 segundo
      setTimeout(() => {
        window.viewportManager.preloadSection('Team');
      }, 1000);
      
      // Preload de Services después de 2 segundos  
      setTimeout(() => {
        window.viewportManager.preloadSection('Services');
      }, 2000);
      
      // Preload de Portfolio después de 3 segundos
      setTimeout(() => {
        window.viewportManager.preloadSection('Portfolio');
      }, 3000);
    }
  }, 500);

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

// 4) El tema ya fue aplicado en el <head>, solo necesitamos sincronizar el estado
// No necesitamos volver a detectar el tema porque ya se hizo antes de cargar CSS
function getDefaultThemeByHour() {
  const now = new Date();
  const hour = now.getHours();
  // Noche: de 20 (8pm) a 6:59am
  return (hour >= 20 || hour < 7) ? "dark" : "light";
}

// El tema ya está aplicado desde el HTML, solo verificamos cuál es
const currentTheme = root.getAttribute("data-theme") || getDefaultThemeByHour();
// Asegurar que el tema esté aplicado (por si acaso)
if (!root.getAttribute("data-theme")) {
  root.setAttribute("data-theme", currentTheme);
}

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
    
    // Aplicar el nuevo tema
    root.setAttribute("data-theme", nextTheme);
    
    // IMPORTANTE: Guardar la preferencia manual del usuario
    // Esto tendrá prioridad sobre la detección automática por hora
    localStorage.setItem("theme", nextTheme);
    
    // Actualizar logos
    updateLogos();
    
    // Actualizar toggle visual con transición suave
    themeToggle.classList.toggle("day", nextTheme === "light");
    moonToggle.classList.toggle("sun", nextTheme === "light");
    document.body.classList.toggle("light", nextTheme === "light");
    
    // Actualizar clases de compatibilidad
    document.documentElement.classList.toggle('theme-light', nextTheme === "light");
    document.documentElement.classList.toggle('theme-dark', nextTheme === "dark");
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

// Funcionalidad para ocultar/mostrar navegación al hacer scroll
(function() {
  const mainNav = document.querySelector('.main-nav');
  if (!mainNav) return;

  let lastScrollY = window.scrollY;
  let isScrollingDown = false;
  let scrollTimeout;
  
  // Umbral mínimo de scroll para activar el efecto (evita parpadeos en scrolls pequeños)
  const scrollThreshold = 10;
  
  // Altura mínima desde la parte superior para empezar a ocultar la nav
  const minScrollDistance = 100;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY);
    
    // Solo actuar si el scroll supera el umbral mínimo y estamos lejos del top
    if (scrollDifference < scrollThreshold || currentScrollY < minScrollDistance) {
      return;
    }

    // Detectar dirección del scroll
    if (currentScrollY > lastScrollY && !isScrollingDown) {
      // Scrolling hacia abajo - ocultar nav
      isScrollingDown = true;
      mainNav.classList.remove('nav-visible');
      mainNav.classList.add('nav-hidden');
    } else if (currentScrollY < lastScrollY && isScrollingDown) {
      // Scrolling hacia arriba - mostrar nav
      isScrollingDown = false;
      mainNav.classList.remove('nav-hidden');
      mainNav.classList.add('nav-visible');
    }

    lastScrollY = currentScrollY;
  }

  // Usar requestAnimationFrame para optimizar el rendimiento
  function optimizedScrollHandler() {
    if (scrollTimeout) return;
    
    scrollTimeout = requestAnimationFrame(() => {
      handleScroll();
      scrollTimeout = null;
    });
  }

  // Añadir el listener de scroll
  window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

  // Asegurar que la nav esté visible al cargar la página
  mainNav.classList.add('nav-visible');
  
  // También mostrar la nav si el usuario llega al top de la página
  window.addEventListener('scroll', () => {
    if (window.scrollY <= minScrollDistance) {
      mainNav.classList.remove('nav-hidden');
      mainNav.classList.add('nav-visible');
      isScrollingDown = false;
      lastScrollY = window.scrollY;
    }
  }, { passive: true });
})();

// Opcional: Limpiar preferencia manual después de 24 horas para volver al sistema automático
// (Comentado por defecto - descomenta si quieres esta funcionalidad)

(function() {
  const themeTimestamp = localStorage.getItem("theme-timestamp");
  const currentTime = Date.now();
  const eightHoursInMs = 8 * 60 * 60 * 1000; // 8 horas

  // Si han pasado más de 8 horas desde la última preferencia manual, limpiar
  if (themeTimestamp && (currentTime - parseInt(themeTimestamp)) > eightHoursInMs) {
    localStorage.removeItem("theme");
    localStorage.removeItem("theme-timestamp");
  }
  
  // Al hacer toggle manual, guardar timestamp
  const originalToggle = themeToggle?.addEventListener;
  if (originalToggle) {
    // Interceptar el click del toggle para añadir timestamp
    themeToggle.addEventListener("click", () => {
      localStorage.setItem("theme-timestamp", Date.now().toString());
    });
  }
})();