/**
 * Mission and Vision Slider Manager
 * Manages the glassmorphism panel with auto-advancing slides
 */
class MissionVisionSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.slideData = [];
    this.autoAdvanceInterval = null;
    this.progressInterval = null;
    this.isPlaying = true;
    this.isPaused = false;
    this.slideContainer = null;
    this.paginationContainer = null;
    this.progressFill = null;
    this.autoAdvanceDelay = 15000; // 15 seconds
    this.progressUpdateInterval = 100; // Update progress every 100ms
    this.currentProgress = 0; // Track current progress
    this.progressStartTime = 0; // Track when progress started
    
    this.init();
  }

  async init() {
    try {
      // Load slide data from JSON
      await this.loadSlideData();
      
      // Get DOM elements
      this.slideContainer = document.querySelector('.slides-container');
      this.paginationContainer = document.querySelector('.pagination-dots');
      this.progressFill = document.querySelector('.progress-fill');
      
      if (!this.slideContainer) {
        console.warn('Mission Vision slider container not found');
        return;
      }
      
      // Create slides and pagination
      this.createSlides();
      this.createPagination();
      this.setupEventListeners();
      
      // Start auto-advance and progress
      this.startAutoAdvance();
      this.startProgressBar();
      
      console.log('Mission Vision slider initialized successfully');
    } catch (error) {
      console.error('Error initializing Mission Vision slider:', error);
    }
  }

  async loadSlideData() {
    try {
      const response = await fetch('assets/data/mission-vision-content.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.slideData = data.slides || [];
    } catch (error) {
      console.error('Error loading slide data:', error);
      // Fallback data
      this.slideData = [
        {
          subtitle: "Nuestra Misión",
          description: "Impulsar el crecimiento de nuestros clientes a través de estrategias de marketing digital innovadoras.",
          image: "assets/images/mission-vision/mission.webp"
        },
        {
          subtitle: "Nuestra Visión",
          description: "Ser la agencia de marketing digital líder en la región, reconocida por la excelencia en nuestros servicios.",
          image: "assets/images/mission-vision/vision.webp"
        }
      ];
    }
  }

  createSlides() {
    // Clear existing slides
    this.slideContainer.innerHTML = '';
    
    this.slideData.forEach((slideData, index) => {
      const slide = document.createElement('div');
      slide.className = `slide ${index === 0 ? 'active' : ''}`;
      slide.setAttribute('data-slide', index);
      
      slide.innerHTML = `
        <div class="slide-content">
          <h3 class="slide-subtitle">${slideData.subtitle}</h3>
          <p class="slide-description">${slideData.description}</p>
        </div>
        <div class="slide-image">
          <img src="${slideData.image}" alt="${slideData.subtitle}" loading="lazy">
        </div>
      `;
      
      this.slideContainer.appendChild(slide);
    });
    
    this.slides = document.querySelectorAll('.slide');
  }

  createPagination() {
    if (!this.paginationContainer) return;
    
    // Clear existing dots
    this.paginationContainer.innerHTML = '';
    
    this.slideData.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `pagination-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('data-slide', index);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.paginationContainer.appendChild(dot);
    });
  }

  setupEventListeners() {
    // Navigation arrows - Add event delegation for dynamic elements
    const glassPanel = document.querySelector('.glass-panel');
    
    if (glassPanel) {
      glassPanel.addEventListener('click', (e) => {
        if (e.target.closest('.nav-arrow-left')) {
          e.preventDefault();
          e.stopPropagation();
          this.previousSlide();
          console.log('Previous slide clicked');
        } else if (e.target.closest('.nav-arrow-right')) {
          e.preventDefault();
          e.stopPropagation();
          this.nextSlide();
          console.log('Next slide clicked');
        }
      });
      
      // Pause on panel hover (excluding navigation zones)
      glassPanel.addEventListener('mouseenter', (e) => {
        // Only pause if not hovering over navigation zones or arrows
        if (!e.target.classList.contains('nav-zone') && 
            !e.target.classList.contains('nav-arrow') &&
            !e.target.closest('.nav-arrow')) {
          this.pauseAutoAdvance();
        }
      });
      
      glassPanel.addEventListener('mouseleave', () => this.resumeAutoAdvance());
    }

    // Direct arrow event listeners as backup
    const prevArrow = document.querySelector('.nav-arrow-left');
    const nextArrow = document.querySelector('.nav-arrow-right');
    
    if (prevArrow) {
      prevArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.previousSlide();
        console.log('Previous arrow direct click');
      });
    }
    
    if (nextArrow) {
      nextArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.nextSlide();
        console.log('Next arrow direct click');
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  }

  goToSlide(index) {
    if (index === this.currentSlide || index < 0 || index >= this.slides.length) {
      return;
    }
    
    // Remove active class from current slide and dot
    this.slides[this.currentSlide].classList.remove('active');
    this.slides[this.currentSlide].classList.add('prev');
    
    const currentDot = document.querySelector(`.pagination-dot[data-slide="${this.currentSlide}"]`);
    if (currentDot) {
      currentDot.classList.remove('active');
    }
    
    // Add active class to new slide and dot
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.remove('prev');
    this.slides[this.currentSlide].classList.add('active');
    
    const newDot = document.querySelector(`.pagination-dot[data-slide="${this.currentSlide}"]`);
    if (newDot) {
      newDot.classList.add('active');
    }
    
    // Reset progress bar for new slide
    this.resetProgressBar();
    
    // Clean up prev class after animation
    setTimeout(() => {
      this.slides.forEach(slide => slide.classList.remove('prev'));
    }, 600);
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoAdvance() {
    this.stopAutoAdvance();
    this.isPlaying = true;
    this.progressStartTime = Date.now();
    
    this.autoAdvanceInterval = setInterval(() => {
      if (this.isPlaying && !this.isPaused) {
        this.nextSlide();
      }
    }, this.autoAdvanceDelay);
  }

  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
  }

  pauseAutoAdvance() {
    this.isPaused = true;
    this.stopProgressBar();
    
    // Store current progress when pausing
    const elapsed = Date.now() - this.progressStartTime;
    this.currentProgress = (elapsed / this.autoAdvanceDelay) * 100;
    this.currentProgress = Math.min(this.currentProgress, 100);
  }

  resumeAutoAdvance() {
    this.isPaused = false;
    
    // Calculate remaining time based on stored progress
    const remainingTime = this.autoAdvanceDelay - (this.currentProgress / 100 * this.autoAdvanceDelay);
    
    // Resume progress bar from where it left off
    this.startProgressBar(this.currentProgress);
    
    // Set timeout for remaining time before next slide
    this.stopAutoAdvance();
    this.autoAdvanceInterval = setTimeout(() => {
      if (!this.isPaused) {
        this.nextSlide();
        // Start normal interval again
        this.startAutoAdvance();
      }
    }, remainingTime);
  }

  startProgressBar(startProgress = 0) {
    this.stopProgressBar();
    
    if (!this.progressFill) return;
    
    let progress = startProgress;
    const increment = (this.progressUpdateInterval / this.autoAdvanceDelay) * 100;
    this.progressStartTime = Date.now() - (startProgress / 100 * this.autoAdvanceDelay);
    
    this.progressInterval = setInterval(() => {
      if (this.isPlaying && !this.isPaused) {
        progress += increment;
        this.currentProgress = progress;
        this.progressFill.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
          progress = 0;
          this.currentProgress = 0;
          this.progressStartTime = Date.now();
        }
      }
    }, this.progressUpdateInterval);
  }

  stopProgressBar() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  resetProgressBar() {
    this.currentProgress = 0;
    this.progressStartTime = Date.now();
    if (this.progressFill) {
      this.progressFill.style.width = '0%';
    }
    if (!this.isPaused) {
      this.startProgressBar();
    }
  }

  destroy() {
    this.stopAutoAdvance();
    this.stopProgressBar();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Mission Vision slider
  window.missionVisionSlider = new MissionVisionSlider();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.missionVisionSlider) {
    window.missionVisionSlider.destroy();
  }
});
