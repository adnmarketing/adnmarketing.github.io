// Animación/interactividad para las tarjetas de valores

// Variables globales para control de viewport
let isCoreValuesSectionVisible = false;

window.addEventListener('DOMContentLoaded', () => {
  // Configurar observación de viewport para la sección CoreValues
  const coreValuesSection = document.querySelector('#CoreValues');

  if (coreValuesSection && window.viewportManager) {
    const handleCoreValuesVisibility = (isVisible, visibilityRatio, element, isPageHidden = false) => {
      isCoreValuesSectionVisible = isVisible && !isPageHidden;

      // Los efectos de CoreValues son principalmente por hover/click,
      // por lo que no necesitamos pausar animaciones automáticas
      // Solo registramos el estado para futuras optimizaciones
    };

    window.viewportManager.observeSection(coreValuesSection, 'CoreValues', [handleCoreValuesVisibility]);
  } else {
    // Fallback si ViewportManager no está disponible
    isCoreValuesSectionVisible = true;
  }

  const cards = document.querySelectorAll('.corevalue-card');
  let lastClickedCard = null;
  cards.forEach(card => {
    let mouseDownInside = false;
    card.addEventListener('mousedown', () => {
      mouseDownInside = true;
    });
    card.addEventListener('mouseup', () => {
      mouseDownInside = false;
    });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
      // Si el mouse salió después de un click, forzar blur
      if (mouseDownInside || document.activeElement === card) {
        card.blur();
        mouseDownInside = false;
      } else {
        card.classList.remove('focus');
      }
    });
    // Accesibilidad: foco
    card.addEventListener('focus', () => card.classList.add('focus'));
    card.addEventListener('blur', () => card.classList.remove('focus'));

    // --- Efecto de voltear tarjeta (giro Y simple, flip 5s, animación en el card) ---
    let flipTimeout = null;
    let animationInProgress = false; // Variable para controlar el estado de animación

    card.addEventListener('click', function (e) {
      // Ignorar eventos que no sean de click (e.detail === 0 es para eventos de teclado)
      if (e.detail === 0) return;

      // Evitar múltiples clicks durante una animación
      if (animationInProgress) return;

      // Marcar que hay una animación en progreso
      animationInProgress = true;

      // Cancelar cualquier temporizador existente de retorno automático
      if (flipTimeout) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
      }

      // Cambiar el estado de la tarjeta (voltear o regresar)
      if (card.classList.contains('flipped')) {
        // Si ya está volteada, regresarla a su posición original
        card.classList.remove('flipped');

        // Asegurar que se restablezca el fondo correcto y la animación float
        setTimeout(() => {
          // Restaurar la animación float
          card.style.animation = '';
          // Asegurar que el fondo se restaure correctamente
          card.style.background = ''; // Eliminar cualquier background inline que pueda estar interfiriendo
          animationInProgress = false;

          // Forzar repintado para dispositivos móviles
          card.offsetHeight; // Truco para forzar repintado
        }, 700);
      } else {
        // Si está en posición normal, voltearla
        // Guardamos el estilo de animación original para restaurarlo después
        const originalAnimation = window.getComputedStyle(card).animation;

        // Desactivar la animación float para que no interfiera con el flip
        card.style.animation = 'none';

        // Aplicar el flip después de un pequeño retraso para que se aplique primero animation: none
        setTimeout(() => {
          card.classList.add('flipped');
        }, 10);

        // Permitir nuevos clicks después de la animación
        setTimeout(() => {
          animationInProgress = false;

          // Solo configurar el temporizador para retorno automático cuando
          // se voltea de la posición normal a la volteada
          flipTimeout = setTimeout(() => {
            // Verificar si la tarjeta sigue volteada
            if (card.classList.contains('flipped')) {
              // Bloquear interacciones durante la animación automática
              animationInProgress = true;

              // Regresar la tarjeta a su posición original
              card.classList.remove('flipped');

              // Restaurar la animación float y el fondo correcto después de completar el flip
              setTimeout(() => {
                card.style.animation = '';
                card.style.background = ''; // Eliminar cualquier background inline
                // Asegurar que se apliquen los estilos correctos especialmente en móvil
                card.classList.remove('no-float'); // Por si acaso se aplicó esta clase

                // Forzar repintado para dispositivos móviles
                card.offsetHeight;
                animationInProgress = false;
              }, 700);
            }
          }, 4000); // 4 segundos antes del retorno automático
        }, 700);
      }
    });
  });
  // Quitar foco visual al hacer click fuera de las tarjetas
  document.addEventListener('mousedown', (e) => {
    if (![...cards].some(card => card.contains(e.target))) {
      cards.forEach(card => card.classList.remove('focus'));
      lastClickedCard = null;
    }
  });
});

// Función para actualizar logos de las tarjetas según el tema
function updateCoreValueLogos() {
  const logos = document.querySelectorAll('.corevalue-logo');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
    !document.body.classList.contains('light');

  logos.forEach(logo => {
    logo.src = isDark ?
      'assets/images/logos/adn_logo_w.svg' :
      'assets/images/logos/adn_logo_b.svg';
  });
}

// Observar cambios de tema para actualizar logos
function setupCoreValueThemeWatcher() {
  // Observar cambios en data-theme
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        updateCoreValueLogos();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // También observar cambios en el body
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        updateCoreValueLogos();
      }
    });
  });

  bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Actualizar logos inicialmente
  updateCoreValueLogos();
}

setupCoreValueThemeWatcher();