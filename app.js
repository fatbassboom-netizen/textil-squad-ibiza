/* ==========================================================
   TEXTIL SQUAD IBIZA - SISTEMA COMPLETO RESTAURADO
   ========================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyCtwuhg7bINy4_FUTUwdXux3Z3tEWeAgRo",
    authDomain: "textilsquadibiza.firebaseapp.com",
    projectId: "textilsquadibiza",
    storageBucket: "textilsquadibiza.firebasestorage.app",
    messagingSenderId: "253161187895",
    appId: "1:253161187895:web:dcda0c1340d765342cadb2",
    measurementId: "G-V5YQZZ1GFC"
};

// Inicializar Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let products = [];
let cart = JSON.parse(localStorage.getItem('textil_cart')) || [];
let showTax = false;

// --- INICIO ---
function init() {
    db.collection("products").onSnapshot((snapshot) => {
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProducts(products);
        renderCart();
    });
    setupEventListeners();
}

// --- RENDERIZADO DE CATÁLOGO ---
function renderProducts(items) {
    const list = document.getElementById('productList');
    if (!list) return;
    list.innerHTML = items.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image" style="background-image: url('${p.image}'); height:180px; background-size:cover; background-position:center;"></div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p><strong>${(p.price || 0).toFixed(2)}€</strong> | Stock: ${p.stock}</p>
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button class="btn btn-add" onclick="window.addToCart('${p.id}')">Añadir</button>
                    <button class="btn btn-secondary" onclick="window.openEdit('${p.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-3d" onclick="window.view3D('${p.id}')"><i class="fas fa-cube"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- VISOR 3D ---
window.view3D = (id) => {
    const p = products.find(prod => prod.id === id);
    if (p && p.image) {
        document.getElementById('view3DTitle').innerText = p.name;
        document.getElementById('faceFront').style.backgroundImage = `url('${p.image}')`;
        document.getElementById('faceBack').style.backgroundImage = `url('${p.image}')`;
        document.getElementById('view3DModal').classList.remove('hidden');
    }
};

// --- CALCULADORA ---
let calcVal = "";
window.calcNum = (n) => { calcVal += n; document.getElementById('calcDisplay').value = calcVal; };
window.calcOp = (o) => { calcVal += o; document.getElementById('calcDisplay').value = calcVal; };
window.calcClear = () => { calcVal = ""; document.getElementById('calcDisplay').value = ""; };
window.calcEqual = () => { try { calcVal = eval(calcVal).toString(); document.getElementById('calcDisplay').value = calcVal; } catch { calcVal = "Error"; } };

// --- GESTIÓN DE CARRITO ---
window.addToCart = (id) => {
    const p = products.find(prod => prod.id === id);
    if (p) { cart.push({...p, cartId: Date.now()}); saveCart(); }
};

function renderCart() {
    const c = document.getElementById('cartItems');
    if (!c) return;
    c.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>${item.price.toFixed(2)}€</span>
            <button onclick="window.removeItem(${i})">×</button>
        </div>
    `).join('');
    updateTotals();
}

function updateTotals() {
    let subtotal = cart.reduce((s, i) => s + i.price, 0);
    let tax = subtotal * 0.21;
    document.getElementById('totalAmount').innerText = (showTax ? subtotal + tax : subtotal).toFixed(2) + "€";
}

window.removeItem = (i) => { cart.splice(i, 1); saveCart(); };
function saveCart() { localStorage.setItem('textil_cart', JSON.stringify(cart)); renderCart(); }

// --- MODAL DE EDICIÓN ---
window.openEdit = (id) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
        document.getElementById('productId').value = p.id;
        document.getElementById('productName').value = p.name;
        document.getElementById('productPrice').value = p.price;
        document.getElementById('productStock').value = p.stock;
        document.getElementById('productImage').value = p.image;
        document.getElementById('productModal').classList.remove('hidden');
    }
};

async function handleProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value
    };
    await db.collection("products").doc(id).set(data, { merge: true });
    document.getElementById('productModal').classList.add('hidden');
}

function setupEventListeners() {
    document.getElementById('productForm')?.addEventListener('submit', handleProductSubmit);
    document.querySelectorAll('.close-modal').forEach(b => b.onclick = () => document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')));
}

window.onload = init;