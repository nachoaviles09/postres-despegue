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
const selectedSizes = {};
const selectedQuantities = {};
let currentCategory = 'all';

function triggerHaptic(duration = 20) {
  if ('vibrate' in navigator) navigator.vibrate(duration);
}

function renderCatalog(itemsToRender = products) {
  const catalogDiv = document.getElementById('catalog');
  catalogDiv.innerHTML = '';

  if (itemsToRender.length === 0) {
    catalogDiv.innerHTML = '<div class="no-results">🔍 No se encontraron postres.</div>';
    return;
  }

  itemsToRender.forEach((product) => {
    if (!selectedSizes[product.id]) selectedSizes[product.id] = '350g';
    if (!selectedQuantities[product.id]) selectedQuantities[product.id] = 1;

    const currentSize = selectedSizes[product.id];
    const currentQty = selectedQuantities[product.id];
    const currentPrice = product.prices[currentSize];

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div>
        <div class="slider-container">
          <img src="${product.images[0]}" alt="${product.name}" class="slider-img" onclick="openLightbox('${product.images[0]}')">
        </div>
        <h3>${product.name}</h3>
        <button class="btn-layers-toggle" onclick="openLayersModal('${product.id}')">🔍 Ver Capas</button>
        <p class="ingredients"><strong>Ingredientes:</strong> ${product.ingredients}</p>
      </div>
      <div>
        <div class="pills-group">
          <button class="pill-btn ${currentSize === '350g' ? 'active' : ''}" onclick="selectSize('${product.id}', '350g')">350g</button>
          <button class="pill-btn ${currentSize === '500g' ? 'active' : ''}" onclick="selectSize('${product.id}', '500g')">500g</button>
        </div>
        
        <div class="qty-control-row">
          <div class="qty-btn-group">
            <button class="btn-qty" onclick="changeQty('${product.id}', -1)">-</button>
            <span style="padding:0 8px; font-weight:bold;">${currentQty}</span>
            <button class="btn-qty" onclick="changeQty('${product.id}', 1)">+</button>
          </div>
          <div class="price-tag">$${(currentPrice * currentQty).toLocaleString()}</div>
        </div>

        <button class="btn-add" onclick="addToCart('${product.id}')">Agregar 🛫</button>
      </div>
    `;

    catalogDiv.appendChild(card);
  });
}

function selectSize(productId, size) {
  triggerHaptic(12);
  selectedSizes[productId] = size;
  renderCatalog(products);
}

function changeQty(productId, delta) {
  triggerHaptic(12);
  let current = selectedQuantities[productId] || 1;
  current += delta;
  if (current < 1) current = 1;
  selectedQuantities[productId] = current;
  renderCatalog(products);
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
  showToast();
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

  const count350g = cart.filter(item => item.size === '350g').length;
  const isWholesale350g = count350g >= 10;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-msg">Aún no has sumado postres a tu vuelo.</p>';
    cartTotal.innerText = '0';
    promoBanner.classList.add('hidden');
    wholesaleTracker.classList.add('hidden');
    mobileBadge.classList.add('hidden');

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
      <div>
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

function toggleMobileCartSheet(isOpen) {
  triggerHaptic(15);
  const cartSection = document.getElementById('cart-anchor');
  const backdrop = document.getElementById('cart-backdrop');

  if (isOpen) {
    cartSection.classList.add('open-sheet');
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    cartSection.classList.remove('open-sheet');
    backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function toggleAddressField() {
  const deliveryOpt = document.getElementById('cust-delivery').value;
  const addressGroup = document.getElementById('address-group');
  addressGroup.classList.toggle('hidden', deliveryOpt !== 'envio');
}

function checkOpenStatus() {
  const badge = document.getElementById('status-badge');
  badge.innerHTML = '<span class="status-indicator open">🟢 ABIERTO</span>';
}

function showToast() {
  const toast = document.getElementById('toast-notification');
  toast.classList.remove('hidden');
  setTimeout(() => { toast.classList.add('hidden'); }, 2000);
}

function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-modal').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightbox-modal').classList.add('hidden');
}

function openLayersModal(productId) {
  const product = products.find(p => p.id === productId);
  document.getElementById('layers-title').innerText = `Capas de ${product.name}`;
  const list = document.getElementById('layers-list');
  list.innerHTML = product.layers.map((l, i) => `<div style="padding:6px; background:var(--bg-subtle); margin-bottom:4px; border-radius:4px;">${i+1}. ${l}</div>`).join('');
  document.getElementById('layers-modal').classList.remove('hidden');
}

function closeLayersModal() {
  document.getElementById('layers-modal').classList.add('hidden');
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

function openBoardingPassModal() {
  if (cart.length === 0) return alert('El carrito está vacío');
  const name = document.getElementById('cust-name').value;
  if (!name) return alert('Ingresá tu nombre');
  
  toggleMobileCartSheet(false);
  document.getElementById('bp-passenger-name').innerText = name;
  document.getElementById('boarding-pass-modal').classList.remove('hidden');
}

function closeBoardingPassModal() {
  document.getElementById('boarding-pass-modal').classList.add('hidden');
}

function confirmAndSendWhatsApp() {
  closeBoardingPassModal();
  const name = document.getElementById('cust-name').value;
  let msg = `Hola! Soy ${name}, mi pedido es:\n` + cart.map((c, i) => `${i+1}. ${c.name} (${c.size})`).join('\n');
  window.open(`https://wa.me/5493436131681?text=${encodeURIComponent(msg)}`, '_blank');
}

checkOpenStatus();
renderCatalog();