// Cart functionality using localStorage
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return false;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} added to cart!`);
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart count
    getCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart count display
    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const count = this.getCount();
        cartCounts.forEach(el => {
            el.textContent = count;
        });
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Display cart on cart page
    displayCart() {
        const cartContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartContainer) return;
        
        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 5rem; color: #ddd;"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        let cartHTML = '';
        this.cart.forEach(item => {
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-details">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div>
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">Rs ${item.price.toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn" onclick="cart.decreaseQuantity(${item.id})">-</button>
                        <input type="number" class="cart-qty-input" value="${item.quantity}" 
                               min="1" onchange="cart.updateQuantity(${item.id}, this.value)">
                        <button class="cart-qty-btn" onclick="cart.increaseQuantity(${item.id})">+</button>
                    </div>
                    <div class="cart-item-total">Rs ${(item.price * item.quantity).toLocaleString()}</div>
                    <button class="btn-remove" onclick="cart.removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartContainer.innerHTML = cartHTML;
        
        // Update summary
        const subtotal = this.getTotal();
        const shipping = subtotal > 2000 ? 0 : 200;
        const total = subtotal + shipping;
        
        if (cartSummary) {
            cartSummary.innerHTML = `
                <h3>Order Summary</h3>
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
                <a href="checkout.html" class="btn-checkout">Proceed to Checkout</a>
            `;
        }
    }

    increaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    decreaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Global functions
function addToCart(productId) {
    cart.addItem(productId);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .empty-cart {
        text-align: center;
        padding: 3rem;
    }
`;
document.head.appendChild(style);