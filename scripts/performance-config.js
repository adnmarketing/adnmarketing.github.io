// Configuración de Performance para optimización ultra-temprana
window.PerformanceConfig = {
  // Configuración de preload inteligente
  preload: {
    // Imágenes críticas que se cargan inmediatamente
    criticalImages: [
      'assets/images/team/rubi/adn-rubi.avif',
      'assets/images/team/jack/adn-jack.avif',
      'assets/images/team/gabo/adn-gabo.avif',
      'assets/images/services/content_visual.webp',
      'assets/images/services/social_media_management.webp',
      'assets/images/services/graphic_design.webp'
    ],

    // Imágenes de segunda prioridad (se cargan después de 1 segundo)
    secondaryImages: [
      'assets/images/team/jota/adn-jota.avif',
      'assets/images/team/alex/adn-alex.avif',
      'assets/images/team/bryan/adn-bryan.avif',
      'assets/images/team/raul/adn-raul.avif',
      'assets/images/services/digital_advertising.webp',
      'assets/images/services/brand_strategy.webp',
      'assets/images/services/automation_followup.webp'
    ],

    // Imágenes de portfolio (se cargan después de 2 segundos)
    portfolioImages: [
      'assets/images/customers/colmena.webp',
      'assets/images/customers/el_patron.webp',
      'assets/images/customers/la_mariscana.webp',
      'assets/images/customers/livis.webp',
      'assets/images/customers/nails.webp'
    ]
  },

  // Configuración de animaciones
  animations: {
    // Usar animaciones reducidas en dispositivos de bajo rendimiento
    useReducedMotion: false,
    
    // Delay mínimo entre animaciones para evitar sobrecarga
    minimumAnimationDelay: 16, // 60fps
    
    // Configuración por sección
    sections: {
      Team: {
        maxConcurrentAnimations: 2,
        animationCooldown: 1000
      },
      Services: {
        maxConcurrentAnimations: 3,
        animationCooldown: 500
      },
      Portfolio: {
        maxConcurrentAnimations: 5,
        animationCooldown: 200
      }
    }
  },

  // Detección automática de capacidades del dispositivo
  deviceCapabilities: {
    // Se detectará automáticamente en runtime
    isLowEndDevice: null,
    hasSlowConnection: null,
    batteryLevel: null,
    prefersReducedMotion: null
  },

  // Umbrales de performance
  thresholds: {
    lowBatteryLevel: 0.3, // 30%
    slowConnectionMbps: 2, // 2 Mbps
    highMemoryUsageMB: 500 // 500 MB
  }
};

// Función para detectar capacidades del dispositivo
window.detectDeviceCapabilities = function() {
  const config = window.PerformanceConfig.deviceCapabilities;
  
  // Detectar preferencia de movimiento reducido
  config.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detectar conexión lenta
  if (navigator.connection) {
    const connection = navigator.connection;
    config.hasSlowConnection = connection.effectiveType === 'slow-2g' || 
                               connection.effectiveType === '2g' ||
                               connection.downlink < window.PerformanceConfig.thresholds.slowConnectionMbps;
  }
  
  // Detectar nivel de batería
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      config.batteryLevel = battery.level;
    });
  }
  
  // Detectar memoria disponible (experimental)
  if (navigator.deviceMemory) {
    config.isLowEndDevice = navigator.deviceMemory <= 2; // 2GB o menos
  }
  
  // Detectar por user agent como fallback
  if (config.isLowEndDevice === null) {
    const userAgent = navigator.userAgent.toLowerCase();
    config.isLowEndDevice = /android/.test(userAgent) && !/chrome/.test(userAgent);
  }
  
  console.log('📱 Capacidades del dispositivo detectadas:', config);
  
  // Aplicar configuraciones automáticas basadas en capacidades
  if (config.isLowEndDevice || config.hasSlowConnection || config.prefersReducedMotion) {
    window.PerformanceConfig.animations.useReducedMotion = true;
    console.log('⚡ Modo de performance activado para dispositivo de baja capacidad');
  }
};

// Ejecutar detección temprana
window.detectDeviceCapabilities();
