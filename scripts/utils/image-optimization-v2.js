// Optimización de imágenes con formatos modernos AVIF y WebP
// Detecta el soporte del navegador y configura las variables CSS apropiadas

// Configuración de imágenes del equipo
const TEAM_IMAGE_CONFIG = {
  originalExtensions: {
    'rubi': 'JPG',
    'alex': 'jpg',
    'bryan': 'png',
    'gabo': 'png',
    'jack': 'JPG',
    'jota': 'jpg',
    'raul': 'png'
  },
  teamMembers: ['rubi', 'alex', 'bryan', 'gabo', 'jack', 'jota', 'raul'],
  imageTypes: ['original', 'glitch-1', 'glitch-2', 'glitch-3'],
  basePath: '../../assets/images/team/'
};

class ImageOptimizer {
  constructor() {
    this.formatSupport = {
      avif: false,
      webp: false
    };
    this.config = TEAM_IMAGE_CONFIG;
  }

  // Detectar soporte de formatos de imagen
  async detectFormatSupport() {
    // Detectar soporte AVIF
    this.formatSupport.avif = await this.supportsFormat('avif');

    // Detectar soporte WebP
    this.formatSupport.webp = await this.supportsFormat('webp');

    console.log('Soporte de formatos detectado:', this.formatSupport);
  }

  // Función para detectar soporte de formato específico
  supportsFormat(format) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      // URLs de prueba para diferentes formatos
      const testImages = {
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
        webp: 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
      };

      img.src = testImages[format];

      // Timeout de seguridad
      setTimeout(() => resolve(false), 1000);
    });
  }

  // Obtener la extensión de archivo original
  getOriginalExtension(member) {
    return this.config.originalExtensions[member] || 'jpg';
  }

  // Generar la URL de la imagen optimizada
  generateImageUrl(member, imageType) {
    const basePath = this.config.basePath;

    // Nombre base del archivo
    let baseName = `adn-${member}`;
    if (imageType !== 'original') {
      baseName += `-${imageType}`;
    }

    // Para imágenes originales, usar formato optimizado con fallback
    if (imageType === 'original') {
      if (this.formatSupport.avif) {
        return `${basePath}${member}/${baseName}.avif`;
      } else if (this.formatSupport.webp) {
        return `${basePath}${member}/${baseName}.webp`;
      } else {
        // Fallback al formato original
        const originalExt = this.getOriginalExtension(member);
        return `${basePath}${member}/${baseName}.${originalExt}`;
      }
    } else {
      // Para imágenes glitch, también usar formatos modernos si están disponibles
      if (this.formatSupport.avif) {
        return `${basePath}${member}/${baseName}.avif`;
      } else if (this.formatSupport.webp) {
        return `${basePath}${member}/${baseName}.webp`;
      } else {
        // Fallback a PNG para imágenes glitch
        return `${basePath}${member}/${baseName}.png`;
      }
    }
  }

  // Generar URL de fallback para casos donde la imagen optimizada falle
  generateFallbackUrl(member, imageType) {
    const basePath = this.config.basePath;

    let baseName = `adn-${member}`;
    if (imageType !== 'original') {
      baseName += `-${imageType}`;
    }

    if (imageType === 'original') {
      const originalExt = this.getOriginalExtension(member);
      return `${basePath}${member}/${baseName}.${originalExt}`;
    } else {
      return `${basePath}${member}/${baseName}.png`;
    }
  }

  // Actualizar las variables CSS con las imágenes optimizadas
  updateCSSVariables() {
    this.config.teamMembers.forEach(member => {
      this.config.imageTypes.forEach(imageType => {
        const url = this.generateImageUrl(member, imageType);
        const variableName = `--image-${imageType}`;

        // Obtener el selector de la tarjeta
        const cardSelector = `.team-card[data-member="${member}"]`;
        const card = document.querySelector(cardSelector);

        if (card) {
          // Crear fallback automático
          const fallbackUrl = this.generateFallbackUrl(member, imageType);
          const cssValue = `url('${url}'), url('${fallbackUrl}')`;

          card.style.setProperty(variableName, cssValue);
          console.log(`✅ Actualizado ${member} ${imageType}: ${url}`);
        }
      });
    });
  }

  // Función para precargar imágenes críticas
  async preloadCriticalImages() {
    const promises = [];

    // Precargar solo las imágenes originales (las más importantes)
    this.config.teamMembers.forEach(member => {
      const url = this.generateImageUrl(member, 'original');
      promises.push(this.preloadImage(url));
    });

    try {
      await Promise.all(promises);
      console.log('✅ Imágenes críticas precargadas');
    } catch (error) {
      console.warn('⚠️ Error precargando algunas imágenes:', error);
    }
  }

  // Función para precargar una imagen específica
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Error cargando: ${url}`));
      img.src = url;
    });
  }

  // Función para verificar que una imagen existe
  async checkImageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Función para verificar la estructura de archivos
  async verifyImageStructure() {
    console.log('🔍 Verificando estructura de archivos de imágenes...');

    for (const member of this.config.teamMembers) {
      console.log(`\n👤 Verificando ${member.toUpperCase()}:`);

      for (const imageType of this.config.imageTypes) {
        const avifUrl = this.generateImageUrl(member, imageType);
        const webpUrl = this.generateImageUrl(member, imageType).replace('.avif', '.webp');
        const fallbackUrl = this.generateFallbackUrl(member, imageType);

        const avifExists = await this.checkImageExists(avifUrl);
        const webpExists = await this.checkImageExists(webpUrl);
        const fallbackExists = await this.checkImageExists(fallbackUrl);

        const avifIcon = avifExists ? '✅' : '❌';
        const webpIcon = webpExists ? '✅' : '❌';
        const fallbackIcon = fallbackExists ? '✅' : '❌';

        console.log(`  ${imageType}: AVIF ${avifIcon} | WebP ${webpIcon} | Fallback ${fallbackIcon}`);
      }
    }
  }

  // Inicializar el optimizador
  async init() {
    console.log('🚀 Inicializando optimizador de imágenes...');

    // Detectar soporte de formatos
    await this.detectFormatSupport();

    // Verificar estructura de archivos (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      await this.verifyImageStructure();
    }

    // Actualizar variables CSS
    this.updateCSSVariables();

    // Precargar imágenes críticas
    await this.preloadCriticalImages();

    console.log('✅ Optimizador de imágenes inicializado correctamente');
  }
}

// Inicializar el optimizador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  const optimizer = new ImageOptimizer();
  await optimizer.init();
});

// Exportar para uso en otros módulos si es necesario
window.ImageOptimizer = ImageOptimizer;
