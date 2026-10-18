// Mahsulotlar bazasi
const products = [
    { id: 1, name: "Muzlatgich Artel Inverter", category: "Muzlatgichlar", price: 4200000, desc: "No Frost, ikki kamerali, oq rang." },
    { id: 2, name: "Kir yuvish mashinasi Avalon", category: "Kir yuvish", price: 3500000, desc: "6 kg yuklama, inverter motor." },
    { id: 3, name: "Televizor Artel 43 LED Smart", category: "Televizorlar", price: 3200000, desc: "Android TV, Full HD, Wi-Fi." },
    { id: 4, name: "Mikrotolqinli pech Hoffmann", category: "Oshxona texnikasi", price: 1100000, desc: "20 litr sig'im, gril funksiyasi." }
];

let cart = [];
let currentCategory = 'Barchasi';

// Sahifaga mahsulotlarni chiqarish
function renderProducts(filterText = '', category = 'Barchasi') {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesCategory = category === 'Barchasi' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(filterText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: span 2; text-align: center; color: #777;">Mahsulot topilmadi</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>${product.desc}</p>
                <strong>${product.price.toLocaleString()} so'm</strong>
            </div>
            <button onclick="addToCart(${product.id})" style="margin-top: 10px;">Savatga qo'shish</button>
        `;
        grid.appendChild(card);
    });
}

// Kategoriyani tanlash
function selectCategory(category, btn) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const searchVal = document.getElementById('searchInput').value;
    renderProducts(searchVal, currentCategory);
}

// Qidiruv
function filterProducts() {
    const searchVal = document.getElementById('searchInput').value;
    renderProducts(searchVal, currentCategory);
}

// Savatga qo'shish
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartBar();
    alert(product.name + " savatga qo'shildi!");
}

// Savat summasini yangilash
function updateCartBar() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartSum').textContent = total.toLocaleString();
}

// Oynani ochish/yopish
function openOrderModal() {
    if (cart.length === 0) {
        alert("Savatiz bo'sh! Avval mahsulot tanlang.");
        return;
    }
    document.getElementById('orderModal').style.display = 'flex';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Buyurtmani tasdiqlash va Telegram botga yuborish
function submitOrder() {
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();

    if (!name || !phone) {
        alert("Iltimos, ism va telefon raqamingizni kiriting!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        name: name,
        phone: phone,
        items: cart,
        total: total
    };

    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify(orderData));
        Telegram.WebApp.close();
    } else {
        alert("Buyurtma yuborildi! Rahmat, " + name + ".");
        closeOrderModal();
        cart = [];
        updateCartBar();
        renderProducts();
    }
}

// Boshlang'ich yuklash
renderProducts();