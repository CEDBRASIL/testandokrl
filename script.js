/* Produtos carregados dinamicamente */
let products = [];

async function loadProducts() {
    try {
        const res = await fetch('products.json');
        if (!res.ok) throw new Error('Erro ao carregar produtos');
        products = await res.json();
    } catch (err) {
        console.error(err);
    }
}

const state = {
    cart: []
};

/* Utilitários */
function $(selector) {
    return document.querySelector(selector);
}

function showSection(id) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        sec.classList.remove('show');
    });
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        setTimeout(() => target.classList.add('show'), 10);
    }
}

/* Menu mobile */
const burger = $('#burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

navLinks.addEventListener('click', e => {
    if (e.target.dataset.section) {
        navLinks.classList.remove('show');
    }
});

/* Navegação de seções */
document.querySelectorAll('a[data-section], button[data-section]').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        const id = e.currentTarget.dataset.section;
        showSection(id);
    });
});

/* Renderização do catálogo */
function renderProducts(filter = '') {
    const list = $('#product-list');
    list.innerHTML = '';
    products
        .filter(p => p.name.toLowerCase().includes(filter))
        .forEach(p => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <p><strong>R$ ${p.price}</strong></p>
            <button data-id="${p.id}" class="buy">Comprar</button>
        `;
            list.appendChild(div);
        });
}

/* Detalhes do produto */
function renderDetails(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    const container = $('#details-content');
    container.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.img}" alt="${product.name}">
        <p>${product.desc}</p>
        <p><strong>R$ ${product.price}</strong></p>
        <button data-id="${product.id}" id="add-cart">Adicionar ao carrinho</button>
    `;
}

/* Gerenciamento do carrinho */
function addToCart(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    const item = state.cart.find(i => i.id == id);
    if (item) {
        item.qty += 1;
    } else {
        state.cart.push({ ...product, qty: 1 });
    }
    updateCartView();
}

function updateCartView() {
    const itemsContainer = $('#cart-items');
    const totalEl = $('#cart-total');
    itemsContainer.innerHTML = '';
    let total = 0;
    state.cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `${item.name} x ${item.qty} - R$ ${item.price * item.qty}`;
        itemsContainer.appendChild(div);
    });
    totalEl.textContent = 'Total: R$ ' + total;
}

/* Listeners do catálogo e detalhes */
$('#product-list').addEventListener('click', e => {
    if (e.target.classList.contains('buy')) {
        const id = e.target.dataset.id;
        renderDetails(id);
        showSection('details');
    }
});

$('#details').addEventListener('click', e => {
    if (e.target.id === 'add-cart') {
        addToCart(e.target.dataset.id);
        showSection('cart');
    }
});

/* Botão do carrinho para checkout */
$('#to-checkout').addEventListener('click', () => {
    showSection('checkout');
});

/* Validação do checkout */
$('#checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Compra realizada com sucesso!');
    state.cart = [];
    updateCartView();
    showSection('home');
});

/* Contato */
$('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Mensagem enviada!');
    e.target.reset();
});

/* Inicialização */
/* Busca */
const searchInput = $('#search');
if (searchInput) {
    searchInput.addEventListener('input', e => {
        renderProducts(e.target.value.toLowerCase());
    });
}

loadProducts().then(() => {
    renderProducts();
    showSection('home');
});

