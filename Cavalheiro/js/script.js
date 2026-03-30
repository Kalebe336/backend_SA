// Exemplo de como adicionar interatividade simples
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.buy-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productTitle = e.target.parentElement.querySelector('h3').innerText;
            alert(`Você selecionou: ${productTitle}\nRedirecionando para a página do produto...`);
        });
    });

    // Efeito de scroll suave para o menu
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Navegando para a seção...");
        });
    });
});