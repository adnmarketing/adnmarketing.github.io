// Gestor de visibilidad de secciones para optimización de performance
class ViewportManager {
  constructor() {
    this.observers = new Map();
    this.sectionStates = new Map();
    this.callbacks = new Map();
    this.preloadedSections = new Set(); // Nuevo: rastrear secciones precargadas
    this.initialized = false;

    // Configuración optimizada del Intersection Observer
    this.observerOptions = {
      root: null,
      rootMargin: '300px', // Aumentado para preload anticipado
      threshold: [0, 0.05, 0.1, 0.5] // Más puntos de detección temprana
    };

    // Configuración de preload específico por sección
    this.preloadOptions = {
      Team: { preloadDistance: '400px', enableEarlyInit: true },
      Services: { preloadDistance: '200px', enableEarlyInit: true },
      Portfolio: { preloadDistance: '250px', enableEarlyInit: false },
      CoreValues: { preloadDistance: '200px', enableEarlyInit: false }
    };

    this.init();
  }

  init() {
    if (this.initialized) return;

    // Crear observer principal
    this.mainObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.observerOptions
    );

    // Pausar animaciones cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
      const isVisible = !document.hidden;
      this.handlePageVisibilityChange(isVisible);
    });

    this.initialized = true;
    console.log('🚀 ViewportManager inicializado');
  }

  // Manejar intersección de elementos
  handleIntersection(entries) {
    entries.forEach(entry => {
      const sectionId = entry.target.id || entry.target.className;
      const isVisible = entry.isIntersecting;
      const visibilityRatio = entry.intersectionRatio;

      // NUEVO: Preload automático cuando la sección está cerca
      if (visibilityRatio > 0 && !this.preloadedSections.has(sectionId)) {
        // Solo preload para secciones pesadas
        if (['Team', 'Services', 'Portfolio'].includes(sectionId)) {
          this.preloadSection(sectionId);
        }
      }

      // Actualizar estado de la sección
      this.sectionStates.set(sectionId, {
        isVisible,
        visibilityRatio,
        element: entry.target,
        lastUpdate: Date.now()
      });

      // Ejecutar callbacks registrados
      const callbacks = this.callbacks.get(sectionId) || [];
      callbacks.forEach(callback => {
        try {
          callback(isVisible, visibilityRatio, entry.target);
        } catch (error) {
          console.warn(`Error en callback para ${sectionId}:`, error);
        }
      });

      // Log para debugging (solo en desarrollo)
      if (this.isDevelopment()) {
        console.log(`📍 Sección ${sectionId}: ${isVisible ? 'visible' : 'oculta'} (${(visibilityRatio * 100).toFixed(1)}%)`);
      }
    });
  }

  // Manejar cambio de visibilidad de la página
  handlePageVisibilityChange(isVisible) {
    // Notificar a todas las secciones sobre el cambio de visibilidad de la página
    this.sectionStates.forEach((state, sectionId) => {
      const callbacks = this.callbacks.get(sectionId) || [];
      callbacks.forEach(callback => {
        try {
          // Pasar información adicional sobre visibilidad de la página
          callback(state.isVisible && isVisible, state.visibilityRatio, state.element, !isVisible);
        } catch (error) {
          console.warn(`Error en callback de visibilidad para ${sectionId}:`, error);
        }
      });
    });
  }

  // Registrar una sección para observación
  observeSection(element, sectionId, callbacks = []) {
    if (!element) {
      console.warn(`No se pudo observar la sección ${sectionId}: elemento no encontrado`);
      return;
    }

    // Asignar ID si no existe
    if (!element.id && sectionId) {
      element.id = sectionId;
    }

    const finalSectionId = element.id || sectionId || element.className;

    // Registrar callbacks
    if (callbacks.length > 0) {
      this.callbacks.set(finalSectionId, callbacks);
    }

    // Inicializar estado
    this.sectionStates.set(finalSectionId, {
      isVisible: false,
      visibilityRatio: 0,
      element: element,
      lastUpdate: Date.now()
    });

    // Comenzar observación
    this.mainObserver.observe(element);

    console.log(`👁️ Observando sección: ${finalSectionId}`);
    return finalSectionId;
  }

  // Dejar de observar una sección
  unobserveSection(sectionId) {
    const state = this.sectionStates.get(sectionId);
    if (state && state.element) {
      this.mainObserver.unobserve(state.element);
      this.sectionStates.delete(sectionId);
      this.callbacks.delete(sectionId);
      console.log(`👁️ Dejando de observar: ${sectionId}`);
    }
  }

  // Obtener estado de una sección
  getSectionState(sectionId) {
    return this.sectionStates.get(sectionId) || null;
  }

  // Verificar si una sección está visible
  isSectionVisible(sectionId) {
    const state = this.sectionStates.get(sectionId);
    return state ? state.isVisible : false;
  }

  // Agregar callback a una sección existente
  addCallback(sectionId, callback) {
    const existingCallbacks = this.callbacks.get(sectionId) || [];
    existingCallbacks.push(callback);
    this.callbacks.set(sectionId, existingCallbacks);
  }

  // Verificar si estamos en desarrollo
  isDevelopment() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  // NUEVO: Sistema de preload inteligente
  preloadSection(sectionId) {
    if (this.preloadedSections.has(sectionId)) {
      console.log(`🔄 Sección ${sectionId} ya está precargada`);
      return Promise.resolve();
    }

    console.log(`🚀 Iniciando preload para sección: ${sectionId}`);
    this.preloadedSections.add(sectionId);

    return new Promise((resolve) => {
      // Ejecutar preload específico por sección
      switch (sectionId) {
        case 'Team':
          this.preloadTeamSection().then(resolve);
          break;
        case 'Services':
          this.preloadServicesSection().then(resolve);
          break;
        case 'Portfolio':
          this.preloadPortfolioSection().then(resolve);
          break;
        default:
          resolve();
      }
    });
  }

  // Preload específico para la sección Team (la más pesada)
  preloadTeamSection() {
    return new Promise((resolve) => {
      console.log('🎭 Precargando sección Team...');
      
      // Preload de imágenes del equipo
      const teamImages = document.querySelectorAll('#Team img');
      const imagePromises = Array.from(teamImages).map(img => {
        return new Promise((resolveImg) => {
          if (img.complete) {
            resolveImg();
          } else {
            img.addEventListener('load', resolveImg);
            img.addEventListener('error', resolveImg);
          }
        });
      });

      // Inicializar animaciones de glitch sin ejecutarlas
      if (typeof window.prepareTeamAnimations === 'function') {
        window.prepareTeamAnimations();
      }

      Promise.all(imagePromises).then(() => {
        console.log('✅ Team section precargada');
        resolve();
      });
    });
  }

  // Preload para Services
  preloadServicesSection() {
    return new Promise((resolve) => {
      console.log('🔧 Precargando sección Services...');
      
      // Preload de imágenes de servicios
      const serviceImages = document.querySelectorAll('#Services .service-bg-blur');
      let loadedCount = 0;
      const totalImages = serviceImages.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      serviceImages.forEach(bgElement => {
        const bgImage = window.getComputedStyle(bgElement).backgroundImage;
        const urlMatch = bgImage.match(/url\("(.+)"\)/);
        
        if (urlMatch) {
          const img = new Image();
          img.onload = img.onerror = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              console.log('✅ Services section precargada');
              resolve();
            }
          };
          img.src = urlMatch[1];
        } else {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        }
      });
    });
  }

  // Preload para Portfolio
  preloadPortfolioSection() {
    return new Promise((resolve) => {
      console.log('📁 Precargando sección Portfolio...');
      
      const portfolioImages = document.querySelectorAll('#Portfolio img');
      const imagePromises = Array.from(portfolioImages).map(img => {
        return new Promise((resolveImg) => {
          if (img.complete) {
            resolveImg();
          } else {
            img.addEventListener('load', resolveImg);
            img.addEventListener('error', resolveImg);
          }
        });
      });

      Promise.all(imagePromises).then(() => {
        console.log('✅ Portfolio section precargada');
        resolve();
      });
    });
  }

  // Limpiar recursos
  destroy() {
    this.mainObserver.disconnect();
    this.observers.clear();
    this.sectionStates.clear();
    this.callbacks.clear();
    console.log('🧹 ViewportManager destruido');
  }
}

// Instancia global del gestor
window.viewportManager = new ViewportManager();

// Función helper para fácil acceso
window.observeSection = function (element, sectionId, callbacks = []) {
  return window.viewportManager.observeSection(element, sectionId, callbacks);
};

window.isSectionVisible = function (sectionId) {
  return window.viewportManager.isSectionVisible(sectionId);
};
