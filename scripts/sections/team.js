// Script optimizado para el efecto glitch en la sección de Equipo

// Variables globales para control de performance
let isPageVisible = true;
let isTeamSectionVisible = false; // Nueva variable para viewport
let glitchAnimationFrame = null;
let titleGlitchTimeout = null;
let characterGlitchInterval = null;
let imageGlitchTimeout = null; // Definida globalmente para resolver el error de scope
let isImageGlitchActive = false; // Definida globalmente para resolver el error de scope
let activeGlitchCards = new Set(); // Mantener registro de tarjetas con animación activa
let cardsWithHover = new Set(); // Mantener registro de tarjetas con hover (mouse encima)
let currentGlitchingCard = null; // Nueva variable para rastrear la tarjeta actualmente con glitch

document.addEventListener('DOMContentLoaded', () => {
  const glitchTitle = document.querySelector('.glitch');
  const teamSection = document.querySelector('#Team');

  if (!glitchTitle || !teamSection) return;

  // Configurar observación de viewport para la sección Team
  const handleTeamVisibility = (isVisible, visibilityRatio, element, isPageHidden = false) => {
    isTeamSectionVisible = isVisible && !isPageHidden;

    if (!isTeamSectionVisible) {
      // Pausar todas las animaciones cuando la sección no es visible
      if (titleGlitchTimeout) clearTimeout(titleGlitchTimeout);
      if (characterGlitchInterval) clearInterval(characterGlitchInterval);
      if (glitchAnimationFrame) cancelAnimationFrame(glitchAnimationFrame);
      if (imageGlitchTimeout) clearTimeout(imageGlitchTimeout);
    } else {
      // Reanudar animaciones cuando la sección es visible
      setTimeout(() => {
        if (isTeamSectionVisible) {
          startOptimizedGlitchLoop();
          startCharacterGlitch();
          scheduleNextImageGlitch();
        }
      }, 500); // Pequeño delay para suavizar la transición
    }
  };

  // Registrar la sección para observación de viewport
  if (window.viewportManager) {
    window.viewportManager.observeSection(teamSection, 'Team', [handleTeamVisibility]);
  } else {
    // Fallback si ViewportManager no está disponible
    console.warn('ViewportManager no disponible, usando detección básica');
    isTeamSectionVisible = true;
  }

  // Detectar cuando la página no está visible (para pausar animaciones)
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    // La lógica de pausa/reanudación ahora se maneja en handleTeamVisibility
  });

  // Función optimizada para activar el efecto glitch del título
  function triggerTitleGlitch() {
    if (!isPageVisible || !isTeamSectionVisible) return;

    // Definir el texto original constante para el título
    const ORIGINAL_TITLE_TEXT = "Equipo";

    // Guardar el texto actual (por si es diferente)
    const currentText = glitchTitle.textContent;

    // Asegurar que el texto es EQUIPO antes de aplicar el glitch
    if (currentText !== ORIGINAL_TITLE_TEXT) {
      glitchTitle.textContent = ORIGINAL_TITLE_TEXT;
    }

    glitchTitle.classList.add('glitching');

    // Usar setTimeout más eficiente
    titleGlitchTimeout = setTimeout(() => {
      glitchTitle.classList.remove('glitching');
      // Asegurar que el texto vuelva a ser EQUIPO después del glitch
      glitchTitle.textContent = ORIGINAL_TITLE_TEXT;
    }, 1700);
  }

  // Loop optimizado con control de frecuencia
  function startOptimizedGlitchLoop() {
    if (!isPageVisible || !isTeamSectionVisible) return;

    // Reducir frecuencia: cada 5-8 segundos en lugar de 3-6
    const randomTime = Math.random() * 3000 + 5000; // Entre 5 y 8 segundos

    titleGlitchTimeout = setTimeout(() => {
      triggerTitleGlitch();
      startOptimizedGlitchLoop();
    }, randomTime);
  }

  // Inicializar con delay optimizado (solo si la sección es visible)
  setTimeout(() => {
    if (isTeamSectionVisible) {
      triggerTitleGlitch();
      startOptimizedGlitchLoop();
    }
  }, 2000);

  // Mantener interactividad del clic
  glitchTitle.addEventListener('click', triggerTitleGlitch, { passive: true });

  // Optimizar efecto de caracteres distorsionados
  function startCharacterGlitch() {
    if (!isPageVisible || !isTeamSectionVisible) return;

    // Definir el texto original constante para el título
    const ORIGINAL_TITLE_TEXT = "Equipo";

    characterGlitchInterval = setInterval(() => {
      if (!isPageVisible || !isTeamSectionVisible) return;

      // Reducir probabilidad del 20% al 10%
      if (Math.random() < 0.1) {
        // Optimizar generación de texto glitch
        const glitchChars = '!@#$%^&*()-_=+[]{}|;:,.<>?/';
        const textArray = ORIGINAL_TITLE_TEXT.split('');

        // Cambiar solo 20% de caracteres en lugar de 30%
        for (let i = 0; i < textArray.length; i++) {
          if (Math.random() < 0.2) {
            textArray[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
        }

        glitchTitle.textContent = textArray.join('');

        // Restaurar más rápido
        setTimeout(() => {
          glitchTitle.textContent = ORIGINAL_TITLE_TEXT;
        }, 100);
      }
    }, 6000); // Aumentar intervalo de 4s a 6s
  }

  startCharacterGlitch();

  // ===== EFECTOS DE IMAGEN OPTIMIZADOS =====
  const teamCardsWithMembers = document.querySelectorAll('.team-card[data-member]');

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

  if (teamCardsWithMembers.length > 0) {
    // Función optimizada para efecto de glitch - muestra las 3 imágenes en secuencia usando superposición
    function applySequentialImageGlitch() {
      if (!isPageVisible || !isTeamSectionVisible || isImageGlitchActive) return;

      isImageGlitchActive = true;

      // Filtrar tarjetas disponibles (no en hover, no animándose actualmente)
      const availableCards = Array.from(teamCardsWithMembers).filter(card =>
        !card.matches(':hover') &&
        !activeGlitchCards.has(card) &&
        !cardsWithHover.has(card)
      );

      if (availableCards.length === 0) {
        isImageGlitchActive = false;
        scheduleNextImageGlitch();
        return;
      }

      // Seleccionar solo 1 tarjeta aleatoria
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards[randomIndex];

      // Marcar como activa
      activeGlitchCards.add(selectedCard);
      currentGlitchingCard = selectedCard;

      // Verificar que todas las imágenes glitch estén presentes
      const glitchContainer = selectedCard.querySelector('.glitch-container');
      const glitchImages = selectedCard.querySelectorAll('.glitch-image');

      if (!glitchContainer || glitchImages.length !== 3) {
        console.warn('Faltan elementos de glitch para esta tarjeta');
        activeGlitchCards.delete(selectedCard);
        currentGlitchingCard = null;
        isImageGlitchActive = false;
        scheduleNextImageGlitch();
        return;
      }

      // Añadir clase para activar el contenedor de glitch
      selectedCard.classList.add('active-glitch-card');

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

          // Programar el siguiente frame
          requestAnimationFrame(showNextGlitchFrameOptimized);
        } else {
          // Quitar todas las clases de glitch
          selectedCard.classList.remove('active-glitch-card', 'glitch-frame-1', 'glitch-frame-2', 'glitch-frame-3');

          // Limpiar estado
          activeGlitchCards.delete(selectedCard);
          currentGlitchingCard = null;
          isImageGlitchActive = false;

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
        return;
      }

      // Verificar si hay tarjetas disponibles (no en hover, no con animación activa)
      const availableCards = Array.from(teamCardsWithMembers).filter(card =>
        !activeGlitchCards.has(card) && !cardsWithHover.has(card)
      );

      // Si no hay tarjetas disponibles, reprogramar con un tiempo más largo
      if (availableCards.length === 0) {
        imageGlitchTimeout = setTimeout(scheduleNextImageGlitch, 2000); // Mayor tiempo de espera para mejorar rendimiento
        return;
      }

      // Usar tiempos más largos para reducir la carga de CPU
      let minDelay = 2500;  // 2.5 segundos
      let maxDelay = 6000;  // 6 segundos

      // Calcular tiempo aleatorio entre min y max
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;

      // Usar requestAnimationFrame para sincronizar con el ciclo de renderizado del navegador
      requestAnimationFrame(() => {
        imageGlitchTimeout = setTimeout(applySequentialImageGlitch, delay);
      });
    }

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

    // Iniciar con delay corto (solo si la sección es visible)
    setTimeout(() => {
      if (isPageVisible && isTeamSectionVisible) {
        scheduleNextImageGlitch();
      }
    }, 2000); // Delay inicial reducido a 2s para ver efectos más pronto
  }

  // ===== ANIMACIONES DE CARGA OPTIMIZADAS =====
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
