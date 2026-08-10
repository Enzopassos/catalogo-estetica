import { Service } from './models/Service.js';
import { CartService } from './services/CartService.js';
import { WhatsAppService } from './services/WhatsAppService.js';
import { ServiceCard } from './components/ServiceCard.js';
import { CartDrawer } from './components/CartDrawer.js';

// Service Catalog Database
const SERVICES_DATA = [
  new Service({
    id: 'maq-social',
    title: 'Maquiagem Social Glam',
    category: 'maquiagem',
    price: 180.00,
    durationMinutes: 60,
    description: 'Produção completa com técnicas de iluminação, pele blindada resistente à água e suor, cílios de alta qualidade e acabamento editorial duradouro.',
    image: 'images/services/makeup_glam.png',
    addons: [
      { id: 'cilios-3d', name: 'Cílios 3D Premium', price: 25.00 },
      { id: 'prep-express', name: 'Skincare Prep Glow', price: 30.00 }
    ]
  }),
  new Service({
    id: 'maq-noiva',
    title: 'Maquiagem Noiva & Madrinha',
    category: 'maquiagem',
    price: 280.00,
    durationMinutes: 90,
    description: 'Maquiagem ultra resistente com consultoria prévia de estilo, fixação HD para foto e vídeo, hidratação profunda e produtos de alta costura.',
    image: 'images/services/makeup_glam.png',
    addons: [
      { id: 'kit-retoque', name: 'Kit Retoque Batom & Pó', price: 35.00 },
      { id: 'colo-glow', name: 'Iluminação de Colo e Ombros', price: 40.00 }
    ]
  }),
  new Service({
    id: 'sob-lamination',
    title: 'Brow Lamination + Design',
    category: 'sobrancelha',
    price: 130.00,
    durationMinutes: 50,
    description: 'Técnica de alinhamento dos fios naturais para sobrancelhas mais encorpadas, selvagens e alinhadas. Inclui design geométrico e nutrição com vitaminas.',
    image: 'images/services/brow_lamination.png',
    addons: [
      { id: 'tintura-fios', name: 'Coloração de Fios (Refectocil)', price: 30.00 },
      { id: 'spa-sobrancelha', name: 'Argiloterapia Calmante', price: 20.00 }
    ]
  }),
  new Service({
    id: 'sob-design-henna',
    title: 'Design Personalizado + Henna',
    category: 'sobrancelha',
    price: 75.00,
    durationMinutes: 40,
    description: 'Mapeamento facial exclusivo de acordo com visagismo, remoção precisa de fios com pinça/linha e aplicação de henna natural sob medida.',
    image: 'images/services/brow_lamination.png',
    addons: [
      { id: 'nutricao-fios', name: 'Nutrição com Óleo de Rícino Pure', price: 15.00 }
    ]
  }),
  new Service({
    id: 'est-limpeza-pele',
    title: 'Limpeza de Pele Deep Glow',
    category: 'estetica',
    price: 150.00,
    durationMinutes: 75,
    description: 'Protocolo de higienização profunda, emoliência sem dor, extração de cravos, peeling ultrassônico, máscara calmante e fototerapia LED.',
    image: 'images/services/facial_spa.png',
    addons: [
      { id: 'mascara-ouro', name: 'Máscara Hidratante Ouro 24k', price: 45.00 },
      { id: 'massagem-jade', name: 'Massagem Facial com Roller Jade', price: 25.00 }
    ]
  }),
  new Service({
    id: 'est-spa-labial',
    title: 'Hydra Gloss & Spa Labial',
    category: 'estetica',
    price: 90.00,
    durationMinutes: 35,
    description: 'Tratamento regenerador intensivo com microagulhamento de ácido hialurônico e esfoliação suave. Remove pelinhas, hidrata profundamente e proporciona efeito pump volumoso natural.',
    image: 'images/services/facial_spa.png',
    addons: [
      { id: 'gloss-homecare', name: 'Gloss Regenerador Homecare', price: 35.00 }
    ]
  })
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // WhatsApp sister's phone number (configured here)
  const SISTER_WHATSAPP_NUMBER = '5511999999999';

  const cartService = new CartService();
  const whatsAppService = new WhatsAppService(SISTER_WHATSAPP_NUMBER);
  const cartDrawer = new CartDrawer({ cartService, whatsAppService });

  const categorySelectionView = document.getElementById('categorySelectionView');
  const servicesListingView = document.getElementById('servicesListingView');
  const categoryNav = document.getElementById('categoryNav');
  const btnBackToCategories = document.getElementById('btnBackToCategories');
  const categoryCards = document.querySelectorAll('.category-card');
  const activeCategoryTitle = document.getElementById('activeCategoryTitle');
  const activeCategoryTag = document.getElementById('activeCategoryTag');

  const servicesContainer = document.getElementById('servicesContainer');
  const categoryChips = document.querySelectorAll('.category-nav .chip');
  
  const stickyCartBar = document.getElementById('stickyCartBar');
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const btnOpenCheckout = document.getElementById('btnOpenCheckout');

  let activeCategory = null;

  const categoryTitles = {
    maquiagem: 'Procedimentos de Maquiagem',
    sobrancelha: 'Design & Sobrancelhas',
    estetica: 'Tratamentos Estéticos',
    todos: 'Todos os Procedimentos'
  };

  const categoryTags = {
    maquiagem: 'Maquiagem',
    sobrancelha: 'Sobrancelha',
    estetica: 'Estética Geral',
    todos: 'Cardápio Completo'
  };

  // Show Services View for a chosen category
  function openCategoryView(categoryKey) {
    activeCategory = categoryKey;

    // Update active category chips
    categoryChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === categoryKey);
    });

    // Update headers
    if (activeCategoryTitle) activeCategoryTitle.textContent = categoryTitles[categoryKey] || 'Procedimentos';
    if (activeCategoryTag) activeCategoryTag.textContent = categoryTags[categoryKey] || 'Catálogo';

    // Switch views
    if (categorySelectionView) categorySelectionView.style.display = 'none';
    if (servicesListingView) servicesListingView.style.display = 'block';
    if (categoryNav) categoryNav.style.display = 'flex';

    renderServices();

    // Smooth scroll to services
    servicesListingView?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Return to Category Selection View
  function showCategorySelectionView() {
    activeCategory = null;
    if (servicesListingView) servicesListingView.style.display = 'none';
    if (categoryNav) categoryNav.style.display = 'none';
    if (categorySelectionView) categorySelectionView.style.display = 'block';

    categorySelectionView?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Render Services according to active filter category
  function renderServices() {
    if (!servicesContainer || !activeCategory) return;
    servicesContainer.innerHTML = '';

    const filtered = activeCategory === 'todos' 
      ? SERVICES_DATA 
      : SERVICES_DATA.filter(s => s.category === activeCategory);

    filtered.forEach(service => {
      const cardComponent = new ServiceCard({ service, cartService });
      servicesContainer.appendChild(cardComponent.render());
    });
  }

  // Event Listeners for Category Cards (Main Entry)
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      openCategoryView(category);
    });
  });

  // Event Listener for Back to Categories button
  btnBackToCategories?.addEventListener('click', () => {
    showCategorySelectionView();
  });

  // Bind Category Filter Chips (inside Services View)
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      openCategoryView(chip.dataset.category);
    });
  });

  // Subscribe UI to Cart Changes
  cartService.subscribe((state) => {
    if (cartCountEl) {
      cartCountEl.textContent = state.count === 1 ? '1 serviço selecionado' : `${state.count} serviços selecionados`;
    }
    if (cartTotalEl) {
      cartTotalEl.textContent = state.formattedTotal;
    }

    if (stickyCartBar) {
      stickyCartBar.style.display = 'flex';
    }

    if (activeCategory) {
      renderServices();
    }
  });

  // Open Checkout Bottom Sheet
  btnOpenCheckout?.addEventListener('click', () => {
    cartDrawer.open();
  });

  // Initial State: Show Category Selection View
  showCategorySelectionView();
});
