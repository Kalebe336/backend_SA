// Abotoaduras Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize product buttons
    initProductButtons();
    
    // Initialize back button
    initBackButton();
});

function initProductButtons() {
    const buttons = document.querySelectorAll('.buy-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productTitle = e.target.parentElement.querySelector('h3').innerText;
            alert(`Você selecionou: ${productTitle}\nRedirecionando para a página do produto...`);
        });
    });
}

function initBackButton() {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
}
