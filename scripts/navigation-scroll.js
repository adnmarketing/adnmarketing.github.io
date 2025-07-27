// Navigation scroll detection and active menu highlighting
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id], .hero[id]');
    
    // Function to update active nav link
    function updateActiveNavLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for navigation height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        if (current) {
            const activeLink = document.querySelector(`.nav-menu a[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update on page load
    updateActiveNavLink();
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navigation
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                document.body.classList.remove('nav-open');
            }
        });
    });
});