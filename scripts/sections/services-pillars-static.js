// Gestor simplificado para servicios con HTML estático
class ServicesPillarsStaticManager {
  constructor() {
    this.container = null;
    this.titleOverlay = null;
    this.services = [
      "Contenido Visual Profesional",
      "Producción y Edición de Video", 
      "Diseño Gráfico Estratégico",
      "Gestión de Redes Sociales",
      "Publicidad Digital",
      "Consultoría y Estrategia de Marca",
      "Automatización y Seguimiento"
    ];
    this.init();
  }

  init() {
    try {
      console.log('🚀 Inicializando ServicesPillarsStaticManager...');
      
      // Encontrar contenedor
      this.container = document.querySelector('.services-container');
      if (!this.container) {
        console.warn('❌ Services container not found');
        return;
      }

      // Encontrar overlay
      this.titleOverlay = document.querySelector('.service-title-overlay');
      if (!this.titleOverlay) {
        console.warn('❌ Service title overlay not found');
      }

      console.log('✅ Container y overlay encontrados');

      // Configurar eventos de hover
      this.setupHoverEvents();

      // Configurar animaciones GSAP
      this.setupAnimations();

      console.log('✅ ServicesPillarsStaticManager initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing ServicesPillarsStaticManager:', error);
    }
  }

  setupHoverEvents() {
    const pillars = this.container.querySelectorAll('.service-pillar');
    
    console.log(`🎯 Configurando eventos hover para ${pillars.length} pilares`);
    
    pillars.forEach((pillar, index) => {
      const serviceName = this.services[index] || 'Servicio';
      
      pillar.addEventListener('mouseenter', () => {
        this.showServiceTitle(serviceName);
      });
      
      pillar.addEventListener('mouseleave', () => {
        this.hideServiceTitle();
      });
    });
  }

  showServiceTitle(serviceName) {
    if (this.titleOverlay) {
      this.titleOverlay.textContent = serviceName;
      this.titleOverlay.classList.add('show');
    }
  }

  hideServiceTitle() {
    if (this.titleOverlay) {
      this.titleOverlay.classList.remove('show');
    }
  }

  setupAnimations() {
    if (!window.gsap || !this.container) {
      console.warn('⚠️ GSAP no disponible o container no encontrado');
      return;
    }

    console.log('🎬 Configurando animaciones GSAP...');

    const pillars = this.container.querySelectorAll('.service-pillar');

    // Configurar ScrollTrigger para la sección
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
      trigger: this.container,
      start: "top 75%",
      end: "bottom 25%",
      onEnter: () => this.animateIn(),
      onLeave: () => this.animateOut(),
      onEnterBack: () => this.animateIn(),
      onLeaveBack: () => this.animateOut(),
      markers: false
    });

    console.log('✅ Animaciones GSAP configuradas');
  }

  animateIn() {
    const pillars = this.container.querySelectorAll('.service-pillar');
    
    console.log('🎬 Animando entrada de pilares...');
    
    pillars.forEach((pillar, index) => {
      const delay = index * 0.15;
      
      gsap.to(pillar, {
        duration: 0.8,
        y: 0,
        x: 0,
        opacity: 1,
        ease: "back.out(1.7)",
        delay: delay
      });
    });
  }

  animateOut() {
    const pillars = this.container.querySelectorAll('.service-pillar');
    
    console.log('🎬 Animando salida de pilares...');
    
    pillars.forEach((pillar, index) => {
      const isDesktop = window.innerWidth > 1024;
      const delay = index * 0.1;
      
      if (isDesktop) {
        // Desktop: regresar a posiciones verticales originales
        const isFromTop = pillar.classList.contains('from-top');
        gsap.to(pillar, {
          duration: 0.6,
          y: isFromTop ? -window.innerHeight : window.innerHeight,
          opacity: 0,
          ease: "power2.in",
          delay: delay
        });
      } else {
        // Mobile: regresar a posiciones horizontales
        const isFromLeft = pillar.classList.contains('from-left');
        gsap.to(pillar, {
          duration: 0.6,
          x: isFromLeft ? -window.innerWidth : window.innerWidth,
          opacity: 0,
          ease: "power2.in",
          delay: delay
        });
      }
    });
  }

  handleResize() {
    console.log('📱 Manejando resize...');
    
    const pillars = this.container.querySelectorAll('.service-pillar');
    const isDesktop = window.innerWidth > 1024;
    
    pillars.forEach((pillar, index) => {
      // Remover todas las clases de dirección
      pillar.classList.remove('from-top', 'from-bottom', 'from-left', 'from-right');
      
      // Agregar la clase apropiada según el dispositivo
      if (isDesktop) {
        // Desktop: alternancia vertical
        pillar.classList.add(index % 2 === 0 ? 'from-top' : 'from-bottom');
      } else {
        // Mobile: alternancia horizontal
        pillar.classList.add(index % 2 === 0 ? 'from-left' : 'from-right');
      }
    });

    // Reconfigurar animaciones
    this.setupAnimations();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM Content Loaded - Inicializando ServicesPillarsStaticManager');
  const servicesPillarsManager = new ServicesPillarsStaticManager();

  // Manejar resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      servicesPillarsManager.handleResize();
    }, 250);
  });

  // Hacer disponible globalmente para debug
  window.servicesPillarsManager = servicesPillarsManager;
});

console.log('📄 Script services-pillars-static.js cargado');
