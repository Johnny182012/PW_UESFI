// Counter animation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all counter elements
    const counters = document.querySelectorAll('.counter');
    
    // Function to animate counter
    function animateCounter(counter) {
        // Get target number from data attribute
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // Animation duration in milliseconds
        const step = Math.ceil(target / (duration / 16)); // Calculate step size (16ms is approx. one frame)
        let current = 0;
        
        // Update counter value at each step
        const updateCounter = () => {
            current += step;
            
            // If reached or exceeded target, set to target value
            if (current >= target) {
                counter.textContent = target;
                return;
            }
            
            // Update counter text
            counter.textContent = current;
            
            // Request next animation frame
            requestAnimationFrame(updateCounter);
        };
        
        // Start animation
        updateCounter();
    }
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll event
    function handleScroll() {
        counters.forEach(counter => {
            // Skip if counter has already been animated
            if (counter.classList.contains('animated')) return;
            
            // Check if counter is in viewport
            if (isInViewport(counter)) {
                animateCounter(counter);
                counter.classList.add('animated'); // Mark as animated
            }
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check on initial load
    handleScroll();
});