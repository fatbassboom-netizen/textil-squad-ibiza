// --- DATA ---
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

let products = []; // Initialized as empty, will be loaded

// --- APP STATE ---
const state = {
    cart: [],
    showTax: false,
    notes: "",
    sortBy: "date-desc" // Default sorting
};

// --- FIREBASE STATE ---
let db = null;
let productsUnsubscribe = null;
const FB_CONFIG_KEY = 'firebase_config_v1';

// Pre-configured Credentials
const DEFAULT_FB_CONFIG = {
    apiKey: "AIzaSyCtwuhg7bINy4_FUTUwdXux3Z3tEWeAgRo",
    authDomain: "textilsquadibiza.firebaseapp.com",
    projectId: "textilsquadibiza",
    storageBucket: "textilsquadibiza.firebasestorage.app",
    messagingSenderId: "253161187895",
    appId: "1:253161187895:web:dcda0c1340d765342cadb2",
    measurementId: "G-V5YQZZ1GFC"
};

// --- DOM ELEMENTS ---
let productListEl, cartItemsEl, subtotalEl, taxRowEl, taxEl, totalEl, itemCountEl;
let toggleTaxBtn, clearCartBtn, checkoutBtn, orderNotesEl, searchInput, sortSelect;
let manageProductsBtn, productModal, productForm, closeButtons;
let configFirebaseBtn, firebaseModal, firebaseForm;
let saveProgressBtn, printOrderBtn, photoModal, photoFull, calcModal, calcDisplay, openCalcBtn, deleteProductBtn;
let view3DModal, view3DContainer, product3DObject, faceFront, faceBack, view3DTitle, modalImagePreview;

// --- DEBUG LOG ---
function debug(msg) {
    const log = document.getElementById('debugLog');
    if (log) {
        const div = document.createElement('div');
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
        console.log("DEBUG:", msg);
    }
}

// --- INITIALIZATION ---
async function init() {
    console.log("🚀 Aplicación v6.1 Iniciada (Firebase Pre-configurado)");

    try {
        productListEl = document.getElementById('productList');
        cartItemsEl = document.getElementById('cartItems');
        subtotalEl = document.getElementById('subtotalAmount');
        taxRowEl = document.getElementById('taxRow');
        taxEl = document.getElementById('taxAmount');
        totalEl = document.getElementById('totalAmount');
        itemCountEl = document.getElementById('itemCount');
        toggleTaxBtn = document.getElementById('toggleTaxBtn');
        clearCartBtn = document.getElementById('clearCartBtn');
        checkoutBtn = document.getElementById('checkoutBtn');
        orderNotesEl = document.getElementById('orderNotes');
        searchInput = document.getElementById('searchInput');
        sortSelect = document.getElementById('sortSelect');
        manageProductsBtn = document.getElementById('manageProductsBtn');
        productModal = document.getElementById('productModal');
        productForm = document.getElementById('productForm');
        closeButtons = document.querySelectorAll('.close-modal');
        configFirebaseBtn = document.getElementById('configFirebaseBtn');
        firebaseModal = document.getElementById('firebaseModal');
        firebaseForm = document.getElementById('firebaseForm');

        saveProgressBtn = document.getElementById('saveProgressBtn');
        printOrderBtn = document.getElementById('printOrderBtn');
        photoModal = document.getElementById('photoModal');
        photoFull = document.getElementById('photoFull');
        calcModal = document.getElementById('calcModal');
        calcDisplay = document.getElementById('calcDisplay');
        openCalcBtn = document.getElementById('openCalcBtn');
        deleteProductBtn = document.getElementById('deleteProductBtn');

        view3DModal = document.getElementById('view3DModal');
        view3DContainer = document.getElementById('view3DContainer');
        product3DObject = document.getElementById('product3DObject');
        faceFront = document.getElementById('faceFront');
        faceBack = document.getElementById('faceBack');
        view3DTitle = document.getElementById('view3DTitle');
        modalImagePreview = document.getElementById('modalImagePreview');

        if (!manageProductsBtn || !productModal) return;
    } catch (e) {
        console.error("❌ Error vinculando elementos:", e);
    }

    loadProducts(); // Load local products
    loadState();
    updateTaxVisibility();
    orderNotesEl.value = state.notes;
    if (sortSelect) sortSelect.value = state.sortBy;

    // Listeners
    toggleTaxBtn.addEventListener('click', toggleTax);
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', handleCheckout);

    orderNotesEl.addEventListener('input', (e) => {
        state.notes = e.target.value;
        saveState();
    });

    searchInput.addEventListener('input', (e) => {
        applyFiltersAndSort();
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            saveState();
            applyFiltersAndSort();
        });
    }

    manageProductsBtn.addEventListener('click', () => openModal());
    configFirebaseBtn.addEventListener('click', () => {
        firebaseModal.classList.remove('hidden');
        fillFirebaseForm();
    });

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

    document.getElementById('productImage').addEventListener('input', (e) => {
        updateModalImagePreview(e.target.value);
    });

    firebaseForm.addEventListener('submit', handleFirebaseConfigSubmit);

    window.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.classList.add('hidden');
        if (e.target === firebaseModal) firebaseModal.classList.add('hidden');
        if (e.target === photoModal) photoModal.classList.add('hidden');
        if (e.target === calcModal) calcModal.classList.add('hidden');
        if (e.target === view3DModal) view3DModal.classList.add('hidden');
    });

    saveProgressBtn.addEventListener('click', () => {
        saveState();
        alert("¡Progreso guardado localmente!");
    });

    printOrderBtn.addEventListener('click', () => {
        window.print();
    });

    openCalcBtn.addEventListener('click', () => {
        calcModal.classList.remove('hidden');
    });

    deleteProductBtn.addEventListener('click', handleDeleteProduct);

    renderProducts(products);
    renderCart();

    // Auto-init with default or saved config
    await initFirebase();
}

