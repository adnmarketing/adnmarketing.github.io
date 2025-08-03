// Script optimizado para el efecto glitch en la sección de Equipo

// Variables globales para control de performance
let isPageVisible = true;
let isTeamSectionVisible = false;
let isTeamSectionNearby = false; // Nueva variable para detección temprana
let glitchAnimationFrame = null;
let titleGlitchTimeout = null;
let characterGlitchInterval = null;
let imageGlitchTimeout = null;
let isImageGlitchActive = false;
let activeGlitchCards = new Set();
let cardsWithHover = new Set();
let currentGlitchingCard = null;

// Nuevas variables para el sistema anti-lag mejorado
let glitchElementsPreloaded = false;
let intersectionObserver = null;
let teamSectionElement = null;
let glitchSystemInitialized = false;
let titleGlitchLoopActive = false;
let characterGlitchActive = false;

// Sistema de logs detallado para debugging
const TEAM_GLITCH_DEBUG = true;
function debugLog(message, data = null) {
  if (TEAM_GLITCH_DEBUG) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[TEAM-GLITCH ${timestamp}] ${message}`, data || '');
  }
}

// SISTEMA DE INICIALIZACIÓN ROBUSTO - Maneja navegación directa y scroll
function initializeTeamGlitchSystem() {
  debugLog('🚀 Iniciando sistema de glitch para Team...');
  
  if (glitchSystemInitialized) {
    debugLog('⚠️ Sistema ya inicializado, saltando...');
    return;
  }

  const glitchTitle = document.querySelector('.glitch');
  teamSectionElement = document.querySelector('#Team');

  if (!glitchTitle || !teamSectionElement) {
    debugLog('❌ Elementos no encontrados', { 
      glitchTitle: !!glitchTitle, 
      teamSection: !!teamSectionElement 
    });
    return;
  }

  debugLog('✅ Elementos encontrados correctamente');
  glitchSystemInitialized = true;

  // DETECCIÓN DE NAVEGACIÓN DIRECTA (#Team)
  checkDirectNavigation();

  // SISTEMA ANTI-LAG: Preparación temprana e Intersection Observer optimizado
  initializeAntiLagGlitchSystem();

  // Detectar cuando la página no está visible (para pausar animaciones)
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    debugLog(`👁️ Visibilidad de página: ${isPageVisible ? 'VISIBLE' : 'OCULTA'}`);
  });

  // Preparar elementos inmediatamente para evitar lag
  preloadGlitchElements();

  // INICIALIZAR ANIMACIONES DE TÍTULO
  initializeTitleGlitchAnimations(glitchTitle);

  debugLog('🎯 Sistema de glitch completamente inicializado');
}

// DETECCIÓN DE NAVEGACIÓN DIRECTA A #Team - MEJORADO
function checkDirectNavigation() {
  const currentHash = window.location.hash;
  debugLog('🔗 Hash actual detectado:', currentHash);
  
  if (currentHash === '#Team') {
    debugLog('🎯 Navegación directa a #Team detectada');
    // Marcar como visible inmediatamente
    isTeamSectionVisible = true;
    isTeamSectionNearby = true;
    
    // Forzar inicialización después de un pequeño delay
    setTimeout(() => {
      debugLog('⚡ Forzando inicialización por navegación directa');
      forceGlitchActivation();
      
      // NUEVO: También forzar inicio de glitch de imágenes
      setTimeout(() => {
        forceImageGlitchStart();
      }, 1000);
    }, 500);
  }

  // Escuchar cambios de hash para navegación SPA
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash;
    debugLog('🔄 Cambio de hash detectado:', newHash);
    
    if (newHash === '#Team') {
      debugLog('🎯 Navegación a #Team por hash');
      isTeamSectionVisible = true;
      isTeamSectionNearby = true;
      setTimeout(() => {
        forceGlitchActivation();
        
        // NUEVO: También forzar inicio de glitch de imágenes
        setTimeout(() => {
          forceImageGlitchStart();
        }, 800);
      }, 300);
    } else {
      debugLog('👋 Saliendo de sección Team');
      stopAllGlitchAnimations();
    }
  });
}

// NUEVA FUNCIÓN: Forzar inicio del glitch de imágenes
function forceImageGlitchStart() {
  debugLog('🖼️ FORZANDO inicio de glitch de imágenes');
  
  const teamCardsWithMembers = document.querySelectorAll('.team-card[data-member]');
  if (teamCardsWithMembers.length === 0) {
    debugLog('❌ No se encontraron tarjetas con miembros');
    return;
  }
  
  // Reiniciar el sistema de glitch de imágenes
  isImageGlitchActive = false;
  
  // Limpiar cualquier timeout existente
  if (imageGlitchTimeout) {
    clearTimeout(imageGlitchTimeout);
    imageGlitchTimeout = null;
  }
  
  // Iniciar inmediatamente
  setTimeout(() => {
    if (isTeamSectionVisible) {
      debugLog('🚀 Iniciando glitch de imágenes forzado');
      applySequentialImageGlitch();
    }
  }, 500);
}

// FORZAR ACTIVACIÓN DE GLITCH (para navegación directa)
function forceGlitchActivation() {
  debugLog('💥 FORZANDO activación de glitch');
  
  if (!glitchElementsPreloaded) {
    preloadGlitchElements();
  }
  
  // Activar título inmediatamente
  if (!titleGlitchLoopActive) {
    debugLog('🎬 Activando animaciones de título');
    const glitchTitle = document.querySelector('.glitch');
    if (glitchTitle) {
      triggerTitleGlitch();
      startOptimizedGlitchLoop();
    }
  }
  
  // Activar caracteres distorsionados
  if (!characterGlitchActive) {
    debugLog('🔤 Activando glitch de caracteres');
    startCharacterGlitch();
  }
}

// PARAR TODAS LAS ANIMACIONES GLITCH
function stopAllGlitchAnimations() {
  debugLog('🛑 Deteniendo todas las animaciones glitch');
  
  isTeamSectionVisible = false;
  isTeamSectionNearby = false;
  titleGlitchLoopActive = false;
  characterGlitchActive = false;
  
  // Limpiar timeouts
  if (titleGlitchTimeout) {
    clearTimeout(titleGlitchTimeout);
    titleGlitchTimeout = null;
  }
  
  if (characterGlitchInterval) {
    clearInterval(characterGlitchInterval);
    characterGlitchInterval = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  debugLog('📄 DOM cargado, inicializando Team Glitch System...');
  initializeTeamGlitchSystem();
});

// TAMBIÉN INICIALIZAR EN window.onload por si DOM ya estaba listo
window.addEventListener('load', () => {
  debugLog('🌐 Window load event, verificando inicialización...');
  if (!glitchSystemInitialized) {
    debugLog('🔄 Sistema no inicializado, intentando de nuevo...');
    initializeTeamGlitchSystem();
  }
});

  // IMPLEMENTACIÓN DE FUNCIONES ANTI-LAG MEJORADAS
  function initializeAntiLagGlitchSystem() {
    debugLog('🔍 Inicializando Intersection Observer...');
    
    // Observer optimizado con thresholds específicos para detección temprana
    const observerOptions = {
      root: null,
      rootMargin: '150px 0px 150px 0px', // MAYOR margen para detección MÁS temprana (especialmente para scroll desde abajo)
      threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0] // MÁS puntos de detección, especialmente en el rango bajo
    };

    // Crear Intersection Observer específico para Team
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const intersectionRatio = entry.intersectionRatio;
        const boundingRect = entry.boundingClientRect;
        const isEnteringFromBottom = boundingRect.top < window.innerHeight && boundingRect.bottom > 0;
        const isEnteringFromTop = boundingRect.top > 0 && boundingRect.top < window.innerHeight;
        
        debugLog(`👀 Intersection - Ratio: ${intersectionRatio.toFixed(3)}, Top: ${boundingRect.top.toFixed(0)}, Bottom: ${boundingRect.bottom.toFixed(0)}`);
        debugLog(`📍 Dirección - Desde abajo: ${isEnteringFromBottom}, Desde arriba: ${isEnteringFromTop}`);
        
        // Sistema de proximidad por niveles MEJORADO
        if (intersectionRatio > 0) {
          if (!isTeamSectionNearby) {
            isTeamSectionNearby = true;
            debugLog('🎯 Sección Team NEARBY - Precargando elementos...');
            preloadGlitchElements();
          }
          
          // REDUCIR umbral para activación más temprana (especialmente importante para scroll desde abajo)
          if (intersectionRatio > 0.05) { // Reducido de 0.1 a 0.05
            if (!isTeamSectionVisible) {
              isTeamSectionVisible = true;
              debugLog('✨ Sección Team VISIBLE - Activando glitch...', {
                ratio: intersectionRatio,
                fromBottom: isEnteringFromBottom,
                fromTop: isEnteringFromTop
              });
              
              // Activar animaciones con delay MÁS corto para scroll desde abajo
              const activationDelay = isEnteringFromBottom ? 50 : 100; // Más rápido desde abajo
              setTimeout(() => {
                activateGlitchAnimations();
                
                // Forzar inicio de glitch de imágenes también
                setTimeout(() => {
                  if (isTeamSectionVisible) {
                    forceImageGlitchStart();
                  }
                }, 500);
              }, activationDelay);
            }
          }
        } else {
          // Sección ya no está cerca
          if (isTeamSectionNearby || isTeamSectionVisible) {
            debugLog('👋 Sección Team ya no visible - Deteniendo glitch...');
            isTeamSectionNearby = false;
            isTeamSectionVisible = false;
            stopAllGlitchAnimations();
          }
        }
      });
    }, observerOptions);

    // Observar la sección Team
    if (teamSectionElement) {
      intersectionObserver.observe(teamSectionElement);
      debugLog('👁️ Observer configurado para Team section con detección mejorada');
    }
  }

  function preloadGlitchElements() {
    if (glitchElementsPreloaded) {
      debugLog('⚠️ Elementos ya precargados');
      return;
    }
    
    debugLog('⚡ Precargando elementos glitch...');
    
    try {
      // Pre-calcular y almacenar referencias DOM
      const teamCards = document.querySelectorAll('#Team .team-card');
      const glitchElements = document.querySelectorAll('#Team .glitch');
      const teamImages = document.querySelectorAll('#Team .team-card img');
      
      debugLog('🔍 Elementos encontrados:', {
        teamCards: teamCards.length,
        glitchElements: glitchElements.length,
        teamImages: teamImages.length
      });
      
      // Marcar como precargado
      glitchElementsPreloaded = true;
      
      // Pre-aplicar estilos base para evitar reflow
      teamCards.forEach((card, index) => {
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        debugLog(`📦 Card ${index + 1} preparada`);
      });
      
      // Optimizar rendimiento de elementos glitch
      glitchElements.forEach((element, index) => {
        element.style.willChange = 'transform, opacity';
        debugLog(`✨ Glitch element ${index + 1} optimizado`);
      });
      
      // Precargar imágenes si no están cargadas
      teamImages.forEach((img, index) => {
        if (!img.complete) {
          debugLog(`🖼️ Precargando imagen ${index + 1}...`);
          img.loading = 'eager';
        } else {
          debugLog(`✅ Imagen ${index + 1} ya cargada`);
        }
      });
      
      debugLog('✅ Precarga completada exitosamente');
      
    } catch (error) {
      debugLog('❌ Error en preload de elementos glitch:', error);
    }
  }

  // ACTIVAR TODAS LAS ANIMACIONES GLITCH
  function activateGlitchAnimations() {
    debugLog('🎬 Activando todas las animaciones glitch...');
    
    const glitchTitle = document.querySelector('.glitch');
    if (!glitchTitle) {
      debugLog('❌ Título glitch no encontrado');
      return;
    }
    
    // Activar título glitch si no está activo
    if (!titleGlitchLoopActive) {
      debugLog('🎯 Iniciando loop de título glitch');
      triggerTitleGlitch();
      startOptimizedGlitchLoop();
    }
    
    // Activar caracteres distorsionados si no está activo
    if (!characterGlitchActive) {
      debugLog('🔤 Iniciando glitch de caracteres');
      startCharacterGlitch();
    }
  }

  // INICIALIZAR ANIMACIONES DEL TÍTULO
  function initializeTitleGlitchAnimations(glitchTitle) {
    debugLog('🎭 Configurando animaciones del título glitch...');
    
    // Mantener interactividad del clic
    glitchTitle.addEventListener('click', () => {
      debugLog('👆 Click en título detectado');
      triggerTitleGlitch();
    }, { passive: true });
    
    debugLog('✅ Título glitch configurado correctamente');
  }

  // Función optimizada para activar el efecto glitch del título
  function triggerTitleGlitch() {
    if (!isPageVisible || !isTeamSectionVisible) {
      debugLog('⏸️ Glitch de título cancelado - página no visible o sección no activa');
      return;
    }

    debugLog('🎬 Ejecutando glitch de título...');

    const glitchTitle = document.querySelector('.glitch');
    if (!glitchTitle) {
      debugLog('❌ Título glitch no encontrado para trigger');
      return;
    }

    // Definir el texto original constante para el título
    const ORIGINAL_TITLE_TEXT = "Equipo";

    // Guardar el texto actual (por si es diferente)
    const currentText = glitchTitle.textContent;

    // Asegurar que el texto es EQUIPO antes de aplicar el glitch
    if (currentText !== ORIGINAL_TITLE_TEXT) {
      glitchTitle.textContent = ORIGINAL_TITLE_TEXT;
      debugLog('🔄 Texto restaurado a:', ORIGINAL_TITLE_TEXT);
    }

    glitchTitle.classList.add('glitching');
    debugLog('✨ Clase glitching añadida');

    // Usar setTimeout más eficiente
    titleGlitchTimeout = setTimeout(() => {
      glitchTitle.classList.remove('glitching');
      // Asegurar que el texto vuelva a ser EQUIPO después del glitch
      glitchTitle.textContent = ORIGINAL_TITLE_TEXT;
      debugLog('🎭 Glitch de título completado');
    }, 1700);
  }

  // Loop optimizado con control de frecuencia
  function startOptimizedGlitchLoop() {
    if (!isPageVisible || !isTeamSectionVisible) {
      debugLog('⏸️ Loop de glitch cancelado - condiciones no cumplidas');
      return;
    }

    if (titleGlitchLoopActive) {
      debugLog('⚠️ Loop de glitch ya activo');
      return;
    }

    titleGlitchLoopActive = true;
    debugLog('🔄 Iniciando loop optimizado de glitch');

    function scheduleNextGlitch() {
      if (!isPageVisible || !isTeamSectionVisible || !titleGlitchLoopActive) {
        debugLog('🛑 Loop detenido - condiciones no cumplidas');
        titleGlitchLoopActive = false;
        return;
      }

      // Reducir frecuencia: cada 5-8 segundos en lugar de 3-6
      const randomTime = Math.random() * 3000 + 5000; // Entre 5 y 8 segundos
      debugLog(`⏰ Próximo glitch en ${(randomTime/1000).toFixed(1)}s`);

      titleGlitchTimeout = setTimeout(() => {
        triggerTitleGlitch();
        scheduleNextGlitch(); // Programar el siguiente
      }, randomTime);
    }

    // Iniciar el primer glitch inmediatamente
    triggerTitleGlitch();
    
    // Programar el siguiente
    setTimeout(() => {
      scheduleNextGlitch();
    }, 2000);
  }

  // Optimizar efecto de caracteres distorsionados
  function startCharacterGlitch() {
    if (!isPageVisible || !isTeamSectionVisible) {
      debugLog('⏸️ Glitch de caracteres cancelado - condiciones no cumplidas');
      return;
    }

    if (characterGlitchActive) {
      debugLog('⚠️ Glitch de caracteres ya activo');
      return;
    }

    characterGlitchActive = true;
    debugLog('🔤 Iniciando glitch de caracteres');

    const glitchTitle = document.querySelector('.glitch');
    if (!glitchTitle) {
      debugLog('❌ Título no encontrado para glitch de caracteres');
      return;
    }

    // Definir el texto original constante para el título
    const ORIGINAL_TITLE_TEXT = "Equipo";

    characterGlitchInterval = setInterval(() => {
      if (!isPageVisible || !isTeamSectionVisible || !characterGlitchActive) {
        debugLog('🛑 Glitch de caracteres detenido');
        characterGlitchActive = false;
        if (characterGlitchInterval) {
          clearInterval(characterGlitchInterval);
          characterGlitchInterval = null;
        }
        return;
      }

      // Reducir probabilidad del 20% al 8%
      if (Math.random() < 0.08) {
        debugLog('🎲 Ejecutando distorsión de caracteres');
        
        // Optimizar generación de texto glitch
        const glitchChars = '!@#$%^&*()-_=+[]{}|;:,.<>?/';
        const textArray = ORIGINAL_TITLE_TEXT.split('');

        // Cambiar solo 15% de caracteres en lugar de 20%
        for (let i = 0; i < textArray.length; i++) {
          if (Math.random() < 0.15) {
            textArray[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
        }

        glitchTitle.textContent = textArray.join('');

        // Restaurar más rápido
        setTimeout(() => {
          glitchTitle.textContent = ORIGINAL_TITLE_TEXT;
        }, 80);
      }
    }, 6000); // Aumentar intervalo de 4s a 6s
  }

// ===== EFECTOS DE IMAGEN OPTIMIZADOS =====
const teamCardsWithMembers = document.querySelectorAll('.team-card[data-member]');

// FUNCIONES GLOBALES DE GLITCH DE IMÁGENES - Definidas fuera del bloque condicional
// Función optimizada para efecto de glitch - muestra las 3 imágenes en secuencia usando superposición
function applySequentialImageGlitch() {
  if (!isPageVisible || !isTeamSectionVisible || isImageGlitchActive) {
    debugLog('⏸️ Glitch de imagen cancelado', {
      pageVisible: isPageVisible,
      sectionVisible: isTeamSectionVisible,
      glitchActive: isImageGlitchActive
    });
    return;
  }

  debugLog('🖼️ Iniciando glitch secuencial de imagen...');
  isImageGlitchActive = true;

  // Filtrar tarjetas disponibles (no en hover, no animándose actualmente)
  const availableCards = Array.from(teamCardsWithMembers).filter(card =>
    !card.matches(':hover') &&
    !activeGlitchCards.has(card) &&
    !cardsWithHover.has(card)
  );

  debugLog(`🎯 Tarjetas disponibles para glitch: ${availableCards.length}/${teamCardsWithMembers.length}`);

  if (availableCards.length === 0) {
    debugLog('⚠️ No hay tarjetas disponibles, reprogramando...');
    isImageGlitchActive = false;
    scheduleNextImageGlitch();
    return;
  }

  // Seleccionar solo 1 tarjeta aleatoria
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  const selectedCard = availableCards[randomIndex];
  const memberName = selectedCard.getAttribute('data-member');

  debugLog(`✨ Tarjeta seleccionada para glitch: ${memberName}`);

  // Marcar como activa
  activeGlitchCards.add(selectedCard);
  currentGlitchingCard = selectedCard;

  // Verificar que todas las imágenes glitch estén presentes
  const glitchContainer = selectedCard.querySelector('.glitch-container');
  const glitchImages = selectedCard.querySelectorAll('.glitch-image');

  if (!glitchContainer || glitchImages.length !== 3) {
    debugLog('❌ Elementos de glitch faltantes para:', memberName);
    activeGlitchCards.delete(selectedCard);
    currentGlitchingCard = null;
    isImageGlitchActive = false;
    scheduleNextImageGlitch();
    return;
  }

  // Añadir clase para activar el contenedor de glitch
  selectedCard.classList.add('active-glitch-card');
  debugLog(`🎬 Iniciando secuencia de glitch para: ${memberName}`);

  // Función para mostrar las imágenes glitcheadas en secuencia usando requestAnimationFrame
  let currentFrame = 0;
  let lastTime = performance.now();
  const frameDuration = 60; // ms por frame

  function showNextGlitchFrameOptimized(timestamp) {
    const elapsed = timestamp - lastTime;

    if (elapsed < frameDuration) {
      // Si no ha pasado suficiente tiempo, programar el siguiente frame
      requestAnimationFrame(showNextGlitchFrameOptimized);
      return;
    }

    lastTime = timestamp;

    if (currentFrame < 3) {  // 3 imágenes glitch
      // Limpiar frames anteriores
      selectedCard.classList.remove('glitch-frame-1', 'glitch-frame-2', 'glitch-frame-3');

      // Mostrar frame actual
      currentFrame++;
      selectedCard.classList.add(`glitch-frame-${currentFrame}`);
      debugLog(`🎞️ Frame ${currentFrame}/3 para ${memberName}`);

      // Programar el siguiente frame
      requestAnimationFrame(showNextGlitchFrameOptimized);
    } else {
      // Quitar todas las clases de glitch
      selectedCard.classList.remove('active-glitch-card', 'glitch-frame-1', 'glitch-frame-2', 'glitch-frame-3');

      // Limpiar estado
      activeGlitchCards.delete(selectedCard);
      currentGlitchingCard = null;
      isImageGlitchActive = false;

      debugLog(`✅ Glitch completado para: ${memberName}`);

      // Programar el siguiente efecto
      scheduleNextImageGlitch();
    }
  }

  // Iniciar la secuencia con requestAnimationFrame
  requestAnimationFrame(showNextGlitchFrameOptimized);
}

// Programación optimizada con tiempos aleatorios basados en la configuración
function scheduleNextImageGlitch() {
  if (imageGlitchTimeout) {
    clearTimeout(imageGlitchTimeout);
  }

  // Si la página o sección no está visible, no programar nuevos efectos
  if (!isPageVisible || !isTeamSectionVisible) {
    debugLog('⏸️ No programando siguiente glitch - sección no visible');
    return;
  }

  // Verificar si hay tarjetas disponibles (no en hover, no con animación activa)
  const availableCards = Array.from(teamCardsWithMembers).filter(card =>
    !activeGlitchCards.has(card) && !cardsWithHover.has(card)
  );

  // Si no hay tarjetas disponibles, reprogramar con un tiempo más largo
  if (availableCards.length === 0) {
    debugLog('⏳ No hay tarjetas disponibles, reintentando en 2s...');
    imageGlitchTimeout = setTimeout(scheduleNextImageGlitch, 2000); // Mayor tiempo de espera para mejorar rendimiento
    return;
  }

  // Usar tiempos más largos para reducir la carga de CPU
  let minDelay = 2000;  // 2 segundos (reducido para más actividad)
  let maxDelay = 5000;  // 5 segundos (reducido para más actividad)

  // Calcular tiempo aleatorio entre min y max
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;
  debugLog(`⏰ Próximo glitch de imagen en ${(delay/1000).toFixed(1)}s`);

  // Usar requestAnimationFrame para sincronizar con el ciclo de renderizado del navegador
  requestAnimationFrame(() => {
    imageGlitchTimeout = setTimeout(applySequentialImageGlitch, delay);
  });
}

// Preparar los contenedores de glitch para cada tarjeta
teamCardsWithMembers.forEach(card => {
    const member = card.getAttribute('data-member');
    const inner = card.querySelector('.team-card-inner');

    // Crear contenedor para imágenes glitch
    const glitchContainer = document.createElement('div');
    glitchContainer.className = 'glitch-container';
    inner.appendChild(glitchContainer);

    // Crear las 3 imágenes glitch
    for (let i = 1; i <= 3; i++) {
      const glitchImg = document.createElement('img');
      glitchImg.className = `glitch-image glitch-image-${i}`;
      glitchImg.src = `assets/images/team/${member}/adn-${member}-glitch-${i}.webp`;
      glitchImg.alt = `Glitch effect ${i}`;

      // Precargar completamente - no usar lazy loading para imágenes glitch
      glitchImg.loading = 'eager';

      // Aplicar filtro de blanco y negro directamente también
      glitchImg.style.filter = "grayscale(100%) contrast(1.2) brightness(0.85)";
      glitchImg.style.webkitFilter = "grayscale(100%) contrast(1.2) brightness(0.85)";

      glitchContainer.appendChild(glitchImg);
    }
  });

// INICIALIZACIÓN DE EVENTOS Y LÓGICA DE GLITCH DE IMÁGENES
if (teamCardsWithMembers.length > 0) {
  // Optimizar eventos de hover usando un debounce para evitar múltiples llamadas
  let hoverDebounceTimeout;

  teamCardsWithMembers.forEach(card => {
      // Evento al poner el mouse encima
      card.addEventListener('mouseenter', () => {
        // Limpiar timeout anterior si existe
        if (hoverDebounceTimeout) {
          clearTimeout(hoverDebounceTimeout);
        }

        // Usar un pequeño timeout para evitar múltiples activaciones rápidas
        hoverDebounceTimeout = setTimeout(() => {
          // Agregar esta tarjeta al conjunto de tarjetas con hover
          cardsWithHover.add(card);

          // Si esta tarjeta está en glitch, cancelar el efecto
          if (activeGlitchCards.has(card)) {
            card.classList.remove('active-glitch-card', 'glitch-frame-1', 'glitch-frame-2', 'glitch-frame-3');
            activeGlitchCards.delete(card);

            // Si es la tarjeta actual con glitch, resetear el estado
            if (currentGlitchingCard === card) {
              currentGlitchingCard = null;
            }
          }
        }, 10); // Un delay muy pequeño para mejorar rendimiento
      }, { passive: true });

      // Evento al quitar el mouse de encima
      card.addEventListener('mouseleave', () => {
        // Limpiar timeout anterior si existe
        if (hoverDebounceTimeout) {
          clearTimeout(hoverDebounceTimeout);
        }

        // Usar un pequeño timeout para evitar parpadeos
        hoverDebounceTimeout = setTimeout(() => {
          // Eliminar esta tarjeta del conjunto de tarjetas con hover
          cardsWithHover.delete(card);
        }, 10); // Un delay muy pequeño para mejorar rendimiento
      }, { passive: true });
    });

  // INICIALIZACIÓN DE GLITCH DE IMÁGENES
  debugLog('🖼️ Configurando sistema de glitch de imágenes...');
  
  // Iniciar con delay corto (solo si la sección es visible)
  setTimeout(() => {
    if (isPageVisible && isTeamSectionVisible) {
      debugLog('🚀 Iniciando programación de glitch de imágenes');
      scheduleNextImageGlitch();
    } else {
      debugLog('⏸️ Sección no visible, esperando activación...');
    }
  }, 1500); // Delay inicial reducido para mayor actividad
}

  // ===== ANIMACIONES DE CARGA OPTIMIZADAS - TEMPORALMENTE DESACTIVADAS =====
  // COMENTARIO TEMPORAL: Desactivando animaciones de entrada GSAP para probar rendimiento
  /*
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach((card, index) => {
    // Usar requestAnimationFrame para animaciones suaves
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50 + (index * 100)); // Reducir delay aleatorio
    });

    // Optimizar carga de imágenes
    const img = card.querySelector('img');
    if (img) {
      img.addEventListener('load', () => {
        requestAnimationFrame(() => {
          img.classList.add('loaded');
        });
      }, { once: true, passive: true });
    }
  });
  */
  
  // VERSIÓN SIMPLIFICADA SIN ANIMACIONES - para probar rendimiento
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach((card, index) => {
    // Mostrar directamente sin animaciones
    card.style.opacity = '1';
    card.style.transform = 'none';
    
    // Solo mantener el event listener de carga de imágenes
    const img = card.querySelector('img');
    if (img) {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      }, { once: true, passive: true });
    }
  });

// ===== CARGA OPTIMIZADA DE DATOS DEL EQUIPO =====
async function loadOptimizedTeamData() {
  try {
    const response = await fetch('data/team.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const teamData = await response.json();

    // Cache de elementos DOM
    const teamCards = document.querySelectorAll('.team-card');
    const overlay = document.querySelector('.team-member-overlay');
    const nameRoleSpan = overlay?.querySelector('.team-member-name-role');

    if (!overlay || !nameRoleSpan) return;

    // Variables de control optimizadas
    let overlayGlitchTimeout = null;
    let overlayGlitchLoopId = null; // Para el loop continuo de glitch
    let isOverlayActive = false;
    let isMobile = window.innerWidth < 993;

    // Lógica optimizada para detectar resize
    window.addEventListener('resize', () => {
      isMobile = window.innerWidth < 993;

      // Actualizar posición si está activo, pero solo una vez por evento resize
      if (isOverlayActive && !isMobile) {
        updateOverlayPosition();

        // Ajustar tamaño del texto de acuerdo al ancho de pantalla
        if (nameRoleSpan) {
          // Las clases CSS se encargarán del tamaño base
          // Esto es solo para ajustes finos adicionales

          // Asegurar que el texto no se desborde si es muy largo
          const text = nameRoleSpan.textContent || '';
          if (text.length > 30 && window.innerWidth < 1200) {
            nameRoleSpan.style.fontSize = '1.3rem';
          } else if (text.length > 25 && window.innerWidth < 1400) {
            nameRoleSpan.style.fontSize = '1.5rem';
          } else {
            // Eliminar estilos inline para usar los valores CSS
            nameRoleSpan.style.fontSize = '';
          }
        }
      }
    }, { passive: true });

    // Optimizar el posicionamiento del overlay - VERSIÓN RESPONSIVE
    function updateOverlayPosition() {
      if (!overlay || window.innerWidth <= 992) return; // No posicionar en mobile

      // Verificar si estamos en mobile
      const isMobile = window.innerWidth <= 992;
      if (isMobile) {
        isOverlayActive = false;
        return;
      }

      // Posición fija en la esquina inferior derecha
      const teamSection = document.querySelector('#Team');
      if (!teamSection) return;

      // Eliminar cualquier estilo inline que pueda interferir
      overlay.removeAttribute('style');

      // Aplicar solo las propiedades necesarias - posición fija para evitar recálculos excesivos
      overlay.style.opacity = '1';
      overlay.style.bottom = '1.5rem'; // Menor distancia desde abajo para posicionarlo más abajo
      overlay.style.right = '3rem'; // Mantener la distancia desde la derecha

      // Ajustar tamaño del texto si es necesario
      if (nameRoleSpan) {
        const text = nameRoleSpan.textContent || '';
        // Ajuste más preciso según longitud del texto y tamaño de ventana
        if (text.length > 30 && window.innerWidth < 1200) {
          nameRoleSpan.style.fontSize = '1.3rem';
        } else if (text.length > 25 && window.innerWidth < 1400) {
          nameRoleSpan.style.fontSize = '1.5rem';
        } else {
          // Usar tamaño basado en las media queries
          nameRoleSpan.style.fontSize = '';
        }
      }
    }

    // Gestionar eventos de hover/touch por delegación
    const teamGallery = document.querySelector('.team-gallery');

    if (teamGallery) {
      // Usar delegación de eventos para mejorar el rendimiento
      teamGallery.addEventListener('mouseover', function (e) {
        // No mostrar overlay en mobile
        if (window.innerWidth <= 992) return;

        const card = e.target.closest('.team-card');
        if (!card) return;

        const member = card.getAttribute('data-member');
        if (!member) return;

        // Obtener datos del miembro directamente del objeto teamData
        const memberData = teamData[member];
        if (!memberData) {
          console.warn(`No se encontraron datos para el miembro: ${member}`);
          return;
        }

        // Mostrar overlay usando el formato correcto del JSON
        const fullText = `${memberData.FullName} - ${memberData.Role}`;
        nameRoleSpan.textContent = fullText;
        nameRoleSpan.setAttribute('data-text', fullText); // Importante para el efecto glitch

        // Eliminar estilos inline que puedan interferir
        overlay.removeAttribute('style');
        nameRoleSpan.removeAttribute('style');

        // Aplicar clases para mostrar el overlay
        overlay.classList.add('visible');
        overlay.classList.add('show');
        nameRoleSpan.classList.add('glitch-text');
        isOverlayActive = true;

        // Actualizar posición del overlay una sola vez sin observer
        updateOverlayPosition();

        // Aplicar el efecto glitch al texto inicialmente
        if (!nameRoleSpan.classList.contains('glitching')) {
          nameRoleSpan.classList.add('glitching');
        }

        // Iniciar el loop de efectos glitch continuos
        startOverlayGlitchLoop();
      }, { passive: true }); // Mejorar performance con passive

      teamGallery.addEventListener('mouseout', function (e) {
        // No hacer nada en mobile
        if (window.innerWidth <= 992) return;

        const card = e.target.closest('.team-card');
        if (!card) return;

        // Verificar que realmente estamos saliendo de la tarjeta y no entrando a un elemento hijo
        const relatedTarget = e.relatedTarget;
        if (relatedTarget && card.contains(relatedTarget)) {
          return; // Aún estamos dentro de la tarjeta
        }

        // Eliminar clases de visibilidad
        overlay.classList.remove('visible');
        overlay.classList.remove('show');
        nameRoleSpan.classList.remove('glitching');

        // Actualizar estado
        isOverlayActive = false;

        // Detener todos los timers y loops de efectos glitch
        if (overlayGlitchTimeout) {
          clearTimeout(overlayGlitchTimeout);
          overlayGlitchTimeout = null;
        }

        if (overlayGlitchLoopId) {
          clearInterval(overlayGlitchLoopId);
          overlayGlitchLoopId = null;
        }
      }, { passive: true }); // Mejorar performance con passive
    }

    // Función para repetir el efecto glitch del overlay periódicamente
    function startOverlayGlitchLoop() {
      if (!isOverlayActive || !nameRoleSpan || window.innerWidth <= 992) return;

      // Limpiar cualquier timeout anterior para evitar múltiples loops
      if (overlayGlitchTimeout) {
        clearTimeout(overlayGlitchTimeout);
      }

      // Limpiar el loop continuo si existe
      if (overlayGlitchLoopId) {
        clearInterval(overlayGlitchLoopId);
        overlayGlitchLoopId = null;
      }

      // Aplicar efecto glitch inicial inmediatamente
      if (!nameRoleSpan.classList.contains('glitching')) {
        nameRoleSpan.classList.add('glitching');
      }

      // Generar tiempos aleatorios para un efecto más natural e impredecible
      const minDelay = 1500; // Mínimo 1 segundo
      const maxDelay = 4000; // Máximo 3 segundos

      // Función anidada para ejecutar un ciclo de glitch con intervalos variables
      function executeGlitchCycle() {
        // Solo continuar si el overlay sigue activo
        if (!isOverlayActive) {
          if (overlayGlitchLoopId) {
            clearTimeout(overlayGlitchLoopId);
            overlayGlitchLoopId = null;
          }
          return;
        }

        // Reiniciar el efecto glitch quitando la clase
        nameRoleSpan.classList.remove('glitching');

        // Pequeño delay antes de volver a aplicar el efecto para que se note
        overlayGlitchTimeout = setTimeout(() => {
          // Solo aplicar si el overlay sigue activo
          if (isOverlayActive) {
            nameRoleSpan.classList.add('glitching');

            // Calcular un nuevo tiempo aleatorio para el próximo ciclo
            const nextCycleDelay = Math.random() * (maxDelay - minDelay) + minDelay;

            // Programar el próximo ciclo con un tiempo aleatorio
            overlayGlitchLoopId = setTimeout(executeGlitchCycle, nextCycleDelay);
          }
        }, 50);
      }

      // Iniciar el primer ciclo
      executeGlitchCycle();
    }

    // Iniciar el loop de glitch del overlay si la sección es visible
    setTimeout(() => {
      if (isPageVisible && isTeamSectionVisible) {
        startOverlayGlitchLoop();
      }
    }, 2000);
  } catch (error) {
    console.error('Error al cargar datos del equipo:', error);
  }
}

// Si el documento ya está listo, cargar datos
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  loadOptimizedTeamData();
} else {
  document.addEventListener('DOMContentLoaded', loadOptimizedTeamData);
}

// Verificar estado del overlay para debugging y añadir botón de prueba
document.addEventListener('DOMContentLoaded', function () {
  console.log('Verificando overlay...');
  setTimeout(() => {
    const overlay = document.querySelector('.team-member-overlay');
    const nameRoleSpan = overlay?.querySelector('.team-member-name-role');

    if (overlay && nameRoleSpan) {
      console.log('Overlay encontrado:', {
        overlay: overlay,
        nameRoleSpan: nameRoleSpan,
        isVisible: window.getComputedStyle(overlay).opacity !== '0',
        styles: {
          position: window.getComputedStyle(overlay).position,
          zIndex: window.getComputedStyle(overlay).zIndex,
          opacity: window.getComputedStyle(overlay).opacity,
          display: window.getComputedStyle(overlay).display,
          width: overlay.offsetWidth,
          height: overlay.offsetHeight
        }
      });

      // Configurar botón de prueba
      const testBtn = document.getElementById('test-overlay-btn');
      if (testBtn) {
        testBtn.addEventListener('click', function () {
          // No mostrar en mobile
          if (window.innerWidth <= 992) {
            alert('El overlay está desactivado en dispositivos móviles');
            return;
          }

          console.log('📢 BOTÓN DE PRUEBA: Activando overlay manualmente...');

          // Limpiar estilos inline existentes
          overlay.removeAttribute('style');
          nameRoleSpan.removeAttribute('style');

          // Posicionar el overlay más abajo de las tarjetas
          overlay.style.bottom = '1.5rem';
          overlay.style.right = '3rem';

          // Mostrar texto de prueba
          nameRoleSpan.textContent = 'PRUEBA DE OVERLAY';
          nameRoleSpan.setAttribute('data-text', 'PRUEBA DE OVERLAY');

          // Aplicar clases para mostrar el overlay
          overlay.classList.add('visible');
          overlay.classList.add('show');
          nameRoleSpan.classList.add('glitch-text');
          nameRoleSpan.classList.add('glitching');
          isOverlayActive = true;

          // Actualizar posición
          updateOverlayPosition();

          // Iniciar el loop de efectos glitch
          startOverlayGlitchLoop();

          console.log('Overlay activado manualmente con glitch continuo', { overlay, nameRoleSpan });

          // Ocultar después de 5 segundos
          setTimeout(() => {
            overlay.classList.remove('visible');
            overlay.classList.remove('show');
            nameRoleSpan.classList.remove('glitching');
            isOverlayActive = false;

            // Detener todos los timers y loops
            if (overlayGlitchTimeout) {
              clearTimeout(overlayGlitchTimeout);
              overlayGlitchTimeout = null;
            }

            if (overlayGlitchLoopId) {
              clearInterval(overlayGlitchLoopId);
              overlayGlitchLoopId = null;
            }
          }, 5000);
        });

        console.log('Botón de prueba configurado correctamente');
      }
    } else {
      console.error('Overlay no encontrado o incompleto:', { overlay, nameRoleSpan });
    }
  }, 1000);
});

// Exponer funciones de testing para depuración
window.teamGlitchDebug = {
  toggleTeamSectionVisibility: function (isVisible) {
    isTeamSectionVisible = isVisible;
    console.log(`Visibilidad de sección Team: ${isVisible ? 'Visible' : 'No visible'}`);
  },
  isTeamSectionVisible,
  isImageGlitchActive,
  cardsWithHover,
  getHoveredCards: function () {
    return Array.from(cardsWithHover).map(card => card.getAttribute('data-member'));
  },
  scheduleNextImageGlitch: function () {
    if (typeof scheduleNextImageGlitch === 'function') {
      scheduleNextImageGlitch();
    }
  },
  getAvailableCards: function () {
    const availableCards = Array.from(document.querySelectorAll('.team-card[data-member]'))
      .filter(card => !activeGlitchCards.has(card) && !cardsWithHover.has(card));
    return availableCards.map(card => card.getAttribute('data-member'));
  }
};

// Función para probar manualmente el efecto glitch en cualquier miembro
window.testGlitch = function (memberName) {
  const card = document.querySelector(`[data-member="${memberName}"]`);
  if (!card) {
    console.error(`Miembro no encontrado: ${memberName}`);
    return;
  }

  // Verificar si la tarjeta tiene el mouse encima (hover)
  if (cardsWithHover.has(card)) {
    console.warn(`No se puede aplicar glitch a ${memberName} porque tiene el mouse encima.`);
    return;
  }

  console.log(`Aplicando efecto glitch a ${memberName}...`);

  // Verificar que las imágenes de glitch estén cargadas
  const glitchContainer = card.querySelector('.glitch-container');
  if (!glitchContainer) {
    console.error(`Contenedor de glitch no encontrado para ${memberName}`);
    return;
  }

  // Precargar imágenes para evitar flashes o retrasos
  const glitchImages = card.querySelectorAll('.glitch-image');
  if (glitchImages.length !== 3) {
    console.error(`No se encontraron las 3 imágenes glitch para ${memberName}`);
    return;
  }

  // Añadir clase visual para el efecto
  card.classList.add('active-glitch-card');

  // Función optimizada para mostrar las imágenes glitcheadas en secuencia usando requestAnimationFrame
  let currentFrame = 0;
  let lastTime = performance.now();
  const frameDuration = 60; // ms por frame

  function showNextTestFrame(timestamp) {
    const elapsed = timestamp - lastTime;

    if (elapsed < frameDuration) {
      // Si no ha pasado suficiente tiempo, programar el siguiente frame
      requestAnimationFrame(showNextTestFrame);
      return;
    }

    lastTime = timestamp;

    if (currentFrame < 3) { // 3 imágenes glitch
      // Limpiar frames anteriores
      card.classList.remove('glitch-frame-1', 'glitch-frame-2', 'glitch-frame-3');

      // Mostrar frame actual
      currentFrame++;
      card.classList.add(`glitch-frame-${currentFrame}`);

      // Programar el siguiente frame
      requestAnimationFrame(showNextTestFrame);
    } else {
      // Quitar clases de glitch
      card.classList.remove('active-glitch-card', 'glitch-frame-1', 'glitch-frame-2', 'glitch-frame-3');

      console.log(`Efecto glitch completado para ${memberName}`);
    }
  }

  // Iniciar la secuencia con requestAnimationFrame
  requestAnimationFrame(showNextTestFrame);
};

// Función para probar el efecto glitch en todos los miembros secuencialmente
window.testAllGlitch = function (delay = 2000) {
  const cards = document.querySelectorAll('.team-card[data-member]');

  console.log(`Probando efecto glitch en ${cards.length} miembros...`);

  // Filtrar tarjetas que no tienen el mouse encima
  const availableCards = Array.from(cards).filter(card => !cardsWithHover.has(card));

  console.log(`${availableCards.length} miembros disponibles para glitch (excluyendo tarjetas con hover)...`);

  availableCards.forEach((card, index) => {
    const memberName = card.getAttribute('data-member');

    setTimeout(() => {
      console.log(`Aplicando efecto glitch a ${memberName}...`);
      window.testGlitch(memberName);
    }, index * delay);
  });
};

// NUEVO: Función para preparar animaciones del Team sin ejecutarlas (para preload)
window.prepareTeamAnimations = function () {
  console.log('🎭 Preparando animaciones de Team para preload...');
  
  const glitchTitle = document.querySelector('.glitch');
  const teamCards = document.querySelectorAll('.team-card[data-member]');
  
  if (!glitchTitle) {
    console.warn('⚠️ Título glitch no encontrado para preparación');
    return;
  }

  // Preparar elementos CSS y clases para evitar reflow posterior
  if (glitchTitle && !glitchTitle.hasAttribute('data-preloaded')) {
    // Forzar cálculo inicial de estilos
    window.getComputedStyle(glitchTitle).getPropertyValue('transform');
    glitchTitle.setAttribute('data-preloaded', 'true');
  }

  // Preparar imágenes de team cards
  teamCards.forEach(card => {
    const img = card.querySelector('img');
    if (img && !img.hasAttribute('data-preloaded')) {
      // Forzar cálculo de estilos de imagen
      window.getComputedStyle(img).getPropertyValue('transform');
      img.setAttribute('data-preloaded', 'true');
    }
  });

  // Pre-calcular variables de configuración
  if (window.ViewportOptimizationConfig && window.ViewportOptimizationConfig.sections.Team) {
    const config = window.ViewportOptimizationConfig.sections.Team;
    
    // Pre-calcular intervalos para evitar cálculos pesados durante la animación
    const preCalcTitleInterval = Math.random() * (config.titleGlitchInterval.max - config.titleGlitchInterval.min) + config.titleGlitchInterval.min;
    const preCalcImageInterval = Math.random() * (config.imageGlitchInterval.max - config.imageGlitchInterval.min) + config.imageGlitchInterval.min;
    
    // Almacenar en variables globales para uso posterior
    window._preCalcTitleInterval = preCalcTitleInterval;
    window._preCalcImageInterval = preCalcImageInterval;
  }

  console.log('✅ Animaciones de Team preparadas para ejecución fluida');
};
