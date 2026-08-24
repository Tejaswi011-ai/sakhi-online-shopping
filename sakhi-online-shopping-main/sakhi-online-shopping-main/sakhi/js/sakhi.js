// js/sakhi.js

// Add to Cart function
function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: name, price: price, img: img });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart!");
    updateCartCount();
}

// Update Cart Count in Navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}

// Checkout: go to Payment Page
function checkout() {
    window.location.href = "payment.html";
}

// Render Cart Items on Cart Page
if (document.getElementById('cart-items')) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let container = document.getElementById('cart-items');
    container.classList.add('cart-items-container');
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty!</p>";
    } else {
        cart.forEach(p => {
            container.innerHTML += `
              <div class="cart-item-3d">
                <img src="${p.img}" alt="${p.name}">
                <div class="item-details">
                  <h4>${p.name}</h4>
                  <p>Price: ₹${p.price}</p>
                </div>
              </div>
            `;
        });
    }
}

// Payment Form Submission
if (document.getElementById('payment-form')) {
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const cardNumber = document.getElementById('card').value;
        if (!/^\d{12,19}$/.test(cardNumber)) {
            alert("Please enter a valid card number (digits only, 16 digits).");
            return;
        }
        alert("Payment Successful!");
        localStorage.removeItem('cart');
        window.location.href = "order-success.html";
    });
}

// Contact Form Submission
if (document.getElementById('contact-form')) {
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Your message has been sent!");
        setTimeout(() => location.reload(), 1000);
    });
}

// Search Products Functionality (Header)
if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        const value = e.target.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = name.includes(value) ? "block" : "none";
        });
    });
}

// Add to Wishlist
function addToWishlist(productName, price) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.push({ name: productName, price: price });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert(productName + " added to wishlist!");
}

// Display Wishlist Items
if (document.getElementById('wishlist-items')) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let container = document.getElementById('wishlist-items');
    if (wishlist.length === 0) {
        container.innerHTML = "<p>Your wishlist is empty!</p>";
    } else {
        wishlist.forEach(p => {
            container.innerHTML += `<p>${p.name} - ₹${p.price}</p>`;
        });
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Auto-render trending if container exists (e.g. homepage)
    if(document.getElementById('trending-now-container') && typeof renderTrending === 'function') {
        renderTrending('trending-now-container');
    }
    
    // Auto-render recommended if container exists
    if(document.getElementById('recommended-for-you-container') && typeof renderRecommended === 'function') {
        renderRecommended('recommended-for-you-container');
    }
});
