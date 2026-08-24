// Products Data
const products = [
    { id: 1, name: "Banarasi Silk Saree", price: 3499, img: "images/product1.jpg" },
    { id: 2, name: "Designer Kurti", price: 1299, img: "images/product2.jpg" },
    { id: 3, name: "Bridal Lehenga", price: 7999, img: "images/product3.jpg" },
    { id: 4, name: "Traditional Jewelry", price: 1599, img: "images/product4.jpg" },
];












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

    // Check if card number is all digits
    if (!/^\d{12,19}$/.test(cardNumber)) {
      alert("Please enter a valid card number (digits only, 16 digits).");
      return;
    }

    alert("Payment Successful!");
    localStorage.removeItem('cart');
    window.location.href = "order-success.html";
  });
}


// Auth Form Submissions
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        if (users[email]) {
            alert("Login Successful! Welcome back.");
            localStorage.setItem('currentUser', email);
            window.location.href = "index.html";
        } else {
            alert("Account not found. Please sign up.");
        }
    });
}

if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email]) {
            alert("Account already exists with this email.");
        } else {
            users[email] = { name: name, password: password };
            localStorage.setItem('users', JSON.stringify(users));
            alert("Account Created Successfully! Please login.");
            document.getElementById('signup-form').reset();
            if (typeof toggleAuth === 'function') toggleAuth('login');
        }
    });
}

// Contact Form Submission
if (document.getElementById('contact-form')) {
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Your message has been sent!");
         setTimeout(() => {
      location.reload();
    }, 1000);
    });
}

// Search Products Functionality
if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        const value = e.target.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = name.includes(value) ? "block" : "none";
        });
    });
}

// Update cart count on page load
if (document.getElementById('cart-count')) {
    updateCartCount();
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

// AI Fashion Assistant Logic
function toggleChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    const chatBody = document.getElementById('chat-body');
    
    // Add user message
    chatBody.innerHTML += `<div class="user-msg">${input.value}</div>`;
    input.value = '';

    // Simulate thinking delay
    setTimeout(() => {
        let response = "I couldn't find exactly what you're looking for, but here are some popular items!";
        let foundProducts = products; // Default to all

        // Simple keyword matching
        if (msg.includes("saree") || msg.includes("banarasi")) {
            foundProducts = products.filter(p => p.name.toLowerCase().includes("saree"));
            response = "Here are some beautiful sarees for you:";
        } else if (msg.includes("kurti") || msg.includes("dress")) {
            foundProducts = products.filter(p => p.name.toLowerCase().includes("kurti") || p.name.toLowerCase().includes("lehenga") || p.name.toLowerCase().includes("kurti"));
            response = "I found these amazing outfits:";
        } else if (msg.includes("jewelry") || msg.includes("jewellery") || msg.includes("necklace")) {
            foundProducts = products.filter(p => p.name.toLowerCase().includes("jewelry") || p.name.toLowerCase().includes("jewellery"));
            response = "Complete your look with this stunning jewelry:";
        }

        // Generate response HTML
        let botHtml = `<div class="bot-msg">${response}</div>`;
        foundProducts.slice(0, 2).forEach(p => {
            botHtml += `
                <div class="chat-product">
                    <img src="${p.img}" alt="${p.name}">
                    <h4>${p.name}</h4>
                    <p>₹${p.price}</p>
                    <button class="btn-outline" style="padding: 5px 10px; font-size:12px; border-radius:5px;" onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">Add to Cart</button>
                </div>
            `;
        });

        chatBody.innerHTML += botHtml;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
}

// Image Search Logic
function openImageSearchModal() {
    document.getElementById('image-search-modal').style.display = 'flex';
}

function closeImageSearchModal() {
    document.getElementById('image-search-modal').style.display = 'none';
    document.getElementById('image-search-results').style.display = 'none';
    document.getElementById('image-upload').value = "";
}

function handleImageUpload(e) {
    if (e.target.files.length > 0) {
        const resultsDiv = document.getElementById('image-search-results');
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = "<h3>Scanning image...</h3>";
        
        // Simulate ML processing delay
        setTimeout(() => {
            let html = `<h3>✨ Similar Styles Found</h3>`;
            // Randomly select 2 products to mock results
            let similar = products.sort(() => 0.5 - Math.random()).slice(0, 2);
            
            similar.forEach(p => {
                html += `
                    <div class="similar-product">
                        <img src="${p.img}" alt="${p.name}">
                        <div>
                            <h4>${p.name}</h4>
                            <p>₹${p.price}</p>
                            <button class="btn-outline" style="padding: 5px 10px; font-size:12px;" onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">Add</button>
                        </div>
                    </div>
                `;
            });
            resultsDiv.innerHTML = html;
        }, 2000);
    }
}

// Complete Your Look Logic
let currentBundle = [];
let bundleMainProduct = null;

function completeLook(mainName, mainPrice) {
    bundleMainProduct = { name: mainName, price: mainPrice };
    currentBundle = [];
    
    // Find jewelry products to suggest
    const accessories = products.filter(p => p.name.toLowerCase().includes("jewelry") || p.name.toLowerCase().includes("jewellery") || p.name.toLowerCase().includes("bridal") || p.id === 4);
    
    let html = '';
    let total = mainPrice;
    
    accessories.slice(0, 3).forEach(acc => {
        currentBundle.push(acc);
        total += acc.price;
        html += `
            <div class="similar-product">
                <img src="${acc.img}" alt="${acc.name}">
                <div>
                    <h4>${acc.name}</h4>
                    <p>₹${acc.price}</p>
                </div>
            </div>
        `;
    });
    
    document.getElementById('main-product-name').innerText = `Main Item: ${mainName} (₹${mainPrice})`;
    document.getElementById('matching-items').innerHTML = html;
    document.getElementById('bundle-total').innerText = `Total Bundle Price: ₹${total}`;
    
    document.getElementById('complete-look-modal').style.display = 'flex';
}

function closeCompleteLookModal() {
    document.getElementById('complete-look-modal').style.display = 'none';
}

function addBundleToCart() {
    addToCart(bundleMainProduct.name, bundleMainProduct.price, "bana.webp");
    currentBundle.forEach(item => {
        addToCart(item.name, item.price, item.img);
    });
    alert("Bundle added to cart successfully!");
    closeCompleteLookModal();
}