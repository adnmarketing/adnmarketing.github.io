// Gestor de visibilidad de secciones para optimización de performance
class ViewportManager {
  constructor() {
    this.observers = new Map();
    this.sectionStates = new Map();
    this.callbacks = new Map();
    this.initialized = false;

    // Configuración optimizada del Intersection Observer
    this.observerOptions = {
      root: null,
      rootMargin: '50px', // Activar 50px antes de que sea visible
      threshold: [0, 0.1, 0.5] // Múltiples puntos de activación
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
