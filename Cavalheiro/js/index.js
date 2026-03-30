// Index Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initAnimations();
    
    // Initialize product buttons
    initProductButtons();
    
    // Initialize category cards
    initCategoryCards();
});

function initAnimations() {
    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.category-card, .product-card').forEach(el => {
        observer.observe(el);
    });
}

function initProductButtons() {
    const buttons = document.querySelectorAll('.buy-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productTitle = e.target.parentElement.querySelector('h3').innerText;
            alert(`Você selecionou: ${productTitle}\nRedirecionando para a página do produto...`);
        });
    });
}

function initCategoryCards() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('img').style.transform = 'scale(1.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('img').style.transform = 'scale(1)';
        });
    });
}
