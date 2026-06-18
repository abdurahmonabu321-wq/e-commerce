const products = [];

const categoryTemplates = {
    men: { name: "Premium Men Luxury Jacket", priceBase: 85, img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400" },
    women: { name: "Luxury Golden Evening Dress", priceBase: 130, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400" },
    kids: { name: "Kids Gold Premium Suit", priceBase: 50, img: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?q=80&w=400" },
    shoes: { name: "Italian Classic Black Shoes", priceBase: 160, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400" },
    caps: { name: "Gold Embroidery Exclusive Cap", priceBase: 35, img: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=400" },
    bags: { name: "Designer Black Leather Bag", priceBase: 240, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400" },
    accessories: { name: "Chronograph Gold Luxury Watch", priceBase: 310, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400" }
};

// 32 tadan jami 224 ta mahsulot bazasini generatsiya qilish
let globalId = 1;
Object.keys(categoryTemplates).forEach(catKey => {
    const template = categoryTemplates[catKey];
    for (let i = 1; i <= 32; i++) {
        products.push({
            id: globalId++,
            name: `${template.name} Model-X${i}`,
            price: template.priceBase + (i * 4),
            category: catKey,
            img: template.img
        });
    }
});

let cart = [];
let currentLang = 'UZ';

// 🌐 TILLAR TARJIMASI TO'LIQ QAYTA TIKLANDI
const translations = {
    UZ: {
        home: "Bosh sahifa", collection: "Kolleksiya", about: "Biz haqimizda", contact: "Aloqa",
        categories: "Kategoriyalar", all: "barchasi", searchPlace: "Mahsulotlarni qidiring...",
        addToCart: "Savatga", cartTitle: "Sizning savatingiz", cartTotal: "Jami summa:", checkoutBtn: "To'lov sahifasiga o'tish",
        m_men: "Erkaklar", m_women: "Ayollar", m_kids: "Bolalar", m_shoes: "Oyoq kiyim", m_caps: "Bosh kiyim", m_bags: "Sumkalar", m_acc: "Aksessuarlar",
        checkoutTitle: "Xaridni rasmiylashtirish", payAmount: "To'lov miqdori:", confirmBtn: "Buyurtmani tasdiqlash",
        emptyCart: "Savat bo'sh"
    },
    EN: {
        home: "Home", collection: "Collection", about: "About Us", contact: "Contact",
        categories: "Categories", all: "all", searchPlace: "Search products...",
        addToCart: "Add to Cart", cartTitle: "Your Cart", cartTotal: "Total Amount:", checkoutBtn: "Proceed to Checkout",
        m_men: "Men", m_women: "Women", m_kids: "Kids", m_shoes: "Shoes", m_caps: "Caps", m_bags: "Bags", m_acc: "Accessories",
        checkoutTitle: "Checkout", payAmount: "Total Payable:", confirmBtn: "Confirm Order",
        emptyCart: "Cart is empty"
    },
    RU: {
        home: "Главная", collection: "Коллекция", about: "О нас", contact: "Контакты",
        categories: "Категории", all: "все", searchPlace: "Поиск товаров...",
        addToCart: "В корзину", cartTitle: "Ваша Корзина", cartTotal: "Итоговая сумма:", checkoutBtn: "Перейти к оплате",
        m_men: "Мужчины", m_women: "Женщины", m_kids: "Дети", m_shoes: "Обувь", m_caps: "Головные уборы", m_bags: "Сумки", m_acc: "Аксессуары",
        checkoutTitle: "Оформление заказа", payAmount: "К оплате:", confirmBtn: "Подтвердить заказ",
        emptyCart: "Корзина пуста"
    }
};

function displayProducts(filteredList = products) {
    const homeGrid = document.getElementById('home-products-grid');
    const collectionGrid = document.getElementById('collection-products-grid');
    let productHTML = '';
    
    filteredList.forEach(p => {
        productHTML += `
            <div class="product-card">
                <div class="img-container">
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                    <button class="add-to-cart-btn" onclick="addToCart(${p.id})">${translations[currentLang].addToCart}</button>
                </div>
                <h3>${p.name}</h3>
                <div class="price">${p.price} USD</div>
            </div>
        `;
    });

    if (homeGrid) homeGrid.innerHTML = productHTML;
    if (collectionGrid) collectionGrid.innerHTML = productHTML;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
    document.getElementById('cart-overlay').style.display = 'block';
    document.getElementById('cart-drawer').classList.add('open');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    const container = document.getElementById('cart-items-container');
    let cartHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.img}" alt="${item.name}">
                    <div><h4>${item.name}</h4><p>${item.price} USD</p></div>
                </div>
                <span class="remove-item" onclick="removeFromCart(${index})">X</span>
            </div>
        `;
    });

    container.innerHTML = cart.length === 0 ? `<p style="color:#8e8e93; text-align:center;">${translations[currentLang].emptyCart}</p>` : cartHTML;
    document.getElementById('cart-total-price').innerText = total + " USD";
    
    const checkoutTotal = document.getElementById('checkout-total-price');
    if(checkoutTotal) checkoutTotal.innerText = total + " USD";
}

// TO'LOV SAHIFASINI OCHISH
function openCheckoutModal() {
    if(cart.length === 0) return alert(translations[currentLang].emptyCart);
    closeAllModals();
    setTimeout(() => {
        document.getElementById('checkout-overlay').style.display = 'block';
        document.getElementById('checkout-modal').classList.add('open');
    }, 200);
}

function closeAllModals() {
    document.getElementById('search-modal').classList.remove('open');
    if(document.getElementById('profile-modal')) document.getElementById('profile-modal').classList.remove('open');
    document.getElementById('checkout-modal').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    
    if(document.getElementById('profile-overlay')) document.getElementById('profile-overlay').style.display = 'none';
    document.getElementById('checkout-overlay').style.display = 'none';
    document.getElementById('cart-overlay').style.display = 'none';
}

function filterByStory(categoryKey) {
    const filtered = products.filter(p => p.category === categoryKey);
    document.getElementById('main-grid-title').innerText = translations[currentLang][`m_${categoryKey}`].toUpperCase();
    displayProducts(filtered);
    document.getElementById('home-products-grid').scrollIntoView({ behavior: 'smooth' });
}

function switchPage(pageId, element) {
    document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
    const activePage = document.getElementById(`${pageId}-page`);
    if(activePage) activePage.classList.add('active');
    if(element) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }
}

function resetToHome() {
    document.getElementById('main-grid-title').innerText = currentLang === 'UZ' ? "Barcha Mahsulotlar" : currentLang === 'EN' ? "All Products" : "Все Товары";
    displayProducts(products);
    switchPage('home');
}

// 🌐 TILNI ALMASHTIRISH FUNKSIYASI TO'LIQ TUZATILDI
function changeLang(lang) {
    currentLang = lang;
    document.getElementById('lang-btn').innerText = lang;
    document.getElementById('lang-dropdown').style.display = 'none'; // dropdownni yopish
    
    // Menyularni tarjima qilish
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    if(navItems.length >= 4) {
        navItems[0].innerText = translations[lang].home;
        navItems[1].innerText = translations[lang].collection;
        navItems[2].innerText = translations[lang].about;
        navItems[3].innerText = translations[lang].contact;
    }

    // Story-kategoriyalarni tarjima qilish
    const storyNames = document.querySelectorAll('.story-name');
    storyNames.forEach(span => {
        const key = span.getAttribute('data-key');
        if(key && translations[lang][key]) {
            span.innerText = translations[lang][key];
        }
    });

    // Savat interfeysini tarjima qilish
    document.querySelector('.cart-header h2').innerText = translations[lang].cartTitle;
    document.querySelector('.total-wrapper span').innerText = translations[lang].cartTotal;
    document.querySelector('.checkout-btn').innerText = translations[lang].checkoutBtn;
    
    // To'lov interfeysini tarjima qilish
    document.querySelector('.checkout-header h2').innerText = translations[lang].checkoutTitle;
    document.querySelector('.checkout-summary span:first-child').innerText = translations[lang].payAmount;
    document.querySelector('.submit-order-btn').innerText = translations[lang].confirmBtn;

    // Mahsulotlarni qayta chizish (tugma yozuvlari o'zgarishi uchun)
    displayProducts();
    updateCart();
}

function setupEvents() {
    document.getElementById('cart-trigger').addEventListener('click', () => {
        document.getElementById('cart-overlay').style.display = 'block';
        document.getElementById('cart-drawer').classList.add('open');
    });
    
    if(document.getElementById('profile-trigger')) {
        document.getElementById('profile-trigger').addEventListener('click', () => {
            document.getElementById('profile-overlay').style.display = 'block';
            document.getElementById('profile-modal').classList.add('open');
        });
    }
    
    document.getElementById('search-trigger').addEventListener('click', () => document.getElementById('search-modal').classList.add('open'));
    document.getElementById('search-close').addEventListener('click', () => document.getElementById('search-modal').classList.remove('open'));

    document.getElementById('cart-close').addEventListener('click', closeAllModals);
    document.getElementById('cart-overlay').addEventListener('click', closeAllModals);
    document.getElementById('checkout-close').addEventListener('click', closeAllModals);
    
    // 🎯 INPUTGA BOSGANDA OYNAYI YOPILIB KETMASLIGI UCHUN TUZATISH:
    // Faqat qora fonning o'ziga bosilganda yopiladi, modal ichiga bosilganda yopilmaydi.
    document.getElementById('checkout-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('checkout-overlay')) {
            closeAllModals();
        }
    });

    if(document.getElementById('profile-close')) document.getElementById('profile-close').addEventListener('click', closeAllModals);
    if(document.getElementById('profile-overlay')) {
        document.getElementById('profile-overlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('profile-overlay')) closeAllModals();
        });
    }

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert(currentLang === 'UZ' ? "Buyurtmangiz muvaffaqiyatli qabul qilindi!" : currentLang === 'EN' ? "Your order has been successfully placed!" : "Ваш заказ успешно принят!");
        cart = [];
        updateCart();
        closeAllModals();
    });

    // 🌐 TIL DROPDOWN HODISASI
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => {
        langDropdown.style.display = 'none';
    });
}

window.onload = () => {
    products.sort(() => Math.random() - 0.5);
    displayProducts();
    setupEvents();
};