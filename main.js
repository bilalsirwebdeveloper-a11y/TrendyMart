// Initialize page based on URL
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    switch(page) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'products.html':
            initProductsPage();
            break;
        case 'product-detail.html':
            initProductDetailPage();
            break;
        case 'cart.html':
            initCartPage();
            break;
        case 'checkout.html':
            initCheckoutPage();
            break;
    }
});

// Home Page Initialization
function initHomePage() {
    // Load featured products
    const featuredProducts = getFeaturedProducts();
    displayProducts(featuredProducts, 'featuredProducts');
}

// Products Page Initialization
function initProductsPage() {
    // Load all products
    displayProducts(products, 'allProducts');
    
    // Setup filters
    setupFilters();
}

// Product Detail Page
function initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        const product = getProductById(parseInt(productId));
        if (product) {
            displayProductDetail(product);
        } else {
            window.location.href = 'products.html';
        }
    } else {
        window.location.href = 'products.html';
    }
}

// Display product detail
function displayProductDetail(product) {
    const container = document.querySelector('.product-detail');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-detail-container">
            <div class="product-images">
                <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="mainImage">
                <div class="thumbnail-images">
                    ${product.images.map((img, index) => `
                        <img src="${img}" alt="Thumbnail ${index + 1}" 
                             class="thumbnail ${index === 0 ? 'active' : ''}"
                             onclick="changeMainImage(this.src, ${index})">
                    `).join('')}
                </div>
            </div>
            <div class="product-info-detail">
                <h1 class="product-title-detail">${product.name}</h1>
                <div class="product-price-detail">Rs ${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    ${generateStarRating(product.rating)} (${product.reviews} reviews)
                </div>
                <p class="product-description">${product.description}</p>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <span class="meta-label">Category:</span>
                        <span>${product.category}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Availability:</span>
                        <span style="color: ${product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'}">
                            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <span>Quantity:</span>
                    <button class="quantity-btn" onclick="updateQuantity(-1)">-</button>
                    <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="${product.stock}">
                    <button class="quantity-btn" onclick="updateQuantity(1)">+</button>
                </div>
                
                <button class="btn-buy-now" onclick="buyNow(${product.id})">
                    Buy Now
                </button>
                <button class="btn-add-cart" onclick="addToCart(${product.id})" style="margin-top: 1rem;">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Change main image
function changeMainImage(src, index) {
    document.getElementById('mainImage').src = src;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Update quantity
function updateQuantity(change) {
    const input = document.getElementById('quantity');
    let value = parseInt(input.value) + change;
    const max = parseInt(input.max);
    
    if (value < 1) value = 1;
    if (value > max) value = max;
    
    input.value = value;
}

// Buy now function
function buyNow(productId) {
    addToCart(productId);
    window.location.href = 'checkout.html';
}

// Cart Page
function initCartPage() {
    cart.displayCart();
}

// Checkout Page
function initCheckoutPage() {
    // Display order summary
    displayOrderSummary();
    
    // Setup form submission
    setupCheckoutForm();
}

// Display order summary on checkout
function displayOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    if (!summaryContainer) return;
    
    const items = cart.cart;
    const subtotal = cart.getTotal();
    const shipping = subtotal > 2000 ? 0 : 200;
    const total = subtotal + shipping;
    
    let itemsHTML = '';
    items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>Rs ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });
    
    summaryContainer.innerHTML = `
        <h3>Order Summary</h3>
        ${itemsHTML}
        <div class="summary-row">
            <span>Subtotal</span>
            <span>Rs ${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'Free' : 'Rs ' + shipping}</span>
        </div>
        <div class="summary-row summary-total">
            <span>Total</span>
            <span>Rs ${total.toLocaleString()}</span>
        </div>
    `;
}

// Setup checkout form
function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            items: cart.cart,
            total: cart.getTotal() + (cart.getTotal() > 2000 ? 0 : 200),
            orderDate: new Date().toISOString()
        };
        
        // Save order (in real app, send to server)
        saveOrder(formData);
        
        // Clear cart
        cart.clearCart();
        
        // Redirect to confirmation
        window.location.href = 'order-confirmation.html';
    });
}

// Save order (localStorage for demo)
function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orderData.orderId = 'ORD' + Date.now();
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success message
    alert('Order placed successfully! Order ID: ' + orderData.orderId);
}

// Setup filters
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
}

// Filter products
function filterProducts() {
    let filteredProducts = [...products];
    
    // Category filter
    const category = document.getElementById('categoryFilter')?.value;
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    // Price filter
    const priceRange = document.getElementById('priceFilter')?.value;
    if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => {
            if (max) {
                return p.price >= min && p.price <= max;
            } else {
                return p.price >= min;
            }
        });
    }
    
    // Sort
    const sortBy = document.getElementById('sortFilter')?.value;
    if (sortBy) {
        switch(sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
        }
    }
    
    displayProducts(filteredProducts, 'allProducts');
}

// Search products
function searchProducts() {
    const query = document.getElementById('searchInput')?.value;
    if (query) {
        const results = searchProducts(query);
        displayProducts(results, 'allProducts');
    }
}

// Filter by category (from home page)
function filterByCategory(category) {
    window.location.href = `products.html?category=${category}`;
}

// Show loading spinner
function showSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="spinner"></div>';
    }
}

// Hide spinner
function hideSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const spinner = container.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}