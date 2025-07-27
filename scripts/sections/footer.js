/**
 * Footer functionality
 * Maneja el selector de idiomas personalizado y otras funcionalidades del footer
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar selector de idiomas
  initLanguageSelector();
  
  // Inicializar año del copyright
  initCopyrightYear();
});

/**
 * Inicializa el selector de idiomas personalizado
 */
function initLanguageSelector() {
  const selectMenu = document.querySelector(".select-menu");
  
  if (!selectMenu) {
    console.warn('Selector de idiomas no encontrado');
    return;
  }
  
  const selectBtn = selectMenu.querySelector(".select-btn");
  const options = selectMenu.querySelectorAll(".option");
  const btnText = selectMenu.querySelector(".btn-text");

  // Toggle del menú al hacer clic en el botón
  selectBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectMenu.classList.toggle("active");
  });

  // Cerrar al hacer clic fuera del selector
  document.addEventListener("click", (e) => {
    if (!selectMenu.contains(e.target)) {
      selectMenu.classList.remove("active");
    }
  });

  // Manejar selección de opciones
  options.forEach(option => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      
      const selectedFlag = option.querySelector(".flag");
      const selectedText = option.querySelector(".option-text").innerText;
      const selectedValue = option.getAttribute("data-value");
      
      // Clonar el elemento de la bandera para mantener los atributos
      const flagClone = selectedFlag.cloneNode(true);
      
      // Actualizar el texto del botón con la bandera clonada
      btnText.innerHTML = '';
      btnText.appendChild(flagClone);
      btnText.appendChild(document.createTextNode(` ${selectedValue.toUpperCase()}`));
      
      // Cerrar el menú
      selectMenu.classList.remove("active");
      
      // Actualizar idioma del documento
      document.documentElement.lang = selectedValue;
      
      // Guardar preferencia de idioma en localStorage
      localStorage.setItem('preferred-language', selectedValue);
      
      // Disparar evento personalizado para otros componentes
      const languageChangeEvent = new CustomEvent('languageChanged', {
        detail: { 
          language: selectedValue, 
          languageName: selectedText,
          flagSrc: selectedFlag.src,
          flagAlt: selectedFlag.alt
        }
      });
      document.dispatchEvent(languageChangeEvent);
      
      console.log(`Idioma seleccionado: ${selectedValue} (${selectedText})`);
    });
  });

  // Cargar idioma guardado al inicializar
  loadSavedLanguage();
}

/**
 * Carga el idioma guardado en localStorage
 */
function loadSavedLanguage() {
  const savedLanguage = localStorage.getItem('preferred-language');
  
  if (savedLanguage) {
    const option = document.querySelector(`[data-value="${savedLanguage}"]`);
    if (option) {
      option.click();
    }
  }
}

/**
 * Inicializa el año del copyright con rango automático
 */
function initCopyrightYear() {
  const yearElement = document.getElementById('footer-year-range');
  
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    const startYear = 2024; // Año de fundación de ADN Marketing
    
    if (currentYear > startYear) {
      yearElement.textContent = `${startYear}-${currentYear}`;
    } else {
      yearElement.textContent = currentYear.toString();
    }
  }
}

/**
 * Función para cambiar idioma programáticamente
 * @param {string} language - Código del idioma (es, en)
 */
function changeLanguage(language) {
  const option = document.querySelector(`[data-value="${language}"]`);
  if (option) {
    option.click();
  } else {
    console.warn(`Idioma no encontrado: ${language}`);
  }
}

// Exportar funciones para uso externo si es necesario
window.FooterManager = {
  changeLanguage,
  initLanguageSelector,
  initCopyrightYear
};
