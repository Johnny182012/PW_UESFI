// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    const whatsappButton = document.querySelector('.whatsapp-button');
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const navbar = document.querySelector('.navbar');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Inicializar AOS (Animate On Scroll) si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        });
    }

    // Toggle del menú móvil
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Funcionalidad de dropdown en móvil
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        // En dispositivos móviles
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                
                // Close other open dropdowns first
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
                
                // Accesibilidad
                const expanded = dropdown.classList.contains('active');
                dropdownLink.setAttribute('aria-expanded', expanded);
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Mostrar/ocultar botón de WhatsApp al hacer scroll
    if (whatsappButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                whatsappButton.classList.add('visible');
            } else {
                whatsappButton.classList.remove('visible');
            }
        });
    }

    // Smooth scroll para enlaces internos
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Asegurarse de que el enlace apunta a un elemento en la misma página
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Cerrar menú móvil si está abierto
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                    
                    // Calcular la posición de desplazamiento
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                    
                    // Realizar el desplazamiento suave
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // Navbar con sombra al hacer scroll
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.padding = '0.7rem 5%';
                navbar.classList.add('sticky');
            } else {
                navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.08)';
                navbar.style.padding = '1rem 5%';
                navbar.classList.remove('sticky');
            }
        });
    }

    // Animación al hacer scroll para elementos con la clase 'animate-on-scroll'
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    }

    // Verificar elementos visibles al cargar la página
    checkScroll();
    
    // Verificar elementos visibles al hacer scroll
    window.addEventListener('scroll', checkScroll);
    
    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    // Contador de estadísticas (si existe la sección)
    const counterElements = document.querySelectorAll('.counter');
    let counted = false;

    function startCounting() {
        if (counted) return;
        
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 segundos para completar el conteo
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        counted = true;
    }

    // Iniciar conteo cuando la sección sea visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        window.addEventListener('scroll', function() {
            const sectionTop = statsSection.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight * 0.8) {
                startCounting();
            }
        });
    }

    // Galería de imágenes con lightbox (si existe)
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${imgSrc}" alt="Imagen ampliada">
                        <span class="close-lightbox">&times;</span>
                    </div>
                `;
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                // Cerrar lightbox
                lightbox.querySelector('.close-lightbox').addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = 'auto';
                });
                
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = 'auto';
                    }
                });
            });
        });
    }

    // Validación de formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Crear mensaje de error si no existe
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Este campo es obligatorio';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Eliminar mensaje de error si existe
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
                
                // Validación específica para email
                if (field.type === 'email' && field.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value)) {
                        valid = false;
                        field.classList.add('error');
                        
                        // Crear mensaje de error si no existe
                        let errorMessage = field.nextElementSibling;
                        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                            errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message';
                            errorMessage.textContent = 'Por favor, introduce un email válido';
                            field.parentNode.insertBefore(errorMessage, field.nextSibling);
                        } else {
                            errorMessage.textContent = 'Por favor, introduce un email válido';
                        }
                    }
                }
            });
            
            if (!valid) {
                e.preventDefault();
            }
        });
        
        // Eliminar clase de error al escribir
        const formFields = form.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                
                // Eliminar mensaje de error si existe
                const errorMessage = this.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            });
        });
    });

    // Inicializar carrusel si existe
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        let currentSlide = 0;
        const slides = carousel.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        // Crear indicadores (dots)
        if (dotsContainer) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('data-slide', i);
                dotsContainer.appendChild(dot);
                
                dot.addEventListener('click', function() {
                    goToSlide(parseInt(this.getAttribute('data-slide')));
                });
            }
        }
        
        // Función para mostrar un slide específico
        function goToSlide(slideIndex) {
            if (slideIndex < 0) slideIndex = totalSlides - 1;
            if (slideIndex >= totalSlides) slideIndex = 0;
            
            slides.forEach((slide, index) => {
                slide.style.transform = `translateX(${100 * (index - slideIndex)}%)`;
            });
            
            // Actualizar dots
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === slideIndex);
            });
            
            currentSlide = slideIndex;
        }
        
        // Inicializar posición de slides
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * index}%)`;
        });
        
        // Navegación con botones
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => goToSlide(currentSlide - 1));
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => goToSlide(currentSlide + 1));
        }
        
        // Autoplay
        let autoplayInterval;
        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        };
        
        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };
        
        // Iniciar autoplay
        startAutoplay();
        
        // Detener autoplay al interactuar
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Soporte para swipe en móviles
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe izquierda (siguiente)
                goToSlide(currentSlide + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe derecha (anterior)
                goToSlide(currentSlide - 1);
            }
        }
    }
});

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('preloader-hidden');
        
        // Eliminar el preloader después de la animación
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

    // Popup Promocional
    const promoPopup = document.getElementById('promo-popup');
    const closePopup = document.getElementById('close-popup');
    const promoImage = document.getElementById('promo-image');
    const promoLink = document.getElementById('promo-link');
    
    // Configuración del popup (puedes modificar estos valores)
    const popupConfig = {
        imagePath: 'assets/images/popup/catequesis_09092025.jpg', // Ruta de la imagen promocional
        linkUrl: '#', // URL a la que dirigirá al hacer clic
        showOnce: true, // Si es true, solo se muestra una vez por sesión
        delay: 1000, // Tiempo de espera antes de mostrar el popup (en milisegundos)
        cookieDuration: 7 // Duración de la cookie en días (si showOnce es true)
    };
    
    // Función para verificar si ya se mostró el popup
    function hasPopupBeenShown() {
        if (!popupConfig.showOnce) return false;
        return localStorage.getItem('promoPopupShown') === 'true';
    }
    
    // Función para marcar el popup como mostrado
    function markPopupAsShown() {
        if (popupConfig.showOnce) {
            localStorage.setItem('promoPopupShown', 'true');
            
            // Si se especificó una duración de cookie, configurar para que expire
            if (popupConfig.cookieDuration > 0) {
                setTimeout(() => {
                    localStorage.removeItem('promoPopupShown');
                }, popupConfig.cookieDuration * 24 * 60 * 60 * 1000);
            }
        }
    }
    
    // Mostrar el popup
    function showPromoPopup() {
        if (!hasPopupBeenShown()) {
            // Configurar solo el enlace (no sobrescribir la imagen)
            promoLink.href = popupConfig.linkUrl;
            
            // Mostrar el popup después del retraso configurado
            setTimeout(() => {
                promoPopup.classList.add('active');
                markPopupAsShown();
            }, popupConfig.delay);
        }
    }
    
    // Cerrar el popup
    function closePromoPopup() {
        promoPopup.classList.remove('active');
    }
    
    // Event listeners
    if (closePopup) {
        closePopup.addEventListener('click', closePromoPopup);
    }
    
    // También cerrar al hacer clic fuera del contenido
    if (promoPopup) {
        promoPopup.addEventListener('click', function(e) {
            if (e.target === promoPopup) {
                closePromoPopup();
            }
        });
        
        // Iniciar el popup
        showPromoPopup();
    }
