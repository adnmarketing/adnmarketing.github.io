// Manejo de videos de fondo para la sección Services
class ServicesVideoManager {
  constructor() {
    this.videoElement = null;
    this.isDarkMode = false;
    this.isInitialized = false;
    this.preloadedVideos = new Map();
    this.performanceConfig = {
      lowBattery: false,
      slowConnection: false,
      deviceType: 'desktop'
    };
    this.init();
  }

  async init() {
    // Detectar configuración de rendimiento
    await this.detectPerformanceConfig();

    // Detectar si es móvil
    if (this.isMobile() || this.performanceConfig.slowConnection) {
      this.showFallbackBackground();
      return;
    }

    // Buscar el elemento de video
    this.videoElement = document.querySelector('.services-background-video');
    if (!this.videoElement) {
      console.warn('Video element not found');
      this.showFallbackBackground();
      return;
    }

    // Aplicar configuración según el dispositivo
    this.applyDeviceOptimizations();

    // Precargar videos solo si no es conexión lenta
    if (!this.performanceConfig.slowConnection) {
      this.preloadVideos();
    }

    // Escuchar cambios de tema
    this.setupThemeWatcher();

    // Configurar video inicial
    this.updateVideoSource();

    // Configurar observer para lazy loading
    this.setupIntersectionObserver();

    this.isInitialized = true;

    console.log('ServicesVideoManager initialized successfully');
  }

  async detectPerformanceConfig() {
    // Detectar tipo de dispositivo
    this.performanceConfig.deviceType = this.getDeviceType();

    // Detectar conexión lenta
    this.performanceConfig.slowConnection = this.isSlowConnection();

    // Detectar batería baja
    this.performanceConfig.lowBattery = await this.isLowBattery();
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      this.performanceConfig.deviceType === 'mobile';
  }

  isSlowConnection() {
    if (!navigator.connection) return false;
    return ['slow-2g', '2g'].includes(navigator.connection.effectiveType);
  }

  async isLowBattery() {
    if (!navigator.getBattery) return false;
    try {
      const battery = await navigator.getBattery();
      return battery.level < 0.2;
    } catch (error) {
      return false;
    }
  }

  applyDeviceOptimizations() {
    if (!this.videoElement) return;

    const effects = {
      blur: {
        desktop: '8px',
        tablet: '4px',
        mobile: '2px'
      },
      scale: {
        desktop: '1.1',
        tablet: '1.05',
        mobile: '1.0'
      },
      opacity: {
        desktop: '0.8',
        tablet: '0.7',
        mobile: '0.6'
      }
    };

    const deviceType = this.performanceConfig.lowBattery ? 'mobile' : this.performanceConfig.deviceType;

    this.videoElement.style.filter = `blur(${effects.blur[deviceType]})`;
    this.videoElement.style.transform = `scale(${effects.scale[deviceType]})`;
    this.videoElement.style.opacity = effects.opacity[deviceType];
  }

