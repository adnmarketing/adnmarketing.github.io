// Pruebas para el Sistema de Optimización por Viewport
// Solo se ejecuta en modo desarrollo

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {

  console.log('🧪 Iniciando pruebas del Sistema de Optimización por Viewport');

  // Esperar a que el DOM esté cargado
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      runViewportTests();
    }, 2000); // Esperar 2 segundos para que todo esté inicializado
  });

  function runViewportTests() {
    console.log('🚀 Ejecutando pruebas del ViewportManager...');

    // Test 1: Verificar que ViewportManager está disponible
    console.log('📋 Test 1: ViewportManager disponible');
    if (window.viewportManager) {
      console.log('✅ ViewportManager inicializado correctamente');
    } else {
      console.error('❌ ViewportManager no encontrado');
      return;
    }

    // Test 2: Verificar secciones registradas
    console.log('📋 Test 2: Verificar secciones registradas');
    const expectedSections = ['Team', 'Portfolio', 'CoreValues'];
    const registeredSections = [];

    expectedSections.forEach(sectionId => {
      const state = window.viewportManager.getSectionState(sectionId);
      if (state) {
        registeredSections.push(sectionId);
        console.log(`✅ Sección ${sectionId} registrada - Visible: ${state.isVisible}`);
      } else {
        console.warn(`⚠️ Sección ${sectionId} no registrada`);
      }
    });

    // Test 3: Verificar variables de visibilidad
    console.log('📋 Test 3: Variables de visibilidad');

    // Team section
    if (typeof isTeamSectionVisible !== 'undefined') {
      console.log(`✅ isTeamSectionVisible: ${isTeamSectionVisible}`);
    } else {
      console.warn('⚠️ isTeamSectionVisible no definida');
    }

    // Portfolio section
    if (typeof isPortfolioSectionVisible !== 'undefined') {
      console.log(`✅ isPortfolioSectionVisible: ${isPortfolioSectionVisible}`);
    } else {
      console.warn('⚠️ isPortfolioSectionVisible no definida');
    }

    // CoreValues section
    if (typeof isCoreValuesSectionVisible !== 'undefined') {
      console.log(`✅ isCoreValuesSectionVisible: ${isCoreValuesSectionVisible}`);
    } else {
      console.warn('⚠️ isCoreValuesSectionVisible no definida');
    }

    // Test 4: Verificar configuración
    console.log('📋 Test 4: Verificar configuración');
    if (window.ViewportOptimizationConfig) {
      console.log('✅ Configuración cargada');
      console.log('🎛️ Configuración del observer:', window.ViewportOptimizationConfig.observer);
      console.log('🎛️ Secciones configuradas:', Object.keys(window.ViewportOptimizationConfig.sections));
    } else {
      console.warn('⚠️ Configuración no encontrada');
    }

    // Test 5: Simular cambios de visibilidad
    console.log('📋 Test 5: Funciones de testing disponibles');

    // Función para testear visibilidad de secciones
    window.testSectionVisibility = function (sectionId) {
      const state = window.viewportManager.getSectionState(sectionId);
      if (state) {
        console.log(`📊 Estado de ${sectionId}:`, {
          isVisible: state.isVisible,
          visibilityRatio: state.visibilityRatio,
          lastUpdate: new Date(state.lastUpdate).toLocaleTimeString()
        });
      } else {
        console.warn(`❌ Sección ${sectionId} no encontrada`);
      }
    };

    // Función para testear configuración
    window.testViewportConfig = function (sectionId) {
      const config = window.getViewportConfig(sectionId);
      console.log(`⚙️ Configuración de ${sectionId}:`, config);
    };

    // Función para scroll automático a secciones
    window.scrollToSection = function (sectionId) {
      const element = document.querySelector(`#${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log(`🔄 Navegando a sección ${sectionId}`);
      } else {
        console.warn(`❌ Elemento #${sectionId} no encontrado`);
      }
    };

    // Función para monitorear cambios de visibilidad
    window.monitorVisibilityChanges = function (duration = 30000) {
      console.log(`👁️ Monitoreando cambios de visibilidad por ${duration / 1000} segundos...`);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed > duration) {
          clearInterval(interval);
          console.log('🏁 Monitoreo de visibilidad finalizado');
          return;
        }

        const teamVisible = window.viewportManager.isSectionVisible('Team');
        const portfolioVisible = window.viewportManager.isSectionVisible('Portfolio');
        const coreValuesVisible = window.viewportManager.isSectionVisible('CoreValues');

        console.log(`📊 Visibilidad [${Math.round(elapsed / 1000)}s]: Team=${teamVisible}, Portfolio=${portfolioVisible}, CoreValues=${coreValuesVisible}`);
      }, 2000);
    };

    console.log('🎮 Funciones de testing disponibles:');
    console.log('   - testSectionVisibility("Team")');
    console.log('   - testViewportConfig("Portfolio")');
    console.log('   - scrollToSection("CoreValues")');
    console.log('   - monitorVisibilityChanges(30000)');

    console.log('✅ Sistema de pruebas inicializado');
  }

  // Eventos para debugging
  document.addEventListener('visibilitychange', () => {
    console.log(`👁️ Visibilidad de página: ${document.hidden ? 'Oculta' : 'Visible'}`);
  });

  // Monitorear errores
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('viewport')) {
      console.error('❌ Error en sistema de viewport:', event.error);
    }
  });

  console.log('🔧 Sistema de pruebas cargado - Modo desarrollo');

} else {
  console.log('📦 Modo producción - Pruebas de viewport deshabilitadas');
}
