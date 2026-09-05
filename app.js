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

// Vibración Háptica
function triggerHaptic(duration = 20) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

// Gestos Inteligentes adaptados para Móvil y PC
function setupSliderGestures(containerElem, productId, imagesList) {
  let lastTapTime = 0;
  let tapTimeout = null;
  let startX = 0;
  let startY = 0;

  // Eventos táctiles para Celular
  containerElem.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  containerElem.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // 1. Swipe horizontal (Cambiar foto)
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (tapTimeout) clearTimeout(tapTimeout);
      if (diffX > 0) moveSlider(productId, 1);
      else moveSlider(productId, -1);
      return;
    }

    // 2. Toques en pantalla táctil
    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;

      if (tapLength < 350 && tapLength > 0) {
        // Doble toque (Celular) = Carrito
        if (tapTimeout) clearTimeout(tapTimeout);
        e.preventDefault();
        triggerDoubleTapAction(productId, e.changedTouches[0]);
        lastTapTime = 0;
      } else {
        // Un toque (Celular) = Lightbox
        lastTapTime = currentTime;
        tapTimeout = setTimeout(() => {
          const currentIdx = sliderPositions[productId] || 0;
          openLightbox(imagesList[currentIdx]);
        }, 350);
      }
    }
  });

  // Eventos de Mouse para PC (Clic simple = Lightbox / Doble clic = Carrito)
  containerElem.addEventListener('click', (e) => {
    // Evitamos que se dispare si hacen clic en los botones de flecha del slider
    if (e.target.classList.contains('slider-btn')) return;

    if (tapTimeout) clearTimeout(tapTimeout);
    
    tapTimeout = setTimeout(() => {
      const currentIdx = sliderPositions[productId] || 0;
      openLightbox(imagesList[currentIdx]);
    }, 250);
  });

  containerElem.addEventListener('dblclick', (e) => {
    if (tapTimeout) clearTimeout(tapTimeout); // Cancela el clic simple en PC
    triggerDoubleTapAction(productId, e);
  });
}

function triggerDoubleTapAction(productId, event) {
  triggerHaptic([30, 20, 40]);

  const sliderContainer = document.getElementById(`slider-${productId}`);
  if (sliderContainer) {
    const heart = document.createElement('div');
    heart.className = 'double-tap-heart';
    heart.innerText = '❤️✈️';
    sliderContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 800);
  }

  addToCart(productId, event);
}

// Skeleton Loader
function showSkeletonLoader() {
  const catalogDiv = document.getElementById('catalog');
  catalogDiv.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const skel = document.createElement('div');
    skel.className = 'skeleton-card';
    skel.innerHTML = `
      <div class="skeleton-box skeleton-img"></div>
      <div class="skeleton-box skeleton-title"></div>
      <div class="skeleton-box skeleton-text"></div>
      <div class="skeleton-box skeleton-btn"></div>
    `;
    catalogDiv.appendChild(skel);
  }
}

// Parallax Banner
window.addEventListener('scroll', () => {
  const banner = document.getElementById('parallax-banner');
  if (banner) {
    banner.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }
});

function toggleMobileCartSheet(show) {
  const sheet = document.getElementById('mobile-cart-sheet') || document.querySelector('.cart-section');
  const backdrop = document.getElementById('cart-backdrop');

  if (!sheet) return;

  if (show) {
    sheet.classList.remove('hidden');
    sheet.classList.add('open-sheet');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.classList.add('cart-open');
    document.body.style.overflow = 'hidden';
  } else {
    sheet.classList.add('hidden');
    sheet.classList.remove('open-sheet');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.classList.remove('cart-open');
    document.body.style.overflow = '';
  }
}

// Lightbox
function openLightbox(src) {
  triggerHaptic(15);
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-modal').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightbox-modal').classList.add('hidden');
}

