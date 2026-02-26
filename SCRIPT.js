// script.js - CLEAN VERSION (No Advance Payment Code)

// Sample Products Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 3999,
        oldPrice: 5999,
        category: "electronics",
        rating: 4.5,
        image: "https://via.placeholder.com/300x300/4A90E2/ffffff?text=Headphones",
        badge: "Sale"
    },
    {
        id: 2,
        name: "iPhone 13 Cover",
        price: 500,
        oldPrice: 800,
        category: "accessories",
        rating: 4,
        image: "https://via.placeholder.com/300x300/50E3C2/ffffff?text=Cover",
        badge: "50% Off"
    },
    {
        id: 3,
        name: "USB-C Cable",
        price: 800,
        oldPrice: 1200,
        category: "electronics",
        rating: 4.5,
        image: "https://via.placeholder.com/300x300/F5A623/ffffff?text=Cable",
        badge: "Sale"
    },
    {
        id: 4,
        name: "Men's T-Shirt",
        price: 1200,
        oldPrice: 1500,
        category: "fashion",
        rating: 4,
        image: "https://via.placeholder.com/300x300/7ED321/ffffff?text=T-Shirt",
        badge: "New"
    },
    {
        id: 5,
        name: "Smart Watch",
        price: 5999,
        oldPrice: 7999,
        category: "electronics",
        rating: 4.5,
        image: "https://via.placeholder.com/300x300/BD10E0/ffffff?text=Watch",
        badge: "Hot"
    },
    {
        id: 6,
        name: "Backpack",
        price: 2500,
        oldPrice: 3000,
        category: "accessories",
        rating: 4,
        image: "https://via.placeholder.com/300x300/9013FE/ffffff?text=Backpack",
        badge: "Sale"
    },
    {
        id: 7,
        name: "Sunglasses",
        price: 1500,
        oldPrice: 2000,
        category: "fashion",
        rating: 4,
        image: "https://via.placeholder.com/300x300/4A90E2/ffffff?text=Sunglasses",
        badge: "Sale"
    },
    {
        id: 8,
        name: "Mouse",
        price: 1200,
        oldPrice: 1800,
        category: "electronics",
        rating: 4.5,
        image: "https://via.placeholder.com/300x300/50E3C2/ffffff?text=Mouse",
        badge: "New"
    }
];

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count on all pages
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Load featured products on home page
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Load new arrivals on home page
function loadNewArrivals() {
    const container = document.getElementById('newArrivals');
    if (!container) return;
    
    const arrivals = products.slice(4, 8);
    container.innerHTML = arrivals.map(product => createProductCard(product)).join('');
}

// Load all products on products page
function loadAllProducts() {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    Rs ${product.price}
                    ${product.oldPrice ? `<span class="old-price">Rs ${product.oldPrice}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${getRatingStars(product.rating)}
                    <span>(${product.rating})</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Get rating stars
function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    alert(`${product.name} added to cart!`);
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Reload cart page if open
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Reload cart page if open
            if (window.location.pathname.includes('cart.html')) {
                loadCartPage();
            }
        }
    }
}

// Load cart page
function loadCartPage() {
    const cartContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">Rs ${item.price}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                Rs ${item.price * item.quantity}
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 2000 ? 0 : 100;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `Rs ${subtotal}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `Rs ${shipping}`;
    document.getElementById('total').textContent = `Rs ${total}`;
}

// Filter products by category
function filterByCategory(category) {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    container.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

// Search products
function searchProducts(query) {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    const searchTerm = query.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

// Sort products
function sortProducts(sortBy) {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    let sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // For demo, just reverse
            sorted.reverse();
            break;
        default:
            // Default order
            break;
    }
    
    container.innerHTML = sorted.map(product => createProductCard(product)).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadFeaturedProducts();
    loadNewArrivals();
    loadAllProducts();
    
    // Load cart page if on cart.html
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Handle URL parameters on products page
    if (window.location.pathname.includes('products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get('search');
        const category = urlParams.get('category');
        const sort = urlParams.get('sort');
        
        if (search) {
            searchProducts(search);
            if (searchInput) searchInput.value = search;
        }
        
        if (category && category !== 'all') {
            filterByCategory(category);
        }
        
        if (sort) {
            sortProducts(sort);
        }
        
        // Setup sort dropdown
        const sortSelect = document.querySelector('.sort-by select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                sortProducts(this.value);
            });
        }
        
        // Setup category filters
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // For demo, just filter by first checked category
                const checked = document.querySelector('.filter-option input[type="checkbox"]:checked');
                if (checked) {
                    const category = checked.nextElementSibling.textContent.toLowerCase();
                    filterByCategory(category);
                } else {
                    filterByCategory('all');
                }
            });
        });
        
        // Setup price filter
        const applyFilter = document.querySelector('.apply-filter');
        if (applyFilter) {
            applyFilter.addEventListener('click', function() {
                const min = document.getElementById('minPrice')?.value;
                const max = document.getElementById('maxPrice')?.value;
                
                if (min || max) {
                    let filtered = [...products];
                    
                    if (min) {
                        filtered = filtered.filter(p => p.price >= parseInt(min));
                    }
                    
                    if (max) {
                        filtered = filtered.filter(p => p.price <= parseInt(max));
                    }
                    
                    document.getElementById('allProducts').innerHTML = 
                        filtered.map(product => createProductCard(product)).join('');
                }
            });
        }
    }
});

// Make functions global for onclick events
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.filterByCategory = filterByCategory;
window.searchProducts = searchProducts;
window.sortProducts = sortProducts;