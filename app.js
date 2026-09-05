const products = [
  {
    id: 'tiramisu',
    name: 'TIRAMISÚ',
    category: 'clasicos',
    ingredients: 'Base de galletitas vainilla bañadas en café, crema tiramisú, galletitas vainilla bañadas en café y crema tiramisú.',
    layers: ['Base de galletitas vainilla bañadas en café', 'Crema tiramisú artesanal', 'Segunda capa de galletitas en café', 'Lluvia de cacao & crema tiramisú superior'],
    images: ['img/tiramisú-1.jpeg', 'img/tiramisú-2.jpeg'],
    prices: { '350g': 6000, '500g': 6800 }
  },
  {
    id: 'oreo',
    name: 'OREO',
    category: 'oreo',
    ingredients: 'Base de galletitas Oreo, dulce de leche repostero y crema de oreo.',
    layers: ['Base crocante de galletitas Oreo', 'Dulce de leche repostero cremoso', 'Crema suave de Oreo con trozos de galletita'],
    images: ['img/oreo-1.jpeg', 'img/oreo-2.jpeg'],
    prices: { '350g': 6000, '500g': 6800 }
  },
  {
    id: 'chocotorta',
    name: 'CHOCOTORTA',
    category: 'clasicos',
    ingredients: 'Base de galletitas chocolinas, crema chocotorta y más galletitas chocolinas.',
    layers: ['Base de galletitas Chocolinas', 'Crema de Chocotorta artesanal', 'Segunda capa de Chocolinas', 'Cobertura cremosa de Chocotorta'],
    images: ['img/chocotorta-1.jpeg', 'img/chocotorta-2.jpeg'],
    prices: { '350g': 6000, '500g': 6800 }
  },
  {
    id: 'chocooreo',
    name: 'CHOCO-OREO',
    category: 'oreo',
    ingredients: 'Base de galletitas oreo, crema chocotorta y más galletitas oreo.',
    layers: ['Base de galletitas Oreo picadas', 'Crema Chocotorta suave', 'Capa intermedia de Oreo', 'Crema especial & trozos de Oreo'],
    images: ['img/chocooreo-1.jpeg', 'img/chocooreo-2.jpeg'],
    prices: { '350g': 6000, '500g': 6800 }
  },
  {
    id: 'pepitos',
    name: 'PEPITOS',
    category: 'clasicos',
    ingredients: 'Base de galletitas pepitos, dulce de leche repostero, chips de chocolate y crema chantillí.',
    layers: ['Base de galletitas Pepitos con chispas', 'Dulce de leche repostero abundante', 'Crema chantillí', 'Chispas de chocolate semi-amargo'],
    images: ['img/pepito-1.jpeg', 'img/pepitos-2.jpeg'],
    prices: { '350g': 6000, '500g': 6800 }
  },
  {
    id: 'banana-split',
    name: 'BANANA SPLIT',
    category: 'frutales',
    ingredients: 'Base de galletitas de vainilla, dulce de leche repostero, banana, crema chantillí y chips de chocolate.',
    layers: ['Base de vainillas', 'Dulce de leche repostero', 'Rodajas de banana fresca', 'Crema chantillí & chips de chocolate'],
    images: ['img/bana split-1.jpeg', 'img/bana split-2.jpeg'],
    prices: { '350g': 6000, '500g': 6800 }
  }
];

let cart = [];
const sliderPositions = {};
const selectedSizes = {};
const selectedQuantities = {};
let currentCategory = 'all';

function triggerHaptic(duration = 20) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

function addToCart(productId) {
  triggerHaptic(25);
  const product = products.find(p => p.id === productId);
  const size = selectedSizes[productId] || '350g';
  const qty = selectedQuantities[productId] || 1;

  for (let i = 0; i < qty; i++) {
    cart.push({
      name: product.name,
      size: size,
      basePrice: product.prices[size]
    });
  }

  selectedQuantities[productId] = 1;
  renderCart();
}

