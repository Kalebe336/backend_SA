// Carrossel de Produtos
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById('carousel-' + carouselId);
    if (carousel) {
        const cardWidth = 300; // Largura do card + gap
        carousel.scrollBy({
            left: direction * cardWidth,
            behavior: 'smooth'
        });
    }
}

// Auto-scroll (opcional)
let autoScrollInterval;

function startAutoScroll(carouselId, interval = 5000) {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
        const carousel = document.getElementById('carousel-' + carouselId);
        if (carousel) {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (carousel.scrollLeft >= maxScroll - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollCarousel(carouselId, 1);
            }
        }
    }, interval);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
}

// Pausar auto-scroll ao passar o mouse
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.product-carousel');
    carousels.forEach(carousel => {
        carousel.addEventListener('mouseenter', () => {
            const carouselId = carousel.id.replace('carousel-', '');
            stopAutoScroll();
        });
        
        carousel.addEventListener('mouseleave', () => {
            const carouselId = carousel.id.replace('carousel-', '');
            startAutoScroll(carouselId);
        });
    });
});

