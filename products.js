// Product Data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max Cover",
        price: 1499,
        category: "electronics",
        subcategory: "accessories",
        description: "Premium quality silicon cover with shockproof protection. Compatible with wireless charging.",
        images: [
            "https://images.unsplash.com/photo-1609592424839-788c95f8d9f5?w=400",
            "https://images.unsplash.com/photo-1609592424839-788c95f8d9f5?w=400",
            "https://images.unsplash.com/photo-1609592424839-788c95f8d9f5?w=400"
        ],
        rating: 4.5,
        reviews: 128,
        stock: 50,
        featured: true,
        badge: "Sale"
    },
    {
        id: 2,
        name: "Men's Casual Shirt",
        price: 2499,
        category: "fashion",
        subcategory: "clothing",
        description: "Premium cotton casual shirt for men. Comfortable and stylish design.",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b38?w=400",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b38?w=400",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b38?w=400"
        ],
        rating: 4.2,
        reviews: 89,
        stock: 35,
        featured: true,
        badge: "New"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 5499,
        category: "electronics",
        subcategory: "audio",
        description: "Bluetooth 5.0 wireless headphones with noise cancellation. 20 hours battery life.",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
        ],
        rating: 4.7,
        reviews: 256,
        stock: 25,
        featured: true,
        badge: "Hot"
    },
    {
        id: 4,
        name: "Home Decor Lamp",
        price: 3299,
        category: "home",
        subcategory: "decor",
        description: "Modern LED table lamp with adjustable brightness. Perfect for bedroom or office.",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"
        ],
        rating: 4.3,
        reviews: 67,
        stock: 15,
        featured: true,
        badge: "Sale"
    },
    {
        id: 5,
        name: "The Great Gatsby - Book",
        price: 899,
        category: "books",
        subcategory: "fiction",
        description: "Classic novel by F. Scott Fitzgerald. Hardcover edition with illustrations.",
        images: [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
        ],
        rating: 4.8,
        reviews: 312,
        stock: 100,
        featured: true,
        badge: "Bestseller"
    },
    {
        id: 6,
        name: "Smart Watch",
        price: 7999,
        category: "electronics",
        subcategory: "wearables",
        description: "Fitness tracker with heart rate monitor, GPS, and sleep tracking. Compatible with iOS and Android.",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
        ],
        rating: 4.4,
        reviews: 178,
        stock: 20,
        featured: true,
        badge: "New"
    }
];

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

// Get products by category
function getProductsByCategory(category) {
    return products.filter(p => p.category === category);
}

// Get featured products
function getFeaturedProducts() {
    return products.filter(p => p.featured);
}

// Search products
function searchProducts(query) {
    query = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
}

// Display products grid
function displayProducts(productsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    productsArray.forEach(product => {
        const productCard = `
            <div class="product-card">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">Rs ${product.price.toLocaleString()}</div>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)} (${product.reviews})
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="product-detail.html?id=${product.id}" class="btn-view">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - rating < 1 && i - rating > 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}