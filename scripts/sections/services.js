// Nueva gestión de servicios con tarjetas fijas y contenido dinámico
class ServicesManager {
  constructor() {
    // Evitar múltiples instancias
    if (ServicesManager.instance) {
      console.log('ServicesManager already exists, returning existing instance');
      return ServicesManager.instance;
    }
    
    ServicesManager.instance = this;
    this.services = [];
    this.serviceCards = [];
    this.init();
  }

  async init() {
    try {
      // Cargar datos de servicios
      await this.loadServices();
      
      // Obtener las tarjetas existentes
      this.serviceCards = document.querySelectorAll('.service-card');
      
      if (!this.serviceCards.length) {
        console.warn('Service cards not found');
        return;
      }

      // Llenar el contenido de las tarjetas
      await this.populateServiceCards();
      
      console.log('Services loaded successfully');
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  }

  async loadServices() {
    try {
      const response = await fetch('data/ourServices.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.services = await response.json();
    } catch (error) {
      console.error('Error loading services data:', error);
      // Fallback data en caso de error
      this.services = [
        {
          service: "Contenido Visual Profesional",
          description: "Capturamos lo mejor de tu marca con fotografía y video de alta calidad para redes sociales, menús, eventos y más.",
          icon: "assets/images/services/content_visual.svg"
        },
        {
          service: "Producción y Edición de Video",
          description: "Creamos reels, spots y contenido emocional con narrativa, edición profesional, efectos, branding y llamados a la acción.",
          icon: "assets/images/services/video_production.svg"
        },
        {
          service: "Diseño Gráfico Estratégico",
          description: "Desde flyers, carruseles y contenido visual para redes, hasta identidad visual completa para presentar tu marca con impacto.",
          icon: "assets/images/services/graphic_design.svg"
        },
        {
          service: "Gestión de Redes Sociales",
          description: "Creamos calendarios de contenido, respondemos mensajes, gestionamos comentarios y hacemos crecer tu comunidad.",
          icon: "assets/images/services/social_media_management.svg"
        },
        {
          service: "Publicidad Digital",
          description: "Diseñamos campañas desde la estrategia hasta el monitoreo. Segmentamos audiencias, optimizamos resultados y entregamos reportes mensuales.",
          icon: "assets/images/services/digital_advertising.svg"
        },
        {
          service: "Consultoría y Estrategia de Marca",
          description: "Te ayudamos a definir el ADN de tu negocio: diferenciadores, tono de comunicación, branding, organización interna y más.",
          icon: "assets/images/services/brand_strategy.svg"
        },
        {
          service: "Automatización y Seguimiento",
          description: "Implementamos sistemas de respuesta automática, asesoría de ventas, y seguimiento de leads para que nunca pierdas una oportunidad.",
          icon: "assets/images/services/automation_followup.svg"
        }
      ];
    }
  }

  async loadSVG(svgPath) {
    try {
      const response = await fetch(svgPath);
      if (!response.ok) {
        throw new Error(`Failed to load SVG: ${svgPath}`);
      }
      const svgContent = await response.text();
      return svgContent;
    } catch (error) {
      console.warn(`Could not load SVG ${svgPath}:`, error);
      // Return a fallback SVG icon
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z" fill="currentColor"/>
      </svg>`;
    }
  }

  async populateServiceCards() {
    if (!this.serviceCards.length || !this.services.length) {
      return;
    }

    // Verificar si ya están pobladas para evitar duplicación
    const firstCard = this.serviceCards[0];
    const firstTitle = firstCard.querySelector('.service-title');
    if (firstTitle && firstTitle.textContent.trim() !== '') {
      console.log('Service cards already populated, skipping...');
      return;
    }

    // Llenar cada tarjeta con su respectivo contenido
    for (let i = 0; i < this.serviceCards.length && i < this.services.length; i++) {
      const card = this.serviceCards[i];
      const service = this.services[i];
      
      await this.populateServiceCard(card, service, i);
    }
  }

  async populateServiceCard(card, service, index) {
    // Obtener elementos de la tarjeta
    const iconContainer = card.querySelector('.service-icon');
    const titleElement = card.querySelector('.service-title');
    const descriptionElement = card.querySelector('.service-description');

    // Cargar y insertar el SVG
    if (iconContainer) {
      const svgContent = await this.loadSVG(service.icon);
      iconContainer.innerHTML = svgContent;
    }

    // Insertar título y descripción
    if (titleElement) {
      titleElement.textContent = service.service;
    }

    if (descriptionElement) {
      descriptionElement.textContent = service.description;
    }

    // Agregar animación de entrada con delay
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    }, index * 100); // Stagger animation
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ServicesManager();
});

// Inicialización única con verificación de estado
function initServices() {
  // Verificar que no se haya inicializado ya
  if (window.servicesManagerInitialized) {
    return;
  }
  
  window.servicesManagerInitialized = true;
  new ServicesManager();
}

// Inicializar según el estado del DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initServices);
} else {
  initServices();
}
