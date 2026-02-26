// ======== PRODUCTS DATA ========
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 3999,
        oldPrice: 5999,
        category: "electronics",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
        badge: "Sale"
    },
    {
        id: 2,
        name: "iPhone 13 Cover",
        price: 500,
        oldPrice: 800,
        category: "accessories",
        rating: 4,
        image: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=300",
        badge: "50% Off"
    },
    {
        id: 3,
        name: "USB-C Cable",
        price: 800,
        oldPrice: 1200,
        category: "electronics",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=300",
        badge: "Sale"
    },
    {
        id: 4,
        name: "Men's T-Shirt",
        price: 1200,
        oldPrice: 1500,
        category: "fashion",
        rating: 4,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
        badge: "New"
    },
    {
        id: 5,
        name: "Smart Watch",
        price: 5999,
        oldPrice: 7999,
        category: "electronics",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
        badge: "Hot"
    },
    {
        id: 6,
        name: "Backpack",
        price: 2500,
        oldPrice: 3000,
        category: "accessories",
        rating: 4,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
        badge: "Sale"
    },
    {
        id: 7,
        name: "Sunglasses",
        price: 1500,
        oldPrice: 2000,
        category: "fashion",
        rating: 4,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300",
        badge: "Sale"
    },
    {
        id: 8,
        name: "Gaming Mouse",
        price: 1200,
        oldPrice: 1800,
        category: "electronics",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300",
        badge: "New"
    }
];

// ======== CART MANAGEMENT ========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`Added another ${product.name} to cart!`);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
        showNotification(`${product.name} added to cart!`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ======== PRODUCT DISPLAY ========
// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Load new arrivals
function loadNewArrivals() {
    const container = document.getElementById('newArrivals');
    if (!container) return;
    
    const arrivals = products.slice(4, 8);
    container.innerHTML = arrivals.map(product => createProductCard(product)).join('');
}

// Load all products
function loadAllProducts() {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card
function createProductCard(product) {
    return `
        <div class="product-card" data-aos="fade-up">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    Rs ${product.price.toLocaleString()}
                    ${product.oldPrice ? `<span class="old-price">Rs ${product.oldPrice.toLocaleString()}</span>` : ''}
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

// ======== SEARCH FUNCTIONALITY ========
function setupSearch() {
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
}

// ======== INITIALIZATION ========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Update cart count
    updateCartCount();
    
    // Load products
    loadFeaturedProducts();
    loadNewArrivals();
    loadAllProducts();
    
    // Setup search
    setupSearch();
    
    // Add notification styles
    addNotificationStyles();
});

// Add notification styles
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--success), #38a169);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification span {
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}

// Make functions global
window.addToCart = addToCart;