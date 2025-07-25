// Gestor de la nueva sección de servicios con pilares animados
class ServicesPillarsManager {
  constructor() {
    this.services = [];
    this.container = null;
    this.isLoaded = false;
    this.init();
  }

  async init() {
    try {
      console.log('🔄 INICIANDO ServicesPillarsManager...');
      
      // Cargar servicios desde JSON
      await this.loadServices();

      // Encontrar contenedor
      this.container = document.querySelector('.services-container');
      if (!this.container) {
        console.warn('❌ Services container not found');
        return;
      }
      
      console.log('✅ Container encontrado:', this.container);

      // Generar pilares
      this.generatePillars();

      // Configurar animaciones
      this.setupAnimations();

      this.isLoaded = true;
      console.log('✅ ServicesPillarsManager initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing ServicesPillarsManager:', error);
    }
  }

  async loadServices() {
    try {
      const response = await fetch('data/ourServices.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.services = await response.json();
      console.log('Servicios cargados desde JSON:', this.services);
    } catch (error) {
      console.error('Error loading services:', error);
      // Fallback con servicios por defecto
      this.services = [
        {
          service: "Contenido Visual Profesional",
          description: "Capturamos lo mejor de tu marca con fotografía y video de alta calidad.",
          image: "assets/images/services/content_visual.webp"
        },
        {
          service: "Producción y Edición de Video",
          description: "Creamos reels, spots y contenido emocional con narrativa profesional.",
          image: "assets/images/services/video_production.webp"
        },
        {
          service: "Diseño Gráfico Estratégico",
          description: "Desde flyers hasta identidad visual completa para tu marca.",
          image: "assets/images/services/graphic_design.webp"
        }
      ];
      console.log('Usando servicios fallback con imágenes:', this.services);
    }
  }

  generatePillars() {
    if (!this.container) {
      console.warn('❌ No container found for pillar generation');
      return;
    }

    if (!this.services.length) {
      console.warn('❌ No services found for pillar generation');
      return;
    }

    console.log('🏗️ Generando pilares para', this.services.length, 'servicios');

    // Limpiar contenedor
    this.container.innerHTML = '';

    // Crear overlay para el título dentro de la sección
    this.createServiceOverlay();

    // Generar cada pilar
    this.services.forEach((service, index) => {
      console.log(`🔨 Creando pilar ${index + 1}:`, service.service);
      const pillar = this.createPillar(service, index);
      this.container.appendChild(pillar);
    });

    console.log('✅ Pilares generados exitosamente. Contenido del container:');
    console.log(this.container.innerHTML);

    // Configurar eventos de hover
    this.setupHoverEvents();
  }

  createPillar(service, index) {
    const pillar = document.createElement('div');
    pillar.className = 'service-pillar';
    pillar.setAttribute('data-service-index', index);

    // Determinar dirección de animación
    const isDesktop = window.innerWidth > 1024;
    if (isDesktop) {
      // Desktop: alternancia vertical (arriba/abajo)
      pillar.classList.add(index % 2 === 0 ? 'from-top' : 'from-bottom');
    } else {
      // Mobile: alternancia horizontal (izquierda/derecha)
      pillar.classList.add(index % 2 === 0 ? 'from-left' : 'from-right');
    }

    // Agregar imagen de fondo si está disponible
    if (service.image) {
      // Verificar que la ruta de la imagen sea correcta
      const imagePath = service.image;
      
      // DEBUG: Aplicar color de fondo temporal primero
      pillar.style.backgroundColor = '#ff0000';
      
      // Aplicar imagen de fondo
      pillar.style.backgroundImage = `url('${imagePath}')`;
      pillar.classList.add('has-background-image');
      
      console.log(`🔍 DEBUG: Aplicando imagen ${imagePath} al pillar:`, pillar);
      console.log(`🔍 DEBUG: Estilo aplicado:`, pillar.style.backgroundImage);
      console.log(`🔍 DEBUG: Clases del pillar:`, pillar.className);
      
      // Verificar si la imagen se carga correctamente
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Imagen cargada exitosamente: ${imagePath}`);
        // Una vez cargada, remover el color de debug
        pillar.style.backgroundColor = '';
      };
      img.onerror = () => {
        console.error(`❌ Error cargando imagen: ${imagePath}`);
        pillar.style.backgroundColor = '#ffff00'; // Amarillo si hay error
      };
      img.src = imagePath;
    } else {
      console.log(`No hay imagen para el servicio: ${service.service}`);
    }

    pillar.innerHTML = `
      <div class="service-content">
        <h3 class="service-title">${service.service}</h3>
      </div>
    `;

    return pillar;
  }

  createServiceOverlay() {
    // Crear overlay dentro de la sección de servicios
    const servicesSection = document.querySelector('.services-section');
    if (!servicesSection) return;

    let overlay = servicesSection.querySelector('.service-title-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'service-title-overlay';
      servicesSection.appendChild(overlay);
    }
    this.titleOverlay = overlay;
  }

  setupHoverEvents() {
    const pillars = this.container.querySelectorAll('.service-pillar');
    
    pillars.forEach((pillar, index) => {
      const service = this.services[index];
      
      pillar.addEventListener('mouseenter', () => {
        this.showServiceTitle(service.service);
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
    if (!window.gsap || !this.container) return;

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
      markers: false // Cambiar a true para debug
    });
  }

  animateIn() {
    if (!window.gsap || !this.container) return;

    const pillars = this.container.querySelectorAll('.service-pillar');
    const isDesktop = window.innerWidth > 1024;

    // Resetear posiciones primero
    gsap.set(pillars, { clearProps: "all" });

    pillars.forEach((pillar, index) => {
      const delay = index * 0.12; // Stagger effect más rápido

      if (isDesktop) {
        // Desktop: animación vertical
        const fromTop = pillar.classList.contains('from-top');
        gsap.fromTo(pillar,
          {
            y: fromTop ? -window.innerHeight * 0.8 : window.innerHeight * 0.8,
            opacity: 0,
            scale: 0.7,
            rotation: fromTop ? -5 : 5
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            delay: delay,
            ease: "back.out(1.4)"
          }
        );
      } else {
        // Mobile: animación horizontal
        const fromLeft = pillar.classList.contains('from-left');
        gsap.fromTo(pillar,
          {
            x: fromLeft ? -window.innerWidth * 0.8 : window.innerWidth * 0.8,
            opacity: 0,
            scale: 0.8,
            rotation: fromLeft ? -3 : 3
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay: delay,
            ease: "power2.out"
          }
        );
      }
    });
  }

  animateOut() {
    if (!window.gsap || !this.container) return;

    const pillars = this.container.querySelectorAll('.service-pillar');
    const isDesktop = window.innerWidth > 1024;

    pillars.forEach((pillar) => {
      if (isDesktop) {
        // Desktop: cada pilar se va hacia donde vino (arriba o abajo)
        const fromTop = pillar.classList.contains('from-top');
        gsap.to(pillar, {
          y: fromTop ? -window.innerHeight : window.innerHeight,
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: "power2.in"
        });
      } else {
        // Mobile: cada pilar se va hacia donde vino (izquierda o derecha)
        const fromLeft = pillar.classList.contains('from-left');
        gsap.to(pillar, {
          x: fromLeft ? -window.innerWidth : window.innerWidth,
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: "power2.in"
        });
      }
    });
  }

  // Método para actualizar animaciones cuando cambie el tamaño de ventana
  handleResize() {
    if (!this.isLoaded) return;

    // Limpiar ScrollTriggers anteriores
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === this.container) {
        trigger.kill();
      }
    });

    // Regenerar pilares con nuevas clases de animación
    this.generatePillars();
    this.setupAnimations();
  }

  // Método para agregar imágenes de fondo (para uso futuro)
  addBackgroundImages(imageUrls) {
    if (!this.container || !Array.isArray(imageUrls)) return;

    const pillars = this.container.querySelectorAll('.service-pillar');
    pillars.forEach((pillar, index) => {
      if (imageUrls[index]) {
        pillar.setAttribute('data-bg-image', imageUrls[index]);
        pillar.style.backgroundImage = `url(${imageUrls[index]})`;
      }
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM Content Loaded - Inicializando ServicesPillarsManager');
  const servicesPillarsManager = new ServicesPillarsManager();

  // Manejar resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      servicesPillarsManager.handleResize();
    }, 250);
  });

  // Hacer disponible globalmente para debug y futuras funcionalidades
  window.servicesPillarsManager = servicesPillarsManager;
});

console.log('📄 Script services-pillars.js cargado');
