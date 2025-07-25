// Configuración para la optimización de videos
const VIDEO_CONFIG = {
  // Configuración de videos
  videos: {
    light: {
      src: 'assets/videos/DNA_B.mp4',
      fallback: 'assets/images/services-bg-light.jpg'
    },
    dark: {
      src: 'assets/videos/DNA_W.mp4',
      fallback: 'assets/images/services-bg-dark.jpg'
    }
  },

  // Configuración de rendimiento
  performance: {
    preloadThreshold: 0.1, // Porcentaje de viewport para iniciar precarga
    pauseThreshold: 0.05,  // Porcentaje de viewport para pausar video
    maxFileSize: 10 * 1024 * 1024, // 10MB máximo por video
    lowBatteryThreshold: 0.2, // Umbral de batería baja
    slowConnectionTypes: ['slow-2g', '2g'] // Tipos de conexión lenta
  },

  // Configuración de efectos
  effects: {
    blur: {
      desktop: '8px',
      tablet: '4px',
      mobile: '2px',
      lowBattery: '2px'
    },
    scale: {
      desktop: '1.1',
      tablet: '1.05',
      mobile: '1.0',
      lowBattery: '1.05'
    },
    opacity: {
      desktop: '0.8',
      tablet: '0.7',
      mobile: '0.6'
    }
  },

  // Configuración de detección de dispositivos
  device: {
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    retinaDensity: 2
  }
};

// Función para detectar el tipo de dispositivo
function getDeviceType() {
  const width = window.innerWidth;
  if (width <= VIDEO_CONFIG.device.mobileBreakpoint) return 'mobile';
  if (width <= VIDEO_CONFIG.device.tabletBreakpoint) return 'tablet';
  return 'desktop';
}

// Función para detectar conexión lenta
function isSlowConnection() {
  if (!navigator.connection) return false;
  return VIDEO_CONFIG.performance.slowConnectionTypes.includes(navigator.connection.effectiveType);
}

// Función para detectar batería baja
async function isLowBattery() {
  if (!navigator.getBattery) return false;
  try {
    const battery = await navigator.getBattery();
    return battery.level < VIDEO_CONFIG.performance.lowBatteryThreshold;
  } catch (error) {
    return false;
  }
}

// Función para aplicar configuración según el dispositivo
function applyDeviceConfig(videoElement) {
  const deviceType = getDeviceType();
  const effects = VIDEO_CONFIG.effects;

  if (videoElement) {
    videoElement.style.filter = `blur(${effects.blur[deviceType]})`;
    videoElement.style.transform = `scale(${effects.scale[deviceType]})`;
    videoElement.style.opacity = effects.opacity[deviceType];
  }
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VIDEO_CONFIG,
    getDeviceType,
    isSlowConnection,
    isLowBattery,
    applyDeviceConfig
  };
} else {
  window.VIDEO_CONFIG = VIDEO_CONFIG;
  window.getDeviceType = getDeviceType;
  window.isSlowConnection = isSlowConnection;
  window.isLowBattery = isLowBattery;
  window.applyDeviceConfig = applyDeviceConfig;
}
