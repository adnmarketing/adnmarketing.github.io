// Configuración de imágenes del equipo
export const TEAM_IMAGE_CONFIG = {
  // Extensiones de archivos originales para cada miembro
  originalExtensions: {
    'rubi': 'JPG',
    'alex': 'jpg',
    'bryan': 'png',
    'gabo': 'png',
    'jack': 'JPG',
    'jota': 'jpg',
    'raul': 'png'
  },

  // Lista de todos los miembros del equipo
  teamMembers: ['rubi', 'alex', 'bryan', 'gabo', 'jack', 'jota', 'raul'],

  // Tipos de imágenes disponibles
  imageTypes: ['original', 'glitch-1', 'glitch-2', 'glitch-3'],

  // Formatos de imagen soportados (en orden de prioridad)
  supportedFormats: ['avif', 'webp'],

  // Ruta base para las imágenes del equipo
  basePath: '../../assets/images/team/',

  // Configuración de precarga
  preloadConfig: {
    // Solo precargar imágenes originales por defecto
    preloadTypes: ['original'],
    // Precargar imágenes glitch al hacer hover
    lazyLoadGlitch: true
  }
};

// Configuración de detección de formatos
export const FORMAT_DETECTION_CONFIG = {
  // Imágenes de prueba para detección de soporte
  testImages: {
    avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
    webp: 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
  },

  // Timeout para detección de formato
  detectionTimeout: 1000
};
