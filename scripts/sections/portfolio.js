// Carrusel de clientes en Portafolio

// Variables globales para control de viewport
let isPortfolioSectionVisible = false;
let portfolioAnimationFrame = null; // Cambiado de portfolioAnimationInterval

// Variable global para almacenar los datos de los clientes
let customerData = null; // Inicializar como null para detectar más fácilmente si se cargó

// Información de clientes (respaldo completo del JSON)
// Definiendo aquí para evitar problemas con el scope y para usar cuando se abre con file://
const customerInfo = {
  "colmena.webp": {
    name: "Colmena",
    description: "Empresa dedicada a la apicultura y productos derivados de la miel.",
    logo: "assets/images/customers/colmena.webp",
    presence: "Activo",
    startDate: "03-2023",
    endDate: null,
    marketingPartners: ["ADN Marketing Agency", "LiveLare2"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "el_patron.webp": {
    name: "El Patrón",
    description: "Restaurante de cocina tradicional mexicana.",
    logo: "assets/images/customers/el_patron.webp",
    presence: "Inactivo",
    startDate: "01-2022",
    endDate: "12-2022",
    marketingPartners: ["ADN Marketing Agency"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "la_mariscana.webp": {
    name: "La Mariscana",
    description: "Marisquería y pescadería con productos frescos.",
    logo: "assets/images/customers/la_mariscana.webp",
    presence: "Parcial",
    startDate: "06-2022",
    endDate: null,
    marketingPartners: ["ADN Marketing Agency", "LiveLare2"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "livis.webp": {
    name: "Livis",
    description: "Boutique de moda y accesorios.",
    logo: "assets/images/customers/livis.webp",
    presence: "Activo",
    startDate: "09-2022",
    endDate: null,
    marketingPartners: ["LiveLare2"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "nails.webp": {
    name: "Nails",
    description: "Estudio de uñas y belleza.",
    logo: "assets/images/customers/nails.webp",
    presence: "Activo",
    startDate: "04-2023",
    endDate: null,
    marketingPartners: ["ADN Marketing Agency"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "paqueteria_universal.webp": {
    name: "Paquetería Universal",
    description: "Servicios de mensajería y paquetería nacional.",
    logo: "assets/images/customers/paqueteria_universal.webp",
    presence: "Activo",
    startDate: "02-2022",
    endDate: "11-2022",
    marketingPartners: ["ADN Marketing Agency"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "three_human.webp": {
    name: "Three Human",
    description: "Consultoría y recursos humanos.",
    logo: "assets/images/customers/three_human.webp",
    presence: "Parcial",
    startDate: "10-2022",
    endDate: null,
    marketingPartners: ["LiveLare2"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "titos.webp": {
    name: "Titos",
    description: "Bar y restaurante familiar.",
    logo: "assets/images/customers/titos.webp",
    ig_reels: ["DLYA1jLSDkq"],
    presence: "Activo",
    startDate: "05-2022",
    endDate: null,
    marketingPartners: ["ADN Marketing Agency", "LiveLare2"],
    tiktoks: ["7285737261738675463"],
    gmaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.123456789!2d-106.123456!3d25.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA3JzI0LjQiTiAxMDbCsDA3JzI0LjQiVw!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx",
    address: "Av. Principal 123, Colonia Centro, Ciudad"
  },
  "lonches_la_abuela.webp": {
    name: "La Abuela",
    description: "La abuela es un restaurante familiar que ofrece una experiencia culinaria única con recetas tradicionales y un ambiente acogedor.",
    logo: "assets/images/customers/lonches_la_abuela.webp",
    ig_reels: ["DKLdb3kJUUF"],
    presence: "Inactivo",
    startDate: "05-2025",
    endDate: "06-2025",
    marketingPartners: ["LiveLare2"],
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "tacolare.webp": {
    name: "Tacolare",
    description: "Tacos de carne asada y al pastor con un toque especial.",
    logo: "assets/images/customers/tacolare.webp",
    presence: "Activo",
    startDate: "03-2022",
    endDate: "01-2023",
    marketingPartners: ["ADN Marketing Agency"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "tacos_kissi.webp": {
    name: "Tacos Kissi",
    description: "Tacos gourmet con ingredientes frescos y salsas únicas.",
    logo: "assets/images/customers/tacos_kissi.webp",
    ig_reels: ["CrE2TsEtOOh"],
    presence: "Activo",
    startDate: "11-2022",
    endDate: null,
    marketingPartners: ["LiveLare2"],
    tiktoks: ["7298765432101234567"],
    gmaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.987654321!2d-106.987654!3d25.987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA3JzI0LjQiTiAxMDbCsDA3JzI0LjQiVw!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx",
    address: "Calle Secundaria 456, Colonia Norte, Ciudad"
  },
  "otilias.webp": {
    name: "Otilia's",
    description: "Restarante de lujo con una fusión de sabores internacionales.",
    logo: "assets/images/customers/otilias.webp",
    presence: "Activo",
    startDate: "01-2023",
    endDate: null,
    marketingPartners: ["ADN Marketing Agency", "LiveLare2"],
    ig_reels: ["DLTNfXZSd64", "DKi5uMsMSFQ"],
    tiktoks: ["7312345678901234567", "7387654321098765432"],
    gmaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.3908180249573!2d-99.4513308!3d27.581410599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8661274fa83e6115%3A0x2c0a0e44dfaedbe2!2sOtilia&#39;s%20Brunch%20and%20Dinner%20-%20Laredo!5e0!3m2!1ses-419!2smx!4v1751854707093!5m2!1ses-419!2smx",
    address: "3311 E Del Mar Blvd suite 101, Laredo, TX 78041, Estados Unidos"
  },
  "slimerella.webp": {
    name: "Slimerella",
    description: "Juguetes de Slime y productos de entretenimiento para niños.",
    logo: "assets/images/customers/slimerella.webp",
    presence: "Parcial",
    startDate: "12-2022",
    endDate: null,
    marketingPartners: ["ADN Marketing Agency"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  },
  "nurseyazz.webp": {
    name: "Nurse Yazz",
    description: "Enfermera especializada en cuidados pediátricos y asesoría de salud infantil.",
    logo: "assets/images/customers/nurseyazz.webp",
    presence: "Parcial",
    startDate: "08-2022",
    endDate: null,
    marketingPartners: ["ADN Marketing Agency"],
    ig_reels: null,
    tiktoks: null,
    gmaps: null,
    address: null
  }
};

window.addEventListener('DOMContentLoaded', () => {
  // Configurar observación de viewport para la sección Portfolio
  const portfolioSection = document.querySelector('#Portfolio');

  if (portfolioSection && window.viewportManager) {
    const handlePortfolioVisibility = (isVisible, visibilityRatio, element, isPageHidden = false) => {
      isPortfolioSectionVisible = isVisible && !isPageHidden;

      if (!isPortfolioSectionVisible && portfolioAnimationFrame) {
        // Pausar animaciones cuando no es visible
        cancelAnimationFrame(portfolioAnimationFrame);
        portfolioAnimationFrame = null;
      } else if (isPortfolioSectionVisible && !portfolioAnimationFrame) {
        // Reanudar animaciones cuando es visible
        startPortfolioAnimation();
      }
    };

    window.viewportManager.observeSection(portfolioSection, 'Portfolio', [handlePortfolioVisibility]);
  } else {
    // Fallback si ViewportManager no está disponible
    isPortfolioSectionVisible = true;
  }

  // Cargar datos de clientes desde JSON

  // Función para cargar los datos JSON
  function loadCustomerData() {
    // Usar la ruta absoluta desde la raíz del sitio web

    // Intentar diferentes rutas para encontrar el archivo JSON
    const jsonPath = './data/customers.json';

    return fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        customerData = data; // Asignar los datos cargados
        return data;
      })
      .catch(error => {
        console.error('Error al cargar datos de clientes:', error);

        // Intentar con una ruta alternativa
        return fetch('/data/customers.json')
          .then(response => {
            if (!response.ok) throw new Error(`Error HTTP en segundo intento: ${response.status}`);
            return response.json();
          })
          .then(data => {
            customerData = data;
            return data;
          });
      })
      .catch(error => {
        console.error('Todos los intentos de carga fallaron:', error);

        // Como último recurso, usar los datos embebidos en el JS
        customerData = customerInfo;
      });
  }

  // Detectar si estamos usando file:// (cuando se abre directamente desde archivo)
  const isFileProtocol = window.location.protocol === 'file:';

  if (isFileProtocol) {
    // Si estamos usando el protocolo file://, usar los datos embebidos directamente
    customerData = customerInfo;
  } else {
    // Intentar cargar los datos solo si no estamos usando el protocolo file://
    loadCustomerData()
      .catch(error => {
        console.error('Error al cargar datos de clientes:', error);

        // Intentar con una ruta alternativa
        return fetch('/data/customers.json')
          .then(response => {
            if (!response.ok) throw new Error(`Error HTTP en segundo intento: ${response.status}`);
            return response.json();
          })
          .then(data => {
            customerData = data;
            return data;
          });
      })
      .catch(error => {
        console.error('Todos los intentos de carga fallaron:', error);

        // Como último recurso, usar los datos embebidos en el JS
        customerData = customerInfo;
      });
  }

  // Asegura que GSAP esté disponible globalmente
  const gsap = window.gsap;
  if (typeof gsap === 'undefined') {
    console.error('GSAP no está cargado. Asegúrate de incluir GSAP antes de este script.');
    return;
  }
  const track = document.querySelector('.carousel-track');
  if (!track) {
    console.error('No se encontró .carousel-track');
    return;
  }
  let animation;

  // Esperar a que carguen imágenes originales
  const originals = Array.from(track.children);
  if (originals.length === 0) {
    console.error('No hay imágenes en el carrusel');
    return;
  }
  let loaded = 0;

  function checkAllLoaded() {
    if (loaded === originals.length) {
      initCarousel();
    }
  }

  originals.forEach(img => {
    if (img.complete) {
      loaded++;
    } else {
      img.onload = () => {
        loaded++;
        checkAllLoaded();
      };
    }
  });

  // Iniciar después de un tiempo máximo incluso si no todas las imágenes están cargadas
  setTimeout(() => {
    if (loaded < originals.length) {
      initCarousel();
    }
  }, 3000); // 3 segundos de tiempo máximo de espera

  // Si todas las imágenes ya estaban cargadas, iniciar de inmediato
  checkAllLoaded();

  function assignLogoClickEvents() {
    track.querySelectorAll('img').forEach(img => {
      // Evita asignar el evento más de una vez
      if (img.dataset.modalBound) return;
      img.addEventListener('click', () => {
        const src = img.getAttribute('src');
        // Extraer correctamente el nombre del archivo
        // La ruta completa puede ser algo como "assets/images/customers/colmena.webp"
        const urlParts = src.split('/');
        const fileName = urlParts[urlParts.length - 1]; // Usar el nombre del archivo tal como está
        const key = fileName; // No hacer conversión, usar directamente el nombre del archivo

        // Intentar obtener la información del cliente primero desde customerData
        let info;

        // Primero intenta usar los datos cargados desde el JSON
        if (customerData && customerData[key]) {
          info = { ...customerData[key] }; // Clonar para evitar referencias
        }
        // Si no hay datos JSON o no contiene esta clave, usar los datos embebidos
        else {
          info = {
            name: "Cliente",
            description: "Sin información.",
            logo: src,
            presence: "Inactivo",
            startDate: "01-2022",
            endDate: null,
            ig_reels: [],
            marketingPartners: []
          };

          // Intentar usar la versión de respaldo si existe
          if (key in customerInfo) {
            Object.assign(info, customerInfo[key]);
          }
        }

        // Función para convertir formato "MM-YYYY" a "NombreMes-YYYY"
        function formatearFecha(fechaMMYYYY) {
          if (!fechaMMYYYY) return '';

          const partes = fechaMMYYYY.split('-');
          if (partes.length !== 2) return fechaMMYYYY; // formato inválido, devolver original

          const mes = parseInt(partes[0], 10);
          const año = partes[1];

          const nombresMeses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ];

          if (mes < 1 || mes > 12) return fechaMMYYYY; // mes inválido, devolver original

          return `${nombresMeses[mes - 1]} ${año}`;
        }

        // Obtener la fecha actual para usarla como endDate si es null
        const currentDate = new Date();
        const currentMonthYear = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
        const endDate = info.endDate || currentMonthYear;

        // Convertir fechas a formato con nombre del mes
        const startDateFormateada = formatearFecha(info.startDate);

        // Si no hay fecha de finalización y el cliente está activo, mostrar "Actual" en lugar de la fecha
        let endDateFormateada;
        if (!info.endDate && info.presence === "Activo") {
          endDateFormateada = '<span class="current-badge">Presente</span>';
        } else {
          endDateFormateada = formatearFecha(endDate);
        }

        // Generar el contenido del modal con las tres secciones
        const headerContent = `
          <div class="customer-presence ${info.presence?.toLowerCase() || 'inactivo'}">${info.presence || 'Inactivo'}</div>
          <img src="${info.logo}" alt="${info.name}" style="height:80px; border-radius:50%; margin-bottom:1rem;">
          <h2 style="margin-bottom:0.5rem;">${info.name}</h2>
          <p>${info.description}</p>
        `;

        let bodyContent = '';

        // Función auxiliar para crear secciones de contenido
        function createContentSection(type, items, logoPath, sectionTitle) {
          if (!items || items.length === 0) return '';

          let sectionContent = `
            <div class="content-section ${type}-section">
              <div class="section-header">
                <img src="${logoPath}" alt="${sectionTitle}" class="section-logo">
                <h4>${sectionTitle}</h4>
              </div>
              <div class="content-container ${type}-container">
          `;

          if (type === 'instagram') {
            items.forEach((reelId, index) => {
              sectionContent += `
                <div class="instagram-embed-container">
                  <div class="loading-indicator">
                    <div class="spinner"></div>
                    <span>Cargando reel ${index + 1} de ${items.length}...</span>
                  </div>
                  <iframe src="https://www.instagram.com/reel/${reelId}/embed/" 
                    allowfullscreen 
                    onload="this.previousElementSibling.style.display='none';" 
                    class="instagram-embed"
                    frameborder="0"
                    title="Instagram reel ${index + 1} de ${info.name}"></iframe>
                </div>
              `;
            });
          } else if (type === 'tiktok') {
            items.forEach((tiktokId, index) => {
              sectionContent += `
                <div class="tiktok-embed-container">
                  <div class="loading-indicator">
                    <div class="spinner"></div>
                    <span>Cargando TikTok ${index + 1} de ${items.length}...</span>
                  </div>
                  <iframe src="https://www.tiktok.com/embed/v2/${tiktokId}?lang=es&autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1&theme=dark" 
                    allowfullscreen 
                    onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';" 
                    class="tiktok-embed"
                    scrolling="no"
                    frameborder="0"
                    style="opacity: 0; transition: opacity 0.3s ease;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title="TikTok video ${index + 1} de ${info.name}"></iframe>
                </div>
              `;
            });
          }

          sectionContent += `
              </div>
            </div>
          `;

          return sectionContent;
        }

        // Función para crear la sección de Google Maps
        function createMapsSection(gmaps, address) {
          if (!gmaps) return '';

          return `
            <div class="content-section maps-section">
              <div class="section-header">
                <img src="assets/images/social/google-maps.webp" alt="Google Maps" class="section-logo">
                <h4>Ubicación</h4>
              </div>
              <div class="content-container maps-container">
                <div class="maps-embed-container">
                  <div class="loading-indicator">
                    <div class="spinner"></div>
                    <span>Cargando mapa...</span>
                  </div>
                  <iframe src="${gmaps}" 
                    allowfullscreen 
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    onload="this.previousElementSibling.style.display='none';" 
                    class="maps-embed"
                    title="Ubicación de ${info.name}"></iframe>
                </div>
                ${address ? `<div class="address-info"><p><strong>Dirección:</strong> ${address}</p></div>` : ''}
              </div>
            </div>
          `;
        }

        // Crear las secciones de contenido
        const instagramSection = createContentSection('instagram', info.ig_reels, 'assets/images/social/ig-reels.webp', 'Reels');
        const tiktokSection = createContentSection('tiktok', info.tiktoks, 'assets/images/social/tiktok.webp', 'TikToks');
        const mapsSection = createMapsSection(info.gmaps, info.address);

        // Combinar todas las secciones
        const allSections = [instagramSection, tiktokSection, mapsSection].filter(section => section !== '');

        if (allSections.length > 0) {
          bodyContent = allSections.join('');
        } else {
          bodyContent = `
            <div class="no-content-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M18 19l-5-5-1 1-4-4-5 5"></path>
              </svg>
              <p>No hay contenido adicional disponible.</p>
              <span>Próximamente más información sobre este cliente.</span>
            </div>
          `;
        }

        // Crear contenido para marketing partners si existen
        let partnersContent = '';
        if (info.marketingPartners && info.marketingPartners.length > 0) {
          // Mapear los partners a sus respectivos logos
          const partnerLogos = info.marketingPartners.map(partner => {
            if (partner === "ADN Marketing Agency") {
              return {
                name: partner,
                logoLight: 'assets/images/logos/just_logo_black.png',
                logoDark: 'assets/images/logos/just_logo_white.png'
              };
            } else if (partner === "LiveLare2") {
              return {
                name: partner,
                logoLight: 'assets/images/logos/livelare2.png',
                logoDark: 'assets/images/logos/livelare2.png'
              };
            } else {
              return { name: partner, logoLight: '', logoDark: '' };
            }
          });

          // Generar HTML para los logos de los partners
          const logosHTML = partnerLogos.map((partner, index) => {
            // Si no es el último elemento y hay más de uno, agregar el símbolo "+"
            const plusSymbol = (index < partnerLogos.length - 1 && partnerLogos.length > 1)
              ? '<span class="partner-plus">+</span>'
              : '';

            return `
              <div class="partner-logo-container">
                <img 
                  class="partner-logo partner-logo-light" 
                  src="${partner.logoLight}" 
                  alt="${partner.name}" 
                  title="${partner.name}"
                >
                <img 
                  class="partner-logo partner-logo-dark" 
                  src="${partner.logoDark}" 
                  alt="${partner.name}" 
                  title="${partner.name}"
                >
                ${plusSymbol}
              </div>
            `;
          }).join('');

          partnersContent = `
            <div class="customer-partners">
              <div class="partners-logos-list">
                ${logosHTML}
              </div>
            </div>
          `;
        }

        const footerContent = `
          ${partnersContent}
          <div class="customer-dates">
            <span class="date-range">${startDateFormateada || 'N/A'} – ${endDateFormateada}</span>
          </div>
        `;

        // Limpiar el modal existente
        modalHeader.innerHTML = headerContent;
        modalBody.innerHTML = bodyContent;
        modalFooter.innerHTML = footerContent;

        // Mostrar el modal
        modal.classList.add('show');
        modal.style.display = 'flex';
        modal.focus();
      });
      img.dataset.modalBound = '1';
    });
  }

  function initCarousel() {
    // Duplicar imágenes suficientes para un loop largo
    while (track.children.length < originals.length * 100) {
      originals.forEach(img => {
        const clone = img.cloneNode(true);
        track.appendChild(clone);
      });
    }

    // Asignar eventos de clic a todas las imágenes (originales y clones)
    assignLogoClickEvents();

    // Iniciar la animación del carrusel
    startCarousel();
  }

  function startCarousel() {
    if (animation) animation.kill();
    const gap = 40; // igual que en el CSS
    const totalWidth = Array.from(track.children).reduce((acc, img) => acc + img.offsetWidth + gap, 0);
    track.style.width = totalWidth + 'px';
    gsap.set(track, { x: 0 });
    // Control de velocidad: px/seg
    let velocidadPxPorSegundo = 100; // Default desktop
    if (window.innerWidth <= 800) {
      velocidadPxPorSegundo = 55; // Más lento en mobile
    }
    const duracion = (totalWidth / 2) / velocidadPxPorSegundo;
    animation = gsap.to(track, {
      x: `-=${totalWidth / 2}`,
      duration: duracion,
      ease: 'linear',
      repeat: -1,
      modifiers: {
        x: x => `${parseFloat(x) % (-totalWidth / 2)}px`
      }
    });
  }

  // Solución para el cursor hand persistente en espacios vacíos
  let mouseX = null, mouseY = null;
  let lastHoveredImg = null;
  let mouseUpdateTimeout = null;

  track.addEventListener('mousemove', (e) => {
    // Debounce para mejor rendimiento
    if (mouseUpdateTimeout) {
      clearTimeout(mouseUpdateTimeout);
    }

    mouseUpdateTimeout = setTimeout(() => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, 16); // ~60 FPS solo para mouse tracking
  });
  track.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
    if (lastHoveredImg) {
      lastHoveredImg.classList.remove('js-forced-hover');
      lastHoveredImg = null;
    }
    track.style.cursor = 'default';
  });

  function updateCursorAndHover() {
    // Solo actualizar si la sección es visible
    if (!isPortfolioSectionVisible) return;

    if (mouseX === null || mouseY === null) return;
    let hovered = false;
    let hoveredImg = null;
    track.querySelectorAll('img').forEach(img => {
      const imgRect = img.getBoundingClientRect();
      if (
        mouseX >= imgRect.left &&
        mouseX <= imgRect.right &&
        mouseY >= imgRect.top &&
        mouseY <= imgRect.bottom
      ) {
        hovered = true;
        hoveredImg = img;
      }
    });
    track.style.cursor = hovered ? 'pointer' : 'default';
    if (lastHoveredImg && lastHoveredImg !== hoveredImg) {
      lastHoveredImg.classList.remove('js-forced-hover');
    }
    if (hoveredImg) {
      hoveredImg.classList.add('js-forced-hover');
      lastHoveredImg = hoveredImg;
    } else if (lastHoveredImg) {
      lastHoveredImg.classList.remove('js-forced-hover');
      lastHoveredImg = null;
    }
  }

  // Función optimizada para animación con throttling
  let lastFrameTime = 0;
  const frameInterval = 100; // 100ms entre actualizaciones (10 FPS en lugar de 60)

  function startPortfolioAnimation() {
    function animate(currentTime) {
      if (!isPortfolioSectionVisible) {
        portfolioAnimationFrame = null;
        return;
      }

      // Throttling: solo actualizar cada 100ms
      if (currentTime - lastFrameTime >= frameInterval) {
        updateCursorAndHover();
        lastFrameTime = currentTime;
      }

      portfolioAnimationFrame = requestAnimationFrame(animate);
    }
    portfolioAnimationFrame = requestAnimationFrame(animate);
  }

  // Inicializar la animación solo si la sección es visible
  if (isPortfolioSectionVisible) {
    startPortfolioAnimation();
  }

  // --- Modal de cliente ---
  const modal = document.getElementById('customer-modal');
  const modalHeader = modal.querySelector('.customer-modal__header');
  const modalBody = modal.querySelector('.customer-modal__body');
  const modalFooter = modal.querySelector('.customer-modal__footer');
  const closeBtn = modal.querySelector('.customer-modal__close');
  const backdrop = modal.querySelector('.customer-modal__backdrop');

  function closeModal() {
    modal.classList.remove('show');
    modal.style.display = 'none';
    modalHeader.innerHTML = '';
    modalBody.innerHTML = '';
    modalFooter.innerHTML = '';
  }
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => {
    if (modal.classList.contains('show') && (e.key === 'Escape' || e.key === 'Esc')) closeModal();
  });
});