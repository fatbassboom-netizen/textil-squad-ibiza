/* ==========================================================
   TEXTIL SQUAD IBIZA - SISTEMA MAESTRO FINAL
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

// 1. INICIALIZAR FIREBASE
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let products = [];
let cart = JSON.parse(localStorage.getItem('textil_cart')) || [];

// 2. FUNCIÓN DE ARRANQUE (Trae tus 123 productos)
function init() {
    console.log("Conectando con la base de datos...");
    db.collection("products").onSnapshot((snapshot) => {
        products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log("Productos cargados:", products.length);
        renderCatalog(products);
        updateCartTotal();
    }, (error) => {
        console.error("Error en Firebase:", error);
    });

    // Configurar cierre de ventanas (Modales)
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    });
}

// 3. RENDERIZAR PRODUCTOS EN PANTALLA
function renderCatalog(items) {
    const list = document.getElementById('productList');
    if (!list) return;
    list.innerHTML = items.map(p => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${p.image || ''}'); height:180px; background-size:cover; background-position:center; border-radius:8px;">
            </div>
            <div class="product-info" style="padding:10px;">
                <h3 style="margin:5px 0;">${p.name}</h3>
                <p style="font-weight:bold; color:#6366f1;">${(p.price || 0).toFixed(2)}€</p>
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button class="btn btn-primary" onclick="window.addToCart('${p.id}')" style="flex:1; cursor:pointer;">Añadir</button>
                    <button class="btn btn-secondary" onclick="window.view3D('${p.id}')" style="cursor:pointer;"><i class="fas fa-cube"></i></button>
                    <button class="btn btn-secondary" onclick="window.openEdit('${p.id}')" style="cursor:pointer;"><i class="fas fa-pen"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// 4. VISOR 3D
window.view3D = (id) => {
    const p = products.find(prod => prod.id === id);
    if (p && p.image) {
        document.getElementById('view3DTitle').innerText = p.name;
        document.getElementById('faceFront').style.backgroundImage = `url('${p.image}')`;
        document.getElementById('faceBack').style.backgroundImage = `url('${p.image}')`;
        document.getElementById('view3DModal').classList.remove('hidden');
    }
};

// 5. CALCULADORA
let calcString = "";
window.calcNum = (n) => { calcString += n; document.getElementById('calcDisplay').value = calcString; };
window.calcOp = (op) => { calcString += op; document.getElementById('calcDisplay').value = calcString; };
window.calcClear = () => { calcString = ""; document.getElementById('calcDisplay').value = ""; };
window.calcEqual = () => { 
    try { 
        calcString = eval(calcString).toString(); 
        document.getElementById('calcDisplay').value = calcString; 
    } catch { 
        document.getElementById('calcDisplay').value = "Error"; 
        calcString = "";
    } 
};

// 6. CARRITO
window.addToCart = (id) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
        cart.push(p);
        saveCart();
    }
};

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    const el = document.getElementById('totalAmount');
    if (el) el.innerText = total.toFixed(2) + "€";
}

function saveCart() { 
    localStorage.setItem('textil_cart', JSON.stringify(cart)); 
    updateCartTotal(); 
}

// 7. EDITAR PRODUCTO
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

// ARRANQUE TOTAL
window.onload = init;