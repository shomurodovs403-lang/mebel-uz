/* ==========================================================================
   WoodCraft - Furniture E-Commerce Engine (app.js)
   Full Functional Logic: LocalStorage, Cart, Wishlist, Currency Conversion,
   Live Search, Multi-filtering, Quick View, Checkout & Order History
   ========================================================================== */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. CONFIGURATION & STATE
    // --------------------------------------------------------------------------
    const EXCHANGE_RATE = 12800; // 1 USD = 12,800 UZS
    const LOCAL_STORAGE_KEYS = {
        CART: 'woodcraft_cart_v1',
        WISHLIST: 'woodcraft_wishlist_v1',
        CURRENCY: 'woodcraft_currency_v1',
        ORDERS: 'woodcraft_orders_v1',
        REVIEWS: 'woodcraft_reviews_v1'
    };

    // State object
    let state = {
        currency: localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENCY) || 'UZS',
        cart: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CART)) || [],
        wishlist: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST)) || [],
        orders: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS)) || [],
        reviews: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS)) || {},
        activeCategory: 'all',
        maxPriceFilter: 25000000,
        selectedMaterials: [],
        inStockOnly: false,
        sortBy: 'popular',
        searchQuery: '',
        appliedPromo: null
    };

    // --------------------------------------------------------------------------
    // 2. MOCK PRODUCT DATASET (12 Detailed Furniture Items)
    // --------------------------------------------------------------------------
    const PRODUCTS = [
        {
            id: 'mbl-001',
            name: `Nordic Elegance Eman Divan`,
            category: 'mehmonxona',
            categoryName: `Mehmonxona mebeli`,
            priceUSD: 680,
            originalPriceUSD: 850,
            rating: 4.9,
            reviewsCount: 38,
            isBestseller: true,
            isNew: false,
            discountPercent: 20,
            inStock: true,
            material: 'Eman',
            colors: [
                { name: 'Krem Velur', hex: '#E6DFD5' },
                { name: 'Kulrang', hex: '#686B73' },
                { name: 'Toq Espresso', hex: '#2C1D11' }
            ],
            dimensions: { height: '88 sm', width: '230 sm', depth: '95 sm' },
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
            ],
            description: `100% tabiiy Eman yog'och karkasi hamda yumshoq premium velur matosi bilan ishlangan 3 kishilik divan. Mehmonxonangizga zamonaviy Skandinaviya estetikasini olib kiradi.`,
            reviewsList: [
                { author: 'Jasurbek O.', rating: 5, date: '2026-07-20', text: `Sifati va qulayligi kutganimdan ham a'lo darajada. Yetkazib berish juda tez sodir bo'ldi!` },
                { author: 'Malika K.', rating: 5, date: '2026-06-15', text: `Krem rangi juda shinam ko'rinadi. Velur matosi dog' bo'lmaydi.` }
            ]
        },
        {
            id: 'mbl-002',
            name: `Royal Walnut Yotoqxona Krovati`,
            category: 'yotoqxona',
            categoryName: `Yotoqxona mebeli`,
            priceUSD: 1050,
            originalPriceUSD: 1300,
            rating: 4.95,
            reviewsCount: 52,
            isBestseller: true,
            isNew: true,
            discountPercent: 19,
            inStock: true,
            material: "Yong'oq",
            colors: [
                { name: "Tabiiy Yong'oq", hex: '#5C3A21' },
                { name: "To'q Yong'oq", hex: '#3B2312' }
            ],
            dimensions: { height: '120 sm', width: '190 sm', depth: '210 sm' },
            image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Tabiiy Yong'oq (Walnut) yog'ochining noyob teksturasi va ortopedik panjarasi bilan jihozlangan Qirollik uslubidagi ikki kishilik krovat.`,
            reviewsList: [
                { author: 'Bobur T.', rating: 5, date: '2026-08-01', text: `Haqiqiy tabiiy yog'och hidi va juda mustahkam qurilma.` }
            ]
        },
        {
            id: 'mbl-003',
            name: `Scandi Craft Oshxona Stoli va Stullari`,
            category: 'oshxona',
            categoryName: `Oshxona mebeli`,
            priceUSD: 520,
            originalPriceUSD: 650,
            rating: 4.8,
            reviewsCount: 29,
            isBestseller: true,
            isNew: false,
            discountPercent: 20,
            inStock: true,
            material: 'Eman',
            colors: [
                { name: "Tabiiy Yog'och / Oq", hex: '#F4F0EA' },
                { name: "To'q Eman", hex: '#8C6847' }
            ],
            dimensions: { height: '75 sm', width: '160 sm', depth: '90 sm' },
            image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80'
            ],
            description: `6 kishilik yig'iluvchan oshxona stoli va 4 ta qulay stullardan iborat to'plam. Issiqqa va suvga chidamli arxitektura.`,
            reviewsList: [
                { author: 'Nilufar R.', rating: 5, date: '2026-07-28', text: `Oshxonamizga judayam mos tushdi. Yuzasi oson tozalanadi.` }
            ]
        },
        {
            id: 'mbl-004',
            name: `Executive Ergonomic Ofis Stoli`,
            category: 'ofis',
            categoryName: `Ofis mebeli`,
            priceUSD: 410,
            originalPriceUSD: 500,
            rating: 4.75,
            reviewsCount: 18,
            isBestseller: false,
            isNew: true,
            discountPercent: 18,
            inStock: true,
            material: 'MDF',
            colors: [
                { name: 'Matoviy Qora', hex: '#1E1E1E' },
                { name: 'Eman Tekstura', hex: '#A47E5B' }
            ],
            dimensions: { height: '76 sm', width: '150 sm', depth: '70 sm' },
            image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Simlarni yashirish kabel-kanali va zaryadlash stansiyasiga ega minimalistik ish stoli. Rahbarlar va frilanserlar uchun ideal.`,
            reviewsList: []
        },
        {
            id: 'mbl-005',
            name: `Velvet Lounge Yumshoq Kreslo`,
            category: 'yumshoq',
            categoryName: `Yumshoq mebellar`,
            priceUSD: 290,
            originalPriceUSD: 380,
            rating: 4.88,
            reviewsCount: 44,
            isBestseller: true,
            isNew: false,
            discountPercent: 23,
            inStock: true,
            material: 'Velur',
            colors: [
                { name: 'Zumrad Yashil', hex: '#10B981' },
                { name: "Xardal Sarig'i", hex: '#F59E0B' },
                { name: 'Kulrang', hex: '#71717A' }
            ],
            dimensions: { height: '92 sm', width: '85 sm', depth: '80 sm' },
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Eman oyoqli va o'ta yumshoq anatomik ko'pik to'ldirilgan lounge kreslo. Kitob o'qish va hordiq chiqarish uchun mo'ljallangan.`,
            reviewsList: []
        },
        {
            id: 'mbl-006',
            name: `Minimalist Shisha Eshikli Shkaf`,
            category: 'yotoqxona',
            categoryName: `Yotoqxona mebeli`,
            priceUSD: 890,
            originalPriceUSD: 1100,
            rating: 4.7,
            reviewsCount: 15,
            isBestseller: false,
            isNew: true,
            discountPercent: 19,
            inStock: true,
            material: 'MDF',
            colors: [
                { name: "To'q Shokolad", hex: '#2C1D11' },
                { name: 'Oq Mat', hex: '#FFFFFF' }
            ],
            dimensions: { height: '220 sm', width: '180 sm', depth: '60 sm' },
            image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Toblangan xira shisha eshikli va LED yoritgichli kiyim shkafi. Kiyimlaringizni tartibli va estetik saqlash imkonini beradi.`,
            reviewsList: []
        },
        {
            id: 'mbl-007',
            name: `Leather Master Teri Kreslo va Otoman`,
            category: 'yumshoq',
            categoryName: `Yumshoq mebellar`,
            priceUSD: 720,
            originalPriceUSD: 900,
            rating: 4.92,
            reviewsCount: 31,
            isBestseller: true,
            isNew: false,
            discountPercent: 20,
            inStock: true,
            material: 'Teri',
            colors: [
                { name: 'Jigar-jigar Teri', hex: '#8C6847' },
                { name: 'Qora Teri', hex: '#1E1E1E' }
            ],
            dimensions: { height: '98 sm', width: '90 sm', depth: '90 sm' },
            image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80'
            ],
            description: `100% tabiiy teri va metall-karkas arxitekturasi. Oyoq tayanchi (Otoman) to'plamga kiritilgan.`,
            reviewsList: []
        },
        {
            id: 'mbl-008',
            name: `Loft Style TV-Tumba va Javon`,
            category: 'mehmonxona',
            categoryName: `Mehmonxona mebeli`,
            priceUSD: 340,
            originalPriceUSD: 420,
            rating: 4.65,
            reviewsCount: 22,
            isBestseller: false,
            isNew: false,
            discountPercent: 19,
            inStock: true,
            material: 'Eman',
            colors: [
                { name: "Loft Yog'och", hex: '#A47E5B' }
            ],
            dimensions: { height: '55 sm', width: '180 sm', depth: '45 sm' },
            image: 'https://images.unsplash.com/photo-1607400201889-565b1e76f164?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1607400201889-565b1e76f164?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Katta razmerli televizorlar uchun mo'ljallangan yong'oq teksturali tumba. Akustik tizimlar va pristavkalarni joylash uchun qulay.`,
            reviewsList: []
        },
        {
            id: 'mbl-009',
            name: `Modern Bar Stollari To'plami (2 dona)`,
            category: 'oshxona',
            categoryName: `Oshxona mebeli`,
            priceUSD: 240,
            originalPriceUSD: 300,
            rating: 4.82,
            reviewsCount: 19,
            isBestseller: false,
            isNew: true,
            discountPercent: 20,
            inStock: true,
            material: 'Eman',
            colors: [
                { name: "Oq / Yog'och", hex: '#FAF8F5' },
                { name: 'Qora', hex: '#1E1E1E' }
            ],
            dimensions: { height: '75 sm', width: '40 sm', depth: '40 sm' },
            image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Oshxona oroli (Kitchen Island) va bar stoykalari uchun baland tabiiy yog'och stullar.`,
            reviewsList: []
        },
        {
            id: 'mbl-010',
            name: `Zenith Yumshoq Modular Divan`,
            category: 'mehmonxona',
            categoryName: `Mehmonxona mebeli`,
            priceUSD: 1450,
            originalPriceUSD: 1800,
            rating: 4.98,
            reviewsCount: 67,
            isBestseller: true,
            isNew: true,
            discountPercent: 19,
            inStock: true,
            material: 'Velur',
            colors: [
                { name: 'Fil Suyagi (Ivory)', hex: '#FAF8F5' },
                { name: 'Zaytuncha', hex: '#556B2F' }
            ],
            dimensions: { height: '85 sm', width: '310 sm', depth: '160 sm' },
            image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Katta oilalar va keng mehmonxonalar uchun L-simon modulli burchak divani.`,
            reviewsList: []
        },
        {
            id: 'mbl-01',
            name: `Classic Oak Jurnal Stoli`,
            category: 'mehmonxona',
            categoryName: `Mehmonxona mebeli`,
            priceUSD: 180,
            originalPriceUSD: 230,
            rating: 4.7,
            reviewsCount: 12,
            isBestseller: false,
            isNew: false,
            discountPercent: 21,
            inStock: true,
            material: 'Eman',
            colors: [
                { name: 'Tabiiy Eman', hex: '#A47E5B' }
            ],
            dimensions: { height: '45 sm', width: '110 sm', depth: '60 sm' },
            image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Divan oldiga qo'yiladigan ixcham, ikki qavatli tabiiy kofe/jurnal stoli.`,
            reviewsList: []
        },
        {
            id: 'mbl-012',
            name: `Comfort Pro Ish Kreslosi`,
            category: 'ofis',
            categoryName: `Ofis mebeli`,
            priceUSD: 260,
            originalPriceUSD: 330,
            rating: 4.85,
            reviewsCount: 26,
            isBestseller: true,
            isNew: false,
            discountPercent: 21,
            inStock: true,
            material: 'Teri',
            colors: [
                { name: 'Qora', hex: '#1E1E1E' }
            ],
            dimensions: { height: '115-125 sm', width: '65 sm', depth: '65 sm' },
            image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80'
            ],
            description: `Bel qismini qo'llab-quvvatlovchi va balandligi rostlanuvchi ergonomik charmdan ishlangan ofis kreslosi.`,
            reviewsList: []
        }
    ];

    // Promo Codes Table
    const PROMO_CODES = {
        'MEBEL10': { type: 'percent', value: 10, minSpendUSD: 0 },
        'WOOD20': { type: 'percent', value: 20, minSpendUSD: 500 },
        'YANGI2026': { type: 'percent', value: 15, minSpendUSD: 200 }
    };

    // --------------------------------------------------------------------------
    // 3. UTILITY FUNCTIONS
    // --------------------------------------------------------------------------
    function saveState(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('LocalStorage saqlashda xatolik:', e);
        }
    }

    function formatPrice(priceUSD) {
        if (state.currency === 'USD') {
            return `$${priceUSD.toLocaleString('en-US')}`;
        } else {
            const priceUZS = Math.round(priceUSD * EXCHANGE_RATE);
            return `${priceUZS.toLocaleString('uz-UZ').replace(/,/g, ' ')} UZS`;
        }
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconClass = 'fa-circle-info';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-circle-exclamation';

        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // --------------------------------------------------------------------------
    // 4. RENDERING ENGINE
    // --------------------------------------------------------------------------
    function renderProductCard(product) {
        const isWishlisted = state.wishlist.includes(product.id);
        const formattedPrice = formatPrice(product.priceUSD);
        const formattedOriginal = formatPrice(product.originalPriceUSD);

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="card-media">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="card-badges">
                        ${product.isBestseller ? '<span class="badge-tag badge-bestseller">Top Sotuv</span>' : ''}
                        ${product.discountPercent ? `<span class="badge-tag badge-discount">-${product.discountPercent}%</span>` : ''}
                        ${product.isNew ? '<span class="badge-tag badge-new">Yangi</span>' : ''}
                    </div>
                    <div class="card-actions">
                        <button class="card-action-btn ${isWishlisted ? 'active-wishlist' : ''}" 
                                onclick="window.WoodCraftApp.toggleWishlist('${product.id}')" 
                                title="${isWishlisted ? 'Sevimlilardan ochirish' : 'Sevimlilarga qoshish'}">
                            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                        <button class="card-action-btn" 
                                onclick="window.WoodCraftApp.openQuickView('${product.id}')" 
                                title="Batafsil korish">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div class="card-body">
                    <span class="card-category">${product.categoryName}</span>
                    <h3 class="card-title">${product.name}</h3>

                    <div class="card-rating">
                        <div class="stars-gold">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating))}
                            ${product.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                        </div>
                        <span class="review-count">(${product.rating}) • ${product.reviewsCount} sharh</span>
                    </div>

                    <div class="card-footer">
                        <div class="price-box">
                            ${product.originalPriceUSD ? `<span class="original-price">${formattedOriginal}</span>` : ''}
                            <span class="current-price">${formattedPrice}</span>
                        </div>
                        <button class="btn btn-primary add-to-cart-btn" 
                                onclick="window.WoodCraftApp.addToCart('${product.id}')" 
                                ${!product.inStock ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
                            <i class="fa-solid fa-cart-plus"></i> ${product.inStock ? 'Savatga' : 'Tugagan'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderBestsellers() {
        const grid = document.getElementById('bestsellersGrid');
        if (!grid) return;

        const bestsellers = PRODUCTS.filter(p => p.isBestseller).slice(0, 4);
        grid.innerHTML = bestsellers.map(renderProductCard).join('');
    }

    function filterAndSortProducts() {
        let list = [...PRODUCTS];

        // Category Filter
        if (state.activeCategory !== 'all') {
            list = list.filter(p => p.category === state.activeCategory);
        }

        // Search Query Filter
        if (state.searchQuery.trim() !== '') {
            const query = state.searchQuery.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(query) || p.categoryName.toLowerCase().includes(query) || p.material.toLowerCase().includes(query));
        }

        // Price Filter
        list = list.filter(p => (p.priceUSD * EXCHANGE_RATE) <= state.maxPriceFilter);

        // Material Filter
        if (state.selectedMaterials.length > 0) {
            list = list.filter(p => state.selectedMaterials.includes(p.material));
        }

        // In Stock Toggle Filter
        if (state.inStockOnly) {
            list = list.filter(p => p.inStock);
        }

        // Sorting Logic
        if (state.sortBy === 'price-asc') {
            list.sort((a, b) => a.priceUSD - b.priceUSD);
        } else if (state.sortBy === 'price-desc') {
            list.sort((a, b) => b.priceUSD - a.priceUSD);
        } else if (state.sortBy === 'rating') {
            list.sort((a, b) => b.rating - a.rating);
        } else if (state.sortBy === 'newest') {
            list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        } else {
            list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        }

        return list;
    }

    function renderCatalog() {
        const mainGrid = document.getElementById('mainProductsGrid');
        const emptyState = document.getElementById('noProductsEmptyState');
        const countText = document.getElementById('productCountText');
        if (!mainGrid) return;

        const filteredProducts = filterAndSortProducts();

        if (countText) {
            countText.textContent = `${filteredProducts.length} ta mahsulot`;
        }

        if (filteredProducts.length === 0) {
            mainGrid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
        } else {
            if (emptyState) emptyState.classList.add('hidden');
            mainGrid.innerHTML = filteredProducts.map(renderProductCard).join('');
        }

        renderActiveFilterPills();
    }

    function renderActiveFilterPills() {
        const pillsContainer = document.getElementById('activePillsContainer');
        if (!pillsContainer) return;

        let pillsHTML = '';

        if (state.activeCategory !== 'all') {
            const catNameMap = {
                mehmonxona: 'Mehmonxona',
                yotoqxona: 'Yotoqxona',
                oshxona: 'Oshxona',
                ofis: 'Ofis mebellari',
                yumshoq: 'Yumshoq mebellar'
            };
            pillsHTML += `<span class="filter-pill">Toifa: ${catNameMap[state.activeCategory]} <i class="fa-solid fa-xmark" onclick="window.WoodCraftApp.setCategory('all')"></i></span>`;
        }

        if (state.selectedMaterials.length > 0) {
            state.selectedMaterials.forEach(m => {
                pillsHTML += `<span class="filter-pill">Material: ${m} <i class="fa-solid fa-xmark" onclick="window.WoodCraftApp.removeMaterial('${m}')"></i></span>`;
            });
        }

        if (state.inStockOnly) {
            pillsHTML += `<span class="filter-pill">Faqat sotuvda borlar <i class="fa-solid fa-xmark" onclick="window.WoodCraftApp.toggleInStock(false)"></i></span>`;
        }

        pillsContainer.innerHTML = pillsHTML;
    }

    // --------------------------------------------------------------------------
    // 5. CART ENGINE & DRAWER LOGIC
    // --------------------------------------------------------------------------
    function updateCartUI() {
        const cartBadge = document.getElementById('cartBadge');
        const cartDrawerCount = document.getElementById('cartDrawerCount');
        const cartTotalPreview = document.getElementById('cartTotalPreview');
        const itemsContainer = document.getElementById('cartDrawerItems');
        const checkoutItemsCount = document.getElementById('checkoutItemsCount');

        const totalItemsCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

        if (cartBadge) cartBadge.textContent = totalItemsCount;
        if (cartDrawerCount) cartDrawerCount.textContent = totalItemsCount;
        if (checkoutItemsCount) checkoutItemsCount.textContent = `${totalItemsCount} ta`;

        let subtotalUSD = 0;
        state.cart.forEach(item => {
            const product = PRODUCTS.find(p => p.id === item.productId);
            if (product) {
                subtotalUSD += product.priceUSD * item.qty;
            }
        });

        let discountUSD = 0;
        if (state.appliedPromo && PROMO_CODES[state.appliedPromo]) {
            const promo = PROMO_CODES[state.appliedPromo];
            if (promo.type === 'percent') {
                discountUSD = (subtotalUSD * promo.value) / 100;
            }
        }

        const freeShippingThresholdUZS = 5000000;
        const subtotalUZS = subtotalUSD * EXCHANGE_RATE;
        let deliveryFeeUSD = 0;

        if (subtotalUZS > 0 && subtotalUZS < freeShippingThresholdUZS) {
            deliveryFeeUSD = 15;
        }

        const grandTotalUSD = Math.max(0, subtotalUSD - discountUSD + deliveryFeeUSD);

        if (cartTotalPreview) {
            cartTotalPreview.textContent = formatPrice(grandTotalUSD);
        }

        const progressFill = document.getElementById('shippingProgressFill');
        const progressText = document.getElementById('shippingProgressText');
        if (progressFill && progressText) {
            if (subtotalUZS >= freeShippingThresholdUZS || subtotalUZS === 0) {
                progressFill.style.width = '100%';
                progressText.innerHTML = subtotalUZS === 0 ? 'Savat hali bosh' : '🎉 Tabriklaymiz! Siz <strong>BEPUL yetkazib berishga</strong> ega boldingiz!';
            } else {
                const diffUZS = freeShippingThresholdUZS - subtotalUZS;
                const percentage = Math.min(100, (subtotalUZS / freeShippingThresholdUZS) * 100);
                progressFill.style.width = `${percentage}%`;
                progressText.innerHTML = `Bepul yetkazish uchun yana <strong>${(diffUZS).toLocaleString().replace(/,/g, ' ')} UZS</strong> xarid qiling!`;
            }
        }

        const subtotalDisplay = document.getElementById('cartSubtotalDisplay');
        const discountDisplay = document.getElementById('cartDiscountDisplay');
        const deliveryDisplay = document.getElementById('cartDeliveryDisplay');
        const grandTotalDisplay = document.getElementById('cartGrandTotalDisplay');
        const checkoutGrandTotal = document.getElementById('checkoutGrandTotal');
        const discountRow = document.getElementById('promoDiscountRow');

        if (subtotalDisplay) subtotalDisplay.textContent = formatPrice(subtotalUSD);
        if (discountDisplay) discountDisplay.textContent = `-${formatPrice(discountUSD)}`;
        if (deliveryDisplay) deliveryDisplay.textContent = deliveryFeeUSD === 0 ? (subtotalUSD === 0 ? '0 UZS' : 'Bepul') : formatPrice(deliveryFeeUSD);
        if (grandTotalDisplay) grandTotalDisplay.textContent = formatPrice(grandTotalUSD);
        if (checkoutGrandTotal) checkoutGrandTotal.textContent = formatPrice(grandTotalUSD);

        if (discountRow) {
            discountRow.style.display = discountUSD > 0 ? 'flex' : 'none';
        }

        if (itemsContainer) {
            if (state.cart.length === 0) {
                itemsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon"><i class="fa-solid fa-bag-shopping"></i></div>
                        <h3>Savatchangiz bosh</h3>
                        <p>Katalogimizdan ozingizga maqul kelgan mebelni tanlang va qoshing.</p>
                    </div>
                `;
            } else {
                itemsContainer.innerHTML = state.cart.map((item, index) => {
                    const p = PRODUCTS.find(prod => prod.id === item.productId);
                    if (!p) return '';
                    return `
                        <div class="cart-item">
                            <img src="${p.image}" alt="${p.name}" class="cart-item-img">
                            <div class="cart-item-info">
                                <h4 class="cart-item-title">${p.name}</h4>
                                <span class="cart-item-variant">Rang: ${item.color || 'Standart'} | ${item.material || p.material}</span>
                                <div class="cart-item-bottom">
                                    <div class="qty-controls">
                                        <button class="qty-btn" onclick="window.WoodCraftApp.changeCartQty(${index}, -1)">-</button>
                                        <span class="qty-num">${item.qty}</span>
                                        <button class="qty-btn" onclick="window.WoodCraftApp.changeCartQty(${index}, 1)">+</button>
                                    </div>
                                    <span class="current-price" style="font-size: 0.95rem;">${formatPrice(p.priceUSD * item.qty)}</span>
                                    <button class="remove-item-btn" onclick="window.WoodCraftApp.removeFromCart(${index})" title="Ochirish">
                                        <i class="fa-regular fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        saveState(LOCAL_STORAGE_KEYS.CART, state.cart);
    }

    function addToCart(productId, qty = 1, selectedColor = null, selectedMaterial = null) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product || !product.inStock) {
            showToast('Kechirasiz, bu mahsulot hozirda sotuvda mavjud emas!', 'error');
            return;
        }

        const targetColor = selectedColor || (product.colors.length > 0 ? product.colors[0].name : 'Standart');
        const targetMaterial = selectedMaterial || product.material;

        const existingItem = state.cart.find(item => item.productId === productId && item.color === targetColor && item.material === targetMaterial);
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            state.cart.push({
                productId: productId,
                qty: qty,
                color: targetColor,
                material: targetMaterial
            });
        }

        updateCartUI();
        showToast(`"${product.name}" savatchaga qoshildi!`, 'success');
    }

    function changeCartQty(indexOrId, delta) {
        let item;
        if (typeof indexOrId === 'number') {
            item = state.cart[indexOrId];
        } else {
            item = state.cart.find(i => i.productId === indexOrId);
        }
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(indexOrId);
        } else {
            updateCartUI();
        }
    }

    function removeFromCart(indexOrId) {
        if (typeof indexOrId === 'number') {
            const item = state.cart[indexOrId];
            const product = item ? PRODUCTS.find(p => p.id === item.productId) : null;
            state.cart.splice(indexOrId, 1);
            updateCartUI();
            if (product) {
                showToast(`"${product.name}" savatchadan ochirildi.`, 'info');
            }
        } else {
            const product = PRODUCTS.find(p => p.id === indexOrId);
            state.cart = state.cart.filter(i => i.productId !== indexOrId);
            updateCartUI();
            if (product) {
                showToast(`"${product.name}" savatchadan ochirildi.`, 'info');
            }
        }
    }

    // --------------------------------------------------------------------------
    // 6. WISHLIST ENGINE & DRAWER LOGIC
    // --------------------------------------------------------------------------
    function updateWishlistUI() {
        const wishlistBadge = document.getElementById('wishlistBadge');
        const wishlistDrawerCount = document.getElementById('wishlistDrawerCount');
        const wishlistItemsContainer = document.getElementById('wishlistDrawerItems');

        if (wishlistBadge) wishlistBadge.textContent = state.wishlist.length;
        if (wishlistDrawerCount) wishlistDrawerCount.textContent = state.wishlist.length;

        if (wishlistItemsContainer) {
            if (state.wishlist.length === 0) {
                wishlistItemsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon"><i class="fa-regular fa-heart"></i></div>
                        <h3>Sevimlilar royxati bosh</h3>
                        <p>Ozingizga yoqqan mebellardagi yurakcha tugmasini bosib saqlab qoying.</p>
                    </div>
                `;
            } else {
                wishlistItemsContainer.innerHTML = state.wishlist.map(id => {
                    const p = PRODUCTS.find(prod => prod.id === id);
                    if (!p) return '';
                    return `
                        <div class="cart-item">
                            <img src="${p.image}" alt="${p.name}" class="cart-item-img">
                            <div class="cart-item-info">
                                <h4 class="cart-item-title">${p.name}</h4>
                                <span class="cart-item-variant">${p.categoryName}</span>
                                <div class="cart-item-bottom">
                                    <span class="current-price" style="font-size: 0.95rem;">${formatPrice(p.priceUSD)}</span>
                                    <button class="btn btn-primary btn-sm" onclick="window.WoodCraftApp.addToCart('${p.id}'); window.WoodCraftApp.toggleWishlist('${p.id}');">
                                        <i class="fa-solid fa-cart-plus"></i> Savatga
                                    </button>
                                    <button class="remove-item-btn" onclick="window.WoodCraftApp.toggleWishlist('${p.id}')" title="Ochirish">
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        saveState(LOCAL_STORAGE_KEYS.WISHLIST, state.wishlist);
        renderCatalog();
        renderBestsellers();
    }

    function toggleWishlist(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        const index = state.wishlist.indexOf(productId);

        if (index > -1) {
            state.wishlist.splice(index, 1);
            showToast(`"${product.name}" sevimlilardan olib tashlandi.`, 'info');
        } else {
            state.wishlist.push(productId);
            showToast(`"${product.name}" sevimlilarga saqlandi!`, 'success');
        }

        updateWishlistUI();
    }

    // --------------------------------------------------------------------------
    // 7. QUICK VIEW MODAL & REVIEWS LOGIC
    // --------------------------------------------------------------------------
    function openQuickView(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('quickViewModal');
        const content = document.getElementById('quickViewContent');
        const backdrop = document.getElementById('drawerBackdrop');

        if (!modal || !content) return;

        let selectedColor = product.colors.length > 0 ? product.colors[0].name : null;

        content.innerHTML = `
            <div class="modal-gallery">
                <img src="${product.image}" alt="${product.name}" class="modal-gallery-main" id="qvMainImg">
                <div class="modal-gallery-thumbs">
                    ${product.gallery.map((imgUrl, idx) => `
                        <img src="${imgUrl}" alt="Thumb" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('qvMainImg').src='${imgUrl}'; document.querySelectorAll('.thumb-img').forEach(t=>t.classList.remove('active')); this.classList.add('active');">
                    `).join('')}
                </div>
            </div>

            <div class="qv-details">
                <span class="card-category">${product.categoryName}</span>
                <h2 class="qv-title">${product.name}</h2>

                <div class="card-rating" style="margin-bottom: 1rem;">
                    <div class="stars-gold">${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating))}</div>
                    <span class="review-count">(${product.rating}) • ${product.reviewsCount} sharh</span>
                </div>

                <div class="qv-price-row">
                    <span class="qv-price">${formatPrice(product.priceUSD)}</span>
                    ${product.originalPriceUSD ? `<span class="original-price" style="font-size: 1.1rem;">${formatPrice(product.originalPriceUSD)}</span>` : ''}
                </div>

                <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 1.5rem;">${product.description}</p>

                ${product.colors.length > 0 ? `
                    <div class="swatch-group">
                        <div class="swatch-title">Mavjud ranglar:</div>
                        <div class="color-swatches">
                            ${product.colors.map((c, i) => `
                                <div class="swatch-circle ${i === 0 ? 'active' : ''}" 
                                     style="background-color: ${c.hex};" 
                                     title="${c.name}"
                                     data-color="${c.name}"></div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="dimensions-grid">
                    <div class="dim-item">
                        <span>Balandlik</span>
                        <strong>${product.dimensions.height}</strong>
                    </div>
                    <div class="dim-item">
                        <span>Eni</span>
                        <strong>${product.dimensions.width}</strong>
                    </div>
                    <div class="dim-item">
                        <span>Chuqurlik</span>
                        <strong>${product.dimensions.depth}</strong>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: auto;">
                    <div class="qty-controls" style="padding: 0.4rem;">
                        <button class="qty-btn" id="qvQtyMinus">-</button>
                        <span class="qty-num" id="qvQtyVal">1</span>
                        <button class="qty-btn" id="qvQtyPlus">+</button>
                    </div>

                    <button class="btn btn-primary btn-lg" style="flex:1;" id="qvAddToCartBtn">
                        <i class="fa-solid fa-bag-shopping"></i> Savatchaga Qoshish
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        backdrop.classList.add('active');

        document.querySelectorAll('#quickViewContent .swatch-circle').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                document.querySelectorAll('#quickViewContent .swatch-circle').forEach(s => s.classList.remove('active'));
                e.currentTarget.classList.add('active');
                selectedColor = e.currentTarget.dataset.color;
            });
        });

        document.getElementById('qvAddToCartBtn')?.addEventListener('click', () => {
            const qtyVal = parseInt(document.getElementById('qvQtyVal').textContent) || 1;
            addToCart(product.id, qtyVal, selectedColor);
            modal.classList.remove('active');
            backdrop.classList.remove('active');
        });

        let qvQty = 1;
        const qvQtyVal = document.getElementById('qvQtyVal');
        document.getElementById('qvQtyMinus')?.addEventListener('click', () => {
            if (qvQty > 1) { qvQty--; qvQtyVal.textContent = qvQty; }
        });
        document.getElementById('qvQtyPlus')?.addEventListener('click', () => {
            qvQty++; qvQtyVal.textContent = qvQty;
        });
    }

    // --------------------------------------------------------------------------
    // 8. CHECKOUT & ORDER HISTORY
    // --------------------------------------------------------------------------
    function submitCheckout(e) {
        e.preventDefault();

        if (state.cart.length === 0) {
            showToast('Savatchangiz bosh. Xarid qilish uchun mahsulot tanlang!', 'error');
            return;
        }

        const name = document.getElementById('custName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const address = document.getElementById('custAddress').value.trim();
        const note = document.getElementById('custNote').value.trim();
        const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
        const payment = paymentRadio ? paymentRadio.value : 'cash';

        if (!name || !phone || !address) {
            showToast('Iltimos, barcha majburiy maydonlarni toldiring!', 'error');
            return;
        }

        const orderId = 'WDC-' + Math.floor(100000 + Math.random() * 900000);
        const orderDate = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        let totalUSD = 0;
        const orderItems = state.cart.map(item => {
            const p = PRODUCTS.find(prod => prod.id === item.productId);
            totalUSD += p.priceUSD * item.qty;
            return {
                name: p.name,
                qty: item.qty,
                priceFormatted: formatPrice(p.priceUSD * item.qty)
            };
        });

        const newOrder = {
            id: orderId,
            date: orderDate,
            customerName: name,
            phone: phone,
            address: address,
            note: note,
            paymentMethod: payment.toUpperCase(),
            items: orderItems,
            totalFormatted: formatPrice(totalUSD)
        };

        state.orders.unshift(newOrder);
        saveState(LOCAL_STORAGE_KEYS.ORDERS, state.orders);

        state.cart = [];
        state.appliedPromo = null;
        updateCartUI();

        document.getElementById('checkoutModal')?.classList.remove('active');

        const receiptContent = document.getElementById('receiptDetailsContent');
        if (receiptContent) {
            receiptContent.innerHTML = `
                <div style="font-size: 0.9rem; margin-bottom: 0.8rem;">
                    <strong>Buyurtma ID:</strong> <span style="color: var(--primary-accent);">${newOrder.id}</span><br>
                    <strong>Sana:</strong> ${newOrder.date}<br>
                    <strong>Mijoz:</strong> ${newOrder.customerName} (${newOrder.phone})<br>
                    <strong>Yetkazish manzili:</strong> ${newOrder.address}<br>
                    <strong>Tolov turi:</strong> ${newOrder.paymentMethod}
                </div>
                <hr style="border: none; border-top: 1px dashed var(--border-color); margin: 0.8rem 0;">
                <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem;">Buyurtma tarkibi:</div>
                <ul style="list-style: none; padding: 0; font-size: 0.88rem; margin-bottom: 0.8rem;">
                    ${newOrder.items.map(it => `
                        <li style="display: flex; justify-content: space-between; padding: 0.2rem 0;">
                            <span>${it.name} (x${it.qty})</span>
                            <strong>${it.priceFormatted}</strong>
                        </li>
                    `).join('')}
                </ul>
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: var(--primary-dark);">
                    <span>Jami summasi:</span>
                    <span>${newOrder.totalFormatted}</span>
                </div>
            `;
        }

        document.getElementById('orderSuccessModal')?.classList.add('active');
        showToast('Buyurtmangiz muvaffaqiyatli rasmiylashtirildi!', 'success');
    }

    function renderOrderHistory() {
        const historyContainer = document.getElementById('orderHistoryContent');
        if (!historyContainer) return;

        if (state.orders.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
                    <h3>Buyurtmalar tarixi mavjud emas</h3>
                    <p>Siz hali hech qanday buyurtma bermagansiz.</p>
                </div>
            `;
        } else {
            historyContainer.innerHTML = state.orders.map(order => `
                <div class="history-item">
                    <div class="history-item-header">
                        <div>
                            <strong style="color: var(--primary-accent);">${order.id}</strong> • <small>${order.date}</small>
                        </div>
                        <span class="badge-tag badge-new" style="background-color: var(--emerald);">Qabul qilindi</span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">
                        Manzil: ${order.address} | Tolov: ${order.paymentMethod}
                    </div>
                    <ul style="list-style: none; font-size: 0.88rem; padding: 0;">
                        ${order.items.map(i => `<li>- ${i.name} (x${i.qty})</li>`).join('')}
                    </ul>
                    <div style="text-align: right; font-weight: 800; font-size: 1.05rem; margin-top: 0.5rem; color: var(--primary-dark);">
                        Jami: ${order.totalFormatted}
                    </div>
                </div>
            `).join('');
        }
    }

    // --------------------------------------------------------------------------
    // 9. EVENT LISTENERS & INITIALIZATION
    // --------------------------------------------------------------------------
    function setupEventListeners() {
        const currencySelector = document.getElementById('currencySelector');
        if (currencySelector) {
            currencySelector.value = state.currency;
            currencySelector.addEventListener('change', (e) => {
                state.currency = e.target.value;
                saveState(LOCAL_STORAGE_KEYS.CURRENCY, state.currency);
                renderCatalog();
                renderBestsellers();
                updateCartUI();
                updateWishlistUI();
                showToast(`Valyuta ${state.currency} ga ozgartirildi.`, 'info');
            });
        }

        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        const dropdown = document.getElementById('searchResultsDropdown');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                if (clearSearchBtn) clearSearchBtn.classList.toggle('active', state.searchQuery.length > 0);

                if (state.searchQuery.trim().length > 1) {
                    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || p.categoryName.toLowerCase().includes(state.searchQuery.toLowerCase())).slice(0, 5);

                    if (matches.length > 0 && dropdown) {
                        dropdown.innerHTML = matches.map(m => `
                            <div class="search-result-item" onclick="window.WoodCraftApp.openQuickView('${m.id}'); document.getElementById('searchResultsDropdown').classList.remove('active');">
                                <img src="${m.image}" class="search-result-thumb">
                                <div class="search-result-info">
                                    <div class="search-result-title">${m.name}</div>
                                    <div class="search-result-price">${formatPrice(m.priceUSD)}</div>
                                </div>
                            </div>
                        `).join('');
                        dropdown.classList.add('active');
                    } else if (dropdown) {
                        dropdown.classList.remove('active');
                    }
                } else if (dropdown) {
                    dropdown.classList.remove('active');
                }

                renderCatalog();
            });

            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    state.searchQuery = '';
                    clearSearchBtn.classList.remove('active');
                    if (dropdown) dropdown.classList.remove('active');
                    renderCatalog();
                });
            }
        }

        const slides = document.querySelectorAll('#heroSlider .slide');
        const dots = document.querySelectorAll('#sliderDots .dot');
        let currentSlide = 0;

        function goToSlide(index) {
            slides.forEach((s, i) => {
                s.classList.toggle('active', i === index);
                if (dots[i]) dots[i].classList.toggle('active', i === index);
            });
            currentSlide = index;
        }

        document.getElementById('slideNextBtn')?.addEventListener('click', () => {
            goToSlide((currentSlide + 1) % slides.length);
        });
        document.getElementById('slidePrevBtn')?.addEventListener('click', () => {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                goToSlide(idx);
            });
        });

        setInterval(() => {
            if (slides.length > 0) {
                goToSlide((currentSlide + 1) % slides.length);
            }
        }, 5500);

        document.querySelectorAll('#categoryTabs .cat-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('#categoryTabs .cat-tab').forEach(t => t.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                state.activeCategory = target.dataset.category;
                renderCatalog();
            });
        });

        const priceSlider = document.getElementById('priceRangeSlider');
        const priceMaxDisplay = document.getElementById('priceMaxDisplay');
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                state.maxPriceFilter = parseInt(e.target.value);
                if (priceMaxDisplay) priceMaxDisplay.textContent = `${(state.maxPriceFilter).toLocaleString().replace(/,/g, ' ')} UZS`;
                renderCatalog();
            });
        }

        document.querySelectorAll('.material-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                state.selectedMaterials = Array.from(document.querySelectorAll('.material-checkbox:checked')).map(c => c.value);
                renderCatalog();
            });
        });

        document.getElementById('inStockToggle')?.addEventListener('change', (e) => {
            state.inStockOnly = e.target.checked;
            renderCatalog();
        });

        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderCatalog();
        });

        document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
            state.activeCategory = 'all';
            state.selectedMaterials = [];
            state.inStockOnly = false;
            state.maxPriceFilter = 25000000;
            state.searchQuery = '';

            document.querySelectorAll('#categoryTabs .cat-tab').forEach(t => t.classList.remove('active'));
            document.querySelector('#categoryTabs .cat-tab[data-category="all"]')?.classList.add('active');
            document.querySelectorAll('.material-checkbox').forEach(c => c.checked = false);
            if (document.getElementById('inStockToggle')) document.getElementById('inStockToggle').checked = false;
            if (priceSlider) priceSlider.value = 25000000;
            if (priceMaxDisplay) priceMaxDisplay.textContent = '25 000 000 UZS';
            if (searchInput) searchInput.value = '';

            renderCatalog();
            showToast('Barcha filtrlar tozalandi.', 'info');
        });

        document.getElementById('copyPromoBtn')?.addEventListener('click', (e) => {
            const code = e.currentTarget.dataset.code;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(() => {
                    showToast(`Promokod "${code}" buferga nusxalandi!`, 'success');
                }).catch(() => {
                    showToast(`Promokod: ${code}`, 'info');
                });
            } else {
                showToast(`Promokod: ${code}`, 'info');
            }
        });

        document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
            const promoInput = document.getElementById('promoInput');
            const promoMsg = document.getElementById('promoMessage');
            if (!promoInput || !promoMsg) return;

            const code = promoInput.value.trim().toUpperCase();
            if (PROMO_CODES[code]) {
                state.appliedPromo = code;
                promoMsg.textContent = `✓ "${code}" kodi muvaffaqiyatli qollandi! (${PROMO_CODES[code].value}% chegirma)`;
                promoMsg.className = 'promo-message success';
                updateCartUI();
                showToast(`Promokod qollandi: ${PROMO_CODES[code].value}% chegirma!`, 'success');
            } else {
                promoMsg.textContent = '✕ Notogri promokod kiritildi.';
                promoMsg.className = 'promo-message error';
            }
        });

        const drawerBackdrop = document.getElementById('drawerBackdrop');
        const cartDrawer = document.getElementById('cartDrawer');
        const wishlistDrawer = document.getElementById('wishlistDrawer');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                if (navMenu) navMenu.classList.remove('active');
            });
        });

        function closeAllDrawers() {
            cartDrawer?.classList.remove('active');
            wishlistDrawer?.classList.remove('active');
            drawerBackdrop?.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }

        document.getElementById('cartToggleBtn')?.addEventListener('click', () => {
            cartDrawer?.classList.add('active');
            drawerBackdrop?.classList.add('active');
        });
        document.getElementById('closeCartBtn')?.addEventListener('click', closeAllDrawers);

        document.getElementById('wishlistToggleBtn')?.addEventListener('click', () => {
            wishlistDrawer?.classList.add('active');
            drawerBackdrop?.classList.add('active');
        });
        document.getElementById('closeWishlistBtn')?.addEventListener('click', closeAllDrawers);

        drawerBackdrop?.addEventListener('click', closeAllDrawers);

        document.getElementById('openCheckoutBtn')?.addEventListener('click', () => {
            if (state.cart.length === 0) {
                showToast('Savatchangiz bosh!', 'error');
                return;
            }
            closeAllDrawers();
            document.getElementById('checkoutModal')?.classList.add('active');
            drawerBackdrop?.classList.add('active');
        });
        document.getElementById('closeCheckoutBtn')?.addEventListener('click', closeAllDrawers);
        document.getElementById('closeQuickViewBtn')?.addEventListener('click', closeAllDrawers);
        document.getElementById('closeHistoryBtn')?.addEventListener('click', closeAllDrawers);

        document.getElementById('checkoutForm')?.addEventListener('submit', submitCheckout);

        document.getElementById('ordersToggleBtn')?.addEventListener('click', () => {
            renderOrderHistory();
            document.getElementById('orderHistoryModal')?.classList.add('active');
            drawerBackdrop?.classList.add('active');
        });
        document.getElementById('viewOrderHistoryBtn')?.addEventListener('click', () => {
            closeAllDrawers();
            renderOrderHistory();
            document.getElementById('orderHistoryModal')?.classList.add('active');
            drawerBackdrop?.classList.add('active');
        });

        document.querySelectorAll('.payment-card input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('active'));
                radio.closest('.payment-card')?.classList.add('active');
            });
        });

        document.getElementById('mobileFilterBtn')?.addEventListener('click', () => {
            document.querySelector('.catalog-sidebar')?.classList.toggle('active-mobile');
        });
    }

    // --------------------------------------------------------------------------
    // 10. GLOBAL EXPORTS & INITIALIZATION
    // --------------------------------------------------------------------------
    window.WoodCraftApp = {
        addToCart,
        changeCartQty,
        removeFromCart,
        toggleWishlist,
        openQuickView,
        setCategory: (cat) => {
            state.activeCategory = cat;
            document.querySelectorAll('#categoryTabs .cat-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.category === cat);
            });
            renderCatalog();
        },
        removeMaterial: (mat) => {
            state.selectedMaterials = state.selectedMaterials.filter(m => m !== mat);
            document.querySelectorAll('.material-checkbox').forEach(cb => {
                if (cb.value === mat) cb.checked = false;
            });
            renderCatalog();
        },
        toggleInStock: (val) => {
            state.inStockOnly = val;
            const toggle = document.getElementById('inStockToggle');
            if (toggle) toggle.checked = val;
            renderCatalog();
        }
    };

    // DOM Ready Initialization
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        renderBestsellers();
        renderCatalog();
        updateCartUI();
        updateWishlistUI();
    });

})();
