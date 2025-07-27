// Gestor simplificado para servicios sin efectos hover
class ServicesPillarsSimpleManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    try {
      console.log('🚀 Inicializando ServicesPillarsSimpleManager...');
      
      // Encontrar contenedor
      this.container = document.querySelector('.services-container');
      if (!this.container) {
        console.warn('❌ Services container not found');
        return;
      }

      console.log('✅ Container encontrado');

      // Establecer clases iniciales antes de configurar animaciones
      this.setupInitialClasses();
      
      // Configurar animaciones y responsive
      this.setupAnimations();
      this.handleResize();
    } catch (error) {
      console.error('❌ Error en init:', error);
    }
  }

  setupInitialClasses() {
    const pillars = this.container.querySelectorAll('.service-pillar');
    const isDesktop = window.innerWidth > 1024;
    
    console.log('🎯 Configurando clases iniciales...');
    
    pillars.forEach((pillar, index) => {
      // Remover todas las clases de dirección primero
      pillar.classList.remove('from-top', 'from-bottom', 'from-left', 'from-right');
      
      // Agregar la clase apropiada según el dispositivo
      if (isDesktop) {
        pillar.classList.add(index % 2 === 0 ? 'from-top' : 'from-bottom');
      } else {
        pillar.classList.add(index % 2 === 0 ? 'from-left' : 'from-right');
      }
    });
  }

  setupAnimations() {
    if (!window.gsap || !this.container) {
      console.warn('⚠️ GSAP no disponible o container no encontrado');
      return;
    }

    console.log('🎬 Configurando animaciones GSAP...');

    const pillars = this.container.querySelectorAll('.service-pillar'); // Los pilares siguen siendo los mismos

    // Configurar ScrollTrigger para la sección
    gsap.registerPlugin(ScrollTrigger);
    
    // Variable para controlar si ya se animó
    let hasAnimated = false;
    
    ScrollTrigger.create({
      trigger: this.container,
      start: "top 75%",
      onEnter: () => {
        // Solo animar la primera vez que entra al viewport
        if (!hasAnimated) {
          this.animateIn();
          hasAnimated = true;
        }
      },
      markers: false
    });

    console.log('✅ Animaciones GSAP configuradas');
  }

  animateIn() {
    const pillars = this.container.querySelectorAll('.service-pillar');
    
    console.log('🎬 Animando entrada de pilares (solo una vez)...');
    
    // Contador para saber cuántos pilares han terminado
    let completedAnimations = 0;
    const totalPillars = pillars.length;
    
    pillars.forEach((pillar, index) => {
      const delay = index * 0.15;
      
      // Establecer estado inicial con GSAP (sobrescribir CSS)
      gsap.set(pillar, {
        y: pillar.classList.contains('from-bottom') ? '100vh' : '-100vh',
        x: pillar.classList.contains('from-left') ? '-100vw' : 
           pillar.classList.contains('from-right') ? '100vw' : 0,
        opacity: 0
      });
      
      // Animar a posición final
      gsap.to(pillar, {
        duration: 1.2, // Duración más larga para suavidad
        y: 0,
        x: 0,
        opacity: 1,
        ease: "power3.out", // Ease más suave que back.out
        delay: delay,
        onComplete: function() {
          // Añadir clase que marca como animado
          pillar.classList.add('animated');
          completedAnimations++;
          
          console.log(`✅ Pilar ${index + 1} animado completamente`);
          
          // Cuando todos los pilares terminen, mostrar los títulos
          if (completedAnimations === totalPillars) {
            setTimeout(() => {
              this.showTitles();
            }, 200); // Pequeña pausa antes de mostrar títulos
          }
        }.bind(this)
      });
    });
  }

  showTitles() {
    const titles = this.container.querySelectorAll('.service-title');
    
    console.log('📝 Mostrando títulos de servicios...');
    
    // Animar los títulos uno por uno con un pequeño delay
    titles.forEach((title, index) => {
      setTimeout(() => {
        title.classList.add('show');
      }, index * 100); // 100ms entre cada título
    });
  }

  handleResize() {
    console.log('📱 Manejando resize...');
    
    const pillars = this.container.querySelectorAll('.service-pillar');
    const isDesktop = window.innerWidth > 1024;
    
    pillars.forEach((pillar, index) => {
      // Solo actualizar si no está ya animado
      if (!pillar.classList.contains('animated')) {
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
      }
    });

    // NO reconfigurar animaciones si ya se ejecutaron
    // this.setupAnimations();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM Content Loaded - Inicializando ServicesPillarsSimpleManager');
  const servicesPillarsManager = new ServicesPillarsSimpleManager();

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

console.log('📄 Script services-pillars-simple.js cargado');
