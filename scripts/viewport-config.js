// Configuración del Sistema de Optimización por Viewport
window.ViewportOptimizationConfig = {
  // Configuración del Intersection Observer
  observer: {
    // Margen para activar antes de que sea visible (en píxeles)
    rootMargin: '50px',

    // Puntos de activación (0 = apenas visible, 1 = completamente visible)
    threshold: [0, 0.1, 0.5, 0.8],

    // Delay para suavizar transiciones (en milisegundos)
    transitionDelay: 500
  },

  // Configuración específica por sección
  sections: {
    Team: {
      // Frecuencia de efectos glitch (en milisegundos)
      titleGlitchInterval: { min: 5000, max: 8000 },
      imageGlitchInterval: { min: 1500, max: 4000 }, // Mayor intervalo para que el efecto sea menos frecuente
      overlayGlitchInterval: { min: 4000, max: 8000 },

      // Probabilidades de efectos
      characterGlitchProbability: 0.1,
      characterChangeProbability: 0.2,

      // Duraciones de efectos
      glitchDuration: 1700,
      imageGlitchDuration: 1500, // Duración total de la animación de imágenes (3 frames de 500ms cada uno)
      characterRestoreDuration: 100
    },

    Portfolio: {
      // Frecuencia de actualización del cursor (en milisegundos)
      cursorUpdateInterval: 50,

      // Activar/desactivar efectos específicos
      enableHoverEffects: true,
      enableCursorTracking: true
    },

    CoreValues: {
      // Configuración para efectos de flip
      flipDuration: 5000,

      // Activar/desactivar efectos
      enableFlipEffects: true,
      enableHoverEffects: true
    }
  },

  // Configuración de debugging
  debug: {
    // Activar logs automáticamente en desarrollo
    autoEnableInDevelopment: true,

    // Nivel de logging (0: none, 1: basic, 2: verbose)
    logLevel: 1,

    // Mostrar indicadores visuales de visibilidad
    showVisualIndicators: false
  },

  // Configuración de performance
  performance: {
    // Usar requestAnimationFrame para animaciones suaves
    useRequestAnimationFrame: true,

    // Throttling para eventos de scroll/resize
    throttleDelay: 16, // ~60fps

    // Pausar animaciones en dispositivos con batería baja
    pauseOnLowBattery: true,

    // Reducir efectos en dispositivos móviles
    reducedMotionOnMobile: false
  },

  // Configuración de fallbacks
  fallbacks: {
    // Qué hacer si Intersection Observer no está disponible
    onUnsupportedBrowser: 'enable-all', // 'enable-all', 'disable-all', 'basic-only'

    // Timeout para inicialización
    initializationTimeout: 5000,

    // Reintentos automáticos
    maxRetries: 3
  }
};

// Función para actualizar configuración dinámicamente
window.updateViewportConfig = function (sectionId, config) {
  if (window.ViewportOptimizationConfig.sections[sectionId]) {
    Object.assign(window.ViewportOptimizationConfig.sections[sectionId], config);
    console.log(`🔧 Configuración actualizada para ${sectionId}:`, config);
  } else {
    console.warn(`❌ Sección ${sectionId} no encontrada en la configuración`);
  }
};

// Función para obtener configuración de una sección
window.getViewportConfig = function (sectionId) {
  return window.ViewportOptimizationConfig.sections[sectionId] || {};
};

// Detectar preferencias del usuario
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // El usuario prefiere movimiento reducido
  window.ViewportOptimizationConfig.performance.reducedMotionOnMobile = true;
  console.log('🎛️ Detectado: preferencia por movimiento reducido');
}

// Detectar dispositivos móviles
if (window.innerWidth < 768) {
  // Ajustar configuración para móviles
  window.ViewportOptimizationConfig.observer.rootMargin = '25px';
  window.ViewportOptimizationConfig.sections.Portfolio.cursorUpdateInterval = 100;
  console.log('📱 Configuración ajustada para dispositivo móvil');
}

// Detectar modo de desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.ViewportOptimizationConfig.debug.autoEnableInDevelopment = true;
  console.log('🔧 Modo desarrollo detectado - debugging habilitado');
}

console.log('⚙️ Sistema de Optimización por Viewport configurado');