// --- LOGIC ---

function applyFiltersAndSort() {
    const term = searchInput.value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(term));

    filtered.sort((a, b) => {
        switch (state.sortBy) {
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'date-desc':
            default:
                const idA = isNaN(a.id) ? a.id : Number(a.id);
                const idB = isNaN(b.id) ? b.id : Number(b.id);
                if (typeof idA === 'number' && typeof idB === 'number') return idB - idA;
                return String(idB).localeCompare(String(idA));
        }
    });

    renderProducts(filtered);
}

// --- FIREBASE LOGIC ---

function getFirebaseConfig() {
    const saved = localStorage.getItem(FB_CONFIG_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_FB_CONFIG;
}

function fillFirebaseForm() {
    const config = getFirebaseConfig();
    document.getElementById('fbApiKey').value = config.apiKey || '';
    document.getElementById('fbAuthDomain').value = config.authDomain || '';
    document.getElementById('fbProjectId').value = config.projectId || '';
    document.getElementById('fbStorageBucket').value = config.storageBucket || '';
    document.getElementById('fbMessagingSenderId').value = config.messagingSenderId || '';
    document.getElementById('fbAppId').value = config.appId || '';
}

async function handleFirebaseConfigSubmit(e) {
    e.preventDefault();
    const config = {
        apiKey: document.getElementById('fbApiKey').value,
        authDomain: document.getElementById('fbAuthDomain').value,
        projectId: document.getElementById('fbProjectId').value,
        storageBucket: document.getElementById('fbStorageBucket').value,
        messagingSenderId: document.getElementById('fbMessagingSenderId').value,
        appId: document.getElementById('fbAppId').value
    };
    localStorage.setItem(FB_CONFIG_KEY, JSON.stringify(config));
    firebaseModal.classList.add('hidden');
    alert("Configuración actualizada. Reconectando...");
    location.reload(); // Simple way to re-init everything
}

async function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn("⚠️ Firebase SDK not loaded yet.");
        return;
    }
    try {
        const config = getFirebaseConfig();
        if (!config.apiKey) return; // No config available

        if (!firebase.apps.length) firebase.initializeApp(config);
        db = firebase.firestore();
        console.log("✅ Firebase Conectado");
        subscribeToProducts();
    } catch (error) {
        console.error("❌ Firebase error:", error);
        alert("Error de conexión Firebase. Revisa la configuración.");
    }
}

