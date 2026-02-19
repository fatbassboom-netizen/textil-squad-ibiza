// --- DATA COMPLETA (RECUPERADA) ---
const initialProducts = [
    { id: "1", name: "Sábana", price: 8.00, stock: 100, image: "" },
    { id: "2", name: "Nórdico Blanco", price: 23.00, stock: 50, image: "" },
    { id: "3", name: "Toalla Ducha", price: 6.90, stock: 100, image: "" },
    { id: "4", name: "Funda Almohada", price: 2.40, stock: 100, image: "" },
    { id: "5", name: "Toalla Lavabo", price: 3.50, stock: 100, image: "" },
    { id: "6", name: "Alfombrín", price: 3.60, stock: 100, image: "" },
    { id: "7", name: "Toalla Piscina 600 gr", price: 10.00, stock: 50, image: "" },
    { id: "101", name: "Body Marrón OC", price: 0.00, stock: 50, image: "assets/body_marron.jpg" },
    { id: "102", name: "Polo Beige OC", price: 0.00, stock: 50, image: "assets/polo_beige.jpg" },
    { id: "103", name: "Conjunto Top y Shorts OC", price: 0.00, stock: 50, image: "assets/conjunto.jpg" },
    { id: "104", name: "Body Negro OC", price: 0.00, stock: 50, image: "assets/body_negro.jpg" },
    { id: "105", name: "Body Tirantes Marrón OC", price: 0.00, stock: 50, image: "assets/body_marron_tirantes.jpg" },
    { id: "106", name: "Camisa 2 OC", price: 0.00, stock: 50, image: "assets/camisa_2.jpg" },
    { id: "107", name: "Camisa 3 OC", price: 0.00, stock: 50, image: "assets/camisa_3.jpg" },
    { id: "108", name: "Camisa 4 OC", price: 0.00, stock: 50, image: "assets/camisa_4.jpg" },
    { id: "109", name: "Camisa 5 OC", price: 0.00, stock: 50, image: "assets/camisa_5.jpg" },
    { id: "110", name: "Camisa Short 2 OC", price: 0.00, stock: 50, image: "assets/camisa_short_2.jpg" },
    { id: "111", name: "Camisa Short OC", price: 0.00, stock: 50, image: "assets/camisa_short.jpg" },
    { id: "112", name: "Camisa y Short Verde OC", price: 0.00, stock: 50, image: "assets/camisa_y_short.jpg" },
    { id: "113", name: "Camisa OC", price: 0.00, stock: 50, image: "assets/camisa.jpg" },
    { id: "114", name: "Camiseta OC", price: 0.00, stock: 50, image: "assets/camiseta.jpg" },
    { id: "115", name: "Camiseta Hombre OC", price: 0.00, stock: 50, image: "assets/camiseta_hombre.jpg" },
    { id: "116", name: "Pantalón 2 OC", price: 0.00, stock: 50, image: "assets/pantalon_2.jpg" },
    { id: "117", name: "Pantalón 3 OC", price: 0.00, stock: 50, image: "assets/pantalon_3.jpg" },
    { id: "118", name: "Pantalón 4 OC", price: 0.00, stock: 50, image: "assets/pantalon_4.jpg" },
    { id: "119", name: "Pantalón 5 OC", price: 0.00, stock: 50, image: "assets/pantalon_5.jpg" },
    { id: "120", name: "Pantalón OC", price: 0.00, stock: 50, image: "assets/pantalon.jpg" },
    { id: "121", name: "Vestido 2 OC", price: 0.00, stock: 50, image: "assets/vestido_2.jpg" },
    { id: "122", name: "Vestido 3 OC", price: 0.00, stock: 50, image: "assets/vestido_3.jpg" },
    { id: "123", name: "Vestido OC", price: 0.00, stock: 50, image: "assets/vestido.jpg" }
];

// --- APP STATE ---
let products = [...initialProducts];
const state = { cart: [], showTax: false, notes: "", sortBy: "date-desc" };

// --- FIREBASE CONFIG ---
const DEFAULT_FB_CONFIG = {
    apiKey: "AIzaSyCtwuhg7bINy4_FUTUwdXux3Z3tEWeAgRo",
    authDomain: "textilsquadibiza.firebaseapp.com",
    projectId: "textilsquadibiza",
    storageBucket: "textilsquadibiza.firebasestorage.app",
    messagingSenderId: "253161187895",
    appId: "1:253161187895:web:dcda0c1340d765342cadb2",
    measurementId: "G-V5YQZZ1GFC"
};

let db = null;

// --- INITIALIZATION ---
async function init() {
    console.log("🚀 Aplicación Textil Squad Reiniciada");
    loadLocalData();
    setupListeners();
    renderProducts(products);
    renderCart();
    await initFirebase();
}

function setupListeners() {
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', handleCheckout);
    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
        if(confirm("¿Vaciar carrito?")) { state.cart = []; renderCart(); saveLocalData(); }
    });
}

async function initFirebase() {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) firebase.initializeApp(DEFAULT_FB_CONFIG);
        db = firebase.firestore();
        db.collection("products").onSnapshot(snapshot => {
            const cloudData = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            if (cloudData.length > 0) {
                products = cloudData;
                renderProducts(products);
                saveLocalData();
            }
        });
    }
}

// --- RENDER ---
function renderProducts(items) {
    const listEl = document.getElementById('productList');
    if (!listEl) return;
    listEl.innerHTML = items.map(p => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${p.image}'); height:150px; background-size:cover; background-position:center;"></div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.price.toFixed(2)}€ | Stock: ${p.stock}</p>
                <button class="btn btn-add" onclick="addToCart('${p.id}')">Añadir</button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const cartEl = document.getElementById('cartItems');
    if (!cartEl) return;
    cartEl.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x${item.quantity}</span>
        </div>
    `).join('');
    
    const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    document.getElementById('totalAmount').textContent = `${subtotal.toFixed(2)}€`;
}

// --- ACCIONES ---
window.addToCart = (id) => {
    const p = products.find(prod => String(prod.id) === String(id));
    if (p) {
        const inCart = state.cart.find(i => String(i.id) === String(id));
        if (inCart) inCart.quantity++;
        else state.cart.push({...p, quantity: 1});
        renderCart();
        saveLocalData();
    }
};

async function handleCheckout() {
    if (state.cart.length === 0) return;
    alert("Pedido procesado (Modo Cloud)");
    state.cart = [];
    renderCart();
    saveLocalData();
}

function saveLocalData() {
    localStorage.setItem('local_products_v1', JSON.stringify(products));
    localStorage.setItem('orderState', JSON.stringify(state));
}

function loadLocalData() {
    const saved = localStorage.getItem('local_products_v1');
    if (saved) products = JSON.parse(saved);
}

window.onload = init;