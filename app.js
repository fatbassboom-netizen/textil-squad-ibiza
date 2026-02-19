// --- DATA ---
// MANTENEMOS TUS FOTOS EXACTAMENTE IGUAL
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

let products = [];
const state = { cart: [], showTax: false, notes: "", sortBy: "date-desc" };
let db = null;
let productsUnsubscribe = null;
const FB_CONFIG_KEY = 'firebase_config_v1';

const DEFAULT_FB_CONFIG = {
    apiKey: "AIzaSyCtwuhg7bINy4_FUTUwdXux3Z3tEWeAgRo",
    authDomain: "textilsquadibiza.firebaseapp.com",
    projectId: "textilsquadibiza",
    storageBucket: "textilsquadibiza.firebasestorage.app",
    messagingSenderId: "253161187895",
    appId: "1:253161187895:web:dcda0c1340d765342cadb2",
    measurementId: "G-V5YQZZ1GFC"
};

// --- ELEMENTOS DOM ---
let productListEl, cartItemsEl, subtotalEl, taxRowEl, taxEl, totalEl, itemCountEl, orderNotesEl, searchInput, sortSelect;
let productModal, productForm, firebaseModal, firebaseForm, photoModal, photoFull, calcModal, calcDisplay, product3DObject, faceFront, faceBack, view3DTitle;

async function init() {
    try {
        productListEl = document.getElementById('productList');
        cartItemsEl = document.getElementById('cartItems');
        subtotalEl = document.getElementById('subtotalAmount');
        taxRowEl = document.getElementById('taxRow');
        taxEl = document.getElementById('taxAmount');
        totalEl = document.getElementById('totalAmount');
        itemCountEl = document.getElementById('itemCount');
        orderNotesEl = document.getElementById('orderNotes');
        searchInput = document.getElementById('searchInput');
        sortSelect = document.getElementById('sortSelect');
        productModal = document.getElementById('productModal');
        productForm = document.getElementById('productForm');
        firebaseModal = document.getElementById('firebaseModal');
        firebaseForm = document.getElementById('firebaseForm');
        photoModal = document.getElementById('photoModal');
        photoFull = document.getElementById('photoFull');
        calcModal = document.getElementById('calcModal');
        calcDisplay = document.getElementById('calcDisplay');
        product3DObject = document.getElementById('product3DObject');
        faceFront = document.getElementById('faceFront');
        faceBack = document.getElementById('faceBack');
        view3DTitle = document.getElementById('view3DTitle');

        loadProducts();
        loadState();
        if(orderNotesEl) orderNotesEl.value = state.notes;
        
        setupEventListeners();
        renderProducts(products);
        renderCart();
        await initFirebase();
    } catch (e) { console.error("Error init:", e); }
}

function setupEventListeners() {
    document.getElementById('toggleTaxBtn')?.addEventListener('click', toggleTax);
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', handleCheckout);
    orderNotesEl?.addEventListener('input', (e) => { state.notes = e.target.value; saveState(); });
    searchInput?.addEventListener('input', applyFiltersAndSort);
    sortSelect?.addEventListener('change', (e) => { state.sortBy = e.target.value; saveState(); applyFiltersAndSort(); });
    document.getElementById('manageProductsBtn')?.addEventListener('click', () => openModal());
    document.getElementById('configFirebaseBtn')?.addEventListener('click', () => { firebaseModal.classList.remove('hidden'); fillFirebaseForm(); });
    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', closeModal));
    document.getElementById('saveProgressBtn')?.addEventListener('click', () => { saveState(); alert("¡Progreso guardado!"); });
    document.getElementById('printOrderBtn')?.addEventListener('click', () => window.print());
    document.getElementById('openCalcBtn')?.addEventListener('click', () => calcModal.classList.remove('hidden'));
    document.getElementById('deleteProductBtn')?.addEventListener('click', handleDeleteProduct);
}

// --- LOGICA DE PRODUCTOS Y RENDER ---
function renderProducts(items) {
    if (!productListEl) return;
    productListEl.innerHTML = items.map(product => {
        const pId = String(product.id);
        return `
        <div class="product-card" data-id="${pId}">
            <div class="product-image" style="background-image: url('${product.image}'); background-size: cover; height:150px;"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${(product.price || 0).toFixed(2)}€ | Stock: ${product.stock}</p>
                <input type="text" class="catalog-note-input" placeholder="Nota...">
                <div style="display: flex; gap: 5px; margin-top:10px;">
                    <button class="btn btn-add" onclick="window.addToCart('${pId}')">Añadir</button>
                    <button class="btn btn-secondary" onclick="window.openEdit('${pId}')"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-3d" onclick="window.view3D('${pId}')"><i class="fas fa-cube"></i></button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (${item.quantity})</span>
            <button onclick="window.updateQuantity(${item.cartItemId}, -1)">-</button>
            <button onclick="window.updateQuantity(${item.cartItemId}, 1)">+</button>
        </div>`).join('');
    
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if(subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)}€`;
    if(totalEl) totalEl.textContent = `${(state.showTax ? subtotal * 1.21 : subtotal).toFixed(2)}€`;
}

// --- FIREBASE & STORAGE ---
async function initFirebase() {
    if (typeof firebase === 'undefined') return;
    try {
        const config = getFirebaseConfig();
        if (!firebase.apps.length) firebase.initializeApp(config);
        db = firebase.firestore();
        subscribeToProducts();
    } catch (e) { console.error("FB Error:", e); }
}

function subscribeToProducts() {
    if (!db) return;
    db.collection("products").onSnapshot(snapshot => {
        const cloudProducts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        if(cloudProducts.length > 0) {
            products = cloudProducts;
            saveProducts();
            renderProducts(products);
        }
    });
}

function loadProducts() {
    const saved = localStorage.getItem('local_products_v1');
    products = saved ? JSON.parse(saved) : [...initialProducts];
}
function saveProducts() { localStorage.setItem('local_products_v1', JSON.stringify(products)); }
function loadState() { const saved = localStorage.getItem('orderState'); if(saved) Object.assign(state, JSON.parse(saved)); }
function saveState() { localStorage.setItem('orderState', JSON.stringify(state)); }

// --- FUNCIONES GLOBALES ---
window.addToCart = (id) => {
    const p = products.find(prod => String(prod.id) === id);
    if(p)