function subscribeToProducts() {
    if (!db) return;
    if (productsUnsubscribe) productsUnsubscribe();
    productsUnsubscribe = db.collection("products").onSnapshot((snapshot) => {
        debug(`Recibido snapshot: ${snapshot.size} productos`);

        const cloudProducts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: String(doc.id),
                price: parseFloat(data.price) || 0,
                stock: parseInt(data.stock) || 0
            };
        });

        // RECONSTRUCCIÓN INTELIGENTE: Combinamos nube, local e iniciales
        const cloudIds = new Set(cloudProducts.map(p => p.id));

        // 1. Empezamos con los productos de la nube
        let newProductsList = [...cloudProducts];

        // 2. Añadimos lo que falte de los initialProducts (que aún no se ha subido)
        initialProducts.forEach(proto => {
            if (!cloudIds.has(proto.id)) {
                // Buscamos si tenemos una versión local ya guardada
                const localVersion = products.find(lp => lp.id === proto.id);
                newProductsList.push(localVersion || proto);
            }
        });

        // 3. Añadimos productos totalmente nuevos que el usuario haya creado localmente y no estén en la nube ni en iniciales
        products.forEach(localP => {
            if (!cloudIds.has(localP.id) && !initialProducts.find(ip => ip.id === localP.id)) {
                newProductsList.push(localP);
            }
        });

        products = newProductsList;

        saveProducts(); // Importante: Guardamos la caché local unificada
        applyFiltersAndSort();
        debug("Catálogo sincronizado y blindado.");
    }, (error) => {
        debug(`Error crítico Firestore: ${error.message}`);
        console.error("❌ Error Firestore:", error);
    });
}