  showFallbackBackground() {
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
      // Detectar tema actual
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isBodyLight = document.body.classList.contains('light');
      const isDarkMode = currentTheme === 'dark' || !isBodyLight;

      servicesSection.style.background = isDarkMode ?
        'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' :
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      servicesSection.style.backgroundAttachment = 'local';
    }
  }

  preloadVideos() {
    const videos = [
      { src: 'assets/videos/DNA_B.mp4', key: 'light' },
      { src: 'assets/videos/DNA_W.mp4', key: 'dark' }
    ];

    videos.forEach(video => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = video.src;
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.playsInline = true;

      // Manejar errores de carga
      videoElement.onerror = () => {
        console.warn(`Error loading video: ${video.src}`);
        this.showFallbackBackground();
      };

      this.preloadedVideos.set(video.key, videoElement);
    });
  }

  setupThemeWatcher() {
    // Observar cambios en el data-theme del root para detectar modo oscuro
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newIsDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
          console.log('Theme changed (data-theme):', {
            oldDarkMode: this.isDarkMode,
            newDarkMode: newIsDarkMode,
            dataTheme: document.documentElement.getAttribute('data-theme')
          });

          if (newIsDarkMode !== this.isDarkMode) {
            this.isDarkMode = newIsDarkMode;
            if (this.isInitialized) {
              this.updateVideoSource();
            } else {
              this.showFallbackBackground();
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // También observar cambios en el body para compatibilidad
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const newIsDarkMode = !document.body.classList.contains('light');
          console.log('Theme changed (body class):', {
            oldDarkMode: this.isDarkMode,
            newDarkMode: newIsDarkMode,
            bodyClasses: document.body.className
          });

          if (newIsDarkMode !== this.isDarkMode) {
            this.isDarkMode = newIsDarkMode;
            if (this.isInitialized) {
              this.updateVideoSource();
            } else {
              this.showFallbackBackground();
            }
          }
        }
      });
    });

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Detectar modo inicial
    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' ||
      !document.body.classList.contains('light');

    console.log('Initial theme detected:', {
      isDarkMode: this.isDarkMode,
      dataTheme: document.documentElement.getAttribute('data-theme'),
      bodyClasses: document.body.className
    });
  }

  updateVideoSource() {
    if (!this.videoElement || this.isMobile()) return;

    const videoKey = this.isDarkMode ? 'dark' : 'light';
    const videoSrc = this.isDarkMode ? 'assets/videos/DNA_W.mp4' : 'assets/videos/DNA_B.mp4';

    console.log('Updating video source:', {
      isDarkMode: this.isDarkMode,
      videoKey: videoKey,
      videoSrc: videoSrc
    });

    // Usar video precargado si está disponible
    if (this.preloadedVideos.has(videoKey)) {
      const preloadedVideo = this.preloadedVideos.get(videoKey);
      this.videoElement.src = preloadedVideo.src;
    } else {
      this.videoElement.src = videoSrc;
    }

    this.videoElement.load();

    // Reproducir cuando esté listo
    this.videoElement.addEventListener('loadeddata', () => {
      this.videoElement.play().catch((error) => {
        console.warn('Error playing video:', error);
        this.showFallbackBackground();
      });
    }, { once: true });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reproducir video cuando la sección esté visible
          if (this.videoElement && this.videoElement.paused) {
            this.videoElement.play().catch(console.error);
          }
        } else {
          // Pausar video cuando la sección no esté visible para ahorrar batería
          if (this.videoElement && !this.videoElement.paused) {
            this.videoElement.pause();
          }
        }
      });
    }, {
      threshold: 0.1
    });

    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
      observer.observe(servicesSection);
    }
  }

  // Método para optimizar rendimiento
  optimizePerformance() {
    if (!this.videoElement) return;

    // Pausar video si la página no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.videoElement.pause();
      } else if (this.isInitialized) {
        this.videoElement.play().catch(console.error);
      }
    });

    // Monitorear cambios en la batería
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.2 && !this.performanceConfig.lowBattery) {
            this.performanceConfig.lowBattery = true;
            this.applyDeviceOptimizations();
          }
        });
      });
    }

    // Monitorear cambios en la conexión
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        const wasSlowConnection = this.performanceConfig.slowConnection;
        this.performanceConfig.slowConnection = this.isSlowConnection();

        if (this.performanceConfig.slowConnection && !wasSlowConnection) {
          this.destroy();
          this.showFallbackBackground();
        }
      });
    }
  }

  // Método para cleanup
  destroy() {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement.load();
    }
    this.preloadedVideos.clear();
    this.isInitialized = false;
  }

  // Método para debug
  debug() {
    console.log('ServicesVideoManager Debug Info:', {
      isInitialized: this.isInitialized,
      isDarkMode: this.isDarkMode,
      videoElement: this.videoElement,
      currentVideoSrc: this.videoElement?.src,
      bodyClasses: document.body.className,
      dataTheme: document.documentElement.getAttribute('data-theme'),
      preloadedVideos: Array.from(this.preloadedVideos.keys()),
      performanceConfig: this.performanceConfig
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const servicesVideoManager = new ServicesVideoManager();
  servicesVideoManager.optimizePerformance();

  // Hacer disponible globalmente para debug
  window.servicesVideoManager = servicesVideoManager;
});