// Modal Capas
function openLayersModal(productId) {
  triggerHaptic(15);
  const product = products.find(p => p.id === productId);
  document.getElementById('layers-title').innerText = `Capas de ${product.name}`;
  
  const list = document.getElementById('layers-list');
  list.className = 'layers-stack';
  list.innerHTML = '';

  product.layers.forEach((layerText, i) => {
    const item = document.createElement('div');
    item.className = 'layer-item';
    item.innerText = `${i + 1}. ${layerText}`;
    list.appendChild(item);
  });

  document.getElementById('layers-modal').classList.remove('hidden');
}

function closeLayersModal() {
  document.getElementById('layers-modal').classList.add('hidden');
}

// Ruleta del Antojo
function spinRoulette() {
  triggerHaptic(30);
  const resultDiv = document.getElementById('roulette-result');
  resultDiv.classList.add('hidden');

  let counter = 0;
  const interval = setInterval(() => {
    triggerHaptic(10);
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    resultDiv.innerHTML = `<span>🎰 Girando... <strong>${randomProduct.name}</strong></span>`;
    resultDiv.classList.remove('hidden');
    counter++;

    if (counter > 12) {
      clearInterval(interval);
      triggerHaptic([40, 30, 50]);
      const chosen = products[Math.floor(Math.random() * products.length)];
      resultDiv.innerHTML = `
        <div>🎯 ¡Elegimos para vos: <strong>${chosen.name}</strong>!</div>
        <button class="btn-accept-roulette" onclick="addToCart('${chosen.id}')">¡Lo quiero! 🛫</button>
      `;
    }
  }, 100);
}

// Tema Claro / Oscuro
function initTheme() {
  const savedTheme = localStorage.getItem('despegue_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-toggle').innerText = '☀️';
  }
}

function toggleTheme() {
  triggerHaptic(15);
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('despegue_theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-toggle').innerText = isDark ? '☀️' : '🌙';
}

// Horarios Dinámicos
function checkOpenStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  let isOpen = false;
  if (day === 5 || day === 6 || day === 0) {
    if (hour >= 11 || hour < 2) isOpen = true;
  } else {
    if (hour >= 11 && hour < 24) isOpen = true;
  }

  const badge = document.getElementById('status-badge');
  badge.innerHTML = isOpen 
    ? '<span class="status-indicator open">🟢 ABIERTO</span>' 
    : '<span class="status-indicator closed">🔴 CERRADO</span>';
}