async function seedDatabase() {
    if (!db) {
        alert("❌ Error: No se ha configurado la base de datos (Firebase).");
        return;
    }

    const message = "⚠️ ATENCIÓN: Se subirán todos los productos actuales a la nube.\n\n" +
        "• Los productos se actualizarán o crearán automáticamente.\n" +
        "• Tus precios locales se guardarán de forma permanente.\n\n" +
        "¿Deseas sincronizar todo el catálogo con la nube?";

    if (!confirm(message)) return;

    try {
        let count = 0;

        // Usamos la lista de productos actual
        for (const p of products) {
            const ref = db.collection("products").doc(String(p.id));

            const dataToUpload = {
                name: p.name,
                price: p.price,
                stock: p.stock,
                image: p.image,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // SET CON MERGE: Es más robusto que get() + update()
            // No necesita comprobar si existe antes, lo cual evita errores de "offline" en la lectura
            await ref.set(dataToUpload, { merge: true });
            count++;
        }
        alert(`✅ Sincronización exitosa: ${count} productos procesados.`);
        debug("Sincronización manual completada.");
    } catch (e) {
        console.error("❌ Error seeding database:", e);
        let errorMsg = e.message;
        if (errorMsg.includes("offline")) {
            errorMsg = "Parece que no hay conexión o Firebase está bloqueado por el navegador.\n\n" +
                "TIP: Si usas Chrome, intenta abrir la consola (F12) para ver si hay bloqueos de seguridad.";
        }
        alert("❌ Error al sincronizar: " + errorMsg);
    }
}

// --- CART LOGIC ---

function addToCart(productId) {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;

    // Get note from the input field in the product card
    const noteEl = document.querySelector(`.product-card[data-id="${productId}"] .catalog-note-input`);
    const initialNote = noteEl ? noteEl.value : "";

    const currentQty = state.cart.filter(item => String(item.id) === String(productId)).reduce((sum, item) => sum + item.quantity, 0);
    if (currentQty + 1 > (product.stock || 0)) {
        alert("¡Stock insuficiente!");
        return;
    }
    state.cart.push({ ...product, quantity: 1, note: initialNote, cartItemId: Date.now() + Math.random() });

    // Clear catalog note input after adding
    if (noteEl) noteEl.value = "";

    saveState();
    renderCart();
}

function updateQuantity(cartItemId, change) {
    const itemIndex = state.cart.findIndex(item => item.cartItemId === cartItemId);
    if (itemIndex === -1) return;
    const item = state.cart[itemIndex];
    if (change > 0) {
        const product = products.find(p => String(p.id) === String(item.id));
        const currentTotalQty = state.cart.filter(i => String(i.id) === String(item.id)).reduce((sum, i) => sum + i.quantity, 0);
        if (product && currentTotalQty + 1 > (product.stock || 0)) return;
    }
    item.quantity += change;
    if (item.quantity <= 0) state.cart.splice(itemIndex, 1);
    saveState();
    renderCart();
}

function updateItemNote(cartItemId, note) {
    const item = state.cart.find(item => item.cartItemId === cartItemId);
    if (item) { item.note = note; saveState(); }
}

function clearCart() {
    if (confirm('¿Vaciar carrito?')) {
        state.cart = [];
        state.notes = "";
        orderNotesEl.value = "";
        saveState();
        renderCart();
    }
}

async function handleCheckout() {
    if (state.cart.length === 0) return;
    if (!db) {
        alert("Modo Local: Pedido finalizado.");
        state.cart = [];
        saveState();
        renderCart();
        return;
    }
    if (!confirm("¿Confirmar pedido?")) return;
    try {
        const batch = db.batch();
        for (const item of state.cart) {
            const productRef = db.collection("products").doc(String(item.id));
            batch.update(productRef, { stock: firebase.firestore.FieldValue.increment(-item.quantity) });
        }
        await batch.commit();
        alert("¡Pedido realizado con éxito!");
        state.cart = [];
        state.notes = "";
        orderNotesEl.value = "";
        saveState();
        renderCart();
    } catch (e) { alert("Error: " + e.message); }
}

// --- UI HELPERS ---

function toggleTax() {
    state.showTax = !state.showTax;
    updateTaxVisibility();
    renderCart();
    saveState();
}

function updateTaxVisibility() {
    if (state.showTax) {
        taxRowEl.classList.remove('hidden');
        toggleTaxBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar IVA';
    } else {
        taxRowEl.classList.add('hidden');
        toggleTaxBtn.innerHTML = '<i class="fas fa-percent"></i> Mostrar IVA';
    }
}

function openModal(product = null) {
    productModal.classList.remove('hidden');
    if (product) {
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('final_price_input').value = product.price || 0;
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productImage').value = product.image || '';
        updateModalImagePreview(product.image);
        deleteProductBtn.classList.remove('hidden');
    } else {
        document.getElementById('modalTitle').textContent = 'Añadir Producto';
        productForm.reset();
        document.getElementById('productId').value = '';
        document.getElementById('final_price_input').value = '';
        updateModalImagePreview('');
        deleteProductBtn.classList.add('hidden');
    }
}

function updateModalImagePreview(url) {
    const previewDiv = document.getElementById('modalImagePreview');
    const previewImg = previewDiv.querySelector('img');
    if (url && url.trim() !== '') {
        previewImg.src = url;
        previewDiv.classList.remove('hidden');
    } else {
        previewDiv.classList.add('hidden');
        previewImg.src = '';
    }
}

function closeModal() {
    productModal.classList.add('hidden');
    firebaseModal.classList.add('hidden');
}

window.handleProductSubmit = handleProductSubmit;
async function handleProductSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    debug("Iniciando guardado definitivo...");

    try {
        const id = document.getElementById('productId').value;
        const nameVal = document.getElementById('productName').value;
        const priceInputEl = document.getElementById('final_price_input');
        const priceVal = priceInputEl ? priceInputEl.value : "";
        const stockVal = document.getElementById('productStock').value;
        const imageVal = document.getElementById('productImage').value;

        // Limpieza quirúrgica de precio
        const cleanPrice = String(priceVal).replace(',', '.').trim();
        if (cleanPrice === "") {
            alert("⚠️ Por favor, introduce un precio.");
            return;
        }
        const parsedPrice = parseFloat(cleanPrice);

        if (isNaN(parsedPrice)) {
            alert("⚠️ Formato de precio incorrecto. Ejemplo: 10.50");
            return;
        }

        const productData = {
            name: nameVal,
            price: parsedPrice,
            stock: parseInt(stockVal) || 0,
            image: imageVal,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (db) {
            // USAMOS SET CON MERGE: SIEMPRE FUNCIONA, EXISTA O NO EL DOCUMENTO
            const targetId = id ? String(id) : db.collection("products").doc().id;
            const docRef = db.collection("products").doc(targetId);

            debug(`Enviando a Cloud ID ${targetId} -> ${parsedPrice}€`);

            await docRef.set(productData, { merge: true });

            // Verificación inmediata: No esperamos al snapshot (que puede tardar)
            // Actualizamos la lista local AHORA MISMO
            const index = products.findIndex(p => p.id === targetId);
            if (index !== -1) {
                products[index] = { ...products[index], ...productData, id: targetId };
            } else {
                products.push({ ...productData, id: targetId });
            }

            saveProducts(); // Guardamos caché local
            applyFiltersAndSort();
            closeModal();

            alert(`✅ PRECIO GUARDADO: ${parsedPrice}€\nProducto: ${nameVal}\n\n(Ya puedes refrescar con F5, los datos están seguros)`);
            debug("Escritura confirmada.");
        } else {
            // Modo local (como fallback)
            const localId = id ? String(id) : String(Date.now());
            const index = products.findIndex(p => p.id === localId);
            if (index !== -1) {
                products[index] = { ...products[index], ...productData, id: localId };
            } else {
                products.push({ ...productData, id: localId });
            }
            saveProducts();
            applyFiltersAndSort();
            closeModal();
            alert("✅ Guardado localmente (Sin conexión a nube)");
        }
    } catch (error) {
        debug(`Error crítico: ${error.message}`);
        console.error(error);
        alert("❌ ERROR AL GUARDAR: " + error.message);
    }
}

// --- RENDER ---

function renderProducts(items) {
    productListEl.innerHTML = items.map(product => {
        const isOutOfStock = (product.stock || 0) <= 0;
        const lowStock = (product.stock || 0) > 0 && (product.stock || 0) <= 5;
        let stockBadge = isOutOfStock ? `<span class="badge badge-danger">Agotado</span>` :
            (lowStock ? `<span class="badge badge-warning">Últs. ${product.stock}</span>` :
                `<span class="badge badge-success">Stock: ${product.stock}</span>`);

        const pId = String(product.id).replace(/'/g, "\\'");
        return `
        <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-id="${pId}">
            <div class="product-image" style="background-image: url('${product.image}'); background-size: cover; background-position: center;">
             ${!product.image ? '<i class="fas fa-image"></i>' : ''}
            </div>
            <div class="product-info">
                <h3 style="margin-bottom: 5px;">${product.name}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <p class="price" style="margin: 0;">${(product.price || 0).toFixed(2)}€</p>
                    ${stockBadge}
                </div>
                <div class="catalog-note-container">
                    <input type="text" class="catalog-note-input" placeholder="Nota rápida...">
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="btn btn-add" onclick="window.addToCart('${pId}')" ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i> Añadir
                    </button>
                    <button class="btn btn-secondary" style="width: 40px;" onclick="window.openEdit('${pId}')" title="Editar">
                         <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn btn-secondary" style="width: 40px;" onclick="window.viewPhoto('${pId}')" title="Ver Foto">
                         <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-3d" style="width: 40px;" onclick="window.view3D('${pId}')" title="Ver 3D">
                         <i class="fas fa-cube"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderCart() {
    if (state.cart.length === 0) {
        cartItemsEl.innerHTML = `<div class="empty-state" style="text-align: center; padding: 20px; color: #888;"><p>Pedido vacío</p></div>`;
    } else {
        cartItemsEl.innerHTML = state.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info" style="flex: 1;">
                    <h4>${item.name}</h4>
                    <span>${(item.price || 0).toFixed(2)}€ x ${item.quantity}</span>
                </div>
                <div class="quantity-controls">
                    <button class="btn-qty" onclick="window.updateQuantity(${item.cartItemId}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty" onclick="window.updateQuantity(${item.cartItemId}, 1)">+</button>
                </div>
                <input type="text" class="item-note-input" value="${item.note || ''}" onchange="window.updateItemNote(${item.cartItemId}, this.value)">
            </div>`).join('');
    }
    const subtotal = state.cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
    const tax = subtotal * 0.21;
    const total = state.showTax ? (subtotal + tax) : subtotal;

    subtotalEl.textContent = `${subtotal.toFixed(2)}€`;
    taxEl.textContent = `${tax.toFixed(2)}€`;
    totalEl.textContent = `${total.toFixed(2)}€`;
    itemCountEl.textContent = `${state.cart.reduce((acc, item) => acc + item.quantity, 0)} items`;
}

// --- STORAGE ---
function saveState() { localStorage.setItem('orderState', JSON.stringify(state)); }
function loadState() {
    const saved = localStorage.getItem('orderState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
        } catch (e) { }
    }
}

// --- GLOBALS ---
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.updateItemNote = updateItemNote;
window.seedDatabase = seedDatabase;
window.openEdit = (id) => {
    debug(`Editando producto ID: ${id}`);
    const p = products.find(prod => String(prod.id) === String(id));
    if (p) {
        openModal(p);
    } else {
        debug(`Error: No se encontró el producto ${id}`);
        alert("No se pudo encontrar el producto seleccionado.");
    }
};

async function handleDeleteProduct() {
    const id = document.getElementById('productId').value;
    if (!id) return;
    if (!confirm("¿Seguro que quieres borrar este producto? Esta acción no se puede deshacer.")) return;

    if (db) {
        try {
            await db.collection("products").doc(String(id)).delete();
            closeModal();
        } catch (e) { alert("Error al borrar: " + e.message); }
    } else {
        const index = products.findIndex(p => String(p.id) === String(id));
        if (index !== -1) {
            products.splice(index, 1);
            saveProducts(); // Save local changes
            applyFiltersAndSort();
            closeModal();
        }
    }
}

function viewPhoto(id) {
    const product = products.find(p => String(p.id) === String(id));
    if (product && product.image) {
        photoFull.src = product.image;
        photoModal.classList.remove('hidden');
    } else {
        alert("Este producto no tiene imagen configurada.");
    }
}

// --- CALCULATOR LOGIC ---
let calcCurrent = "";

function calcNum(n) {
    calcCurrent += n;
    updateCalcDisplay();
}

function calcOp(op) {
    if (calcCurrent === "" || "+-*/".includes(calcCurrent.slice(-1))) return;
    calcCurrent += op;
    updateCalcDisplay();
}

function calcClear() {
    calcCurrent = "";
    updateCalcDisplay();
}

function calcBackspace() {
    calcCurrent = calcCurrent.slice(0, -1);
    updateCalcDisplay();
}

function calcEqual() {
    try {
        // Simple eval-like behavior for basic math
        // eslint-disable-next-line no-eval
        const res = eval(calcCurrent);
        calcCurrent = String(res);
        updateCalcDisplay();
    } catch (e) {
        calcCurrent = "Error";
        updateCalcDisplay();
        setTimeout(() => calcClear(), 1000);
    }
}

function updateCalcDisplay() {
    calcDisplay.value = calcCurrent;
}

// --- PERSISTENCE ---
const STORAGE_PRODUCTS_KEY = 'local_products_v1';

function saveProducts() {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
}

function loadProducts() {
    const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (saved) {
        try {
            products = JSON.parse(saved);
        } catch (e) {
            products = [...initialProducts];
        }
    } else {
        products = [...initialProducts];
    }
}

// --- START ---
window.viewPhoto = viewPhoto;
window.calcNum = calcNum;
window.calcOp = calcOp;
window.calcClear = calcClear;
window.calcBackspace = calcBackspace;
window.calcEqual = calcEqual;
window.view3D = view3D;

// --- 3D INTERACTION ---
let isDragging = false;
let startX, startY;
let rotateX = 10, rotateY = 0;

function view3D(id) {
    const product = products.find(p => String(p.id) === String(id));
    if (product && product.image) {
        view3DTitle.textContent = `Visualización 3D - ${product.name}`;

        // Aplicar imagen a las caras principales del "placard"
        if (faceFront) faceFront.style.backgroundImage = `url('${product.image}')`;
        if (faceBack) faceBack.style.backgroundImage = `url('${product.image}')`;

        view3DModal.classList.remove('hidden');

        // Reset rotation
        rotateX = 10; rotateY = 0;
        product3DObject.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        product3DObject.classList.add('auto-rotate');
    } else {
        alert("Este producto no tiene imagen configurada.");
    }
}

// Logic for dragging/rotating 3D object
if (document.getElementById('view3DContainer')) {
    const container = document.getElementById('view3DContainer');
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        product3DObject.classList.remove('auto-rotate');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        rotateY += deltaX * 0.5;
        rotateX -= deltaY * 0.5;

        product3DObject.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        product3DObject.classList.remove('auto-rotate');
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;

        rotateY += deltaX * 0.5;
        rotateX -= deltaY * 0.5;

        product3DObject.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
