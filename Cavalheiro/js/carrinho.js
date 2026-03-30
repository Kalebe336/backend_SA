/**
 * Cavalheiro - Sistema de Carrinho de Compras e Modal de Produtos
 * E-commerce Premium com persistência localStorage
 */

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let carrinho = JSON.parse(localStorage.getItem('carrinhoCavalheiro')) || [];

// ============================================
// FUNÇÕES DO CARRINHO
// ============================================

/**
 * Adicionar produto ao carrinho
 */
function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            tamanho: produto.tamanho || null,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    atualizarUI();
    abrirCarrinho();
    
    // Feedback visual
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

/**
 * Remover produto do carrinho
 */
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarUI();
}

/**
 * Atualizar quantidade de um item
 */
function atualizarQuantidade(id, delta) {
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            removerDoCarrinho(id);
        } else {
            salvarCarrinho();
            atualizarUI();
        }
    }
}

/**
 * Salvar carrinho no localStorage
 */
function salvarCarrinho() {
    localStorage.setItem('carrinhoCavalheiro', JSON.stringify(carrinho));
}

/**
 * Calcular total do carrinho
 */
function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

/**
 * Obter quantidade total de itens
 */
function obterQuantidadeTotal() {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

/**
 * Atualizar UI do carrinho (ícone, contador, sidebar)
 */
function atualizarUI() {
    // Atualizar contador do carrinho na navbar
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
        const qtd = obterQuantidadeTotal();
        contador.textContent = qtd;
        contador.style.display = qtd > 0 ? 'inline-flex' : 'none';
    }
    
    // Atualizar sidebar do carrinho
    const carrinhoItens = document.getElementById('carrinho-itens');
    const carrinhoTotal = document.getElementById('carrinho-total');
    
    if (carrinhoItens) {
        if (carrinho.length === 0) {
            carrinhoItens.innerHTML = `
                <div class="carrinho-vazio">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p>Seu carrinho está vazio</p>
                    <span>Adicione produtos para vê-los aqui</span>
                </div>
            `;
        } else {
            carrinhoItens.innerHTML = carrinho.map(item => `
                <div class="carrinho-item" data-id="${item.id}">
                    <div class="carrinho-item-img">
                        <img src="${item.imagem}" alt="${item.nome}">
                    </div>
                    <div class="carrinho-item-info">
                        <h4>${item.nome}</h4>
                        ${item.tamanho ? `<p class="item-tamanho">Tamanho: ${item.tamanho}</p>` : ''}
                        <p class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="carrinho-item-acoes">
                        <button class="btn-qty" onclick="atualizarQuantidade('${item.id}', -1)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <span class="item-qty">${item.quantidade}</span>
                        <button class="btn-qty" onclick="atualizarQuantidade('${item.id}', 1)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <button class="btn-remover" onclick="removerDoCarrinho('${item.id}')" title="Remover">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (carrinhoTotal) {
        carrinhoTotal.innerHTML = `
            <div class="total-row">
                <span>Total:</span>
                <span class="valor-total">R$ ${calcularTotal().toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    }
}

/**
 * Abrir sidebar do carrinho
 */
function abrirCarrinho() {
    const sidebar = document.getElementById('carrinho-sidebar');
    const overlay = document.getElementById('carrinho-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.add('aberto');
        overlay.classList.add('aberto');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Fechar sidebar do carrinho
 */
function fecharCarrinho() {
    const sidebar = document.getElementById('carrinho-sidebar');
    const overlay = document.getElementById('carrinho-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('aberto');
        overlay.classList.remove('aberto');
        document.body.style.overflow = '';
    }
}

/**
 * Finalizar compra
 */
function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Adicione produtos ao carrinho primeiro!');
        return;
    }
    
    const total = calcularTotal();
    const quantidade = obterQuantidadeTotal();
    
    // Simulação de checkout
    const mensagem = `
        ✅ Pedido confirmado!
                
        Obrigado pela preferência!
        Em breve você receberá mais informações.
        
        — Cavalheiro
    `;
    
    alert(mensagem);
    
    // Limpar carrinho
    carrinho = [];
    salvarCarrinho();
    atualizarUI();
    fecharCarrinho();
}

// ============================================
// MODAL DE DETALHES DO PRODUTO
// ============================================

/**
 * Abrir modal de detalhes do produto
 */
function abrirDetalhesProduto(button) {
    const card = button.closest('.product-card');
    const img = card.querySelector('img').src;
    const nome = card.querySelector('h3').textContent;
    const precoTexto = card.querySelector('.price').textContent;
    const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.'));
    const info = card.querySelector('.product-info p').textContent;
    
    // Gerar ID único baseado no nome
    const id = 'prod_' + nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    // Determinar categoria para descrição
    const categoria = obterCategoriaDoProduto(nome);
    const descricao = gerarDescricao(categoria, nome);
    
    // Mostrar modal
    const modal = document.getElementById('modal-detalhes');
    const modalImg = document.getElementById('modal-img');
    const modalNome = document.getElementById('modal-nome');
    const modalDesc = document.getElementById('modal-desc');
    const modalPreco = document.getElementById('modal-preco');
    const modalTamanho = document.getElementById('modal-tamanho');
    const modalBtn = document.getElementById('modal-btn-adicionar');
    
    modalImg.src = img;
    modalNome.textContent = nome;
    modalDesc.textContent = descricao;
    modalPreco.textContent = precoTexto;
    
    // Mostrar/esconder seletor de tamanho
    const precisaTamanho = ['Terno', 'Sapato', 'Camisa', 'Jaqueta', 'Polo', 'Blazer', 'Calça', 'Bermuda', 'Moletom', 'Colete', 'Cinto'];
    const temTamanho = precisaTamanho.some(t => nome.toLowerCase().includes(t.toLowerCase()));
    
    if (temTamanho) {
        modalTamanho.style.display = 'block';
    } else {
        modalTamanho.style.display = 'none';
    }
    
    // Configurar botão de adicionar
    modalBtn.onclick = () => {
        const tamanho = temTamanho ? modalTamanho.value : null;
        adicionarAoCarrinho({
            id: id,
            nome: nome,
            preco: preco,
            imagem: img,
            tamanho: tamanho
        });
        fecharModal();
    };
    
    modal.classList.add('aberto');
    document.body.style.overflow = 'hidden';
}

/**
 * Fechar modal de detalhes
 */
function fecharModal() {
    const modal = document.getElementById('modal-detalhes');
    modal.classList.remove('aberto');
    document.body.style.overflow = '';
}

/**
 * Obter categoria do produto
 */
function obterCategoriaDoProduto(nome) {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes('terno') || nomeLower.includes('blazer')) return 'terno';
    if (nomeLower.includes('camisa')) return 'camisa';
    if (nomeLower.includes('sapato') || nomeLower.includes('oxford') || nomeLower.includes('derby') || nomeLower.includes('mocassim') || nomeLower.includes('loafer') || nomeLower.includes('monge') || nomeLower.includes('sandália')) return 'calcado';
    if (nomeLower.includes('relógio') || nomeLower.includes('watch')) return 'relogio';
    if (nomeLower.includes('abotoadura')) return 'abotoadura';
    if (nomeLower.includes('jaqueta') || nomeLower.includes('moletom') || nomeLower.includes('bermuda') || nomeLower.includes('calça') || nomeLower.includes('polo') || nomeLower.includes('colete') || nomeLower.includes('corta')) return 'casual';
    if (nomeLower.includes('carteira') || nomeLower.includes('cinto') || nomeLower.includes('gravata') || nomeLower.includes('óculos') || nomeLower.includes('pulseira') || nomeLower.includes('chaveiro') || nomeLower.includes('bolsa') || nomeLower.includes('lenço')) return 'acessorio';
    return 'produto';
}

/**
 * Gerar descrição do produto
 */
function gerarDescricao(categoria, nome) {
    const descricoes = {
        terno: `Terno premium ${nome} - Confeccionado com tecidos de alta qualidade, corte moderno e acabamento impecável. Ideal para eventos formais, reuniões de negócios ou occasions especiais. Incluye paleta e gravata.`,
        camisa: `Camisa social ${nome} - Tecido premium com acabamento antitmanchas, corte slimfit perfeito. Combine elegância e conforto no seu dia a dia profissional.`,
        calcado: `${nome} - Calçado executivo em couro legítimo brasileiro. Solado em couro com sistema de amortecimento. Design clássico que never goes out of style.`,
        relogio: `${nome} - Relógio premium com movimento suíço de alta precisão. Caixa em aço inoxidável, vidro safira antirriscos. Resistente à água até 100 metros.`,
        abotoadura: `${nome} - Abotoaduras artesanais em materiais premium. Design elegante que complementa perfeitamente seu terno social.`,
        casual: `${nome} - Peça de moda casual premium. Tecido de alta qualidade com corte moderno. Perfeito para o dia a dia com estilo.`,
        acessorio: `${nome} - Accessório premium para complementar seu visual. Material de alta qualidade com acabamento impecável.`
    };
    
    return descricoes[categoria] || `Produto premium ${nome} - Alta qualidade e design exclusivo Cavalheiro.`;
}

// ============================================
// NOTIFICAÇÕES
// ============================================

/**
 * Mostrar notificação toast
 */
function mostrarNotificacao(mensagem) {
    // Remover notificação existente
    const existente = document.querySelector('.notificacao');
    if (existente) existente.remove();
    
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(notificacao);
    
    // Animar entrada
    setTimeout(() => notificacao.classList.add('mostrar'), 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.classList.remove('mostrar');
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar UI
    atualizarUI();
    
    // Adicionar event listeners para botões de detalhes
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            abrirDetalhesProduto(this);
        });
    });
    
    // Fechar modal ao clicar fora
    const modal = document.getElementById('modal-detalhes');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharModal();
            }
        });
    }
    
    // Fechar carrinho ao clicar no overlay
    const overlay = document.getElementById('carrinho-overlay');
    if (overlay) {
        overlay.addEventListener('click', fecharCarrinho);
    }
    
    // Fechar modal com Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal-detalhes');
            if (modal && modal.classList.contains('aberto')) {
                fecharModal();
            }
            if (document.getElementById('carrinho-sidebar')?.classList.contains('aberto')) {
                fecharCarrinho();
            }
        }
    });
});

