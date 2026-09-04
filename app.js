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
    images: ['img/choctorta-1.jpeg', 'img/chocotorta-2.jpeg'],
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

// Parallax Banner
window.addEventListener('scroll', () => {
  const banner = document.getElementById('parallax-banner');
  if (banner) {
    banner.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }
});

// Lightbox
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-modal').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightbox-modal').classList.add('hidden');
}

// Modal Capas de Postre (Corte Transversal)
function openLayersModal(productId) {
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
  const resultDiv = document.getElementById('roulette-result');
  resultDiv.classList.add('hidden');

  let counter = 0;
  const interval = setInterval(() => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    resultDiv.innerHTML = `<span>🎰 Girando... <strong>${randomProduct.name}</strong></span>`;
    resultDiv.classList.remove('hidden');
    counter++;

    if (counter > 12) {
      clearInterval(interval);
      const chosen = products[Math.floor(Math.random() * products.length)];
      resultDiv.innerHTML = `
        <div>🎯 ¡El Capitán elige para vos: <strong>${chosen.name}</strong>!</div>
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

// Render Catálogo + 3D Tilt Hover
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
            ${product.images.map(imgSrc => `<img src="${imgSrc}" alt="${product.name}" class="slider-img" onclick="openLightbox('${imgSrc}')">`).join('')}
          </div>
          <button class="slider-btn prev" onclick="moveSlider('${product.id}', -1)">❮</button>
          <button class="slider-btn next" onclick="moveSlider('${product.id}', 1)">❯</button>
          <div class="slider-dots">
            <span class="dot active" id="dot-${product.id}-0"></span>
            <span class="dot" id="dot-${product.id}-1"></span>
          </div>
        </div>
        <h3>${product.name}</h3>
        <button class="btn-layers-toggle" onclick="openLayersModal('${product.id}')">🔍 Ver Capas del Postre</button>
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

        <button class="btn-add" onclick="addToCart('${product.id}', event)">Agregar al Vuelo 🛫</button>
      </div>
    `;

    catalogDiv.appendChild(card);
    setupSwipeSupport(product.id);
    setup3DTilt(card);
  });
}

// Hover 3D Tilt
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