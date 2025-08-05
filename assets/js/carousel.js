// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get carousel elements
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    // Initialize variables
    let currentIndex = 0;
    let startX, moveX;
    let isMoving = false;
    let autoplayInterval;
    const slideWidth = 100; // 100% width
    
    // Create dots for each slide
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Update dots active state
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        currentIndex = index;
        carouselContainer.style.transform = `translateX(-${slideWidth * currentIndex}%)`;
        updateDots();
        resetAutoplay();
    }
    
    // Next slide function
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide function
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset autoplay
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Touch events for mobile swipe
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isMoving = true;
        
        // Pause transitions during swipe
        carouselContainer.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isMoving) return;
        
        moveX = e.touches[0].clientX;
        const diff = moveX - startX;
        const offset = (diff / window.innerWidth) * 100;
        
        // Move container with finger but limit movement
        carouselContainer.style.transform = `translateX(calc(-${slideWidth * currentIndex}% + ${offset}px))`;
    }
    
    function handleTouchEnd() {
        if (!isMoving) return;
        isMoving = false;
        
        // Restore transition
        carouselContainer.style.transition = 'transform 0.3s ease-in-out';
        
        // Calculate if we should move to next/prev slide based on swipe distance
        const diff = moveX - startX;
        
        if (diff < -50) {
            nextSlide();
        } else if (diff > 50) {
            prevSlide();
        } else {
            // Return to current slide if swipe wasn't far enough
            goToSlide(currentIndex);
        }
    }
    
    // Initialize carousel
    function initCarousel() {
        // Set initial position
        carouselContainer.style.transform = `translateX(0)`;
        
        // Create navigation dots
        createDots();
        
        // Add event listeners
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
        
        // Touch events for mobile
        carouselContainer.addEventListener('touchstart', handleTouchStart);
        carouselContainer.addEventListener('touchmove', handleTouchMove);
        carouselContainer.addEventListener('touchend', handleTouchEnd);
        
        // Start autoplay
        startAutoplay();
        
        // Pause autoplay when user hovers over carousel
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carousel.addEventListener('mouseleave', startAutoplay);
    }
    
    // Initialize the carousel
    if (slides.length > 0) {
        initCarousel();
    }
});