// Script para el modal de detalles de los miembros del equipo
// Usa GSAP para animaciones fluidas y profesionales

document.addEventListener('DOMContentLoaded', () => {
  // Función para crear el efecto de partículas
  function createParticleAnimation(parentElement, numParticles = 15) {
    // Crear partículas
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'team-modal__particle';

      // Tamaño aleatorio con partículas más grandes
      const size = Math.random() * 10 + 5;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Color aleatorio con más variedad y brillo
      const colors = [
        '#ff3366', '#00ccff', '#ffcc00', '#33cc33', '#cc33ff',
        '#ff9900', '#00ffcc', '#3399ff', '#ff66cc', '#66ff99'
      ];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Añadir brillo
      particle.style.boxShadow = `0 0 ${Math.floor(size / 2)}px ${particle.style.backgroundColor}`;

      // Posición inicial (centro del modal o bordes para efecto de entrada)
      const rect = parentElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Algunas partículas desde el centro, otras desde los bordes
      let startX = centerX;
      let startY = centerY;
      if (i % 3 === 0) {
        startX = rect.left + Math.random() * rect.width;
        startY = rect.top + Math.random() * rect.height;
      }

      particle.style.position = 'absolute';
      particle.style.top = startY + 'px';
      particle.style.left = startX + 'px';
      particle.style.borderRadius = '50%';
      particle.style.zIndex = '2000';

      document.body.appendChild(particle);

      // Animación con GSAP más dinámica
      gsap.to(particle, {
        x: (Math.random() - 0.5) * window.innerWidth * 0.8,
        y: (Math.random() - 0.5) * window.innerHeight * 0.8,
        opacity: 0,
        scale: Math.random() * 2.5 + 0.8,
        rotation: Math.random() * 360,
        duration: Math.random() * 1.5 + 1,
        ease: 'power3.out',
        delay: Math.random() * 0.3,
        onComplete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      });
    }
  }

  // Variable para controlar el intervalo de glitch del nombre
  let nameGlitchTimeout;

  // Función para activar el efecto glitch en el nombre
  function activateNameGlitch(nameElement) {
    if (!nameElement) return;

    // Limpiar timeout anterior si existe
    if (nameGlitchTimeout) {
      clearTimeout(nameGlitchTimeout);
      nameGlitchTimeout = null;
    }

    // Función que activa el glitch brevemente
    function triggerGlitch() {
      nameElement.classList.add('active');

      // Eliminar la clase después de completar la animación
      setTimeout(() => {
        nameElement.classList.remove('active');
      }, 200);

      // Programar el próximo glitch en un intervalo aleatorio entre 1 y 3 segundos
      const nextGlitchTime = Math.random() * 2000 + 1000; // Entre 1000ms y 3000ms

      nameGlitchTimeout = setTimeout(triggerGlitch, nextGlitchTime);
    }

    // Iniciar el primer glitch después de un breve retraso
    setTimeout(triggerGlitch, 500);
  }

  // Variable para almacenar los datos cargados desde el JSON
  let teamMembersData = {};

  // Función para cargar datos desde el JSON
  async function loadTeamData() {
    try {
      const response = await fetch('/data/team.json');
      if (!response.ok) {
        throw new Error(`Error cargando datos del equipo: ${response.statusText}`);
      }

      const jsonData = await response.json();

      // Convertir los datos del JSON al formato usado por el modal
      Object.keys(jsonData).forEach(memberId => {
        const member = jsonData[memberId];

        // Crear estructura de socials a partir del objeto en el JSON
        const socials = [];
        if (member.Socials) {
          Object.keys(member.Socials).forEach(platform => {
            const username = member.Socials[platform];
            if (username) {
              let url = '';

              // Construir URLs basadas en la plataforma
              switch (platform) {
                case 'linkedin':
                  url = `https://www.linkedin.com/in/${username}/`;
                  break;
                case 'instagram':
                  url = `https://www.instagram.com/${username}/`;
                  break;
                case 'twitter':
                  url = `https://twitter.com/${username}`;
                  break;
                case 'facebook':
                  url = `https://www.facebook.com/${username}`;
                  break;
                case 'github':
                  url = `https://github.com/${username}`;
                  break;
                case 'behance':
                  url = `https://www.behance.net/${username}`;
                  break;
                case 'dribbble':
                  url = `https://dribbble.com/${username}`;
                  break;
                case 'vimeo':
                  url = `https://vimeo.com/${username}`;
                  break;
                case 'youtube':
                  url = `https://www.youtube.com/${username}`;
                  break;
                default:
                  url = username; // Si es una URL completa
              }

              socials.push({ platform, url });
            }
          });
        }

        // Crear objeto con el formato que espera el modal
        teamMembersData[memberId] = {
          fullName: member.FullName,
          role: member.Role,
          skills: member.Skills || [],
          quote: member.Quote || "",
          image: member.ImagePath || `assets/images/team/${memberId}/${memberId}-nobg.webp`,
          socials: socials
        };
      });

      console.log('Datos del equipo cargados correctamente', teamMembersData);
    } catch (error) {
      console.error('Error al cargar datos del equipo:', error);
      // Usar datos fallback por si hay error al cargar el JSON
      teamMembersData = {
        'rubi': {
          fullName: 'Rubí Urioste',
          role: 'CEO DE ADN',
          skills: [
            'Pensamiento Estratégico y Estructura de Paquetes',
            'Enfoque en Resultados',
            'Dominio de Redes Sociales',
            'Copywriting Emocional y Comercial',
            'Storytelling para Branding',
            'Liderazgo de Proyecto y Trabajo en Equipo',
            'Comunicación con Clientes'
          ],
          quote: '"Trabajamos con excelencia no para agradar a los hombres, sino porque servimos al Señor en todo lo que hacemos."',
          image: 'assets/images/team/rubi/rubi-nobg.webp',
          socials: [
            { platform: 'linkedin', url: 'https://www.linkedin.com/in/rubi-urioste/' },
            { platform: 'instagram', url: 'https://www.instagram.com/adn.agency/' }
          ]
        },
      };
    }
  }

  // Cargar datos del equipo cuando se inicializa
  loadTeamData();

  // Datos fallback por si no se cargan correctamente los datos del JSON
  if (Object.keys(teamMembersData).length === 0) {
    teamMembersData = {
      'rubi': {
        fullName: 'Rubí Urioste',
        role: 'CEO DE ADN',
        skills: [
          'Pensamiento Estratégico y Estructura de Paquetes',
          'Enfoque en Resultados',
          'Dominio de Redes Sociales',
          'Copywriting Emocional y Comercial',
          'Storytelling para Branding',
          'Liderazgo de Proyecto y Trabajo en Equipo',
          'Comunicación con Clientes'
        ],
        quote: '"Trabajamos con excelencia no para agradar a los hombres, sino porque servimos al Señor en todo lo que hacemos."',
        image: 'assets/images/team/rubi/rubi-nobg.webp',
        socials: [
          { platform: 'linkedin', url: 'https://www.linkedin.com/in/rubi-urioste/' },
          { platform: 'instagram', url: 'https://www.instagram.com/adn.agency/' }
        ]
      },
      'jack': {
        fullName: 'Jack Holden',
        role: 'Director Creativo',
        skills: [
          'Diseño Gráfico y Composición Visual',
          'Branding y Desarrollo de Identidad',
          'Dirección Artística',
          'UI/UX para Redes Sociales',
          'Fotografía y Edición',
          'Ilustración Digital',
          'Motion Graphics'
        ],
        quote: '"El diseño no es solo cómo se ve, sino cómo funciona. Buscamos que cada pieza visual cuente una historia coherente con la marca."',
        image: 'assets/images/team/jack/jack-nobg.webp',
        socials: [
          { platform: 'behance', url: 'https://www.behance.net/' },
          { platform: 'instagram', url: 'https://www.instagram.com/adn.agency/' }
        ]
      },
      'gabo': {
        fullName: 'Gabriel Mendoza',
        role: 'Director de Marketing',
        skills: [
          'Estrategia de Contenidos',
          'Campañas de Publicidad Digital',
          'Análisis de Datos y Métricas',
          'SEO y SEM',
          'Email Marketing',
          'Segmentación de Audiencias',
          'Growth Hacking'
        ],
        quote: '"Los números cuentan historias. Nuestra misión es traducir esas historias en acciones que impulsen el crecimiento de nuestros clientes."',
        image: 'assets/images/team/gabo/gabo-nobg.webp',
        socials: [
          { platform: 'linkedin', url: 'https://www.linkedin.com/' },
          { platform: 'instagram', url: 'https://www.instagram.com/adn.agency/' }
        ]
      },
      'jota': {
        fullName: 'José Antonio Pérez',
        role: 'Desarrollador Web',
        skills: [
          'Desarrollo Frontend (HTML, CSS, JS)',
          'Frameworks JavaScript (React, Vue)',
          'Diseño Responsivo',
          'Optimización de Performance Web',
          'Animaciones Interactivas',
          'Integración de APIs',
          'WordPress y CMS'
        ],
        quote: '"La mejor experiencia de usuario es aquella que no se nota. Trabajamos para que la tecnología sea transparente y el mensaje brille."',
        image: 'assets/images/team/jota/jota-nobg.webp',
        socials: [
          { platform: 'github', url: 'https://github.com/' },
          { platform: 'linkedin', url: 'https://www.linkedin.com/' }
        ]
      },
      'alex': {
        fullName: 'Alejandra Guzmán',
        role: 'Community Manager',
        skills: [
          'Gestión de Comunidades Digitales',
          'Creación de Contenido para RRSS',
          'Planificación Editorial',
          'Análisis de Métricas Sociales',
          'Atención al Cliente Digital',
          'Gestión de Crisis en Redes',
          'Organización de Campañas Sociales'
        ],
        quote: '"Las redes sociales son conversaciones, no monólogos. Nuestra estrategia se centra en crear diálogos significativos con cada audiencia."',
        image: 'assets/images/team/alex/alex-nobg.webp',
        socials: [
          { platform: 'instagram', url: 'https://www.instagram.com/adn.agency/' },
          { platform: 'twitter', url: 'https://twitter.com/' }
        ]
      },
      'bryan': {
        fullName: 'Bryan Rodríguez',
        role: 'Fotógrafo y Videógrafo',
        skills: [
          'Fotografía de Producto y Retrato',
          'Producción y Edición de Video',
          'Dirección de Arte Visual',
          'Post-producción Avanzada',
          'Composición y Encuadre Creativo',
          'Iluminación Técnica',
          'Motion Graphics'
        ],
        quote: '"Una imagen vale más que mil palabras, pero una imagen bien pensada puede cambiar la percepción de una marca completa."',
        image: 'assets/images/team/bryan/bryan-nobg.webp',
        socials: [
          { platform: 'instagram', url: 'https://www.instagram.com/' },
          { platform: 'vimeo', url: 'https://vimeo.com/' }
        ]
      },
      'raul': {
        fullName: 'Raúl Méndez',
        role: 'Especialista en Publicidad Digital',
        skills: [
          'Gestión de Campañas PPC',
          'Facebook & Instagram Ads',
          'Google Ads y SEM',
          'Análisis y Optimización de Conversiones',
          'Segmentación de Audiencias',
          'Retargeting Estratégico',
          'Análisis de ROI y KPIs'
        ],
        quote: '"La publicidad efectiva no interrumpe, conecta. Generamos conversiones mediante mensajes precisos a audiencias cualificadas."',
        image: 'assets/images/team/raul/raul-nobg.webp',
        socials: [
          { platform: 'linkedin', url: 'https://www.linkedin.com/' },
          { platform: 'twitter', url: 'https://twitter.com/' }
        ]
      }
    };

    // Referencias a elementos del DOM
    const teamModal = document.getElementById('team-modal');
    const modalBackdrop = teamModal.querySelector('.team-modal__backdrop');
    const modalClose = teamModal.querySelector('.team-modal__close');
    const modalCard = teamModal.querySelector('.team-modal__card');
    const teamCards = document.querySelectorAll('.team-card[data-member]');

    // Inicialización del estado del modal para evitar animaciones extrañas en la primera apertura
    gsap.set(modalCard, {
      y: 30,
      opacity: 0,
      rotationX: 10,
      clearProps: "transform" // Esto asegura que no haya transformaciones residuales
    });

    gsap.set(teamModal.querySelector('.team-modal__image'), {
      x: 100,
      y: 50,
      opacity: 0,
      scale: 0.8
    });

    // Función para obtener ícono de red social según plataforma
    function getSocialIcon(platform) {
      const icons = {
        'instagram': '<i class="fab fa-instagram"></i>',
        'linkedin': '<i class="fab fa-linkedin-in"></i>',
        'twitter': '<i class="fab fa-twitter"></i>',
        'facebook': '<i class="fab fa-facebook-f"></i>',
        'github': '<i class="fab fa-github"></i>',
        'behance': '<i class="fab fa-behance"></i>',
        'dribbble': '<i class="fab fa-dribbble"></i>',
        'vimeo': '<i class="fab fa-vimeo-v"></i>',
        'youtube': '<i class="fab fa-youtube"></i>'
      };

      return icons[platform] || '<i class="fas fa-link"></i>';
    }

    // Función para ajustar el ancho del contenido de texto según la superposición con la imagen
    function adjustTextContentWidth() {
      // Solo ejecutar si el modal está activo
      if (!teamModal.classList.contains('active')) return;

      const modalWidth = modalCard.offsetWidth;
      const imageContainer = teamModal.querySelector('.team-modal__image-container');
      const skillsContainer = teamModal.querySelector('.team-modal__skills');
      const quoteContainer = teamModal.querySelector('.team-modal__quote');
      const socialContainer = teamModal.querySelector('.team-modal__social');

      if (!imageContainer || !skillsContainer || !quoteContainer) return;

      // Obtener la posición de la imagen desde la derecha
      const imageRect = imageContainer.getBoundingClientRect();
      const cardRect = modalCard.getBoundingClientRect();

      // Calcular el espacio disponible (distancia desde el borde izquierdo hasta la imagen)
      const availableWidth = imageRect.left - cardRect.left - 20; // 20px de margen de seguridad

      // Convertir a porcentaje del ancho del modal
      const widthPercentage = Math.floor((availableWidth / cardRect.width) * 100);

      // Detectar si estamos en mobile
      const isMobile = window.innerWidth < 768;

      // Aplicar ancho según el dispositivo
      if (isMobile) {
        // En dispositivos móviles, usar un ancho mucho mayor
        const mobileWidth = window.innerWidth < 480 ? '95%' : '90%';
        skillsContainer.style.width = mobileWidth;
        quoteContainer.style.width = '70%'; // La cita puede ser algo más corta
        if (socialContainer) {
          socialContainer.style.width = '70%';
          socialContainer.style.justifyContent = 'flex-start';
        }
      } else if (widthPercentage >= 50 && widthPercentage <= 80) {
        // En desktop, usar el cálculo dinámico
        const newWidth = `${widthPercentage}%`;
        skillsContainer.style.width = newWidth;
        quoteContainer.style.width = newWidth;
        if (socialContainer) {
          socialContainer.style.width = newWidth;
          socialContainer.style.justifyContent = 'flex-start';
        }
      }
    }

    // Función para abrir el modal con datos de un miembro
    function openTeamModal(memberId) {
      const memberData = teamMembersData[memberId];

      if (!memberData) {
        console.error(`No se encontraron datos para el miembro: ${memberId}`);
        return;
      }

      // Actualizar contenido del modal
      const nameElement = teamModal.querySelector('.team-modal__name');
      nameElement.textContent = memberData.fullName;
      nameElement.className = 'team-modal__name text-glitch';
      nameElement.setAttribute('data-text', memberData.fullName);

      teamModal.querySelector('.team-modal__role').textContent = memberData.role;

      // Llenar la lista de habilidades
      const skillsList = teamModal.querySelector('.team-modal__skills-list');
      skillsList.innerHTML = '';
      memberData.skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
      });

      // Actualizar cita
      teamModal.querySelector('.team-modal__quote').textContent = memberData.quote;

      // Actualizar imagen con precarga para ajustar layout
      const modalImage = teamModal.querySelector('.team-modal__image');

      // Crear imagen temporal para precarga y verificar dimensiones
      const preloadImage = new Image();
      preloadImage.onload = () => {
        // Ajustar el contenedor según la relación de aspecto de la imagen
        const imageContainer = teamModal.querySelector('.team-modal__image-container');
        const aspectRatio = preloadImage.height / preloadImage.width;

        // Si es una imagen alta y estrecha, ajustar el ancho del contenedor
        if (aspectRatio > 1.5) {
          imageContainer.style.width = '40%';
        } else {
          imageContainer.style.width = '45%';
        }

        // Asegurar que la imagen aparezca con la animación correcta
        modalImage.style.opacity = '0';
        setTimeout(() => {
          modalImage.style.opacity = '1';
        }, 300);
      };

      preloadImage.src = memberData.image;
      modalImage.src = memberData.image;
      modalImage.alt = memberData.fullName;

      // Crear contenedor de redes sociales si no existe
      let socialContainer = teamModal.querySelector('.team-modal__social');
      if (!socialContainer) {
        socialContainer = document.createElement('div');
        socialContainer.className = 'team-modal__social';
        teamModal.querySelector('.team-modal__footer').appendChild(socialContainer);
      } else {
        socialContainer.innerHTML = '';
      }

      // Añadir iconos de redes sociales
      if (memberData.socials && memberData.socials.length > 0) {
        memberData.socials.forEach(social => {
          const socialLink = document.createElement('a');
          socialLink.href = social.url;
          socialLink.target = '_blank';
          socialLink.rel = 'noopener noreferrer';
          socialLink.innerHTML = getSocialIcon(social.platform);
          socialLink.setAttribute('aria-label', `${social.platform} de ${memberData.fullName}`);
          socialContainer.appendChild(socialLink);
        });
      }

      // Reinicializar estados antes de mostrar para garantizar consistencia
      gsap.set(modalCard, {
        y: 80,
        opacity: 0,
        rotationX: 20,
        scale: 0.95,
        transformOrigin: "center bottom"
      });

      gsap.set(teamModal.querySelector('.team-modal__image'), {
        x: 100,
        y: 50,
        opacity: 0,
        scale: 0.8
      });

      gsap.set(modalBackdrop, { opacity: 0 });

      // Mostrar el modal (primero para evitar parpadeos)
      teamModal.classList.add('active');

      // Animar con GSAP
      const tl = gsap.timeline({
        // Asegurar que no haya transformaciones residuales al finalizar
        onComplete: () => {
          gsap.set(modalCard, { clearProps: "transform" });
          // Ajustar el ancho del texto en relación a la imagen
          setTimeout(adjustTextContentWidth, 100); // Pequeño retraso para asegurar que todo se ha renderizado
        }
      });

      // Animar backdrop con efecto de desenfoque
      tl.to(modalBackdrop, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut"
      });

      // Entrada del modal con efecto de rebote suave
      tl.to(modalCard, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.2");

      // Entrada de la imagen con efecto más suave, sin crecimiento/encogimiento
      tl.to(teamModal.querySelector('.team-modal__image'), {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.35");

      // Animar habilidades con stagger para efecto secuencial más dinámico
      tl.fromTo(teamModal.querySelectorAll('.team-modal__skills-list li'),
        { opacity: 0, x: -30, y: 10 },
        { opacity: 1, x: 0, y: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" },
        "-=0.4"
      );

      // Animar quote con efecto de fade + slide más suave
      tl.fromTo(teamModal.querySelector('.team-modal__quote'),
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );

      // Animar iconos sociales con efecto de rebote más pronunciado
      if (socialContainer.children.length) {
        tl.fromTo(socialContainer.children,
          { scale: 0, opacity: 0, rotation: -30 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5, stagger: 0.08, ease: "back.out(2.5)" },
          "-=0.25"
        );
      }

      // Crear efecto de partículas más vistoso después de la animación principal
      setTimeout(() => {
        createParticleAnimation(modalCard, 25);
      }, 300);

      // Activar el efecto glitch en el nombre (ya tenemos la referencia de arriba)
      activateNameGlitch(nameElement);

      // Asegurarse de que el modal tiene el foco para accesibilidad
      modalCard.focus();

      // Evitar scroll en el body
      document.body.style.overflow = 'hidden';
    }

    // No necesitamos efectos especiales adicionales para el modal

    // Función para cerrar el modal
    function closeTeamModal() {
      // Detener el efecto glitch del nombre
      if (nameGlitchTimeout) {
        clearTimeout(nameGlitchTimeout);
        nameGlitchTimeout = null;
      }

      // Timeline para animación de salida
      const tl = gsap.timeline({
        onComplete: () => {
          teamModal.classList.remove('active');
          document.body.style.overflow = '';

          // Reiniciar los estados para la próxima apertura
          gsap.set(modalCard, {
            y: 80,
            opacity: 0,
            rotationX: 20,
            scale: 0.95,
            transformOrigin: "center bottom",
            clearProps: "transform"
          });

          gsap.set(teamModal.querySelector('.team-modal__image'), {
            x: 100,
            y: 50,
            opacity: 0,
            scale: 0.8
          });
        }
      });

      // Animaciones de salida coordinadas
      // Primero desaparecen los elementos internos
      tl.to(teamModal.querySelector('.team-modal__quote'), {
        opacity: 0, y: 10, duration: 0.2, ease: "power2.in"
      }, 0);

      tl.to(teamModal.querySelectorAll('.team-modal__skills-list li'), {
        opacity: 0, x: -10, duration: 0.2, stagger: 0.03, ease: "power2.in"
      }, 0);

      // Luego la imagen
      tl.to(teamModal.querySelector('.team-modal__image'), {
        x: 80, opacity: 0, duration: 0.3, ease: "power3.in"
      }, 0.1);

      // Finalmente el modal completo
      tl.to(modalCard, {
        y: 40, opacity: 0, duration: 0.3, scale: 0.95, rotationX: 10, ease: "power3.in"
      }, 0.2);

      tl.to(modalBackdrop, {
        opacity: 0, duration: 0.3
      }, 0.25);
    }

    // Efecto de hover simplificado para las tarjetas sin efectos visuales adicionales
    function createHoverEffect(element) {
      // No se implementa ningún efecto adicional ya que las transiciones
      // se manejan completamente por CSS
    }

    // Asignar evento click a cada tarjeta
    teamCards.forEach(card => {
      // Solo añadir el evento si no tiene uno ya (para evitar duplicados)
      card.addEventListener('click', () => {
        const memberId = card.getAttribute('data-member');
        if (memberId) {
          // Animación de clic en la tarjeta
          gsap.timeline()
            .to(card, {
              scale: 0.95,
              duration: 0.1
            })
            .to(card, {
              scale: 1.05,
              duration: 0.1
            })
            .to(card, {
              scale: 1,
              duration: 0.2
            });

          openTeamModal(memberId);
        }
      });

      // Aplicar efecto de hover a las tarjetas
      createHoverEffect(card);
    });

    // Cerrar modal con click en botón
    modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeTeamModal();
    });

    // Añadir evento touch explícito para dispositivos móviles
    modalClose.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeTeamModal();
    });

    // Cerrar modal con click en backdrop
    modalBackdrop.addEventListener('click', closeTeamModal);

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && teamModal.classList.contains('active')) {
        closeTeamModal();
      }
    });

    // Detener propagación de clics en el contenido del modal
    modalCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Añadir cursor pointer a las tarjetas para indicar que son clickeables
    teamCards.forEach(card => {
      card.style.cursor = 'pointer';
      // Añadir atributo de accesibilidad
      card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('tabindex', '0');
    });

    // Permitir activar el modal con teclado (accesibilidad)
    teamCards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        // Activar con Enter o Space
        if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
          e.preventDefault();
          const memberId = card.getAttribute('data-member');
          if (memberId) {
            openTeamModal(memberId);
          }
        }
      });
    });

    // Detectar cambios de tamaño de ventana para ajustar el contenido
    window.addEventListener('resize', () => {
      if (teamModal.classList.contains('active')) {
        adjustTextContentWidth();
      }
    });
  }
});