function removeFromCart(index) {
  triggerHaptic(15);
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const promoBanner = document.getElementById('promo-banner');
  const wholesaleTracker = document.getElementById('wholesale-tracker');
  const mobileBadge = document.getElementById('mobile-cart-badge');

  // Recalcular contador exacto de postres de 350g
  const count350g = cart.filter(item => item.size === '350g').length;
  const isWholesale350g = count350g >= 10;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-msg">Aún no has sumado postres a tu vuelo.</p>';
    cartTotal.innerText = '0';
    promoBanner.classList.add('hidden');
    wholesaleTracker.classList.add('hidden');
    mobileBadge.classList.add('hidden');

    // Resetea explícitamente el contador y la barra a 0
    document.getElementById('tracker-count-text').innerText = '0 de 10';
    document.getElementById('progress-bar-fill').style.width = '0%';
    return;
  }

  cartContainer.innerHTML = '';

  if (isWholesale350g) {
    promoBanner.classList.remove('hidden');
    wholesaleTracker.classList.add('hidden');
  } else {
    promoBanner.classList.add('hidden');
    if (count350g > 0 && count350g < 10) {
      const remaining = 10 - count350g;
      const percentage = (count350g / 10) * 100;
      
      document.getElementById('tracker-count-text').innerText = `${count350g} de 10`;
      document.getElementById('progress-bar-fill').style.width = `${percentage}%`;
      document.getElementById('tracker-hint-text').innerHTML = `💡 Te faltan <strong>${remaining} postre${remaining > 1 ? 's' : ''} de 350g</strong> para activar la promo.`;
      wholesaleTracker.classList.remove('hidden');
    } else {
      wholesaleTracker.classList.add('hidden');
      document.getElementById('tracker-count-text').innerText = '0 de 10';
      document.getElementById('progress-bar-fill').style.width = '0%';
    }
  }

  let total = 0;
  cart.forEach((item, index) => {
    let finalUnitPrice = item.basePrice;
    if (isWholesale350g && item.size === '350g') finalUnitPrice = 4000;
    total += finalUnitPrice;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong> (${item.size})<br>
        <small>$${finalUnitPrice.toLocaleString()}</small>
      </div>
      <button class="btn-remove" onclick="removeFromCart(${index})">X</button>
    `;
    cartContainer.appendChild(itemDiv);
  });

  cartTotal.innerText = total.toLocaleString();
  document.getElementById('mobile-cart-count').innerText = cart.length;
  document.getElementById('mobile-cart-total').innerText = total.toLocaleString();
  mobileBadge.classList.remove('hidden');
}

function renderCatalog() {
  const catalogDiv = document.getElementById('catalog');
  catalogDiv.innerHTML = '';

  products.forEach((product) => {
    selectedSizes[product.id] = '350g';
    selectedQuantities[product.id] = 1;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <div class="slider-container">
          <img src="${product.images[0]}" alt="${product.name}" class="slider-img">
        </div>
        <h3>${product.name}</h3>
        <p class="ingredients"><strong>Ingredientes:</strong> ${product.ingredients}</p>
      </div>
      <div>
        <button class="btn-add" onclick="addToCart('${product.id}')">Agregar 🛫</button>
      </div>
    `;
    catalogDiv.appendChild(card);
  });
}

function toggleAddressField() {
  const deliveryOpt = document.getElementById('cust-delivery').value;
  const addressGroup = document.getElementById('address-group');
  addressGroup.classList.toggle('hidden', deliveryOpt !== 'envio');
}

function initTheme() {
  const savedTheme = localStorage.getItem('despegue_theme');
  if (savedTheme === 'dark') document.body.classList.add('dark-theme');
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

function checkOpenStatus() {
  const badge = document.getElementById('status-badge');
  badge.innerHTML = '<span class="status-indicator open">🟢 ABIERTO</span>';
}

initTheme();
checkOpenStatus();
renderCatalog();