// Render Catálogo
function renderCatalog(itemsToRender = products) {
  const catalogDiv = document.getElementById('catalog');
  catalogDiv.innerHTML = '';

  if (itemsToRender.length === 0) {
    catalogDiv.innerHTML = '<div class="no-results">🔍 No se encontraron postres que coincidan con tu búsqueda.</div>';
    return;
  }

  itemsToRender.forEach((product, idx) => {
    sliderPositions[product.id] = 0;
    if (!selectedSizes[product.id]) selectedSizes[product.id] = '350g';
    if (!selectedQuantities[product.id]) selectedQuantities[product.id] = 1;

    const currentSize = selectedSizes[product.id];
    const currentQty = selectedQuantities[product.id];
    const currentPrice = product.prices[currentSize];

    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${idx * 0.08}s`;

    card.innerHTML = `
      <div>
        <div class="slider-container" id="slider-${product.id}">
          <div class="slider-track" id="track-${product.id}">
            ${product.images.map((imgSrc, imgIndex) => `
              <img src="${imgSrc}" alt="${product.name}" class="slider-img" id="img-${product.id}-${imgIndex}" onclick="openLightbox(event, '${product.id}', ${imgIndex})" style="cursor: pointer;">
            `).join('')}
          </div>
          <button class="slider-btn prev" onclick="moveSlider('${product.id}', -1)">❮</button>
          <button class="slider-btn next" onclick="moveSlider('${product.id}', 1)">❯</button>
          <div class="slider-dots">
            <span class="dot active" id="dot-${product.id}-0"></span>
            <span class="dot" id="dot-${product.id}-1"></span>
          </div>
        </div>
        <h3>${product.name}</h3>
        <button class="btn-layers-toggle" onclick="openLayersModal('${product.id}')">🔍 Ver Capas</button>
        <p class="ingredients"><strong>Ingredientes:</strong> ${product.ingredients}</p>
      </div>
      <div>
        <div class="size-selector-pills">
          <label>Tamaño:</label>
          <div class="pills-group">
            <button class="pill-btn ${currentSize === '350g' ? 'active' : ''}" id="pill-${product.id}-350g" onclick="selectSize('${product.id}', '350g')">350g</button>
            <button class="pill-btn ${currentSize === '500g' ? 'active' : ''}" id="pill-${product.id}-500g" onclick="selectSize('${product.id}', '500g')">500g</button>
          </div>
        </div>
        
        <div class="qty-control-row">
          <div class="qty-btn-group">
            <button class="btn-qty" onclick="changeQty('${product.id}', -1)">-</button>
            <span class="qty-value" id="qty-${product.id}">${currentQty}</span>
            <button class="btn-qty" onclick="changeQty('${product.id}', 1)">+</button>
          </div>
          <div class="price-tag" id="price-${product.id}">$${(currentPrice * currentQty).toLocaleString()}</div>
        </div>

        <button class="btn-add" onclick="addToCart('${product.id}', event)">Agregar 🛫</button>
      </div>
    `;

    catalogDiv.appendChild(card);

    // Asignar los gestos inteligentes
    const sliderContainer = document.getElementById(`slider-${product.id}`);
    if (sliderContainer) {
      setupSliderGestures(sliderContainer, product.id, product.images);
    }

    setup3DTilt(card);
  });
}

function setup3DTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);
    card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

function changeQty(productId, delta) {
  triggerHaptic(12);
  let current = selectedQuantities[productId] || 1;
  current += delta;
  if (current < 1) current = 1;
  selectedQuantities[productId] = current;

  document.getElementById(`qty-${productId}`).innerText = current;
  const product = products.find(p => p.id === productId);
  const size = selectedSizes[productId] || '350g';
  const unitPrice = product.prices[size];

  document.getElementById(`price-${productId}`).innerText = `$${(unitPrice * current).toLocaleString()}`;
}

function addCombo(comboType) {
  triggerHaptic(25);
  if (comboType === 'pareja') {
    const oreo = products.find(p => p.id === 'oreo');
    const chocotorta = products.find(p => p.id === 'chocotorta');
    cart.push({ name: oreo.name, size: '350g', basePrice: oreo.prices['350g'] });
    cart.push({ name: chocotorta.name, size: '350g', basePrice: chocotorta.prices['350g'] });
  } else if (comboType === 'familiar') {
    ['tiramisu', 'oreo', 'chocotorta', 'pepitos'].forEach(id => {
      const p = products.find(prod => prod.id === id);
      cart.push({ name: p.name, size: '500g', basePrice: p.prices['500g'] });
    });
  }
  renderCart();
  showToast();
}

function setCategoryFilter(category, btnElement) {
  triggerHaptic(15);
  currentCategory = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');

  const radarSweep = document.getElementById('radar-sweep');
  radarSweep.classList.remove('hidden');
  setTimeout(() => radarSweep.classList.add('hidden'), 600);

  showSkeletonLoader();
  setTimeout(() => {
    applyFilters();
  }, 250);
}

function applyFilters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  const filtered = products.filter(product => {
    const matchesCategory = (currentCategory === 'all') || (product.category === currentCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                          product.ingredients.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  renderCatalog(filtered);
}

function selectSize(productId, size) {
  triggerHaptic(12);
  selectedSizes[productId] = size;
  const product = products.find(p => p.id === productId);

  document.getElementById(`pill-${productId}-350g`).classList.toggle('active', size === '350g');
  document.getElementById(`pill-${productId}-500g`).classList.toggle('active', size === '500g');

  const qty = selectedQuantities[productId] || 1;
  document.getElementById(`price-${productId}`).innerText = `$${(product.prices[size] * qty).toLocaleString()}`;
}

function moveSlider(productId, direction) {
  triggerHaptic(10);
  const product = products.find(p => p.id === productId);
  const totalImages = product.images.length;
  
  let currentIdx = sliderPositions[productId] + direction;
  if (currentIdx < 0) currentIdx = totalImages - 1;
  if (currentIdx >= totalImages) currentIdx = 0;

  sliderPositions[productId] = currentIdx;
  const track = document.getElementById(`track-${productId}`);
  track.style.transform = `translateX(-${currentIdx * 100}%)`;

  for (let i = 0; i < totalImages; i++) {
    const dot = document.getElementById(`dot-${productId}-${i}`);
    if (dot) dot.classList.toggle('active', i === currentIdx);
  }
}

// Fly to Cart
function animateFlyToCart(event, imgSrc) {
  const target = window.innerWidth <= 768 
    ? document.getElementById('mobile-cart-badge') 
    : document.getElementById('cart-anchor');

  if (!target) return;

  const targetRect = target.getBoundingClientRect();
  const clone = document.createElement('img');
  clone.src = imgSrc;
  clone.className = 'flying-clone';

  const startX = event ? (event.clientX || window.innerWidth / 2) : window.innerWidth / 2;
  const startY = event ? (event.clientY || window.innerHeight / 2) : window.innerHeight / 2;

  clone.style.left = `${startX}px`;
  clone.style.top = `${startY}px`;

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.left = `${targetRect.left + (targetRect.width / 2) - 15}px`;
    clone.style.top = `${targetRect.top + (targetRect.height / 2) - 15}px`;
    clone.style.width = '20px';
    clone.style.height = '20px';
    clone.style.opacity = '0.2';
  });

  setTimeout(() => { clone.remove(); }, 800);
}

function addToCart(productId, event) {
  triggerHaptic(25);
  const product = products.find(p => p.id === productId);
  const size = selectedSizes[productId] || '350g';
  const qty = selectedQuantities[productId] || 1;

  // 1. Suma el producto al carrito
  for (let i = 0; i < qty; i++) {
    cart.push({
      name: product.name,
      size: size,
      basePrice: product.prices[size]
    });
  }

  // 2. Animación visual temporal en el botón presionado
  if (event && event.target) {
    const btn = event.target;
    const originalText = btn.innerText;
    
    btn.classList.add('added-success');
    btn.innerText = '✓ ¡Agregado!';
    
    setTimeout(() => {
      btn.classList.remove('added-success');
      btn.innerText = originalText;
    }, 1200);
  }

  // 3. Resetea cantidad y actualiza interfaz
  selectedQuantities[productId] = 1;
  renderCart();
  showToast();
}

function showToast() {
  const toast = document.getElementById('toast-notification');
  toast.classList.remove('hidden');
  setTimeout(() => { toast.classList.add('hidden'); }, 2200);
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

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-msg">Aún no has sumado postres a tu vuelo.</p>';
    cartTotal.innerText = '0';
    promoBanner.classList.add('hidden');
    wholesaleTracker.classList.add('hidden');
    mobileBadge.classList.add('hidden');
    return;
  }

  cartContainer.innerHTML = '';

  const count350g = cart.filter(item => item.size === '350g').length;
  const isWholesale350g = count350g >= 10;

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
      document.getElementById('tracker-hint-text').innerHTML = ` Te faltan <strong>${remaining} postre${remaining > 1 ? 's' : ''} de 350g</strong> para activar el descuento mayorista.`;
      
      wholesaleTracker.classList.remove('hidden');
    } else {
      wholesaleTracker.classList.add('hidden');
    }
  }

  let total = 0;

  cart.forEach((item, index) => {
    let finalUnitPrice = item.basePrice;
    if (isWholesale350g && item.size === '350g') {
      finalUnitPrice = 4000;
    }
    total += finalUnitPrice;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong> (${item.size})<br>
        <small>$${finalUnitPrice.toLocaleString()} ${isWholesale350g && item.size === '350g' ? '🏷️ (Mayorista)' : ''}</small>
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

function toggleAddressField() {
  triggerHaptic(10);
  const deliveryOpt = document.getElementById('cust-delivery').value;
  const addressGroup = document.getElementById('address-group');
  
  if (deliveryOpt === 'envio') {
    addressGroup.classList.remove('hidden');
    document.getElementById('cust-address').required = true;
  } else {
    addressGroup.classList.add('hidden');
    document.getElementById('cust-address').required = false;
  }
}

// Shake Error + Boarding Pass Modal
function openBoardingPassModal() {
  triggerHaptic(20);
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agrega algún postre primero.');
    return;
  }

  const nameInput = document.getElementById('cust-name');
  const addressInput = document.getElementById('cust-address');
  const delivery = document.getElementById('cust-delivery').value;
  const groupName = document.getElementById('group-name');
  const groupAddr = document.getElementById('address-group');

  let hasError = false;

  if (!nameInput.value.trim()) {
    triggerHaptic([30, 30, 30]);
    groupName.classList.add('shake-error');
    setTimeout(() => groupName.classList.remove('shake-error'), 500);
    hasError = true;
  }

  if (delivery === 'envio' && !addressInput.value.trim()) {
    triggerHaptic([30, 30, 30]);
    groupAddr.classList.add('shake-error');
    setTimeout(() => groupAddr.classList.remove('shake-error'), 500);
    hasError = true;
  }

  if (hasError) return;

  if (window.innerWidth <= 768) {
    toggleMobileCartSheet(false);
  }

  const payment = document.getElementById('cust-payment').value;

// Lógica para mostrar u ocultar el Alias según el pago
  const aliasBox = document.getElementById('bp-alias-box');
  if (aliasBox) {
    if (payment === 'transferencia') {
      aliasBox.classList.remove('hidden');
    } else {
      aliasBox.classList.add('hidden');
    }
  }

  document.getElementById('bp-passenger-name').innerText = nameInput.value.trim();
  document.getElementById('bp-delivery-type').innerText = delivery === 'envio' ? `Envío Moto Uber (${addressInput.value.trim()})` : 'Retiro en local';
  document.getElementById('bp-payment-method').innerText = payment === 'efectivo' ? 'Efectivo' : 'Transferencia Bancaria';

  const count350g = cart.filter(item => item.size === '350g').length;
  const isWholesale350g = count350g >= 10;
  let total = 0;
  let itemsHtml = '';

  cart.forEach((item, index) => {
    let price = item.basePrice;
    if (isWholesale350g && item.size === '350g') price = 4000;
    total += price;
    itemsHtml += `${index + 1}. ${item.name} (${item.size}) - $${price.toLocaleString()}<br>`;
  });

  document.getElementById('bp-items-list').innerHTML = itemsHtml;
  document.getElementById('bp-total-amount').innerText = `$${total.toLocaleString()}`;

  document.getElementById('boarding-pass-modal').classList.remove('hidden');
}

function closeBoardingPassModal() {
  triggerHaptic(15);
  document.getElementById('boarding-pass-modal').classList.add('hidden');
}

// Confirmar y Avión Takeoff
function confirmAndSendWhatsApp() {
  triggerHaptic([40, 50, 60]);
  localStorage.setItem('despegue_last_order', JSON.stringify(cart));

  closeBoardingPassModal();

  const plane = document.getElementById('takeoff-plane');
  plane.classList.remove('hidden');

  setTimeout(() => {
    plane.classList.add('hidden');

    const name = document.getElementById('cust-name').value.trim();
    const delivery = document.getElementById('cust-delivery').value;
    const address = document.getElementById('cust-address').value.trim();
    const payment = document.getElementById('cust-payment').value;

    const phoneNumber = '5493436131681';
    let message = '✈️ *NUEVO PEDIDO - POSTRES DESPEGUE*\n';
    message += '_"Tu antojo listo para despegar"_\n\n';
    
    message += `👤 *Pasajero:* ${name}\n`;
    if (delivery === 'envio') {
      message += `🛵 *Entrega:* Envío Moto Uber a: ${address}\n`;
    } else {
      message += `📍 *Entrega:* Retiro en local (López Jordán 1115)\n`;
    }

    let paymentText = payment === 'efectivo' ? 'Efectivo' : 'Transferencia Bancaria';
    message += `💳 *Medio de pago:* ${paymentText}\n\n`;
    message += `📋 *DETALLE DEL PEDIDO:*\n`;

    const count350g = cart.filter(item => item.size === '350g').length;
    const isWholesale350g = count350g >= 10;
    let total = 0;

    cart.forEach((item, index) => {
      let finalUnitPrice = item.basePrice;
      if (isWholesale350g && item.size === '350g') {
        finalUnitPrice = 4000;
      }
      message += `${index + 1}. ${item.name} (${item.size}) - $${finalUnitPrice.toLocaleString()}\n`;
      total += finalUnitPrice;
    });

    message += `\n📦 *Cantidad de postres:* ${cart.length}`;
    message += `\n💰 *Total Estimado:* $${total.toLocaleString()}`;

    if (isWholesale350g) {
      message += `\n🎉 *Promo Mayorista (10+ postres de 350g):* Liquidados a $4.000 c/u.`;
    }

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = waUrl;
    } else {
      window.open(waUrl, '_blank');
    }
  }, 1000);
}

function checkLastOrderAvailable() {
  if (localStorage.getItem('despegue_last_order')) {
    document.getElementById('btn-reorder').classList.remove('hidden');
  }
}

function loadLastOrder() {
  triggerHaptic(20);
  const lastOrder = localStorage.getItem('despegue_last_order');
  if (lastOrder) {
    cart = JSON.parse(lastOrder);
    renderCart();
    showToast();
  }
}

// Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA lista', reg))
      .catch(err => console.error('Error PWA', err));
  });
}
// Función para copiar el Alias al portapapeles
function copyAlias() {
  triggerHaptic(20);
  const aliasText = document.getElementById('bp-alias-text').innerText;
  
  navigator.clipboard.writeText(aliasText).then(() => {
    const btn = document.querySelector('.btn-copy-alias');
    btn.classList.add('copied');
    btn.innerText = "✓ ¡Copiado!";
    
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerText = "📋 Copiar Alias";
    }, 1800);
  }).catch(() => {
    alert("No se pudo copiar automáticamente. El alias es: " + aliasText);
  });
}

// Variables globales exclusivas para el visor flotante
let currentLightboxImages = [];
let currentLightboxIndex = 0;

// Función para abrir la foto ampliada evitando la propagación al carrito
function openLightbox(event, productId, imageIndex = 0) {
  if (event) {
    event.stopPropagation(); // Frenamos el evento para que NO agregue al carrito
    event.preventDefault();
  }

  triggerHaptic(20);
  const product = products.find(p => p.id === productId);

  if (product && product.images && product.images.length > 0) {
    currentLightboxImages = product.images;
    currentLightboxIndex = imageIndex;
  } else {
    currentLightboxImages = [productId];
    currentLightboxIndex = 0;
  }

  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('hidden');
  updateLightboxContent();
}

// Actualiza la imagen y mantiene visibles las flechas sin que se borren
function updateLightboxContent() {
  const imgElement = document.getElementById('lightbox-img');
  const counterElement = document.getElementById('lightbox-counter');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!imgElement) return;

  imgElement.src = currentLightboxImages[currentLightboxIndex];

  if (currentLightboxImages.length > 1) {
    if (prevBtn) prevBtn.style.setProperty('display', 'flex', 'important');
    if (nextBtn) nextBtn.style.setProperty('display', 'flex', 'important');
    if (counterElement) {
      counterElement.style.setProperty('display', 'block', 'important');
      counterElement.innerText = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
    }
  } else {
    if (prevBtn) prevBtn.style.setProperty('display', 'none', 'important');
    if (nextBtn) nextBtn.style.setProperty('display', 'none', 'important');
    if (counterElement) counterElement.style.setProperty('display', 'none', 'important');
  }
}

// Cambiar de foto sin cerrar ni reiniciar
function changeLightboxImage(event, direction) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  triggerHaptic(15);
  currentLightboxIndex += direction;

  if (currentLightboxIndex < 0) {
    currentLightboxIndex = currentLightboxImages.length - 1;
  } else if (currentLightboxIndex >= currentLightboxImages.length) {
    currentLightboxIndex = 0;
  }

  updateLightboxContent();
}

// Cerrar el visor
function closeLightbox(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.add('hidden');
}

// Inicialización
initTheme();
checkOpenStatus();
renderCatalog();
checkLastOrderAvailable();