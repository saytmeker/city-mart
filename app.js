let tg = window.Telegram.WebApp;
tg.expand();

const products = [
    {
        id: 1,
        title: "Muzlatgich LG 350L",
        category: "Muzlatgichlar",
        desc: "NoFrost tizimi, energiya tejamkor A++, sig'imi 350 litr.",
        price: 6500000,
        img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400"
    },
    {
        id: 2,
        title: "Kir yuvish mashinasi Samsung 7kg",
        category: "Kir yuvish mashinalari",
        desc: "Inverter motor, 1400 ayl/min, EcoBubble texnologiyasi.",
        price: 4800000,
        img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400"
    },
    {
        id: 3,
        title: "Televizor Artel 43 LED Smart",
        category: "Televizorlar",
        desc: "Android TV, Full HD, Wi-Fi va Bluetooth mavjud.",
        price: 3200000,
        img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400"
    },
    {
        id: 4,
        title: "Mikroto'lqinli pech Hoffmann",
        category: "Oshxona texnikasi",
        desc: "20 litr sig'im, gril funksiyasi, 800W quvvat.",
        price: 1100000,
        img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400"
    },
    {
        id: 5,
        title: "iPhone 13 Pro Max 128GB",
        category: "Smartfonlar",
        desc: "Super Retina XDR ekran, ProMotion 120Hz, A15 Bionic chip.",
        price: 11200000,
        img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400"
    }
];

let cart = [];
let currentCategory = 'all';

function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: span 2; text-align: center; color: #888; padding: 20px;">Mahsulot topilmadi</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" class="product-img" alt="${product.title}">
            <div class="product-title">${product.title}</div>
            <div class="product-desc">${product.desc}</div>
            <div class="product-price">${product.price.toLocaleString()} so'm</div>
            <button class="add-btn" onclick="addToCart(${product.id})">Savatga qo'shish</button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    const sum = cart.reduce((total, p) => total + p.price, 0);
    document.getElementById('cartSum').innerText = sum.toLocaleString();
}

function selectCategory(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    filterProducts();
}

function filterProducts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(product => {
        const matchCategory = (currentCategory === 'all' || product.category === currentCategory);
        const matchSearch = product.title.toLowerCase().includes(searchText) || product.desc.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });
    renderProducts(filtered);
}

// Modal oynani ochish
function openOrderModal() {
    if (cart.length === 0) {
        alert("Savat bo'sh! Iltimos, mahsulot tanlang.");
        return;
    }
    document.getElementById('orderModal').style.display = 'flex';
}

// Modal oynani yopish
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Buyurtmani botga yuborish
function submitOrder() {
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();

    if (!name || !phone) {
        alert("Iltimos, ismingiz va telefon raqamingizni kiriting!");
        return;
    }

    let orderItems = cart.map((item, index) => `${index + 1}. ${item.title} - ${item.price.toLocaleString()} so'm`).join('\n');
    let totalSum = cart.reduce((sum, item) => sum + item.price, 0);

    let data = {
        name: name,
        phone: phone,
        items: orderItems,
        total: totalSum
    };

    // Telegram Bot WebApp orqali ma'lumotlarni yuborish
    tg.sendData(JSON.stringify(data));
}

renderProducts(products);