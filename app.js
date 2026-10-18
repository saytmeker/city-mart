let tg = window.Telegram.WebApp;
tg.expand();

const products = [
    { id: 1, name: "Muzlatgich LG 350L", price: 6500000, img: "https://via.placeholder.com/150?text=Muzlatgich" },
    { id: 2, name: "Kir yuvish mashinasi Samsung 7kg", price: 4800000, img: "https://via.placeholder.com/150?text=Kir+Yuvish" },
    { id: 3, name: "Televizor Artel 43 LED", price: 3200000, img: "https://via.placeholder.com/150?text=Televizor" },
    { id: 4, name: "Mikroto'lqinli pech Hoffmann", price: 1100000, img: "https://via.placeholder.com/150?text=Pech" }
];

let cart = [];

function renderProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = '';
    products.forEach(p => {
        list.innerHTML += `
            <div class="card">
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.price.toLocaleString()} so'm</p>
                <button class="btn" onclick="addToCart(${p.id})">Savatga qo'shish</button>
            </div>
        `;
    });
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateTotal();
}

function updateTotal() {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-price').innerText = total.toLocaleString() + " so'm";
}

function sendOrder() {
    if (cart.length === 0) {
        alert("Savat bo'sh!");
        return;
    }
    
    let orderData = {
        items: cart.map(i => i.name),
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    tg.sendData(JSON.stringify(orderData));
}

renderProducts();