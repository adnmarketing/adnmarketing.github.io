// Animación de fondo con SVG real de ADN para la sección Team
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si estamos en la sección correcta y si canvas es soportado
  const teamSection = document.getElementById('Team');
  if (!teamSection || !window.CanvasRenderingContext2D) return;

  // Crear el canvas y añadirlo a la sección
  const canvas = document.createElement('canvas');
  canvas.classList.add('team-background-canvas');
  canvas.setAttribute('aria-hidden', 'true');
  teamSection.insertBefore(canvas, teamSection.firstChild);

  // Configurar el tamaño del canvas para cubrir toda la sección
  function resizeCanvas() {
    canvas.width = teamSection.offsetWidth;
    canvas.height = teamSection.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Obtener el contexto 2D para dibujar
  const ctx = canvas.getContext('2d');

  // Cargar el SVG real de ADN
  const svgPath = 'assets/symbols/dna-symbol.svg';
  const svgImage = new Image();

  // Estructura para almacenar los datos del SVG procesado
  let svgData = {
    loaded: false,
    width: 0,
    height: 0,
    aspectRatio: 1 // Asegurar que mantenemos la relación de aspecto
  };

  // Cargar la imagen correctamente
  svgImage.src = svgPath;

  // Clase para manejar cada instancia de ADN
  class DNAShape {
    constructor() {
      this.reset();
    }

    reset() {
      // Posición aleatoria en el canvas
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;

      // Parámetros visuales - símbolos más grandes y visibles con ciclo más rápido
      this.size = Math.random() * 0.25 + 0.20; // Entre 20% y 45% del tamaño de referencia (más grandes y visibles)
      this.opacity = 0;
      this.growing = true;
      this.speed = Math.random() * 0.0015 + 0.0008; // Velocidad más rápida para aparición
      this.maxOpacity = Math.random() * 0.10 + 0.05; // Opacidad máxima aumentada para mayor visibilidad
      this.rotation = Math.random() * 360; // Rotación aleatoria en grados

      // Efecto de relieve - ajustado para ser más visible
      this.offsetX = Math.random() * 2 - 1; // Desplazamiento para sombra
      this.offsetY = Math.random() * 2 - 1; // Desplazamiento para sombra
      this.blurAmount = Math.random() * 1.5 + 2; // Cantidad de desenfoque reducida para mayor nitidez

      // Tiempo de vida reducido
      this.lifeTime = Math.random() * 8000 + 7000; // Entre 7 y 15 segundos
      this.fadeOutDelay = null;
    }

    update() {
      if (!svgData.loaded) return;

      // Actualizar opacidad según estado
      if (this.growing) {
        this.opacity += this.speed;
        if (this.opacity >= this.maxOpacity) {
          this.opacity = this.maxOpacity;
          this.growing = false;

          // Programar el desvanecimiento
          if (!this.fadeOutDelay) {
            this.fadeOutDelay = setTimeout(() => {
              this.growing = false;
            }, this.lifeTime);
          }
        }
      } else {
        this.opacity -= this.speed * 0.5; // Desaparición más rápida
        if (this.opacity <= 0) {
          // Limpiar timeout si existe
          if (this.fadeOutDelay) {
            clearTimeout(this.fadeOutDelay);
            this.fadeOutDelay = null;
          }
          // Reiniciar en una nueva posición
          this.reset();
        }
      }
    }

    draw() {
      if (!svgData.loaded || this.opacity <= 0) return;

      // Configurar propiedades para el efecto de "presión bajo tela"
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const isLight = theme === 'light';

      // Colores y sombras basados en el tema
      const shadowColor = isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)';
      const highlightColor = isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)';

      // Usar un tamaño base mayor para aumentar visibilidad
      const baseSize = 120; // Aumentado para mejor visibilidad

      // Calcular dimensiones manteniendo estrictamente la relación de aspecto
      const getDimensions = () => {
        let width, height;

        if (svgData.width && svgData.height) {
          // Asegurar que se mantiene la proporción exacta
          if (svgData.width >= svgData.height) {
            width = baseSize;
            height = baseSize * (svgData.height / svgData.width);
          } else {
            height = baseSize;
            width = baseSize * (svgData.width / svgData.height);
          }
        } else {
          // Fallback para evitar distorsión
          width = baseSize;
          height = baseSize;
        }

        return { width, height };
      };

      // Dibujar la sombra principal (parte que "presiona" desde atrás)
      ctx.save();
      ctx.globalAlpha = this.opacity * 0.9; // Aumentado para mayor visibilidad
      ctx.translate(this.x + this.offsetX, this.y + this.offsetY);
      ctx.rotate(this.rotation * Math.PI / 180);

      // Usamos el mismo factor de escala para ambos ejes para evitar distorsión
      ctx.scale(this.size, this.size);

      // Configuración para mejorar calidad de renderizado
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = this.blurAmount;
      ctx.shadowOffsetX = this.offsetX * -1;
      ctx.shadowOffsetY = this.offsetY * -1;

      const { width: drawWidth1, height: drawHeight1 } = getDimensions();
      ctx.drawImage(svgImage, -drawWidth1 / 2, -drawHeight1 / 2, drawWidth1, drawHeight1);
      ctx.restore();

      // Añadir un sutil brillo en el lado opuesto para aumentar el efecto 3D
      ctx.save();
      ctx.globalAlpha = this.opacity * 0.6; // Aumentado para mayor visibilidad
      ctx.translate(this.x - this.offsetX * 0.8, this.y - this.offsetY * 0.8);
      ctx.rotate(this.rotation * Math.PI / 180);

      // Mantener la misma proporción para el escalado
      const scaleRatio = this.size * 0.95;
      ctx.scale(scaleRatio, scaleRatio);

      // Configuración para mejorar calidad de renderizado
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.shadowColor = highlightColor;
      ctx.shadowBlur = this.blurAmount * 0.7;
      ctx.shadowOffsetX = this.offsetX * 0.8;
      ctx.shadowOffsetY = this.offsetY * 0.8;

      const { width: drawWidth2, height: drawHeight2 } = getDimensions();
      ctx.drawImage(svgImage, -drawWidth2 / 2, -drawHeight2 / 2, drawWidth2, drawHeight2);
      ctx.restore();
    }
  }

  // Evento de carga del SVG
  svgImage.onload = function () {
    // Guardar dimensiones del SVG y calcular la relación de aspecto
    svgData.width = this.naturalWidth || 800; // Usar el tamaño original del SVG
    svgData.height = this.naturalHeight || 800; // El SVG original es 800x800
    svgData.aspectRatio = svgData.height / svgData.width;
    svgData.loaded = true;

    console.log("SVG cargado correctamente:", svgData.width, "x", svgData.height);

    // Inicializar animación una vez cargada la imagen
    startAnimation();
  };

  // En caso de error al cargar el SVG
  svgImage.onerror = function () {
    console.error('Error al cargar el SVG de ADN');
    // Usar un SVG cuadrado como fallback
    svgData.width = 100;
    svgData.height = 100;
    svgData.aspectRatio = 1;
    svgData.loaded = true;

    console.warn("Usando dimensiones de fallback para el SVG de ADN");

    // Inicializar animación con fallback
    startAnimation();
  };

  // Función para iniciar la animación
  function startAnimation() {
    // Calcular número de instancias para que sean bien visibles (20-25 figuras)
    const numShapes = Math.max(8, Math.floor(canvas.width * canvas.height / 75000)); // Menos figuras pero más visibles
    const dnaShapes = [];

    // Crear instancias iniciales con tiempos escalonados más cortos
    for (let i = 0; i < numShapes; i++) {
      setTimeout(() => {
        dnaShapes.push(new DNAShape());
      }, i * 1000); // Menor retraso entre apariciones
    }

    // Función de animación
    function animate() {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar cada figura
      dnaShapes.forEach(shape => {
        shape.update();
        shape.draw();
      });

      // Continuar animación
      requestAnimationFrame(animate);
    }

    // Iniciar animación
    animate();

    // Crear nuevas figuras periódicamente pero con más tiempo entre cada una
    setInterval(() => {
      // Mantener un número máximo de figuras para no sobrecargar
      if (dnaShapes.length < numShapes * 1.1) { // Limitar más el número máximo de figuras
        dnaShapes.push(new DNAShape());
      }
    }, 6000); // Menos tiempo entre nuevas apariciones
  }
});
