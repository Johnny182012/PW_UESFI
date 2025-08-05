// Preloader functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the preloader element
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader after page is fully loaded
    window.addEventListener('load', function() {
        // Add a small delay for better user experience
        setTimeout(function() {
            preloader.classList.add('hidden');
            
            // Remove preloader from DOM after transition completes
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500); // Match this with the CSS transition duration
        }, 500);
    });
    
    // Fallback: Hide preloader after 5 seconds even if page hasn't fully loaded
    setTimeout(function() {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 5000);
});